import { motion } from "framer-motion";
import { scrollManager } from "../scroll/ScrollManager";
import { useDevice } from "../scroll/useDevice";
import { useScrollElement } from "../scroll/useScroll";
import { useScrollTransform } from "../scroll/useScrollTransform";

export const Bottom = () => {
    const { ref, bottom } = useScrollElement();
    const { isMobile } = useDevice();
    const h = isMobile ? "h-14" : "h-20";
    const bot = isMobile ? "bottom-5" : "bottom-5";

    const opacity = useScrollTransform(
        bottom,
        [isMobile ? 0.7 : 1, isMobile ? 0.65 : 0.65],
        [1, 0],
    );

    return (
        <motion.div
            data-cursor="button"
            onClick={() => scrollManager.scrollToSection(1)}
            style={{ opacity }}
            ref={(e) => ref(e?.parentNode as HTMLElement)}
            className={` absolute
                w-40
                ${h}
                left-1/2
                transform
                -translate-x-1/2
                ${bot}
                cursor-pointer`}
        >
            <div
                className={`absolute
                w-[3px]
                ${h}
                left-1/2
                transform
                -translate-x-1/2
                bottom-0
                bg-fg/10
                
                overflow-hidden`}
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
