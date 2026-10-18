import { useEffect, useMemo, useRef, useState } from "react";
import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";
import { useDevice } from "../scroll/useDevice";

const letters = "abcdefghijklmnopqrstuvwxyz1234567890".split("");

const keyboardCodes: Record<string, string> = {
    ...Object.fromEntries(
        "abcdefghijklmnopqrstuvwxyz"
            .split("")
            .map((letter) => [`Key${letter.toUpperCase()}`, letter]),
    ),
    ...Object.fromEntries(
        "0123456789".split("").flatMap((digit) => [
            [`Digit${digit}`, digit],
            [`Numpad${digit}`, digit],
        ]),
    ),
};

type Position = {
    x: number;
    y: number;
    size: number;
};

type Point = {
    x: number;
    y: number;
};

type CornerRadius = {
    x: number;
    y: number;
};

type BorderRadii = {
    topLeft: CornerRadius;
    topRight: CornerRadius;
    bottomRight: CornerRadius;
    bottomLeft: CornerRadius;
};

type NeedleVariant =
    | "classic"
    | "slim"
    | "arrow"
    | "star"
    | "diamond"
    | "spear"
    | "kite"
    | "trident"
    | "chevron"
    | "crystal"
    | "minimal"
    | "orbital"
    | "wing"
    | "flame";

type LettersProps = {
    offset?: number;
    needleVariant?: NeedleVariant;
};

const ZERO_RADII: BorderRadii = {
    topLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
    bottomRight: { x: 0, y: 0 },
    bottomLeft: { x: 0, y: 0 },
};

const parseCornerRadius = (
    value: string,
    width: number,
    height: number,
): CornerRadius => {
    const [xValue, yValue = xValue] = value.trim().split(/\s+/);

    const parse = (part: string, basis: number) => {
        const parsed = Number.parseFloat(part);

        if (!Number.isFinite(parsed)) {
            return 0;
        }

        return part.endsWith("%") ? (parsed / 100) * basis : parsed;
    };

    return {
        x: parse(xValue, width),
        y: parse(yValue, height),
    };
};

const getComputedBorderRadii = (element: HTMLElement): BorderRadii => {
    const target = element.parentElement;

    if (!target) {
        return ZERO_RADII;
    }

    const style = getComputedStyle(target);
    const rect = target.getBoundingClientRect();

    return {
        topLeft: parseCornerRadius(
            style.borderTopLeftRadius,
            rect.width,
            rect.height,
        ),
        topRight: parseCornerRadius(
            style.borderTopRightRadius,
            rect.width,
            rect.height,
        ),
        bottomRight: parseCornerRadius(
            style.borderBottomRightRadius,
            rect.width,
            rect.height,
        ),
        bottomLeft: parseCornerRadius(
            style.borderBottomLeftRadius,
            rect.width,
            rect.height,
        ),
    };
};

const normalizeRadii = (
    radii: BorderRadii,
    width: number,
    height: number,
): BorderRadii => {
    const scale = Math.min(
        1,
        width / Math.max(radii.topLeft.x + radii.topRight.x, 0.001),
        width / Math.max(radii.bottomLeft.x + radii.bottomRight.x, 0.001),
        height / Math.max(radii.topLeft.y + radii.bottomLeft.y, 0.001),
        height / Math.max(radii.topRight.y + radii.bottomRight.y, 0.001),
    );

    const scaleCorner = (corner: CornerRadius): CornerRadius => ({
        x: corner.x * scale,
        y: corner.y * scale,
    });

    return {
        topLeft: scaleCorner(radii.topLeft),
        topRight: scaleCorner(radii.topRight),
        bottomRight: scaleCorner(radii.bottomRight),
        bottomLeft: scaleCorner(radii.bottomLeft),
    };
};

const createRoundedRectPath = (
    width: number,
    height: number,
    inset: number,
    radii: BorderRadii,
): Point[] => {
    const innerWidth = width - inset * 2;
    const innerHeight = height - inset * 2;

    if (innerWidth <= 0 || innerHeight <= 0) {
        return [];
    }

    const outerRadii = normalizeRadii(radii, width, height);

    const insetCorner = (corner: CornerRadius): CornerRadius => ({
        x: Math.max(0, corner.x - inset),
        y: Math.max(0, corner.y - inset),
    });

    const innerRadii = normalizeRadii(
        {
            topLeft: insetCorner(outerRadii.topLeft),
            topRight: insetCorner(outerRadii.topRight),
            bottomRight: insetCorner(outerRadii.bottomRight),
            bottomLeft: insetCorner(outerRadii.bottomLeft),
        },
        innerWidth,
        innerHeight,
    );

    const x = inset;
    const y = inset;
    const right = x + innerWidth;
    const bottom = y + innerHeight;

    const path: Point[] = [
        {
            x: x + innerWidth / 2,
            y,
        },
    ];

    const pushPoint = (point: Point) => {
        const last = path[path.length - 1];

        if (!last || Math.hypot(point.x - last.x, point.y - last.y) > 0.001) {
            path.push(point);
        }
    };

    const addArc = (
        cx: number,
        cy: number,
        rx: number,
        ry: number,
        startAngle: number,
        endAngle: number,
    ) => {
        const steps = 24;

        for (let step = 1; step <= steps; step++) {
            const angle = startAngle + ((endAngle - startAngle) * step) / steps;

            pushPoint({
                x: cx + Math.cos(angle) * rx,
                y: cy + Math.sin(angle) * ry,
            });
        }
    };

    const tl = innerRadii.topLeft;
    const tr = innerRadii.topRight;
    const br = innerRadii.bottomRight;
    const bl = innerRadii.bottomLeft;

    pushPoint({ x: right - tr.x, y });

    addArc(right - tr.x, y + tr.y, tr.x, tr.y, -Math.PI / 2, 0);

    pushPoint({ x: right, y: bottom - br.y });

    addArc(right - br.x, bottom - br.y, br.x, br.y, 0, Math.PI / 2);

    pushPoint({ x: x + bl.x, y: bottom });

    addArc(x + bl.x, bottom - bl.y, bl.x, bl.y, Math.PI / 2, Math.PI);

    pushPoint({ x, y: y + tl.y });

    addArc(x + tl.x, y + tl.y, tl.x, tl.y, Math.PI, (3 * Math.PI) / 2);

    pushPoint({
        x: x + innerWidth / 2,
        y,
    });

    return path;
};

const getPathLength = (path: Point[]): number => {
    let length = 0;

    for (let index = 1; index < path.length; index++) {
        length += Math.hypot(
            path[index].x - path[index - 1].x,
            path[index].y - path[index - 1].y,
        );
    }

    return length;
};

const getRoundedRectPositions = (
    width: number,
    height: number,
    offset: number,
    radii: BorderRadii,
    MAX_ICON_SIZE: number,
): Position[] => {
    if (width <= 0 || height <= 0) {
        return [];
    }

    const safeOffset = Math.max(0, offset);

    const basePath = createRoundedRectPath(width, height, safeOffset, radii);

    let size = Math.min(
        MAX_ICON_SIZE,
        (getPathLength(basePath) / letters.length) * 0.75,
    );

    if (size <= 0) {
        return [];
    }

    for (let iteration = 0; iteration < 5; iteration++) {
        const path = createRoundedRectPath(
            width,
            height,
            safeOffset + size / 2,
            radii,
        );

        const perimeter = getPathLength(path);

        if (perimeter <= 0) {
            return [];
        }

        const nextSize = Math.min(
            MAX_ICON_SIZE,
            (perimeter / letters.length) * 0.75,
        );

        if (Math.abs(nextSize - size) < 0.01) {
            size = nextSize;
            break;
        }

        size = nextSize;
    }

    const path = createRoundedRectPath(
        width,
        height,
        safeOffset + size / 2,
        radii,
    );

    if (path.length < 2) {
        return [];
    }

    const cumulativeLengths = [0];

    for (let index = 1; index < path.length; index++) {
        const previous = path[index - 1];
        const current = path[index];

        cumulativeLengths.push(
            cumulativeLengths[index - 1] +
                Math.hypot(current.x - previous.x, current.y - previous.y),
        );
    }

    const perimeter = cumulativeLengths[cumulativeLengths.length - 1];

    if (perimeter <= 0) {
        return [];
    }

    const positions: Position[] = letters.map((_, index) => {
        const distance = (perimeter * index) / letters.length;

        let segment = 1;

        while (
            segment < cumulativeLengths.length - 1 &&
            cumulativeLengths[segment] < distance
        ) {
            segment++;
        }

        const startDistance = cumulativeLengths[segment - 1];

        const segmentLength = cumulativeLengths[segment] - startDistance;

        const progress =
            segmentLength > 0 ? (distance - startDistance) / segmentLength : 0;

        const start = path[segment - 1];
        const end = path[segment];

        return {
            x: start.x + (end.x - start.x) * progress,
            y: start.y + (end.y - start.y) * progress,
            size,
        };
    });

    const isSquare = Object.values(radii).every(
        (corner) => corner.x <= 0.01 && corner.y <= 0.01,
    );

    if (isSquare) {
        const inset = safeOffset + size / 2;

        const left = inset;
        const top = inset;
        const right = width - inset;
        const bottom = height - inset;

        const horizontalLength = right - left;
        const verticalLength = bottom - top;
        const halfIntervals = letters.length / 2;

        const horizontalIntervals = Math.max(
            1,
            Math.min(
                halfIntervals - 1,
                Math.round(
                    (halfIntervals * horizontalLength) /
                        (horizontalLength + verticalLength),
                ),
            ),
        );

        const verticalIntervals = halfIntervals - horizontalIntervals;

        const squarePositions: Position[] = [];

        for (let i = 0; i < horizontalIntervals; i++) {
            squarePositions.push({
                x: left + (horizontalLength * i) / horizontalIntervals,
                y: top,
                size,
            });
        }

        for (let i = 0; i < verticalIntervals; i++) {
            squarePositions.push({
                x: right,
                y: top + (verticalLength * i) / verticalIntervals,
                size,
            });
        }

        for (let i = 0; i < horizontalIntervals; i++) {
            squarePositions.push({
                x: right - (horizontalLength * i) / horizontalIntervals,
                y: bottom,
                size,
            });
        }

        for (let i = 0; i < verticalIntervals; i++) {
            squarePositions.push({
                x: left,
                y: bottom - (verticalLength * i) / verticalIntervals,
                size,
            });
        }

        return squarePositions;
    }

    return positions;
};

export const Letters = ({ offset = 8 }: LettersProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const compassAngleRef = useRef(0);

    const [containerSize, setContainerSize] = useState({
        width: 0,
        height: 0,
    });

    const [borderRadii, setBorderRadii] = useState<BorderRadii>(ZERO_RADII);

    const [pulseCounts, setPulseCounts] = useState<Record<string, number>>({});
    const { isMobile } = useDevice();
    const MAX_ICON_SIZE = isMobile ? 12 : 18;

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const updateMeasurements = () => {
            const rect = container.getBoundingClientRect();

            setContainerSize({
                width: rect.width,
                height: rect.height,
            });

            setBorderRadii(getComputedBorderRadii(container));
        };

        updateMeasurements();

        const observer = new ResizeObserver(updateMeasurements);

        observer.observe(container);

        const parent = container.parentElement;

        if (parent) {
            observer.observe(parent);
        }

        window.addEventListener("resize", updateMeasurements);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateMeasurements);
        };
    }, []);

    const positions = useMemo(
        () =>
            getRoundedRectPositions(
                containerSize.width,
                containerSize.height,
                Math.max(0, offset),
                borderRadii,
                MAX_ICON_SIZE,
            ),
        [
            containerSize.width,
            containerSize.height,
            offset,
            borderRadii,
            MAX_ICON_SIZE,
        ],
    );

    const centerX = containerSize.width / 2;
    const centerY = containerSize.height / 2;

    const targetAngles = useMemo(
        () =>
            positions.map((position) => {
                const theta =
                    (Math.atan2(position.y - centerY, position.x - centerX) *
                        180) /
                    Math.PI;

                return (theta + 90 + 360) % 360;
            }),
        [positions, centerX, centerY],
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.repeat ||
                event.ctrlKey ||
                event.altKey ||
                event.metaKey
            ) {
                return;
            }

            const symbol = keyboardCodes[event.code];

            if (!symbol) {
                return;
            }

            const index = letters.indexOf(symbol);

            if (index === -1) {
                return;
            }

            const targetAngle =
                targetAngles[index] ?? (index * 360) / letters.length;

            const currentAngle = compassAngleRef.current;

            const normalizedCurrent = ((currentAngle % 360) + 360) % 360;

            let delta = targetAngle - normalizedCurrent;

            if (delta > 180) {
                delta -= 360;
            }

            if (delta < -180) {
                delta += 360;
            }

            const nextAngle = currentAngle + delta;

            compassAngleRef.current = nextAngle;

            setPulseCounts((current) => ({
                ...current,
                [symbol]: (current[symbol] ?? 0) + 1,
            }));
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [targetAngles]);

    return (
        <div
            ref={containerRef}
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-inherit"
        >
            <div className="absolute inset-0">
                {letters.map((letter, index) => {
                    const position = positions[index];

                    if (!position) {
                        return null;
                    }

                    const pulseCount = pulseCounts[letter] ?? 0;

                    return (
                        <div
                            key={`${letter}-${pulseCount}`}
                            className={`absolute flex items-center justify-center ${
                                pulseCount > 0 ? "letter-pulse" : ""
                            }`}
                            style={{
                                left: position.x - position.size / 2,
                                top: position.y - position.size / 2,
                                width: position.size,
                                height: position.size,
                            }}
                        >
                            <DynamicSvgIcon
                                data-cursor="symbol"
                                data-color="alter-foreground"
                                name={letter}
                                className="size-full fill-curr/50"
                            />
                        </div>
                    );
                })}
            </div>

            <style>
                {`
                    .letter-pulse {
                        transform-origin: center;
                        animation: letters-pulse 450ms ease-in-out;
                    }

                    .letter-pulse > svg {
                        animation: letters-pulse-fill 450ms ease-in-out;
                    }

                    .compass-needle {
                        transform-origin: center;
                        animation: compass-spin 700ms cubic-bezier(0.22, 1, 0.36, 1);
                    }

                    @keyframes compass-spin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes letters-pulse {
                        0% {
                            transform: scale(1);
                            opacity: 0.45;
                        }

                        45% {
                            transform: scale(1.15);
                            opacity: 1;
                        }

                        100% {
                            transform: scale(1);
                            opacity: 0.45;
                        }
                    }

                    @keyframes letters-pulse-fill {
                        0%, 100% {
                            fill: var(--alter-foreground);
                            fill-opacity: 0.1;
                        }

                        45% {
                            fill: var(--alter-foreground);
                            fill-opacity: 1;
                        }
                    }
                `}
            </style>
        </div>
    );
};
