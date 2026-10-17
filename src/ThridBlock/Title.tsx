import type { MotionValue } from "framer-motion";
import {
    AnimatePresence,
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
import { createPortal } from "react-dom";
import { SplitText } from "../components/text/ScatterText";
import { useDevice } from "../scroll/useDevice";
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
    const { isMobile } = useDevice();

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
    }, [measureLayout, isMobile]);

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
            isMobile ||
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
    }, [isMobile, hovered, layout, hoverOffset]);

    const clearHover = () => {
        hoveredRef.current = null;
        setHovered(null);

        hoverAnimationRef.current?.stop();
        hoverAnimationRef.current = null;
    };

    const handleHover = (index: number) => {
        if (isMobile) return;

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
            isMobile ||
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
        isMobile,
        hovered,
        active,
        hoverSide,
        layout,
        hoverOffset,
        hoverLength,
        hoverGap,
    ]);

    const opacity = useTransform(leaveProgress, [0, 1], [1, isMobile ? 1 : 0]);

    const rectWidth = Math.max((layout?.width ?? 0) - INSET * 2, 0);
    const rectHeight = Math.max((layout?.height ?? 0) - INSET * 2, 0);
    const radius = layout?.radius ?? BORDER_RADIUS;

    const activeClipX = layout
        ? INSET + radius + (activeButton?.topStart ?? 0)
        : 0;

    const activeClipWidth = activeButton?.length ?? 0;

    const clipHeight = INSET * 2 + STROKE_WIDTH * 2;

    const text = isMobile ? "text-[1.8em]!" : "text-[32px]!";
    const w = isMobile ? "w-full" : "w-2/3";

    return (
        <motion.div
            ref={(e) => ref(e?.previousSibling as HTMLElement)}
            className="col-center-4 mb-10 w-full z-999"
            style={{ opacity }}
        >
            <GoPrev />

            {isMobile ? (
                <h1 className="relative shrink-0 text-nowrap text-curr/80 text-[32px]! font-raj!">
                    Tech Stack
                </h1>
            ) : (
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
            )}

            <div className={`mb-6 ${w}`}>
                {isMobile ? (
                    <h1
                        className={`text-center font-outfit! text-curr! ${text} opacity-80`}
                    >
                        An interactive tour of my core tech stack and the tools
                        I use in my projects
                    </h1>
                ) : (
                    <SplitText
                        text="An interactive tour of my core tech stack and the tools I use in my projects"
                        className={`text-center font-outfit! text-curr! ${text} opacity-80`}
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
                )}
            </div>

            {isMobile ? (
                <MobileTechSelect
                    types={types}
                    active={active}
                    onSelect={handleSelect}
                />
            ) : (
                <div
                    ref={borderRef}
                    className="relative isolate row-center-2 justify-center flex-wrap rounded-[12px] p-3"
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
                                stroke="var(--color-curr)"
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
            )}
        </motion.div>
    );
};

type MobileTechSelectProps = {
    types: readonly string[];
    active: number;
    onSelect: (index: number) => void;
};

type MenuPosition = {
    left: number;
    width: number;
    top: number;
    bottom: number;
    maxHeight: number;
    openAbove: boolean;
};

type MenuSize = {
    width: number;
    height: number;
    radius: number;
};

const MENU_INSET = 1;
const MENU_RADIUS = 11;
const MENU_STROKE_WIDTH = 1.5;
const MENU_SNAKE_DURATION = 4.5;

const MobileTechSelect = ({
    types,
    active,
    onSelect,
}: MobileTechSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
    const [menuSize, setMenuSize] = useState<MenuSize | null>(null);

    const selectRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const snakeOffset = useMotionValue(0);
    const snakeDashOffset = useTransform(snakeOffset, (value) => -value);

    const activeType = types[active] ?? types[0] ?? "Select technology";
    const menuMounted = isOpen && menuPosition !== null;

    useEffect(() => {
        const handlePointerDown = (event: globalThis.PointerEvent) => {
            const target = event.target;

            if (!(target instanceof Node)) return;

            if (
                !selectRef.current?.contains(target) &&
                !menuRef.current?.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        let frameId = 0;

        const updatePosition = () => {
            const trigger = triggerRef.current;

            if (trigger) {
                const rect = trigger.getBoundingClientRect();

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const gap = 8;
                const edge = 8;

                const width = Math.min(rect.width, viewportWidth - edge * 2);

                const left = Math.max(
                    edge,
                    Math.min(rect.left, viewportWidth - width - edge),
                );

                const spaceBelow = Math.max(
                    0,
                    viewportHeight - rect.bottom - gap - edge,
                );

                const spaceAbove = Math.max(0, rect.top - gap - edge);

                const preferredHeight = Math.min(viewportHeight * 0.45, 360);

                const openAbove =
                    spaceBelow < Math.min(preferredHeight, 220) &&
                    spaceAbove > spaceBelow;

                const availableSpace = openAbove ? spaceAbove : spaceBelow;

                const maxHeight = Math.max(
                    0,
                    Math.min(preferredHeight, availableSpace - 14),
                );

                const next: MenuPosition = {
                    left,
                    width,
                    top: rect.bottom + gap,
                    bottom: viewportHeight - rect.top + gap,
                    maxHeight,
                    openAbove,
                };

                setMenuPosition((previous) => {
                    if (
                        previous &&
                        previous.openAbove === next.openAbove &&
                        Math.abs(previous.left - next.left) < 0.5 &&
                        Math.abs(previous.width - next.width) < 0.5 &&
                        Math.abs(previous.top - next.top) < 0.5 &&
                        Math.abs(previous.bottom - next.bottom) < 0.5 &&
                        Math.abs(previous.maxHeight - next.maxHeight) < 0.5
                    ) {
                        return previous;
                    }

                    return next;
                });
            }

            frameId = requestAnimationFrame(updatePosition);
        };

        updatePosition();

        return () => cancelAnimationFrame(frameId);
    }, [isOpen]);

    useLayoutEffect(() => {
        if (!menuMounted || !menuRef.current) {
            setMenuSize(null);
            return;
        }

        const element = menuRef.current;

        const measure = () => {
            const rect = element.getBoundingClientRect();

            if (rect.width <= 0 || rect.height <= 0) return;

            const radius = Math.min(
                MENU_RADIUS,
                (rect.width - MENU_INSET * 2) / 2,
                (rect.height - MENU_INSET * 2) / 2,
            );

            const next: MenuSize = {
                width: rect.width,
                height: rect.height,
                radius,
            };

            setMenuSize((previous) => {
                if (
                    previous &&
                    Math.abs(previous.width - next.width) < 0.5 &&
                    Math.abs(previous.height - next.height) < 0.5 &&
                    Math.abs(previous.radius - next.radius) < 0.5
                ) {
                    return previous;
                }

                return next;
            });
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(element);

        return () => observer.disconnect();
    }, [menuMounted]);

    useEffect(() => {
        if (!menuMounted || !menuSize) return;

        snakeOffset.set(0);

        const playback = animate(snakeOffset, 1, {
            duration: MENU_SNAKE_DURATION,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
        });

        return () => playback.stop();
    }, [menuMounted, menuSize?.width, menuSize?.height, snakeOffset]);

    const handleSelect = (index: number) => {
        onSelect(index);
        setIsOpen(false);
    };

    const portalRoot = document.getElementById("overlay-root");

    return (
        <>
            <div ref={selectRef} className="relative z-30 w-full">
                <button
                    ref={triggerRef}
                    type="button"
                    aria-label="Select technology"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((previous) => !previous)}
                    className="
                        flex w-full items-center justify-between gap-3
                        rounded-xl border border-curr/50
                        bg-app px-4 py-3 text-left text-curr
                        transition-colors duration-200
                        active:border-curr
                        focus-visible:outline
                        focus-visible:outline-1
                        focus-visible:outline-curr
                    "
                >
                    <span className="flex min-w-0 items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-curr/40 font-mono text-xs text-curr">
                            {String(active + 1).padStart(2, "0")}
                        </span>

                        <span className="truncate font-ops tracking-[0.16em]">
                            {activeType}
                        </span>
                    </span>

                    <motion.svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-5 shrink-0 text-curr"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut",
                        }}
                    >
                        <path
                            d="m6 9 6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </motion.svg>
                </button>
            </div>

            {portalRoot &&
                createPortal(
                    <AnimatePresence>
                        {menuMounted && (
                            <motion.div
                                ref={menuRef}
                                key="tech-options"
                                initial={{
                                    opacity: 0,
                                    y: menuPosition.openAbove ? 6 : -6,
                                    scale: 0.985,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: menuPosition.openAbove ? 4 : -4,
                                    scale: 0.99,
                                }}
                                transition={{
                                    duration: 0.16,
                                    ease: "easeOut",
                                }}
                                className="
                                    overflow-hidden rounded-xl
                                    border border-curr/40
                                    bg-app shadow-2xl
                                "
                                style={{
                                    position: "fixed",
                                    left: menuPosition.left,
                                    width: menuPosition.width,
                                    top: menuPosition.openAbove
                                        ? undefined
                                        : menuPosition.top,
                                    bottom: menuPosition.openAbove
                                        ? menuPosition.bottom
                                        : undefined,
                                    zIndex: 2147483647,
                                    pointerEvents: "auto",
                                }}
                            >
                                {menuSize && (
                                    <svg
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                                        viewBox={`0 0 ${menuSize.width} ${menuSize.height}`}
                                        preserveAspectRatio="none"
                                    >
                                        <motion.rect
                                            x={MENU_INSET}
                                            y={MENU_INSET}
                                            width={Math.max(
                                                menuSize.width - MENU_INSET * 2,
                                                0,
                                            )}
                                            height={Math.max(
                                                menuSize.height -
                                                    MENU_INSET * 2,
                                                0,
                                            )}
                                            rx={menuSize.radius}
                                            pathLength={1}
                                            fill="none"
                                            stroke="var(--color-curr)"
                                            strokeWidth={MENU_STROKE_WIDTH}
                                            strokeLinecap="round"
                                            strokeDasharray="0.16 0.84"
                                            strokeDashoffset={snakeDashOffset}
                                        />
                                    </svg>
                                )}

                                <div
                                    role="listbox"
                                    aria-label="Technology stack"
                                    data-lenis-prevent
                                    className="relative z-0 overflow-y-auto overscroll-contain p-1.5"
                                    style={{
                                        maxHeight: menuPosition.maxHeight,
                                    }}
                                >
                                    {types.map((type, index) => {
                                        const isSelected = active === index;

                                        return (
                                            <button
                                                key={type}
                                                type="button"
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() =>
                                                    handleSelect(index)
                                                }
                                                className={`
                                                    flex w-full items-center gap-3
                                                    rounded-lg px-3 py-3
                                                    text-left
                                                    transition-colors duration-150
                                                    ${
                                                        isSelected
                                                            ? "bg-curr text-app!"
                                                            : "text-curr hover:bg-white/5 hover:text-fg!"
                                                    }
                                                `}
                                            >
                                                <span
                                                    className={`
                                                        grid size-7 shrink-0 place-items-center
                                                        rounded-md border font-mono text-[10px]
                                                        ${
                                                            isSelected
                                                                ? "border-app/30"
                                                                : "border-curr/30"
                                                        }
                                                    `}
                                                >
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                </span>

                                                <span className="min-w-0 flex-1 truncate font-ops text-sm tracking-[0.14em]">
                                                    {type}
                                                </span>

                                                {isSelected && (
                                                    <svg
                                                        aria-hidden="true"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        className="size-4 shrink-0"
                                                    >
                                                        <path
                                                            d="m5 12 4 4L19 6"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    portalRoot,
                )}
        </>
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
    const { isMobile } = useDevice();
    const p = isMobile ? "py-2 px-3 w-full" : "py-1 pt-[6px] px-2";

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
            style={isMobile ? { filter: "none" } : { filter }}
            data-cursor="button"
            data-color={isActive ? "curr" : "curr"}
            onClick={() => onSelect(i)}
            onMouseEnter={() => onHover(i)}
            className={`
                relative
                whitespace-nowrap
                text-[10px]
                font-ops
                tracking-[0.2em]
                ${p}
                outline-1
                outline-fg/20
                outline-offset-2
                ${
                    isActive
                        ? "bg-curr text-app!"
                        : "text-curr hover:text-curr! hover:outline-curr"
                }
            `}
        >
            {type}
        </motion.button>
    );
};
