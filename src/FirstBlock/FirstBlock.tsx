import { motion } from "framer-motion";
import { useTransform } from "motion/react";
import { useDevice } from "../scroll/useDevice";
import { useScrollElementMotion } from "../scroll/useScroll";
import { Bottom } from "./Bottom";
import { Flip } from "./Flip";
import { Left } from "./Left";
import { Right } from "./Right";

export const FirstBlock = () => {
    const { isMobile } = useDevice();
    const { ref, leaveProgress } = useScrollElementMotion();

    const scale = useTransform(leaveProgress, [0, 1], [1, isMobile ? 0 : 1]);
    const opacity = useTransform(
        leaveProgress,
        [0, 0.4],
        [1, isMobile ? 0 : 1],
    );
    return (
        <motion.div
            ref={ref}
            style={{ scale, opacity }}
            className="col-center-4 lg:row-center-12 justify-start lg:justify-center h-full"
        >
            <Left />
            <Flip />
            <Bottom />
            <Right />
        </motion.div>
    );
};
