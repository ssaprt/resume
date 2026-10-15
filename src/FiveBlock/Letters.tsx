import { useEffect, useRef, useState } from "react";
import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";

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

const MAX_ICON_SIZE = 18;

type Position = {
    x: number;
    y: number;
    size: number;
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

const renderNeedleShape = (variant: NeedleVariant, radius: number) => {
    const c = radius;

    switch (variant) {
        case "classic":
            return (
                <>
                    <path
                        d={`M16 0 L23 ${c} L16 ${c - 7} L9 ${c} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M16 ${2 * c} L9 ${c} L16 ${c + 7} L23 ${c} Z`}
                        fill="currentColor"
                        opacity="0.45"
                    />
                </>
            );

        case "slim":
            return (
                <>
                    <path
                        d={`M16 0 L19 ${c} L16 ${c - 5} L13 ${c} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M16 ${2 * c} L13 ${c} L16 ${c + 5} L19 ${c} Z`}
                        fill="currentColor"
                        opacity="0.4"
                    />
                </>
            );

        case "arrow":
            return (
                <>
                    <path
                        d={`M16 0 L25 ${c - 4} L16 ${c - 9} L7 ${c - 4} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M16 ${2 * c} L12 ${c + 11} L16 ${c + 7} L20 ${c + 11} Z`}
                        fill="currentColor"
                        opacity="0.4"
                    />
                </>
            );

        case "star":
            return (
                <>
                    <path
                        d={`M16 0 L21 ${c - 8} L16 ${c - 3} L11 ${c - 8} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M16 ${2 * c} L11 ${c + 8} L16 ${c + 3} L21 ${c + 8} Z`}
                        fill="currentColor"
                        opacity="0.4"
                    />
                    <path
                        d={`M5 ${c} L13 ${c - 3} L16 ${c} L13 ${c + 3} Z`}
                        fill="currentColor"
                        opacity="0.5"
                    />
                    <path
                        d={`M27 ${c} L19 ${c - 3} L16 ${c} L19 ${c + 3} Z`}
                        fill="currentColor"
                        opacity="0.5"
                    />
                </>
            );

        case "diamond":
            return (
                <>
                    <path
                        d={`M16 0 L24 ${c - 5} L16 ${c} L8 ${c - 5} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M16 ${2 * c} L24 ${c + 5} L16 ${c} L8 ${c + 5} Z`}
                        fill="currentColor"
                        opacity="0.45"
                    />
                </>
            );

        case "spear":
            return (
                <>
                    <path
                        d={`M16 0 L21 ${c - 9} L18 ${c - 2} L16 ${c} L14 ${c - 2} L11 ${c - 9} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M16 ${2 * c} L19 ${c + 7} L16 ${c + 3} L13 ${c + 7} Z`}
                        fill="currentColor"
                        opacity="0.45"
                    />
                </>
            );

        case "kite":
            return (
                <>
                    <path
                        d={`M16 0 L25 ${c - 8} L20 ${c - 2} L16 ${c} L12 ${c - 2} L7 ${c - 8} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M16 ${2 * c} L21 ${c + 8} L16 ${c + 2} L11 ${c + 8} Z`}
                        fill="currentColor"
                        opacity="0.45"
                    />
                </>
            );

        case "trident":
            return (
                <>
                    <path
                        d={`M16 0 L20 ${c - 7} L23 ${c - 11} L24 ${c - 4} L18 ${c} L16 ${c - 5} L14 ${c} L8 ${c - 4} L9 ${c - 11} L12 ${c - 7} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M16 ${2 * c} L20 ${c + 7} L16 ${c + 3} L12 ${c + 7} Z`}
                        fill="currentColor"
                        opacity="0.4"
                    />
                </>
            );

        case "chevron":
            return (
                <>
                    <path
                        d={`M6 ${c - 5} L16 0 L26 ${c - 5} L22 ${c - 4} L16 7 L10 ${c - 4} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M6 ${c + 5} L16 ${2 * c} L26 ${c + 5} L22 ${c + 4} L16 ${2 * c - 7} L10 ${c + 4} Z`}
                        fill="currentColor"
                        opacity="0.4"
                    />
                </>
            );

        case "crystal":
            return (
                <>
                    <path
                        d={`M16 0 L24 ${c - 7} L18 ${c} L16 ${c - 5} L14 ${c} L8 ${c - 7} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M16 0 L16 ${c - 5} L24 ${c - 7} Z`}
                        fill="currentColor"
                        opacity="0.3"
                    />
                    <path
                        d={`M16 ${2 * c} L24 ${c + 7} L16 ${c + 5} L8 ${c + 7} Z`}
                        fill="currentColor"
                        opacity="0.4"
                    />
                </>
            );

        case "minimal":
            return (
                <>
                    <path
                        d="M16 0 L21 13 L16 9 L11 13 Z"
                        fill="var(--alter-foreground)"
                    />
                    <line
                        x1="16"
                        y1="12"
                        x2="16"
                        y2={c}
                        stroke="var(--alter-foreground)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <line
                        x1="16"
                        y1={c}
                        x2="16"
                        y2={2 * c}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        opacity="0.4"
                    />
                </>
            );

        case "orbital":
            return (
                <>
                    <path
                        d={`M16 0 L22 ${c - 8} L18 ${c - 2} L16 ${c} L14 ${c - 2} L10 ${c - 8} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <circle
                        cx="16"
                        cy={c * 0.38}
                        r="4"
                        stroke="var(--alter-foreground)"
                        strokeWidth="1"
                        fill="none"
                    />
                    <path
                        d={`M16 ${2 * c} L20 ${c + 7} L16 ${c + 3} L12 ${c + 7} Z`}
                        fill="currentColor"
                        opacity="0.4"
                    />
                </>
            );

        case "wing":
            return (
                <>
                    <path
                        d={`M16 0 L21 ${c - 7} L30 ${c - 3} L20 ${c - 2} L16 ${c} L12 ${c - 2} L2 ${c - 3} L11 ${c - 7} Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M16 ${2 * c} L21 ${c + 7} L16 ${c + 3} L11 ${c + 7} Z`}
                        fill="currentColor"
                        opacity="0.4"
                    />
                </>
            );

        case "flame":
            return (
                <>
                    <path
                        d={`M16 0 C21 9 25 ${c - 9} 22 ${c - 3} L16 ${c} L10 ${c - 3} C7 ${c - 9} 11 9 16 0 Z`}
                        fill="var(--alter-foreground)"
                    />
                    <path
                        d={`M16 ${2 * c} L21 ${c + 7} L16 ${c + 3} L11 ${c + 7} Z`}
                        fill="currentColor"
                        opacity="0.4"
                    />
                </>
            );
    }
};

type LettersProps = {
    offset?: number;
    needleVariant?: NeedleVariant;
};
const getCirclePositions = (
    width: number,
    height: number,
    offset: number,
): Position[] => {
    const diameter = Math.min(width, height) - offset * 2;

    if (diameter <= 0) {
        return [];
    }

    const maxRadius = diameter / 2;
    const spacing = (2 * Math.PI * maxRadius) / letters.length;
    const size = Math.min(MAX_ICON_SIZE, spacing * 0.75);
    const radius = maxRadius - size / 2;

    if (radius <= 0 || size <= 0) {
        return [];
    }

    const centerX = width / 2;
    const centerY = height / 2;

    return letters.map((_, index) => {
        const angle = -Math.PI / 2 + (2 * Math.PI * index) / letters.length;

        return {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            size,
        };
    });
};

export const Letters = ({ offset = 8 }: LettersProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [containerSize, setContainerSize] = useState({
        width: 0,
        height: 0,
    });
    const [compassAngle, setCompassAngle] = useState(0);
    const compassAngleRef = useRef(0);
    const [targetIndex, setTargetIndex] = useState(0);

    const [pulseCounts, setPulseCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const observer = new ResizeObserver(([entry]) => {
            if (!entry) {
                return;
            }

            setContainerSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            });
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, []);

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

            const targetAngle = (index * 360) / letters.length;
            const currentAngle = compassAngleRef.current;
            const normalizedCurrent = ((currentAngle % 360) + 360) % 360;

            let delta = targetAngle - normalizedCurrent;

            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;

            const nextAngle = currentAngle + delta;

            compassAngleRef.current = nextAngle;

            setCompassAngle(nextAngle);
            setTargetIndex(index);

            setPulseCounts((current) => ({
                ...current,
                [symbol]: (current[symbol] ?? 0) + 1,
            }));
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const positions = getCirclePositions(
        containerSize.width,
        containerSize.height,
        Math.max(0, offset),
    );

    const centerX = containerSize.width / 2;
    const centerY = containerSize.height / 2;

    const targetPosition = positions[targetIndex];

    const circleRadius = targetPosition
        ? Math.hypot(targetPosition.x - centerX, targetPosition.y - centerY)
        : 0;

    const targetTheta =
        -Math.PI / 2 + (2 * Math.PI * targetIndex) / letters.length;

    const edgeOffset = targetPosition
        ? targetPosition.size /
          (2 *
              Math.max(
                  Math.abs(Math.cos(targetTheta)),
                  Math.abs(Math.sin(targetTheta)),
              ))
        : 0;

    const needleRadius = Math.max(0, circleRadius - edgeOffset);

    return (
        <div
            ref={containerRef}
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
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
                                className="size-full fill-crm/40"
                            />
                        </div>
                    );
                })}
            </div>

            {containerSize.width > 0 &&
                containerSize.height > 0 &&
                needleRadius > 0 && (
                    <div
                        className="pointer-events-none absolute left-1/2 top-1/2 z-0 transform scale-70"
                        style={{
                            width: 32,
                            height: needleRadius * 2,
                            marginLeft: -16,
                            marginTop: -needleRadius,
                        }}
                    >
                        <svg
                            viewBox={`0 0 32 ${needleRadius * 2}`}
                            className="size-full overflow-visible"
                            aria-hidden="true"
                            style={{
                                transform: `rotate(${compassAngle}deg)`,
                                transformOrigin: "center",
                                transition:
                                    "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                        >
                            {renderNeedleShape("chevron", needleRadius)}

                            <circle
                                cx="16"
                                cy={needleRadius}
                                r="5"
                                fill="var(--background)"
                                stroke="var(--alter-foreground)"
                                strokeWidth="1.5"
                            />

                            <circle
                                cx="16"
                                cy={needleRadius}
                                r="2"
                                fill="var(--alter-foreground)"
                            />
                        </svg>
                    </div>
                )}

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
