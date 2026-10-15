import { motion } from "framer-motion";
import { useTransform } from "motion/react";
import { useScrollElementMotion } from "../../scroll/useScroll";
import { FiveBlockContext } from "./FiveBlockContext";

export const FiveBlockProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const {
        ref,
        leaveProgress,
        enterProgress,
        leaveDirection,
        isAnimationComplete,
        intersection,
    } = useScrollElementMotion();

    const opacity = useTransform(leaveProgress, [0, 0.5], [1, 0]);

    const pointerEvents = useTransform(leaveProgress, [0, 1], ["auto", "none"]);
    const y = useTransform(leaveProgress, [0, 1], [0, 320]);

    return (
        <FiveBlockContext.Provider
            value={{
                leaveProgress,
                enterProgress,
                leaveDirection,
                isAnimationComplete,
                intersection,
            }}
        >
            <motion.div
                ref={(e) => ref(e?.parentNode as HTMLElement)}
                style={{ opacity, pointerEvents, y }}
                className="w-full h-full row-center-4 justify-center p-10"
            >
                {children}
            </motion.div>
        </FiveBlockContext.Provider>
    );
};
