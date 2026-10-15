import { motion } from "framer-motion";
import { scrollManager } from "../scroll/ScrollManager";
import { useScrollBlocks } from "../scroll/useScroll";
const clamp = (value: number, min = 0, max = 1) =>
    Math.min(Math.max(value, min), max);

const getPosition = (top: number, bottom: number) =>
    (top + bottom) / 2.9 - 0.35;

export const ToPrevBlock = () => {
    const blocks = useScrollBlocks();

    const block = blocks[3];

    const position = block
        ? getPosition(block.animationTop, block.animationBottom)
        : 1;

    const opacity = clamp(1 - Math.abs(position) * 2);
    return (
        <motion.div
            data-cursor="button"
            onClick={() => scrollManager.scrollToSection(1)}
            style={{ opacity }}
            className="
                relative
                w-40
                h-20
                left-1/2
                transform
                -translate-x-1/2
                bottom-5
                cursor-pointer"
        >
            <div
                className="
               absolute
                w-[3px]
                h-20
                left-1/2
                transform
                -translate-x-1/2
                bottom-0
                bg-fg/10
                
                overflow-hidden
            "
            >
                <div
                    className="
                    absolute
                    w-[2px]
                    left-[0.5px]
                    top-0
                    bg-fg/70
                    rounded-lg
                    animate-scroll-line
                "
                />
            </div>
        </motion.div>
    );
};
