import { IconCheck, IconLoader2, IconX } from "@tabler/icons-react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { memo } from "react";

export const SkillLetter = memo(function SkillLetter({
    letter,
    groupIndex,
    index,
    leaveProgress,
    isAnimationComplete,
    replaced,
    showFail,
    groupLength = 0,
}: {
    letter: string;
    groupIndex: number;
    index: number;
    leaveProgress: MotionValue<number>;
    isAnimationComplete: boolean;
    replaced: boolean;
    groupLength?: number;
    showFail?: boolean;
}) {
    const delay = groupIndex * 0.04 + index * 0.01;
    const inputStart = 0.49 - delay;
    const inputEnd = 1 - delay;

    const y = useTransform(
        leaveProgress,
        [inputStart, inputEnd],
        [0, -10 * groupIndex],
    );

    const x = useTransform(leaveProgress, [inputStart, inputEnd], [0, 60]);

    const scale = useTransform(leaveProgress, [inputStart, inputEnd], [1, 0]);

    if (index !== 0) {
        return (
            <motion.span
                animate={
                    showFail !== undefined && showFail
                        ? {
                              x: [10, -10, 6, -6, 0],
                          }
                        : {
                              x: 0,
                          }
                }
                transition={{
                    scale: {
                        duration: 1.2,
                        times: [0, 0.2, 0.45, 0.7, 1],
                        ease: "easeOut",
                    },
                }}
                style={{
                    y,
                    scale,
                    opacity:
                        showFail !== undefined ? (!showFail ? 0 : 1) : scale,
                    x,
                }}
                className={`${groupIndex === groupLength - 1 && "transition-opacity duration-600"} ${showFail !== undefined && showFail && "text-rose-500"}`}
            >
                {letter === " " ? "\u00A0" : letter}
            </motion.span>
        );
    }

    return (
        <motion.div
            style={{
                y,
                scale,
                x,
                transitionDelay: isAnimationComplete
                    ? `${groupIndex * 400}ms`
                    : "0ms",
            }}
            animate={
                replaced
                    ? {
                          scale: [1, 0.75, 1.3, 0.9, 1],
                      }
                    : {
                          scale: 1,
                      }
            }
            transition={{
                scale: {
                    duration: 0.35,
                    times: [0, 0.2, 0.45, 0.7, 1],
                    ease: "easeOut",
                },
            }}
            className={`
                size-5
                border-1
                rounded-full
                ${
                    isAnimationComplete
                        ? `${groupIndex === groupLength - 1 ? "border-rose-500" : "border-green-500"} duration-800`
                        : "border-alter-fg duration-0"
                }
                transition-[background,border-color]
                ease
                flex
                flex-row
                items-center
                justify-center
                mr-2
            `}
        >
            {replaced ? (
                groupIndex === groupLength - 1 ? (
                    <IconX className="size-3 text-rose-500" />
                ) : (
                    <IconCheck className="size-3 text-green-500" />
                )
            ) : (
                <IconLoader2 className="size-3 text-alter-fg animate-spin" />
            )}
        </motion.div>
    );
});
