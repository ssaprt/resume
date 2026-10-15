import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { scrollManager } from "../../scroll/ScrollManager";
import { useDevice } from "../../scroll/useDevice";
import { useScrollBlocks } from "../../scroll/useScroll";

const tags = ["Main", "Experience", "Tech Stack", "Projects", "Contacts"];

const ITEM_H = 32;
const BOX_H = 32;
const LIST_TOP = 0;

const clamp = (value: number, min = 0, max = 1) =>
    Math.min(Math.max(value, min), max);

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const getPosition = (top: number, bottom: number) =>
    (top + bottom) / 2.9 - 0.35;

export const Top = () => {
    const blocks = useScrollBlocks();
    const { isDesktop } = useDevice();

    const [hovered, setHovered] = useState(false);

    const [mix, setMix] = useState(0);

    const mixRef = useRef(0);

    const listH = blocks.length * ITEM_H;

    const openH = Math.max(BOX_H, listH);

    const boxH = lerp(BOX_H, openH, mix);

    let active = -1;
    let smallest = Infinity;

    blocks.forEach((block, i) => {
        const distance = Math.abs(
            getPosition(block.animationTop, block.animationBottom),
        );

        if (distance < smallest) {
            smallest = distance;
            active = i;
        }
    });

    useEffect(() => {
        const controls = animate(mixRef.current, hovered ? 1 : 0, {
            duration: 0.4,
            ease: "easeInOut",
            onUpdate: (value) => {
                mixRef.current = value;
                setMix(value);
            },
        });

        return () => controls.stop();
    }, [hovered]);

    return (
        <div
            className="
            w-8
            h-8
            rounded-full
            bg-fg/5
            relative
            flex
            items-center
            justify-center
            "
        >
            <span className="text-alter-fg select-none">#</span>

            {isDesktop && (
                <div
                    data-cursor="button"
                    data-color="alter-foreground"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="
                    absolute
                    left-[calc(100%+0.5rem)]
                    top-1/2
                    w-24
                    [perspective:500px]
                    [transform-style:preserve-3d]
                "
                    style={{
                        height: boxH,
                        transform: "translateY(-50%)",
                    }}
                >
                    {blocks.map((block, i) => {
                        const position = getPosition(
                            block.animationTop,
                            block.animationBottom,
                        );

                        const distance = Math.abs(position);

                        const drumY = position * 42;

                        const drumRotateX = position * -60;

                        const drumZ = -distance * 60;

                        const drumOpacity = clamp(1 - distance * 0.7);

                        const listY = LIST_TOP + i * ITEM_H;

                        const y = lerp(drumY, listY, mix);

                        const rotateX = lerp(drumRotateX, 0, mix);

                        const z = lerp(drumZ, 0, mix);

                        const opacity = lerp(drumOpacity, 1, mix);

                        const isActive = hovered && i === active;

                        return (
                            <span
                                data-cursor="button"
                                data-color="alter-foreground"
                                key={i}
                                onClick={() => scrollManager.scrollToSection(i)}
                                className={`
                                    absolute
                                    left-1/2
                                    top-1/2
                                    w-24
                                    whitespace-nowrap
                                    will-change-transform
                                    select-none
                                    text-[14px]!
                                    cursor-pointer
                                    transition-colors
                                    duration-300
                                    py-1
                                    pb-[6px]
                                    text-center
                                    bg-alter-fg/10
                                    shadow-[0_0_1px_1px]
                                    shadow-alter-fg
                                    
                                    ${
                                        isActive
                                            ? "text-alter-fg"
                                            : "text-alter-fg hover:text-alter-fg/90"
                                    }
                                `}
                                style={{
                                    opacity,
                                    transform: `
                                        translate3d(
                                            -50%,
                                            calc(-50% + ${y}px),
                                            ${z}px
                                        )
                                        rotateX(${rotateX}deg)
                                    `,
                                }}
                            >
                                {tags[block.block]}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
