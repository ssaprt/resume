import type { MotionValue } from "framer-motion";
import {
    animate,
    motion,
    useMotionTemplate,
    useMotionValue,
    useTransform,
} from "framer-motion";
import {
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { SplitText } from "../components/text/ScatterText";
import {
    useScrollBlockMotion,
    useScrollElementMotion,
} from "../scroll/useScroll";
import { clamp } from "../utils/clamp";
import { getPosition } from "../utils/getPosition";
import { types } from "./config";
import { GoPrev } from "./GoPrev";
import { useThridBlockContext } from "./useThridBlockContext";

const INSET = 0.75;
const BORDER_RADIUS = 11.25;
const STROKE_WIDTH = 1;

const AUTO_LOOP_DURATION = 8;
const HOVER_LOOP_DURATION = 1.8;

type Side = "top" | "bottom";

type ButtonGeometry = {
    topStart: number;
    bottomStart: number;
    length: number;
};

type BorderLayout = {
    width: number;
    height: number;
    perimeter: number;
    radius: number;
    buttons: (ButtonGeometry | null)[];
};

type SnakePlayback = {
    stop: () => void;
};

const positiveModulo = (value: number, divisor: number) =>
    ((value % divisor) + divisor) % divisor;

const getNearestOffset = (target: number, current: number, perimeter: number) =>
    target + Math.round((current - target) / perimeter) * perimeter;

const animateSnake = (
    offset: MotionValue<number>,
    length: MotionValue<number>,
    gap: MotionValue<number>,
    targetOffset: number,
    targetLength: number,
    perimeter: number,
    duration: number,
): SnakePlayback => {
    const options = {
        duration,
        ease: "easeInOut" as const,
    };

    const animations = [
        animate(offset, targetOffset, options),
        animate(length, targetLength, options),
        animate(gap, Math.max(perimeter - targetLength, 0.001), options),
    ];

    return {
        stop: () => {
            animations.forEach((animation) => animation.stop());
        },
    };
};

export const Title = () => {
    const { active, setActive } = useThridBlockContext();
    const { ref, leaveProgress, leaveDirection } = useScrollElementMotion();

    const [hovered, setHovered] = useState<number | null>(null);
    const [hoverSide, setHoverSide] = useState<Side>("bottom");
    const [layout, setLayout] = useState<BorderLayout | null>(null);

    const borderRef = useRef<HTMLDivElement>(null);
    const borderPathRef = useRef<SVGRectElement>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const hoveredRef = useRef<number | null>(null);
    const initializedRef = useRef(false);

    const autoAnimationRef = useRef<SnakePlayback | null>(null);
    const hoverAnimationRef = useRef<SnakePlayback | null>(null);

    const clipId = useId().replace(/:/g, "");

    const hoverOffset = useMotionValue(0);
    const hoverLength = useMotionValue(30);
    const hoverGap = useMotionValue(500);

    const hoverDashArray = useMotionTemplate`${hoverLength} ${hoverGap}`;
    const hoverDashOffset = useTransform(hoverOffset, (value) => -value);

    const activeButton = layout?.buttons[active] ?? null;

    const measureLayout = useCallback(() => {
        const container = borderRef.current;

        if (!container) return;

        const bounds = container.getBoundingClientRect();
        const width = bounds.width;
        const height = bounds.height;

        if (width <= 0 || height <= 0) return;

        const radius = Math.min(
            BORDER_RADIUS,
            Math.max(0, (width - INSET * 2) / 2),
            Math.max(0, (height - INSET * 2) / 2),
        );

        const leftX = INSET + radius;
        const rightX = width - INSET - radius;

        const topLength = Math.max(0, rightX - leftX);
        const verticalLength = Math.max(0, height - 2 * (INSET + radius));
        const quarterArc = (Math.PI * radius) / 2;

        const perimeter = topLength * 2 + verticalLength * 2 + quarterArc * 4;

        const buttons: (ButtonGeometry | null)[] = buttonRefs.current.map(
            (button) => {
                if (!button) return null;

                const buttonBounds = button.getBoundingClientRect();

                const x1 = clamp(
                    buttonBounds.left - bounds.left,
                    leftX,
                    rightX,
                );

                const x2 = clamp(
                    buttonBounds.right - bounds.left,
                    leftX,
                    rightX,
                );

                return {
                    topStart: x1 - leftX,
                    bottomStart:
                        topLength +
                        quarterArc +
                        verticalLength +
                        quarterArc +
                        (rightX - x2),
                    length: Math.max(0, x2 - x1),
                };
            },
        );

        const next: BorderLayout = {
            width,
            height,
            perimeter,
            radius,
            buttons,
        };

        setLayout((previous) => {
            if (
                previous &&
                Math.abs(previous.width - next.width) < 0.05 &&
                Math.abs(previous.height - next.height) < 0.05 &&
                previous.buttons.length === next.buttons.length &&
                previous.buttons.every((button, index) => {
                    const nextButton = next.buttons[index];

                    if (!button || !nextButton) {
                        return button === nextButton;
                    }

                    return (
                        Math.abs(button.topStart - nextButton.topStart) <
                            0.05 &&
                        Math.abs(button.bottomStart - nextButton.bottomStart) <
                            0.05 &&
                        Math.abs(button.length - nextButton.length) < 0.05
                    );
                })
            ) {
                return previous;
            }

            return next;
        });
    }, []);

    useLayoutEffect(() => {
        measureLayout();

        const observer = new ResizeObserver(measureLayout);

        if (borderRef.current) {
            observer.observe(borderRef.current);
        }

        buttonRefs.current.forEach((button) => {
            if (button) observer.observe(button);
        });

        window.addEventListener("resize", measureLayout);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measureLayout);
        };
    }, [measureLayout]);

    useLayoutEffect(() => {
        if (!layout) return;

        const path = borderPathRef.current;

        if (!path) return;

        const actualPerimeter = path.getTotalLength();

        if (
            actualPerimeter <= 0 ||
            Math.abs(actualPerimeter - layout.perimeter) < 0.01
        ) {
            return;
        }

        setLayout((previous) => {
            if (!previous) return previous;

            if (Math.abs(previous.perimeter - actualPerimeter) < 0.01) {
                return previous;
            }

            return {
                ...previous,
                perimeter: actualPerimeter,
            };
        });
    }, [layout]);

    useLayoutEffect(() => {
        if (!layout || layout.perimeter <= 0) return;

        if (!initializedRef.current) {
            const firstButton = layout.buttons.find(
                (button) => button !== null && button.length > 0,
            );

            hoverOffset.set(firstButton?.topStart ?? 0);
            initializedRef.current = true;
        }

        hoverGap.set(Math.max(layout.perimeter - hoverLength.get(), 0.001));
    }, [layout, hoverOffset, hoverLength, hoverGap]);

    useEffect(() => {
        if (
            !layout ||
            hovered !== null ||
            layout.perimeter <= 0 ||
            !initializedRef.current
        ) {
            return;
        }

        const current = hoverOffset.get();
        const perimeter = layout.perimeter;

        const playback = animate(hoverOffset, [current, current + perimeter], {
            duration: AUTO_LOOP_DURATION,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
        });

        autoAnimationRef.current = playback;

        return () => {
            playback.stop();

            if (autoAnimationRef.current === playback) {
                autoAnimationRef.current = null;
            }
        };
    }, [hovered, layout, hoverOffset]);

    const clearHover = () => {
        hoveredRef.current = null;
        setHovered(null);

        hoverAnimationRef.current?.stop();
        hoverAnimationRef.current = null;
    };

    const handleHover = (index: number) => {
        if (index === active) {
            clearHover();
            return;
        }

        if (hoveredRef.current === index) return;

        const path = borderPathRef.current;

        if (!layout || !path || layout.perimeter <= 0) return;

        autoAnimationRef.current?.stop();
        autoAnimationRef.current = null;

        hoverAnimationRef.current?.stop();
        hoverAnimationRef.current = null;

        const current = hoverOffset.get();
        const currentLength = hoverLength.get();
        const pathLength = path.getTotalLength();

        if (pathLength <= 0) return;

        const center = positiveModulo(current + currentLength / 2, pathLength);

        const point = path.getPointAtLength(center);

        const topDistance = Math.abs(point.y - INSET);
        const bottomDistance = Math.abs(point.y - (layout.height - INSET));

        const nextSide: Side =
            Math.abs(topDistance - bottomDistance) < 1
                ? hoverSide
                : topDistance < bottomDistance
                  ? "top"
                  : "bottom";

        hoveredRef.current = index;

        setHoverSide(nextSide);
        setHovered(index);
    };

    const handleSelect = (index: number) => {
        setActive(index);
        clearHover();
    };

    useEffect(() => {
        if (
            hovered === null ||
            hovered === active ||
            !layout ||
            layout.perimeter <= 0
        ) {
            return;
        }

        const button = layout.buttons[hovered];

        if (!button || button.length <= 0) return;

        const targetStart =
            hoverSide === "top" ? button.topStart : button.bottomStart;

        const current = hoverOffset.get();

        const target = getNearestOffset(targetStart, current, layout.perimeter);

        const distance = Math.abs(target - current);

        const duration = Math.max(
            0.25,
            (distance / layout.perimeter) * HOVER_LOOP_DURATION,
        );

        const playback = animateSnake(
            hoverOffset,
            hoverLength,
            hoverGap,
            target,
            button.length,
            layout.perimeter,
            duration,
        );

        hoverAnimationRef.current = playback;

        return () => {
            playback.stop();

            if (hoverAnimationRef.current === playback) {
                hoverAnimationRef.current = null;
            }
        };
    }, [
        hovered,
        active,
        hoverSide,
        layout,
        hoverOffset,
        hoverLength,
        hoverGap,
    ]);

    const opacity = useTransform(leaveProgress, [0, 1], [1, 0]);

    const rawW = useTransform(leaveProgress, [0, 1], [4, 10]);
    const w = useMotionTemplate`${rawW}vw`;

    const rectWidth = Math.max((layout?.width ?? 0) - INSET * 2, 0);
    const rectHeight = Math.max((layout?.height ?? 0) - INSET * 2, 0);
    const radius = layout?.radius ?? BORDER_RADIUS;

    const activeClipX = layout
        ? INSET + radius + (activeButton?.topStart ?? 0)
        : 0;

    const activeClipWidth = activeButton?.length ?? 0;

    const clipHeight = INSET * 2 + STROKE_WIDTH * 2;

    return (
        <motion.div
            ref={(e) => ref(e?.previousSibling as HTMLElement)}
            className="col-center-4 mb-10 w-full"
            style={{ opacity }}
        >
            <GoPrev />

            <motion.div className="row-center-4 w-full justify-center">
                <motion.div
                    className="h-[1px]! w-[40px] bg-gradient-to-r from-curr/80 to-transparent"
                    style={{ width: w }}
                />

                <SplitText
                    text="Tech Stack"
                    className="relative shrink-0 text-nowrap text-curr/80 text-[32px]! font-raj!"
                    left={{
                        x: -20,
                        y: 0,
                        rotate: 0,
                        scale: 0,
                        opacity: 0,
                    }}
                    right={{
                        x: 20,
                        y: 0,
                        rotate: 0,
                        scale: 0,
                        opacity: 0,
                    }}
                    stagger={0.15}
                    as="h1"
                    scroll={{ leaveProgress, leaveDirection }}
                />

                <motion.div
                    className="h-[1px]! w-[40px] bg-gradient-to-r from-transparent to-curr/80"
                    style={{ width: w }}
                />
            </motion.div>

            <div className="mb-6 w-2/3">
                <SplitText
                    text="An interactive tour of my core tech stack and the tools I use in my projects"
                    className="text-center font-outfit! text-curr! text-5xl! opacity-80"
                    left={{
                        x: -80,
                        y: 50,
                        rotate: 0,
                        scale: 0,
                        opacity: 0,
                    }}
                    right={{
                        x: 80,
                        y: 50,
                        rotate: 0,
                        scale: 0,
                        opacity: 0,
                    }}
                    stagger={0.2}
                    as="h1"
                    scroll={{ leaveProgress, leaveDirection }}
                />
            </div>

            <div
                ref={borderRef}
                className="relative isolate row-center-2 rounded-[12px] p-3"
                onMouseLeave={clearHover}
            >
                {layout && (
                    <svg
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-px z-20 h-[calc(100%+2px)] w-[calc(100%+2px)] overflow-visible"
                        viewBox={`0 0 ${layout.width} ${layout.height}`}
                        preserveAspectRatio="none"
                    >
                        <rect
                            ref={borderPathRef}
                            x={INSET}
                            y={INSET}
                            width={rectWidth}
                            height={rectHeight}
                            rx={radius}
                            fill="none"
                            stroke="transparent"
                            strokeWidth={STROKE_WIDTH}
                        />

                        <motion.rect
                            x={INSET}
                            y={INSET}
                            width={rectWidth}
                            height={rectHeight}
                            rx={radius}
                            fill="none"
                            stroke="var(--color-nestjs)"
                            strokeWidth={STROKE_WIDTH}
                            strokeLinecap="round"
                            strokeDasharray={hoverDashArray}
                            strokeDashoffset={hoverDashOffset}
                        />

                        {activeButton && activeClipWidth > 0 && (
                            <>
                                <defs>
                                    <clipPath
                                        id={clipId}
                                        clipPathUnits="userSpaceOnUse"
                                    >
                                        <rect
                                            x={activeClipX}
                                            y={0}
                                            width={activeClipWidth}
                                            height={clipHeight}
                                        />
                                        <rect
                                            x={activeClipX}
                                            y={layout.height - clipHeight}
                                            width={activeClipWidth}
                                            height={clipHeight}
                                        />
                                    </clipPath>
                                </defs>

                                <motion.rect
                                    x={INSET}
                                    y={INSET}
                                    width={rectWidth}
                                    height={rectHeight}
                                    rx={radius}
                                    fill="none"
                                    stroke="var(--color-curr)"
                                    strokeWidth={STROKE_WIDTH}
                                    strokeLinecap="round"
                                    strokeDasharray={hoverDashArray}
                                    strokeDashoffset={hoverDashOffset}
                                    clipPath={`url(#${clipId})`}
                                />
                            </>
                        )}
                    </svg>
                )}

                {types.map((type, i) => (
                    <Button
                        key={type}
                        type={type}
                        i={i}
                        active={active}
                        onSelect={handleSelect}
                        onHover={handleHover}
                        buttonRef={(node) => {
                            buttonRefs.current[i] = node;
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

type ButtonProps = {
    type: string;
    i: number;
    active: number;
    onSelect: (index: number) => void;
    onHover: (index: number) => void;
    buttonRef: (node: HTMLButtonElement | null) => void;
};

const Button = ({
    type,
    i,
    active,
    onSelect,
    onHover,
    buttonRef,
}: ButtonProps) => {
    const { animationTop, animationBottom } = useScrollBlockMotion(2);

    const position = useTransform(
        [animationTop, animationBottom],
        ([top, bottom]: number[]) => getPosition(top, bottom),
    );

    const leaveDown = useTransform(position, (value) => clamp(value * 2));

    const blur = useTransform(leaveDown, (value) => value * 120);
    const filter = useMotionTemplate`blur(${blur}px)`;

    const isActive = active === i;

    return (
        <motion.button
            ref={buttonRef}
            style={{ filter }}
            data-cursor="button"
            data-color={isActive ? "curr" : "nestjs"}
            onClick={() => onSelect(i)}
            onMouseEnter={() => onHover(i)}
            className={`
                relative
                whitespace-nowrap
                text-[10px]
                font-ops
                tracking-[0.2em]
                py-1
                pt-[6px]
                px-2
                outline-1
                outline-fg/20
                outline-offset-2
                ${
                    isActive
                        ? "bg-curr text-app!"
                        : "text-curr hover:text-nestjs! hover:outline-nestjs"
                }
            `}
        >
            {type}
        </motion.button>
    );
};
