import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { scrollManager } from "../../scroll/ScrollManager";
import { useDevice } from "../../scroll/useDevice";
import { useScrollBlocks } from "../../scroll/useScroll";

const tags = ["Main", "Experience", "Tech Stack", "Projects", "Contacts"];

const ITEM_H = 32;
const BOX_H = 32;
const LIST_TOP = 0;

const FACES = 8;
const STEP = (Math.PI * 2) / FACES;
const RAD = 180 / Math.PI;

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

    const positions = blocks.map((block) =>
        getPosition(block.animationTop, block.animationBottom),
    );

    let active = -1;
    let smallest = Infinity;

    positions.forEach((position, i) => {
        const distance = Math.abs(position);

        if (distance < smallest) {
            smallest = distance;
            active = i;
        }
    });

    let center = 0;

    if (positions.length > 1) {
        const last = positions.length - 1;

        let j = positions.findIndex(
            (_, i) => i < last && positions[i + 1] >= 0,
        );

        if (j < 0) j = last - 1;

        const d = positions[j + 1] - positions[j] || 1;

        center = clamp(j - positions[j] / d, 0, last);
    }

    const phi = STEP * (1 - mix);
    const apothem = phi > 1e-4 ? ITEM_H / (2 * Math.tan(phi / 2)) : 0;
    const pivot = lerp(center, 0, mix);

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
                relative
                flex
                size-8
                items-center
                justify-center
                rounded-full
                bg-fg/5
            "
        >
            <span className="select-none text-curr">#</span>

            {isDesktop && (
                <div
                    data-cursor="button"
                    data-color="curr"
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
                    <div
                        aria-hidden
                        className="absolute inset-x-0"
                        style={{
                            top: `calc(50% + ${LIST_TOP - ITEM_H / 2}px)`,
                            height: listH,
                            transform: "translateZ(-1px)",
                            pointerEvents: mix === 1 ? "auto" : "none",
                        }}
                    />

                    {blocks.map((block, i) => {
                        const s = i - pivot;
                        const angle = s * phi;

                        const y =
                            (apothem ? apothem * Math.sin(angle) : s * ITEM_H) +
                            LIST_TOP * mix;

                        const z = apothem ? apothem * (Math.cos(angle) - 1) : 0;

                        const rotateX = -angle * RAD;
                        const opacity = Math.max(0, Math.cos(angle));
                        const isActive = hovered && i === active;

                        return (
                            <span
                                data-cursor="button"
                                data-color="curr"
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
                                    cursor-pointer
                                    py-1
                                    pb-[6px]
                                    text-center
                                    text-[14px]!
                                    transition-colors
                                    duration-300
                                    bg-curr/10
                                    shadow-[0_0_1px_1px]
                                    shadow-curr
                                    ${
                                        isActive
                                            ? "text-curr"
                                            : "text-curr hover:text-curr/90"
                                    }
                                `}
                                style={{
                                    opacity,
                                    pointerEvents:
                                        opacity < 0.05 ? "none" : "auto",
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
