import {
    useAnimationControls,
    useInView,
    type Transition,
} from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { useScroll } from "../scroll/useScroll";

type UseScrollRevealOptions = {
    distance?: number;
    duration?: number;
    delay?: number;
    once?: boolean;
    amount?: number;
    transition?: Transition;
};

export const useScrollReveal = ({
    distance = 60,
    duration = 1,
    delay = 0,
    once = true,
    amount = 0.25,
    transition,
}: UseScrollRevealOptions = {}) => {
    const { direction } = useScroll();
    const controls = useAnimationControls();
    const elementRef = useRef<HTMLDivElement | null>(null);

    const ref = useCallback((node: HTMLDivElement | null) => {
        elementRef.current = node;
    }, []);
    const isInView = useInView(elementRef, { once, amount });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isInView || (once && hasAnimated.current)) {
            return;
        }

        hasAnimated.current = true;

        controls.set({
            opacity: 0,
            y: direction === 0 ? distance : direction * distance,
        });

        controls.start({
            opacity: 1,
            y: 0,
            transition: transition ?? {
                opacity: {
                    duration: 0.8,
                    ease: "easeOut",
                    delay,
                },
                y: {
                    duration,
                    ease: [0.22, 1, 0.36, 1],
                    delay,
                },
            },
        });
    }, [
        isInView,
        direction,
        controls,
        distance,
        duration,
        delay,
        once,
        transition,
    ]);

    return {
        ref,
        initial: false as const,
        animate: controls,
    };
};
