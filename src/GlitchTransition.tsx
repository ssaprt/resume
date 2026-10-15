import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

type GlitchTransitionProps = {
    active: boolean;
};

export const GlitchTransition = ({ active }: GlitchTransitionProps) => {
    const controls = useAnimationControls();

    useEffect(() => {
        if (!active) return;

        controls.start({
            opacity: [0, 1, 0.7, 1, 0],
            x: [0, -12, 9, -5, 3, 0],
            y: [0, 3, -4, 2, 0],
            skewX: [0, -2, 3, -1, 0],
            filter: [
                "none",
                "hue-rotate(90deg) saturate(2)",
                "hue-rotate(-60deg) saturate(3)",
                "none",
                "none",
            ],
            transition: {
                duration: 0.55,
                times: [0, 0.12, 0.3, 0.65, 1],
                ease: "linear",
            },
        });
    }, [active, controls]);

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-[10001] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={controls}
        >
            <motion.div
                className="absolute inset-0 bg-alter-fg/20"
                initial={{ opacity: 0 }}
                animate={
                    active
                        ? {
                              opacity: [0, 0.7, 0, 0.4, 0],
                              scaleY: [1, 0.98, 1.02, 1],
                          }
                        : { opacity: 0 }
                }
                transition={{ duration: 0.45, ease: "linear" }}
            />

            <motion.div
                className="absolute left-0 right-0 top-[35%] h-[3px] bg-cyan-400/70"
                initial={{ opacity: 0, x: 0 }}
                animate={
                    active
                        ? {
                              opacity: [0, 1, 0, 0.8, 0],
                              x: [0, 40, -25, 12, 0],
                          }
                        : { opacity: 0 }
                }
                transition={{ duration: 0.4, ease: "linear" }}
            />

            <motion.div
                className="absolute left-0 right-0 top-[62%] h-[2px] bg-red-500/70"
                initial={{ opacity: 0, x: 0 }}
                animate={
                    active
                        ? {
                              opacity: [0, 0, 1, 0, 0],
                              x: [0, -30, 50, -10, 0],
                          }
                        : { opacity: 0 }
                }
                transition={{ duration: 0.35, ease: "linear" }}
            />
        </motion.div>
    );
};
