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

    useEffect(() => {
        const animate = () => {
            const current = currentRotation.current;
            const target = targetRotation.current;

            current.x += (target.x - current.x) * tiltSpeed;
            current.y += (target.y - current.y) * tiltSpeed;

            const element = tiltRef.current;

            if (element) {
                element.style.transform = `
                    perspective(${perspective}px)
                    rotateX(${current.x}deg)
                    rotateY(${current.y}deg)
                `;
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [perspective, tiltSpeed]);

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const element = wrapperRef.current;

        if (!element) {
            return;
        }

        const rect = element.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const normalizedX = clamp(x * 2 - 1, -1, 1);
        const normalizedY = clamp(y * 2 - 1, -1, 1);

        targetRotation.current = {
            x: -normalizedY * maxRotateX,
            y: normalizedX * maxRotateY,
        };
    };

    const handlePointerLeave = () => {
        targetRotation.current = {
            x: 0,
            y: 0,
        };
    };

    const bsh = `0px 0px 3px -1px var(--${color})`;
    const bshHover = `0px 0px 34px -20px var(--${color})`;

    return (
        <motion.div
            className="relative w-content h-content"
            data-cursor="magnetic"
            data-color={color}
            ref={(element) => {
                wrapperRef.current = element;
            }}
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
                onHoverStart={(e) => {
                    (e.target as HTMLDivElement).style.boxShadow = bshHover;
                    (e.target as HTMLDivElement).style.transition =
                        "box-shadow 0.37s ease-in-out";
                }}
                onHoverEnd={(e) =>
                    ((e.target as HTMLDivElement).style.boxShadow = bsh)
                }
                style={
                    {
                        transformStyle: "preserve-3d",
                        transformOrigin: "center center",
                        willChange: "transform",
                        "--color": `var(--${color})`,
                        boxShadow: bsh,
                    } as CSSProperties
                }
            >
                {children}
            </motion.div>
        </motion.div>
    );
};
