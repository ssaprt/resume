import { motion, useAnimationControls } from "framer-motion";
import type { ComponentPropsWithRef } from "react";
import { useEffect, useMemo, useRef } from "react";
import { getCarouselDotCount, resolveDotSize } from "./getCarouselDotCount";

type DotButtonProps = ComponentPropsWithRef<"button">;

export const DotButton = ({
    children,
    className,
    ...props
}: DotButtonProps) => {
    return (
        <button type="button" className={className} {...props}>
            {children}
        </button>
    );
};

const modulo = (value: number, count: number) =>
    ((value % count) + count) % count;

type Props = {
    slideCount: number;
    activeIndex: number;
    onClick: (index: number) => void;
    radius?: number;
    gap?: number;
    dotSize?: number;
};

export const CarouselProjectsDots = ({
    slideCount,
    activeIndex,
    onClick,
    radius = 78,
    gap = 10,
    dotSize,
}: Props) => {
    const controls = useAnimationControls();

    const rotation = useRef(0);
    const initialized = useRef(false);

    const size = resolveDotSize(gap, dotSize);

    const count = useMemo(
        () => getCarouselDotCount(slideCount, radius, gap, dotSize),
        [slideCount, radius, gap, dotSize],
    );

    const angles = useMemo(() => {
        if (!count) {
            return [];
        }

        const step = (Math.PI * 2) / count;

        return Array.from(
            { length: count },
            (_, index) => -Math.PI / 2 + index * step,
        );
    }, [count]);

    useEffect(() => {
        if (!angles.length) {
            return;
        }

        const currentIndex = modulo(activeIndex, count);

        const angle = angles[currentIndex];

        const target = Math.PI / 2 - angle;

        const current = (rotation.current * Math.PI) / 180;

        const normalizedTarget =
            target +
            Math.round((current - target) / (Math.PI * 2)) * Math.PI * 2;

        const degrees = (normalizedTarget * 180) / Math.PI;

        rotation.current = degrees;

        if (!initialized.current) {
            initialized.current = true;

            controls.set({
                rotate: degrees,
            });

            return;
        }

        controls.start({
            rotate: degrees,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
            },
        });
    }, [activeIndex, angles, count, controls]);

    if (!count) {
        return null;
    }

    const activeDotIndex = modulo(activeIndex, count);

    const circleSize = radius * 2;

    return null;

    return (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
                className="relative"
                style={{
                    width: circleSize,
                    height: circleSize,
                    transformOrigin: "center center",
                }}
                initial={false}
                animate={controls}
            >
                {angles.map((angle, index) => {
                    const x = radius + Math.cos(angle) * radius;

                    const y = radius + Math.sin(angle) * radius;

                    const active = index === activeDotIndex;

                    return (
                        <DotButton
                            key={index}
                            onClick={() => onClick(index)}
                            aria-label={`Go to slide ${
                                (index % slideCount) + 1
                            }`}
                            className={`pointer-events-auto absolute rounded-full ${
                                active ? "bg-alter-fg" : "bg-alter-fg/30"
                            }`}
                            style={{
                                width: size,
                                height: size,
                                left: x,
                                top: y,
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    );
                })}
            </motion.div>
        </div>
    );
};
