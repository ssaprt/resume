import { motion } from "framer-motion";
import { useTransform } from "motion/react";
import { scrollManager } from "../scroll/ScrollManager";
import { useScrollElementMotion } from "../scroll/useScroll";

export const GoPrev = () => {
    const { ref, enterProgress } = useScrollElementMotion();

    const inputStart = 0;
    const inputEnd = 1;

    const opacity = useTransform(enterProgress, [inputStart, inputEnd], [0, 1]);
    const y = useTransform(enterProgress, [inputStart, inputEnd], [-230, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity, y }}
            data-cursor="button"
            onClick={() => scrollManager.scrollToSection(1)}
            className="
                relative
                w-40
                h-10
                cursor-pointer mt-4"
        >
            <div
                className="
               absolute
                w-[3px]
                h-10
                left-1/2
                transform
                -translate-x-1/2
                rotate-180
                bottom-0
                bg-curr/10
                
                overflow-hidden
            "
            >
                <div
                    className="
                    absolute
                    w-[2px]
                    left-[0.5px]
                    top-0
                    bg-curr/70
                    rounded-lg
                    animate-scroll-line
                "
                />
            </div>
        </motion.div>
    );
};
