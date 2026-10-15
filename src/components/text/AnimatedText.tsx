import { motion, useSpring, useTransform } from "framer-motion";
import { createElement, type ElementType } from "react";
import { useScrollElementMotion } from "../../scroll/useScroll";

type AnimatedLetterProps = {
    letter: string;
    index: number;
    length: number;
    start?: number;
};

const AnimatedLetter = ({
    letter,
    index,
    length,
    start = 0.8,
}: AnimatedLetterProps) => {
    const { ref, enterProgress, intersection } = useScrollElementMotion();

    const animationStart = 0;
    const animationEnd = Math.max(start, 0.08);
    const position = index / Math.max(length - 1, 1);

    const inputStart =
        animationStart + position * (animationEnd - animationStart);

    const inputEnd = inputStart + 0.1;

    const rawOpacity = useTransform(
        enterProgress,
        [inputStart, inputEnd],
        [0, 0.8],
    );

    const rawY = useTransform(enterProgress, [inputStart, inputEnd], [-60, 0]);

    const letterOpacity = useSpring(rawOpacity, {
        stiffness: 180,
        damping: 22,
        mass: 0.6,
    });

    const letterY = useSpring(rawY, {
        stiffness: 220,
        damping: 12,
        mass: 0.5,
    });

    const visibleRatio = useSpring(intersection, {
        stiffness: 240,
        damping: 30,
        mass: 0.5,
    });

    const opacity = useTransform(
        [letterOpacity, visibleRatio],
        ([letterValue, visibility]: number[]) => letterValue * visibility,
    );

    return (
        <motion.span
            ref={ref}
            style={{
                display: "inline-block",
                opacity,
                y: letterY,
                transformOrigin: "center",
                fontSize: "inherit",
                lineHeight: "inherit",
                fontFamily: "inherit",
                fontWeight: "inherit",
                letterSpacing: "inherit",
                color: "inherit",
            }}
        >
            {letter}
        </motion.span>
    );
};

type AnimatedTextProps = {
    text: string;
    as?: ElementType;
    className?: string;
    start?: number;
};

export const AnimatedText = ({
    text,
    as = "h1",
    className,
    start,
}: AnimatedTextProps) => {
    const { ref } = useScrollElementMotion();

    const letters = [...text];
    const parts = text.match(/\s+|[^\s]+/gu) ?? [];

    const children = parts.map((part, partIndex) => {
        const startIndex = parts
            .slice(0, partIndex)
            .reduce((total, previous) => total + [...previous].length, 0);

        if (/^\s+$/u.test(part)) {
            return part;
        }

        return (
            <span
                key={`word-${partIndex}`}
                className={`inline-block whitespace-nowrap ${className ?? ""}`}
            >
                {[...part].map((letter, letterIndex) => {
                    const currentIndex = startIndex + letterIndex;

                    return (
                        <AnimatedLetter
                            key={`${letter}-${currentIndex}`}
                            letter={letter}
                            index={currentIndex}
                            length={letters.length}
                            start={start}
                        />
                    );
                })}
            </span>
        );
    });

    return createElement(
        as,
        {
            ref,
            className: `max-w-full whitespace-normal ${className ?? ""}`,
        },
        children,
    );
};

export default AnimatedText;
