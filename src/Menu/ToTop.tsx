import { IconArrowUpToArc } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { scrollManager } from "../scroll/ScrollManager";
import { useDevice } from "../scroll/useDevice";
import { useScrollBlocks } from "../scroll/useScroll";

export const ToTop = () => {
    const blocks = useScrollBlocks();
    const [hovered, setHovered] = useState(false);
    const visible = blocks[0]?.visible ?? true;
    const { isMobile } = useDevice();

    const style = isMobile ? "fixed bottom-13 left-[7px] w-8 h-8" : "";

    return (
        <motion.div
            data-cursor="button"
            data-color="curr"
            className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center ${style}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => scrollManager.scrollToSection(0)}
            animate={{
                scale: visible ? 0 : 1,
                y: visible ? 40 : 0,
                rotate: visible ? -90 : 0,
            }}
            transition={
                visible
                    ? {
                          duration: 0.3,
                          ease: "easeOut",
                      }
                    : {
                          type: "spring",
                          stiffness: 300,
                          damping: 12,
                          mass: 0.8,
                      }
            }
        >
            <div
                className={`
                           ${isMobile ? "w-8 h-8" : "w-5 h-5"}
                           rounded-full
                           border border-curr/30
                            backdrop-blur-sm
                            shadow-[inset_0_0_16px_0px]
                            shadow-curr/30
                           flex
                           items-center
                           justify-center
                           ${hovered ? (isMobile ? "scale-110" : "scale-130") : "scale-100"}
                           transition-transform
                           duration-200
                           ease
                     `}
            >
                <IconArrowUpToArc className={`w-3 h-3 text-curr`} />
            </div>
        </motion.div>
    );
};
