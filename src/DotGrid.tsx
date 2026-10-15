import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { DynamicSvgIcon } from "./components/Icons/DynamicSvgIcon";
import { useAssetReady } from "./shared/AssetLoader/useAssetReady";

type Props = {
    gridSize?: number;
    cursorRadius?: number;
    falloff?: number;
    baseRadius?: number;
    maxRadius?: number;
    baseOpacity?: number;
    maxOpacity?: number;
    distortion?: number;
    smoothness?: number;
    jellySmoothness?: number;
    color?: string;
    cursorDotSize?: number;
    circleOpacity?: number;
    circleBorder?: string;
    className?: string;
};

type Point = {
    x: number;
    y: number;
    currentX: number;
    currentY: number;
};

type CursorMode = {
    scale: number;
    opacity: number;
    borderScale: number;
    distortion: number;
    className?: string;
    icon?: ReactNode;
    iconClassName?: string;
    circleOpacity?: number;
    circleScale?: number;
};

const CURSOR_MODES: Record<string, CursorMode> = {
    default: {
        scale: 1,
        opacity: 1,
        borderScale: 1,
        distortion: 0,
        circleOpacity: 1,
        circleScale: 1,
    },

    button: {
        scale: 1,
        opacity: 1,
        borderScale: 1,
        distortion: 0.2,
        icon: (
            <DynamicSvgIcon
                name="left_click"
                className="
                    relative
                    size-5
                    fill-current
                    text-current
                    [&_*]:!fill-current
                    [&_*]:!stroke-current
                "
            />
        ),
        iconClassName: "",
        circleOpacity: 0,
        circleScale: 0.8,
    },

    move: {
        scale: 1,
        opacity: 1,
        borderScale: 1,
        distortion: 0.2,
        icon: (
            <DynamicSvgIcon
                name="move"
                className="
                    relative
                    size-5
                    fill-current
                    text-current
                    [&_*]:!fill-current
                    [&_*]:!stroke-current
                "
            />
        ),
        iconClassName: "",
        circleOpacity: 0,
        circleScale: 0.8,
    },

    magnetic: {
        scale: 1,
        opacity: 1,
        borderScale: 1,
        distortion: 0.2,
        icon: (
            <DynamicSvgIcon
                name="magnetic"
                className="
                    relative
                    size-5
                    fill-current
                    text-current
                    [&_*]:!fill-current
                    [&_*]:!stroke-current
                "
            />
        ),
        iconClassName: "",
        circleOpacity: 0,
        circleScale: 0.8,
    },

    write: {
        scale: 1,
        opacity: 1,
        borderScale: 1,
        distortion: 0.2,
        icon: (
            <DynamicSvgIcon
                name="pen"
                className="
                    relative
                    size-5
                    fill-current
                    text-current
                    [&_*]:!fill-current
                    [&_*]:!stroke-current
                "
            />
        ),
        iconClassName: "",
        circleOpacity: 0,
        circleScale: 0.8,
    },
};

const DEFAULT_CURSOR_MODE = CURSOR_MODES.default;
const DEFAULT_CURSOR_COLOR = "rgb(100 116 139)";
const DEFAULT_SHADOW = "0 0 500px 50px";

const lerp = (current: number, target: number, amount: number) => {
    return current + (target - current) * amount;
};

const resolveCursorColor = (value?: string) => {
    if (!value) {
        return DEFAULT_CURSOR_COLOR;
    }

    return `var(--${value})`;
};

export default function DotGrid({
    gridSize = 10,
    cursorRadius = 90,
    falloff = 38,
    baseRadius = 1,
    maxRadius = 3,
    baseOpacity = 0.12,
    maxOpacity = 0.8,
    distortion = 20,
    smoothness = 0.08,
    jellySmoothness = 0.08,
    color = "100,116,139",
    cursorDotSize = 10,
    circleOpacity = 0.35,
    className,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const isReady = useAssetReady();

    const mouseRef = useRef({
        x: -1000,
        y: -1000,
    });

    const targetMouseRef = useRef({
        x: -1000,
        y: -1000,
    });

    const pointsRef = useRef<Point[]>([]);
    const animationRef = useRef<number>(0);

    const clickRef = useRef(0);
    const clickTargetRef = useRef(0);

    const cursorModeRef = useRef({
        target: "default",
    });

    const cursorColorRef = useRef(DEFAULT_CURSOR_COLOR);

    const cursorAnimationRef = useRef({
        scale: 1,
        opacity: 1,
        borderScale: 1,
        circleOpacity: 1,
        circleScale: 1,
        distortion: 0,
    });

    const [cursorMode, setCursorMode] =
        useState<CursorMode>(DEFAULT_CURSOR_MODE);

    const [cursorColor, setCursorColor] = useState(DEFAULT_CURSOR_COLOR);
    const [shadow, setShadow] = useState(DEFAULT_SHADOW);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        const createPoints = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const points: Point[] = [];

            for (let y = 0; y <= height; y += gridSize) {
                for (let x = 0; x <= width; x += gridSize) {
                    points.push({
                        x,
                        y,
                        currentX: x,
                        currentY: y,
                    });
                }
            }

            pointsRef.current = points;
        };

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;

            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;

            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            createPoints();
        };

        const updateCursorMode = (element: Element | null) => {
            const cursorElement =
                element?.closest<HTMLElement>("[data-cursor]");

            const modeValue = cursorElement?.dataset.cursor ?? "default";

            const mode = CURSOR_MODES[modeValue] ? modeValue : "default";

            const colorValue = cursorElement?.dataset.color;
            const shadowValue = cursorElement?.dataset.shadow;

            const nextColor = resolveCursorColor(colorValue);

            if (cursorColorRef.current !== nextColor) {
                cursorColorRef.current = nextColor;
                setCursorColor(nextColor);
            }

            if (shadow !== shadowValue) {
                setShadow(shadowValue ?? DEFAULT_SHADOW);
            }

            if (cursorModeRef.current.target !== mode) {
                cursorModeRef.current.target = mode;

                setCursorMode(CURSOR_MODES[mode] ?? DEFAULT_CURSOR_MODE);
            }
        };

        const handlePointerMove = (event: PointerEvent) => {
            targetMouseRef.current.x = event.clientX;
            targetMouseRef.current.y = event.clientY;

            const element = document.elementFromPoint(
                event.clientX,
                event.clientY,
            );

            updateCursorMode(element);
        };

        const handlePointerDown = (event: PointerEvent) => {
            clickTargetRef.current = 1;

            const element = document.elementFromPoint(
                event.clientX,
                event.clientY,
            );

            updateCursorMode(element);
        };

        const handlePointerUp = () => {
            clickTargetRef.current = 0;
        };

        const handlePointerLeave = () => {
            targetMouseRef.current.x = -1000;
            targetMouseRef.current.y = -1000;

            clickTargetRef.current = 0;

            cursorModeRef.current.target = "default";
            cursorColorRef.current = DEFAULT_CURSOR_COLOR;

            setCursorMode(DEFAULT_CURSOR_MODE);
            setCursorColor(DEFAULT_CURSOR_COLOR);
        };

        const render = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const mouse = mouseRef.current;
            const target = targetMouseRef.current;

            mouse.x += (target.x - mouse.x) * smoothness;
            mouse.y += (target.y - mouse.y) * smoothness;

            clickRef.current +=
                (clickTargetRef.current - clickRef.current) * 0.2;

            const click = clickRef.current;

            const targetMode =
                CURSOR_MODES[cursorModeRef.current.target] ??
                DEFAULT_CURSOR_MODE;

            const animation = cursorAnimationRef.current;

            animation.scale = lerp(animation.scale, targetMode.scale, 0.12);

            animation.opacity = lerp(
                animation.opacity,
                targetMode.opacity,
                0.12,
            );

            animation.borderScale = lerp(
                animation.borderScale,
                targetMode.borderScale,
                0.12,
            );

            animation.circleOpacity = lerp(
                animation.circleOpacity,
                targetMode.circleOpacity ?? 1,
                0.12,
            );

            animation.circleScale = lerp(
                animation.circleScale,
                targetMode.circleScale ?? 1,
                0.12,
            );

            animation.distortion = lerp(
                animation.distortion,
                targetMode.distortion,
                0.12,
            );

            ctx.clearRect(0, 0, width, height);

            if (cursorRef.current) {
                const scale = animation.scale * (1 - click * 0.5);

                cursorRef.current.style.transform = `translate3d(
                    ${mouse.x - cursorDotSize / 2}px,
                    ${mouse.y - cursorDotSize / 2}px,
                    0
                ) scale(${scale})`;

                cursorRef.current.style.opacity = `${animation.opacity}`;
            }

            if (circleRef.current) {
                circleRef.current.style.transform = `translate3d(
                    ${mouse.x - cursorRadius}px,
                    ${mouse.y - cursorRadius}px,
                    0
                ) scale(${animation.borderScale})`;

                circleRef.current.style.opacity = `${circleOpacity}`;

                circleRef.current.style.setProperty(
                    "--cursor-circle-opacity",
                    `${animation.circleOpacity}`,
                );

                circleRef.current.style.setProperty(
                    "--cursor-circle-scale",
                    `${animation.circleScale}`,
                );
            }

            const radiusSquared = cursorRadius * cursorRadius;
            const falloffSquared = falloff * falloff;

            for (const point of pointsRef.current) {
                const dx = point.x - mouse.x;
                const dy = point.y - mouse.y;

                const distanceSquared = dx * dx + dy * dy;

                let influence = 0;

                if (distanceSquared < radiusSquared) {
                    influence = Math.exp(
                        -distanceSquared / (2 * falloffSquared),
                    );
                }

                const distance = Math.sqrt(distanceSquared);

                let directionX = 0;
                let directionY = 0;

                if (distance > 0.001) {
                    directionX = dx / distance;
                    directionY = dy / distance;
                }

                const displacement = distortion * influence;

                let targetX = point.x + directionX * displacement;
                let targetY = point.y + directionY * displacement;

                if (click > 0 && distance > 0.001) {
                    const clickFalloff = Math.exp(
                        -distanceSquared / (2 * falloffSquared),
                    );

                    const compression = distortion * clickFalloff * click;

                    targetX -= directionX * compression;
                    targetY -= directionY * compression;
                }

                if (animation.distortion > 0 && distance > 0.001) {
                    const cursorFalloff = Math.exp(
                        -distanceSquared / (2 * falloffSquared),
                    );

                    const compression =
                        distortion * animation.distortion * cursorFalloff;

                    targetX -= directionX * compression;
                    targetY -= directionY * compression;
                }

                point.currentX += (targetX - point.currentX) * jellySmoothness;

                point.currentY += (targetY - point.currentY) * jellySmoothness;

                const pointRadius =
                    baseRadius + (maxRadius - baseRadius) * influence;

                const opacity =
                    baseOpacity + (maxOpacity - baseOpacity) * influence;

                ctx.beginPath();

                ctx.arc(
                    point.currentX,
                    point.currentY,
                    pointRadius,
                    0,
                    Math.PI * 2,
                );

                ctx.fillStyle = `rgba(${color}, ${opacity})`;

                ctx.fill();
            }

            animationRef.current = requestAnimationFrame(render);
        };

        resize();
        render();

        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointerleave", handlePointerLeave);

        return () => {
            cancelAnimationFrame(animationRef.current);

            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointerleave", handlePointerLeave);
        };
    }, [
        gridSize,
        cursorRadius,
        falloff,
        baseRadius,
        maxRadius,
        baseOpacity,
        maxOpacity,
        distortion,
        smoothness,
        jellySmoothness,
        color,
        cursorDotSize,
        circleOpacity,
    ]);

    useEffect(() => {
        document.body.classList.toggle("custom-cursor-active", isReady);

        return () => {
            document.body.classList.remove("custom-cursor-active");
        };
    }, [isReady]);

    const circleStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: cursorRadius * 2,
        height: cursorRadius * 2,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform, opacity",
        transformOrigin: "center",
        "--cursor-color": cursorColor,
        "--cursor-circle-opacity": 1,
        "--cursor-circle-scale": 1,
    } as CSSProperties;

    const cursorStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: cursorDotSize,
        height: cursorDotSize,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 10000,
        willChange: "transform, opacity",
        transformOrigin: "center",
        color: cursorColor,
        "--cursor-color": cursorColor,
        backgroundColor: cursorMode.icon ? "transparent" : cursorColor,
    } as CSSProperties;

    const glowStyle = {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 1,
        height: 1,
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        backgroundColor: cursorColor,
        boxShadow: `${shadow} ${cursorColor}`,
    } as CSSProperties;

    return (
        <>
            <canvas
                ref={canvasRef}
                className={className}
                style={{
                    position: "fixed",
                    inset: 0,
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "none",
                    zIndex: -1,
                }}
            />

            {isReady && (
                <>
                    <div
                        ref={circleRef}
                        className="
                        before:content-['']
                        before:absolute
                        before:left-1/2
                        before:top-1/2
                        before:w-[33%]
                        before:h-[33%]
                        before:-translate-x-1/2
                        before:-translate-y-1/2
                        before:rounded-full
                        before:border
                        before:border-[var(--cursor-color)]
                        before:opacity-[var(--cursor-circle-opacity)]
                        before:scale-[var(--cursor-circle-scale)]
                        before:origin-center
                    "
                        style={circleStyle}
                    />

                    <div
                        ref={cursorRef}
                        className="flex items-center justify-center"
                        style={cursorStyle}
                    >
                        {cursorMode.icon && (
                            <>
                                <span style={glowStyle} />

                                <span
                                    className="
                                    absolute
                                    flex
                                    items-center
                                    justify-center
                                    text-current
                                "
                                >
                                    {cursorMode.icon}
                                </span>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
