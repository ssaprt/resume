import {
    AnimatePresence,
    motion,
    useMotionTemplate,
    useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
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

type MenuPosition = {
    left: number;
    width: number;
    top: number;
    bottom: number;
    maxHeight: number;
    openAbove: boolean;
};

export const Title = () => {
    const { active, setActive } = useThridBlockContext();
    const { ref, leaveProgress, leaveDirection } = useScrollElementMotion();
    const { isMobile } = useDevice();

    const opacity = useTransform(leaveProgress, [0, 1], [1, isMobile ? 1 : 0]);

    const text = isMobile ? "text-[1.8em]!" : "text-[32px]!";
    const width = isMobile ? "w-full" : "w-2/3";
    const mb = isMobile ? "mb-6 col-center-1" : "mb-0 col-center-4";

    const handleSelect = (index: number) => {
        setActive(index);
    };

    return (
        <motion.div
            ref={(element) => ref(element?.previousSibling as HTMLElement)}
            className={`w-full z-999 ${mb}`}
            style={{ opacity }}
        >
            <GoPrev />

            {isMobile ? (
                <h1 className="relative shrink-0 text-nowrap text-curr/80 text-[32px]! font-ops!">
                    Tech Stack
                </h1>
            ) : (
                <SplitText
                    text="Tech Stack"
                    className="relative shrink-0 text-nowrap text-curr/80 text-[32px]! font-ops!"
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
                    enterOnlyFromTop
                    as="h1"
                    scroll={{ leaveProgress, leaveDirection }}
                />
            )}

            <div className={`${mb} ${width}`}>
                {isMobile ? (
                    <h1
                        className={`text-center font-rob! text-curr! ${text} opacity-80`}
                    >
                        An interactive tour of my core tech stack and the tools
                        I use in my projects
                    </h1>
                ) : (
                    <SplitText
                        text="An interactive tour of my core tech stack and the tools I use in my projects"
                        className={`text-center font-outfit! text-curr! ${text} opacity-80`}
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
                        enterOnlyFromTop
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
                <div className="relative isolate row-center-2 justify-center flex-wrap rounded-[12px] p-3">
                    {types.map((type, index) => (
                        <Button
                            key={type}
                            type={type}
                            i={index}
                            active={active}
                            onSelect={handleSelect}
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

const MobileTechSelect = ({
    types,
    active,
    onSelect,
}: MobileTechSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialPosition, setInitialPosition] = useState<MenuPosition | null>(
        null,
    );

    const selectRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const activeType = types[active] ?? types[0] ?? "Select technology";

    const calculatePosition = useCallback((): MenuPosition | null => {
        const trigger = triggerRef.current;
        if (!trigger) return null;

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

        return {
            left,
            width,
            top: rect.bottom + gap,
            bottom: viewportHeight - rect.top + gap,
            maxHeight,
            openAbove,
        };
    }, []);

    const openMenu = () => {
        if (isOpen) {
            setIsOpen(false);
            return;
        }

        const position = calculatePosition();
        if (!position) return;

        setInitialPosition(position);
        setIsOpen(true);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
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
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        let frameId = 0;

        const updatePosition = () => {
            const position = calculatePosition();
            const menu = menuRef.current;
            const options = optionsRef.current;

            if (position && menu && options) {
                const left = `${position.left}px`;
                const width = `${position.width}px`;
                const top = position.openAbove ? "auto" : `${position.top}px`;
                const bottom = position.openAbove
                    ? `${position.bottom}px`
                    : "auto";
                const maxHeight = `${position.maxHeight}px`;

                if (menu.style.left !== left) menu.style.left = left;
                if (menu.style.width !== width) menu.style.width = width;
                if (menu.style.top !== top) menu.style.top = top;
                if (menu.style.bottom !== bottom) menu.style.bottom = bottom;
                if (options.style.maxHeight !== maxHeight) {
                    options.style.maxHeight = maxHeight;
                }
            }

            frameId = requestAnimationFrame(updatePosition);
        };

        updatePosition();

        return () => {
            cancelAnimationFrame(frameId);
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, calculatePosition]);

    const handleSelect = (index: number) => {
        onSelect(index);
        setIsOpen(false);
    };

    const portalRoot =
        typeof document !== "undefined"
            ? document.getElementById("overlay-root")
            : null;

    return (
        <>
            <div ref={selectRef} className="relative z-30 w-full">
                <button
                    ref={triggerRef}
                    type="button"
                    aria-label="Select technology"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    onClick={openMenu}
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
                        transition={{ duration: 0.2, ease: "easeInOut" }}
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
                        {isOpen && initialPosition && (
                            <motion.div
                                ref={menuRef}
                                key="tech-options"
                                initial={{
                                    opacity: 0,
                                    y: initialPosition.openAbove ? 6 : -6,
                                    scale: 0.985,
                                }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{
                                    opacity: 0,
                                    y: initialPosition.openAbove ? 4 : -4,
                                    scale: 0.99,
                                }}
                                transition={{ duration: 0.16, ease: "easeOut" }}
                                className="fixed overflow-hidden rounded-xl border border-curr/40 bg-app shadow-2xl"
                                style={{
                                    position: "fixed",
                                    left: initialPosition.left,
                                    width: initialPosition.width,
                                    top: initialPosition.openAbove
                                        ? undefined
                                        : initialPosition.top,
                                    bottom: initialPosition.openAbove
                                        ? initialPosition.bottom
                                        : undefined,
                                    zIndex: 2147483647,
                                    pointerEvents: "auto",
                                }}
                            >
                                <div
                                    ref={optionsRef}
                                    role="listbox"
                                    aria-label="Technology stack"
                                    data-lenis-prevent
                                    className="overflow-y-auto overscroll-contain p-1.5"
                                    style={{
                                        maxHeight: initialPosition.maxHeight,
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
};

const Button = ({ type, i, active, onSelect }: ButtonProps) => {
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
            style={{ filter }}
            data-cursor="button"
            data-color="curr"
            onClick={() => onSelect(i)}
            className={`
                relative
                whitespace-nowrap
                text-[10px]
                font-ops
                tracking-[0.2em]
                py-1 pt-[6px] px-2
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
