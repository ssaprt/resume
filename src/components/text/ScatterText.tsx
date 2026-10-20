import { motion, useTransform, type MotionValue } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useScrollElementMotion } from "../../scroll/useScroll";

export type SideMotion = {
    x: number;
    y: number;
    rotate: number;
    scale: number;
    opacity: number;
};

const DEFAULT_LEFT: SideMotion = {
    x: -280,
    y: 40,
    rotate: -10,
    scale: 0.5,
    opacity: 0,
};

const DEFAULT_RIGHT: SideMotion = {
    x: 280,
    y: 40,
    rotate: 10,
    scale: 0.5,
    opacity: 0,
};

const WINDOW = 0.3;
const INHERIT_FONT = "[font:inherit]!";

type Placement = {
    isLeft: boolean;
    strength: number;
    position: number;
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

const getPlacement = (position: number, split: number): Placement => {
    const normalized = clamp(position, 0, 1);
    const isLeft = normalized < split;

    const strength = isLeft
        ? split > 0
            ? (split - normalized) / split
            : 0
        : split < 1
          ? (normalized - split) / (1 - split)
          : 0;

    return {
        isLeft,
        strength: clamp(strength, 0, 1),
        position: normalized,
    };
};

const getFallback = (index: number, total: number, split: number): Placement =>
    getPlacement(index / Math.max(total - 1, 1), split);

type SplitLetterProps = {
    char: string;
    progress: MotionValue<number>;
    direction: MotionValue<number>;
    start: number;
    side: SideMotion;
};

const SplitLetter = ({
    char,
    progress,
    direction,
    start,
    side,
}: SplitLetterProps) => {
    const t = useTransform(progress, [start, start + WINDOW], [0, 1]);
    const x = useTransform(t, [0, 1], [0, side.x]);

    const y = useTransform(
        [t, direction],
        ([value, dir]: number[]) => value * side.y * dir,
    );

    const rotate = useTransform(t, [0, 1], [0, side.rotate]);
    const scale = useTransform(t, [0, 1], [1, side.scale]);
    const opacity = useTransform(t, [0, 1], [1, side.opacity]);

    return (
        <motion.span
            data-letter=""
            style={{
                display: "inline-block",
                x,
                y,
                rotate,
                scale,
                opacity,
            }}
            className={INHERIT_FONT}
        >
            {char}
        </motion.span>
    );
};

type IntrinsicTag = keyof React.JSX.IntrinsicElements;

type SplitTextProps = {
    text: string;
    as?: IntrinsicTag;
    className?: string;
    stagger?: number;
    left?: Partial<SideMotion>;
    right?: Partial<SideMotion>;
    trackParent?: boolean;
    enterOnlyFromTop?: boolean;
    split?: number;
    dir?: -1 | 0 | 1;
    once?: boolean;
    scroll?: {
        leaveProgress: MotionValue<number>;
        leaveDirection: MotionValue<number>;
    };
};

const SplitText = ({
    text,
    as = "h1",
    className,
    stagger = 1 - WINDOW,
    left,
    right,
    trackParent = true,
    enterOnlyFromTop = false,
    split = 0.5,
    once = false,
    dir = 0,
    scroll,
}: SplitTextProps) => {
    const {
        ref,
        leaveProgress: ownProgress,
        leaveDirection: ownDirection,
    } = useScrollElementMotion();

    const leaveProgress = scroll?.leaveProgress ?? ownProgress;
    const leaveDirection = scroll?.leaveDirection ?? ownDirection;
    const external = scroll !== undefined;
    const splitPoint = clamp(split, 0, 1);

    const maxProgress = useRef(0);

    const animationProgress = useTransform(
        [leaveProgress, leaveDirection],
        ([value, direction]: number[]) => {
            if (once) {
                maxProgress.current = Math.max(maxProgress.current, value);
                return maxProgress.current;
            }

            if (!enterOnlyFromTop) {
                return value;
            }

            return direction < 0 ? 0 : value;
        },
    );

    const rootRef = useRef<HTMLElement | null>(null);
    const [placements, setPlacements] = useState<Placement[]>([]);

    const bindRef = useCallback(
        (node: HTMLElement | null) => {
            rootRef.current = node;

            if (external) return;

            ref(trackParent ? (node?.parentElement ?? null) : node);
        },
        [ref, external, trackParent],
    );

    const measure = useCallback(() => {
        const root = rootRef.current;

        if (!root) return;

        const nodes = Array.from(
            root.querySelectorAll<HTMLElement>("[data-letter]"),
        );

        const lines: HTMLElement[][] = [];

        nodes.forEach((node) => {
            const line = lines[lines.length - 1];

            if (
                line &&
                node.offsetTop - line[0].offsetTop <= node.offsetHeight / 2
            ) {
                line.push(node);
            } else {
                lines.push([node]);
            }
        });

        const next = lines.flatMap((line) => {
            const lineLeft = Math.min(...line.map((node) => node.offsetLeft));

            const lineRight = Math.max(
                ...line.map((node) => node.offsetLeft + node.offsetWidth),
            );

            const width = Math.max(lineRight - lineLeft, 1);

            return line.map((node): Placement => {
                const position =
                    (node.offsetLeft + node.offsetWidth / 2 - lineLeft) / width;

                return getPlacement(position, splitPoint);
            });
        });

        setPlacements((previous) =>
            previous.length === next.length &&
            previous.every(
                (placement, index) =>
                    placement.isLeft === next[index].isLeft &&
                    Math.abs(placement.strength - next[index].strength) <
                        0.01 &&
                    Math.abs(placement.position - next[index].position) < 0.01,
            )
                ? previous
                : next,
        );
    }, [splitPoint]);

    useLayoutEffect(() => {
        measure();

        const root = rootRef.current;

        if (!root) return;

        const observer = new ResizeObserver(measure);

        observer.observe(root);

        let active = true;

        document.fonts?.ready.then(() => {
            if (active) measure();
        });

        return () => {
            active = false;
            observer.disconnect();
        };
    }, [measure, text]);

    const spread = clamp(stagger, 0, 1 - WINDOW);

    const leftSide = { ...DEFAULT_LEFT, ...left };
    const rightSide = { ...DEFAULT_RIGHT, ...right };

    const parts = text.match(/\s+|\S+/gu) ?? [];
    const total = Array.from(text.replace(/\s+/gu, "")).length;

    const wordStarts = parts.map((_, partIndex) =>
        parts
            .slice(0, partIndex)
            .reduce(
                (sum, previous) =>
                    /^\s/u.test(previous)
                        ? sum
                        : sum + Array.from(previous).length,
                0,
            ),
    );

    const letters = parts.map((part, partIndex) => {
        if (/^\s/u.test(part)) {
            return part;
        }

        return (
            <span
                key={`word-${partIndex}`}
                className={`inline-block whitespace-nowrap ${INHERIT_FONT}`}
            >
                {Array.from(part).map((char, letterIndex) => {
                    const index = wordStarts[partIndex] + letterIndex;

                    const placement =
                        placements[index] ??
                        getFallback(index, total, splitPoint);

                    const start =
                        dir === 1
                            ? placement.position * spread
                            : dir === -1
                              ? (1 - placement.position) * spread
                              : (1 - placement.strength) * spread;

                    return (
                        <SplitLetter
                            key={index}
                            char={char}
                            progress={animationProgress}
                            direction={leaveDirection}
                            start={start}
                            side={placement.isLeft ? leftSide : rightSide}
                        />
                    );
                })}
            </span>
        );
    });

    const content = (
        <>
            <span className="sr-only select-none">{text}</span>
            <span aria-hidden="true" className={INHERIT_FONT}>
                {letters}
            </span>
        </>
    );

    switch (as) {
        case "h1":
            return (
                <h1 ref={bindRef} className={className}>
                    {content}
                </h1>
            );

        case "h2":
            return (
                <h2 ref={bindRef} className={className}>
                    {content}
                </h2>
            );

        case "h3":
            return (
                <h3 ref={bindRef} className={className}>
                    {content}
                </h3>
            );

        case "h4":
            return (
                <h4 ref={bindRef} className={className}>
                    {content}
                </h4>
            );

        case "h5":
            return (
                <h5 ref={bindRef} className={className}>
                    {content}
                </h5>
            );

        case "h6":
            return (
                <h6 ref={bindRef} className={className}>
                    {content}
                </h6>
            );

        case "p":
            return (
                <p ref={bindRef} className={className}>
                    {content}
                </p>
            );

        case "div":
            return (
                <div ref={bindRef} className={className}>
                    {content}
                </div>
            );

        case "span":
            return (
                <span ref={bindRef} className={className}>
                    {content}
                </span>
            );

        case "label":
            return (
                <label ref={bindRef} className={className}>
                    {content}
                </label>
            );

        case "strong":
            return (
                <strong ref={bindRef} className={className}>
                    {content}
                </strong>
            );

        case "em":
            return (
                <em ref={bindRef} className={className}>
                    {content}
                </em>
            );

        default:
            return (
                <h1 ref={bindRef} className={className}>
                    {content}
                </h1>
            );
    }
};

export default SplitText;
