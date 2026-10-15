import { useEffect, useRef, useState } from "react";
import styles from "./ProcessingStatus.module.css";

type Anims = "bounce" | "orbit";

type ProcessingStatusProps = {
    className?: string;
    size?: number;
    stepDuration?: number;
    transitionDuration?: number;
};

type Point = {
    x: number;
    y: number;
    scale: number;
    opacity: number;
};

const ANIMS: Anims[] = ["bounce", "orbit"];

const DOT_COUNTS: Record<Anims, number> = {
    bounce: 3,
    orbit: 3,
};

const INITIAL_POINT: Point = {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
};

const BASE_SIZE = 32;

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

const lerp = (from: number, to: number, progress: number) =>
    from + (to - from) * progress;

const easeInOut = (value: number) =>
    value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;

function getTarget(
    variant: Anims,
    index: number,
    time: number,
    sizeScale: number,
): Point {
    const phase = time * 0.001;

    if (variant === "bounce") {
        const x = (index - 1) * 7 * sizeScale;
        const wave = Math.max(0, Math.sin(phase * 3.2 - index * 0.9));

        return {
            x,
            y: -10 * wave * sizeScale,
            scale: 0.85 + wave * 0.3,
            opacity: 0.8 + wave * 0.2,
        };
    }

    const angle = phase * 2.2 + (index / 3) * Math.PI * 2;
    const tilt = Math.sin(phase * 0.9) * 0.65;
    const x = Math.cos(angle) * 9 * sizeScale;
    const y = Math.sin(angle) * 5 * sizeScale;

    return {
        x: x * Math.cos(tilt) - y * Math.sin(tilt),
        y: (x * Math.sin(tilt) + y * Math.cos(tilt)) * 1.1,
        scale: 0.8 + (Math.sin(angle) + 1) * 0.2,
        opacity: 0.55 + (Math.sin(angle) + 1) * 0.225,
    };
}

function interpolatePoint(from: Point, to: Point, progress: number): Point {
    const eased = easeInOut(clamp(progress, 0, 1));

    return {
        x: lerp(from.x, to.x, eased),
        y: lerp(from.y, to.y, eased),
        scale: lerp(from.scale, to.scale, eased),
        opacity: lerp(from.opacity, to.opacity, eased),
    };
}

export function ProcessingStatus({
    className,
    size = BASE_SIZE,
    stepDuration = 3000,
    transitionDuration = 800,
}: ProcessingStatusProps) {
    const [variant, setVariant] = useState<Anims>("bounce");
    const [points, setPoints] = useState<Point[]>(() =>
        Array.from({ length: 3 }, () => ({ ...INITIAL_POINT })),
    );

    const pointsRef = useRef(points);

    useEffect(() => {
        let frame = 0;
        let initialized = false;
        let lastSwitch = 0;
        let startTime = 0;
        let transitionStart = 0;
        let currentIndex = 0;

        let transitionFrom = pointsRef.current.map((point) => ({
            ...point,
        }));

        let activeVariant: Anims = "bounce";

        const sizeScale = size / BASE_SIZE;

        const animate = (now: number) => {
            if (!initialized) {
                initialized = true;
                startTime = now;
                lastSwitch = now;
                transitionStart = now;
            }

            if (now - lastSwitch >= stepDuration) {
                currentIndex = (currentIndex + 1) % ANIMS.length;
                activeVariant = ANIMS[currentIndex];

                setVariant(activeVariant);

                lastSwitch = now;
                transitionStart = now;

                transitionFrom = pointsRef.current.map((point) => ({
                    ...point,
                }));
            }

            const elapsed = now - startTime;

            const transitionProgress =
                transitionDuration <= 0
                    ? 1
                    : clamp((now - transitionStart) / transitionDuration, 0, 1);

            const count = DOT_COUNTS[activeVariant];

            const nextPoints = Array.from({ length: count }, (_, index) => {
                const target = getTarget(
                    activeVariant,
                    index,
                    elapsed,
                    sizeScale,
                );

                const from = transitionFrom[index] ?? {
                    ...INITIAL_POINT,
                    ...target,
                };

                return transitionProgress >= 1
                    ? target
                    : interpolatePoint(from, target, transitionProgress);
            });

            pointsRef.current = nextPoints;
            setPoints(nextPoints);

            frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frame);
    }, [size, stepDuration, transitionDuration]);

    return (
        <div
            role="status"
            aria-live="polite"
            className={`${styles.root} ${className ?? ""}`}
            data-variant={variant}
            style={{
                width: size,
                height: size,
            }}
        >
            <span className={styles.dots} aria-hidden="true">
                {points.map((point, index) => (
                    <i
                        key={index}
                        className={styles.dot}
                        style={{
                            opacity: point.opacity,
                            transform: `translate(${point.x}px, ${point.y}px) scale(${point.scale})`,
                        }}
                    />
                ))}
            </span>
        </div>
    );
}
