import { motion } from "framer-motion";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";

type Props = {
    children: ReactNode;
    maxRotateX?: number;
    maxRotateY?: number;
    perspective?: number;
    tiltSpeed?: number;
    className?: string;
    color: string;
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

export const Tilt = ({
    children,
    maxRotateX = 8,
    maxRotateY = 8,
    perspective = 800,
    tiltSpeed = 0.12,
    className = "",
    color,
}: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tiltRef = useRef<HTMLDivElement>(null);

    const targetRotation = useRef({
        x: 0,
        y: 0,
    });

    const currentRotation = useRef({
        x: 0,
        y: 0,
    });

    const animationFrameRef = useRef<number | null>(null);
    const startAnimationRef = useRef<(() => void) | null>(null);

    const bsh = `0px 0px 3px -1px var(--${color})`;
    const bshHover = `0px 0px 34px -20px var(--${color})`;

    useEffect(() => {
        const animate = () => {
            animationFrameRef.current = null;

            const current = currentRotation.current;
            const target = targetRotation.current;

            const deltaX = target.x - current.x;
            const deltaY = target.y - current.y;

            if (Math.abs(deltaX) <= 0.01 && Math.abs(deltaY) <= 0.01) {
                current.x = target.x;
                current.y = target.y;
            } else {
                current.x += deltaX * tiltSpeed;
                current.y += deltaY * tiltSpeed;
            }

            const element = tiltRef.current;

            if (element) {
                element.style.transform = `
                    perspective(${perspective}px)
                    rotateX(${current.x}deg)
                    rotateY(${current.y}deg)
                `;
            }

            if (
                Math.abs(target.x - current.x) > 0.01 ||
                Math.abs(target.y - current.y) > 0.01
            ) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        const startAnimation = () => {
            if (animationFrameRef.current === null) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        startAnimationRef.current = startAnimation;

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }

            startAnimationRef.current = null;
        };
    }, [perspective, tiltSpeed]);

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const element = wrapperRef.current;

        if (!element) {
            return;
        }

        const rect = element.getBoundingClientRect();

        if (!rect.width || !rect.height) {
            return;
        }

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        targetRotation.current.x = -clamp(y * 2 - 1, -1, 1) * maxRotateX;
        targetRotation.current.y = clamp(x * 2 - 1, -1, 1) * maxRotateY;

        startAnimationRef.current?.();
    };

    const handlePointerLeave = () => {
        targetRotation.current.x = 0;
        targetRotation.current.y = 0;

        startAnimationRef.current?.();
    };

    const handleHoverStart = () => {
        const element = tiltRef.current;

        if (element) {
            element.style.boxShadow = bshHover;
        }
    };

    const handleHoverEnd = () => {
        const element = tiltRef.current;

        if (element) {
            element.style.boxShadow = bsh;
        }
    };

    return (
        <motion.div
            ref={wrapperRef}
            className="relative w-content h-content"
            data-cursor="magnetic"
            data-color={color}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            <motion.div
                ref={tiltRef}
                className={`relative overflow-hidden ${className} before:content-['']
                    before:absolute
                    before:w-full
                    before:h-full
                    before:bottom-0
                    before:left-0
                    hover:before:bg-current/3 before:-z-10`}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                style={
                    {
                        transformStyle: "preserve-3d",
                        transformOrigin: "center center",
                        willChange: "transform",
                        "--color": `var(--${color})`,
                        boxShadow: bsh,
                        transition: "box-shadow 0.37s ease-in-out",
                    } as CSSProperties
                }
            >
                {children}
            </motion.div>
        </motion.div>
    );
};
