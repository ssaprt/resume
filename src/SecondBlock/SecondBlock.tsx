import { motion } from "framer-motion";
import { useTransform } from "motion/react";
import { useDevice } from "../scroll/useDevice";
import { useScrollElement, useScrollElementMotion } from "../scroll/useScroll";
import { Bottom } from "./Bottom";
import { Flip } from "./Flip";
import { Left } from "./Left";
import { Right } from "./Right";

export const SecondBlock = () => {
    const { ref, bottom } = useScrollElement();
    const { isMobile } = useDevice();
    const { ref: ref2, leaveProgress: leaveProgress } =
        useScrollElementMotion();

    const scale = useTransform(leaveProgress, [0, 1], [1, isMobile ? 0.5 : 1]);
    const opacity = useTransform(
        leaveProgress,
        [0, 0.4],
        [1, isMobile ? 0 : 1],
    );
    return (
        <motion.div
            ref={ref2}
            style={{ scale, opacity }}
            className={`col-center-4 lg:row-center-12 justify-start lg:justify-center h-full w-full`}
        >
            <div
                ref={ref}
                className="absolute w-full h-[99.9dvh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />
            <Left />
            <Flip bottom={bottom} />
            <Bottom />
            <Right />
        </motion.div>
    );
};
