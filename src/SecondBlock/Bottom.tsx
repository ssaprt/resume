import { motion } from "framer-motion";
import { scrollManager } from "../scroll/ScrollManager";
import { useDevice } from "../scroll/useDevice";
import { useScrollElement } from "../scroll/useScroll";
import { useScrollTransform } from "../scroll/useScrollTransform";

export const Bottom = () => {
    const { ref, bottom } = useScrollElement();
    const { isMobile } = useDevice();
    const h = isMobile ? "h-8" : "h-12";
    const bot = isMobile ? "bottom-14" : "bottom-12";
    const opacity = useScrollTransform(
        bottom,
        [isMobile ? 0.7 : 1, isMobile ? 0.65 : 0.65],
        [1, 0],
    );

    return (
        <motion.div
            data-cursor="button"
            data-color="alter-foreground"
            onClick={() => scrollManager.scrollToSection(2)}
            style={{ opacity }}
            ref={(e) => ref(e?.parentNode as HTMLElement)}
            className={`absolute
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
                bg-alter-fg/10
                
                overflow-hidden`}
            >
                <div
                    className="
                    absolute
                    w-[2px]
                    left-[0.5px]
                    top-0
                    bg-alter-fg/70
                    rounded-lg
                    animate-scroll-line
                "
                />
            </div>
        </motion.div>
    );
};
