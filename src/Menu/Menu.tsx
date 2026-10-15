import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { scrollManager } from "../scroll/ScrollManager";
import { useScrollBlocks } from "../scroll/useScroll";
import { ToTop } from "./ToTop";
import { Top } from "./Top/Top";

const RESERVE_HEIGHT = 160;

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

export const Menu = () => {
    const blocks = useScrollBlocks();

    return (
        <div
            className="
                fixed
                z-9999
                top-0
                left-0
                w-12
                h-dvh
                py-10
                flex
                flex-col
                gap-4
                items-center
                justify-stretch
            "
        >
            <Top />

            <div
                className="w-full flex flex-col items-center gap-2"
                style={{
                    height: `calc(100dvh - ${RESERVE_HEIGHT}px)`,
                }}
            >
                {blocks.map((block) => {
                    return <MenuBlock key={block.block} block={block} />;
                })}
            </div>

            <ToTop />
        </div>
    );
};

const MenuBlock = ({
    block,
}: {
    block: ReturnType<typeof useScrollBlocks>[number];
}) => {
    const intersection = clamp(block.intersection);
    const active = intersection >= 0.99;

    const [hovered, setHovered] = useState(false);
    const [wasActive, setWasActive] = useState(active);

    useEffect(() => {
        // eslint-disable-next-line
        setWasActive(active);
    }, [active]);

    let translateY = 100;
    let scaleY = 0;
    //eslint-disable-next-line
    let transformOrigin: "top" | "bottom" = "top";

    if (block.direction === 1) {
        transformOrigin = "top";

        if (block.top < 0 && block.bottom > 0) {
            translateY = (1 - intersection) * 100;
            scaleY = 1;
        } else if (block.top < 1 && block.bottom > 1) {
            translateY = 0;
            scaleY = intersection;
        }
    } else {
        transformOrigin = "bottom";

        if (block.top < 1 && block.bottom > 1) {
            translateY = -(1 - intersection) * 100;
            scaleY = 1;
        } else if (block.top < 0 && block.bottom > 0) {
            translateY = (1 - intersection) * 100;
            scaleY = intersection;
        }
    }

    if (active && block.top >= 0 && block.bottom <= 1) {
        translateY = 0;
        scaleY = 1;
    }

    const width = hovered || active ? (hovered ? "0.5rem" : "0.4rem") : "1px";

    const transition =
        hovered || (active && !wasActive)
            ? {
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 12,
                  mass: 0.8,
              }
            : {
                  duration: 0.3,
                  ease: "easeOut" as const,
              };

    return (
        <motion.div
            data-cursor="button"
            data-color="foreground"
            className={`
                flex
                justify-center
                min-h-0
                w-full
                flex-1
                rounded-full
                relative
                cursor-pointer
                ${!active ? "pointer-events-auto" : "pointer-events-none"}
            `}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => scrollManager.scrollToSection(block.block)}
        >
            <motion.div
                animate={{
                    width,
                }}
                transition={{
                    width: transition,
                }}
                className="
                    min-h-0
                    rounded-full
                    bg-fg/15
                    relative
                    overflow-hidden
                "
            >
                <div
                    className={`
                        absolute
                        inset-0
                        rounded-full
                        transition-colors
                        duration-600
                        ease-in-out
                        ${active ? "bg-alter-fg/30" : "bg-fg/30"}
                    `}
                    style={{
                        transform: `translateY(${translateY}%) scaleY(${scaleY})`,
                        transformOrigin,
                    }}
                />
            </motion.div>
        </motion.div>
    );
};
