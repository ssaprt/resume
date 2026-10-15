import { motion } from "framer-motion";
import { scrollManager } from "../scroll/ScrollManager";
import { useScrollElement } from "../scroll/useScroll";
import { useScrollTransform } from "../scroll/useScrollTransform";

export const Bottom = () => {
    const { ref, bottom } = useScrollElement();

    const opacity = useScrollTransform(bottom, [1, 0.85], [1, 0]);

    return (
        <motion.div
            data-cursor="button"
            data-color="alter-foreground"
            onClick={() => scrollManager.scrollToSection(2)}
            style={{ opacity }}
            ref={(e) => ref(e?.parentNode as HTMLElement)}
            className="
                absolute
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
                bg-alter-fg/10
                
                overflow-hidden
            "
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
