import { motion } from "framer-motion";
import { useTransform } from "motion/react";
import { useDevice } from "../../scroll/useDevice";
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
    const { isMobile } = useDevice();

    const opacity = useTransform(
        leaveProgress,
        [0, 0.5],
        [1, isMobile ? 1 : 0],
    );

    const pointerEvents = useTransform(
        leaveProgress,
        [0, 1],
        ["auto", isMobile ? "auto" : "none"],
    );
    const y = useTransform(leaveProgress, [0, 1], [0, isMobile ? 0 : 320]);
    const p = isMobile
        ? "col-center-4 p-0"
        : "row-center-4 p-10 justify-center";

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
                className={`w-full h-full ${p} `}
            >
                {children}
            </motion.div>
        </FiveBlockContext.Provider>
    );
};
