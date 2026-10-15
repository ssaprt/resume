import { motion, MotionValue, useTransform } from "framer-motion";

export const FixIt = ({
    letter,
    groupIndex,
    index,
    leaveProgress,

    showFail,
}: {
    letter: string;
    groupIndex: number;
    index: number;
    leaveProgress: MotionValue<number>;

    groupLength?: number;
    showFail?: boolean;
}) => {
    const delay = groupIndex * 0.04 + index * 0.01;
    const inputStart = 0.45 - delay;
    const inputEnd = 1 - delay;

    const y = useTransform(
        leaveProgress,
        [inputStart, inputEnd],
        [0, -10 * groupIndex],
    );

    const scale = useTransform(leaveProgress, [inputStart, inputEnd], [1, 0]);
    return (
        <motion.span
            style={{
                y,
                scale,
                opacity: showFail !== undefined ? (!showFail ? 0 : 1) : scale,
            }}
            className="transition-opacity duration-600 ease"
        >
            <motion.span
                animate={{
                    x: showFail ? (index - 2.5) * 12 : 0,
                }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut",
                }}
                className="select-none text-rose-500 text-[14px]!"
            >
                {letter === " " ? "\u00A0" : letter}
            </motion.span>
        </motion.span>
    );
};
