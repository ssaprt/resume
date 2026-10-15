import { type MotionValue, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export const useScrollTransform = <T>(
    progress: number,
    input: [number, number],
    output: [T, T],
): MotionValue<T> => {
    const progressValue = useMotionValue(progress);

    useEffect(() => {
        progressValue.set(progress);
    }, [progress, progressValue]);

    return useTransform(progressValue, input, output);
};
