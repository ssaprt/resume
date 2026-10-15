import type { MotionValue } from "motion";

export type PropsContext = {
    leaveProgress: MotionValue<number>;
    enterProgress: MotionValue<number>;
    leaveDirection: MotionValue<number>;
    isAnimationComplete: boolean;
    intersection: MotionValue<number>;
};
