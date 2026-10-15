import type { PointerEvent, ReactNode } from "react";
import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";

type IndentPosition =
    | "top"
    | "top-left"
    | "top-right"
    | "bottom"
    | "bottom-left"
    | "bottom-right"
    | "none";

type Props = {
    children: ReactNode;
    borderRadius?: number;
    indentPosition?: IndentPosition;
    indentWidth?: number;
    indentDepth?: number;
    indentRoundness?: number;
    maxRotateX?: number;
    maxRotateY?: number;
    perspective?: number;
    tiltSpeed?: number;
    wrapperClassName?: string;
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

const degToRad = (degrees: number) => (degrees * Math.PI) / 180;

const STROKE_WIDTH = 2;
const SVG_PADDING = 4;

export const TopIndentShape = ({
    children,
    borderRadius = 20,
    indentPosition = "top",
    indentWidth = 180,
    indentDepth = 35,
    indentRoundness = 1,
    maxRotateX = 8,
    maxRotateY = 8,
    perspective = 800,
    tiltSpeed = 0.12,
    wrapperClassName = "",
}: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const shapeRef = useRef<HTMLDivElement>(null);

    const animationFrameRef = useRef<number | null>(null);

    const targetRotation = useRef({
        x: 0,
        y: 0,
    });

    const currentRotation = useRef({
        x: 0,
        y: 0,
    });

    const clipId = useId().replace(/:/g, "");

    const [size, setSize] = useState({
        width: 1,
        height: 1,
    });

    useLayoutEffect(() => {
        const element = wrapperRef.current;

        if (!element) {
            return;
        }

        const updateSize = () => {
            const rect = element.getBoundingClientRect();

            setSize({
                width: rect.width,
                height: rect.height,
            });
        };

        updateSize();

        const observer = new ResizeObserver(updateSize);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    useLayoutEffect(() => {
        const animate = () => {
            const current = currentRotation.current;
            const target = targetRotation.current;

            current.x += (target.x - current.x) * tiltSpeed;
            current.y += (target.y - current.y) * tiltSpeed;

            const element = shapeRef.current;

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
        const wrapper = wrapperRef.current;

        if (!wrapper) {
            return;
        }

        const rect = wrapper.getBoundingClientRect();

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

    const { path, transform } = useMemo(() => {
        const { width, height } = size;

        const radius = clamp(borderRadius, 0, Math.min(width / 2, height / 2));

        const roundness = clamp(indentRoundness, 0, 1);

        const right = width - radius;
        const bottom = height - radius;

        const topCenter = width / 2;

        const topIndentWidth = clamp(
            indentWidth,
            0,
            Math.max(width - radius * 2, 0),
        );

        const topHalfWidth = topIndentWidth / 2;

        const topLeft = topCenter - topHalfWidth;
        const topRight = topCenter + topHalfWidth;

        const topDepth = clamp(indentDepth, 0, Math.max(height - radius, 0));

        const topHandle = topHalfWidth * (0.35 + roundness * 0.22);

        if (indentPosition === "none") {
            return {
                path: `
                    M ${radius} 0

                    H ${right}

                    Q
                        ${width} 0
                        ${width} ${radius}

                    V ${bottom}

                    Q
                        ${width} ${height}
                        ${right} ${height}

                    H ${radius}

                    Q
                        0 ${height}
                        0 ${bottom}

                    V ${radius}

                    Q
                        0 0
                        ${radius} 0

                    Z
                `
                    .replace(/\s+/g, " ")
                    .trim(),
                transform: "",
            };
        }

        if (indentPosition === "top") {
            return {
                path: `
                    M ${radius} 0

                    H ${topLeft}

                    C
                        ${topLeft + topHandle} 0
                        ${topCenter - topHandle} ${topDepth}
                        ${topCenter} ${topDepth}

                    C
                        ${topCenter + topHandle} ${topDepth}
                        ${topRight - topHandle} 0
                        ${topRight} 0

                    H ${right}

                    Q
                        ${width} 0
                        ${width} ${radius}

                    V ${bottom}

                    Q
                        ${width} ${height}
                        ${right} ${height}

                    H ${radius}

                    Q
                        0 ${height}
                        0 ${bottom}

                    V ${radius}

                    Q
                        0 0
                        ${radius} 0

                    Z
                `
                    .replace(/\s+/g, " ")
                    .trim(),
                transform: "",
            };
        }

        if (indentPosition === "bottom") {
            return {
                path: `
                    M ${radius} 0

                    H ${right}

                    Q
                        ${width} 0
                        ${width} ${radius}

                    V ${bottom}

                    Q
                        ${width} ${height}
                        ${right} ${height}

                    H ${topRight}

                    C
                        ${topRight - topHandle} ${height}
                        ${topCenter + topHandle}
                        ${height - topDepth}
                        ${topCenter}
                        ${height - topDepth}

                    C
                        ${topCenter - topHandle}
                        ${height - topDepth}
                        ${topLeft + topHandle}
                        ${height}
                        ${topLeft} ${height}

                    H ${radius}

                    Q
                        0 ${height}
                        0 ${bottom}

                    V ${radius}

                    Q
                        0 0
                        ${radius} 0

                    Z
                `
                    .replace(/\s+/g, " ")
                    .trim(),
                transform: "",
            };
        }

        const cornerRadius = clamp(
            indentDepth,
            1,
            Math.min(width - radius, height - radius),
        );

        const edgeSpan = clamp(
            indentWidth,
            cornerRadius,
            Math.min(width - radius, height - radius),
        );

        const angle = degToRad(36 - roundness * 18);

        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const topCirclePoint = {
            x: cornerRadius * cos,
            y: cornerRadius * sin,
        };

        const leftCirclePoint = {
            x: cornerRadius * sin,
            y: cornerRadius * cos,
        };

        const transitionSpace = Math.max(edgeSpan - cornerRadius * cos, 0);

        const transitionLength = Math.min(
            transitionSpace * 0.45,
            cornerRadius * 0.8,
        );

        const leftC1 = {
            x: 0,
            y: edgeSpan - transitionLength,
        };

        const leftTangent = {
            x: cos,
            y: -sin,
        };

        const leftC2 = {
            x: leftCirclePoint.x - leftTangent.x * transitionLength,
            y: leftCirclePoint.y - leftTangent.y * transitionLength,
        };

        const topTangent = {
            x: sin,
            y: -cos,
        };

        const topC1 = {
            x: topCirclePoint.x + topTangent.x * transitionLength,
            y: topCirclePoint.y + topTangent.y * transitionLength,
        };

        const topC2 = {
            x: edgeSpan - transitionLength,
            y: 0,
        };

        const cornerPath = `
            M ${edgeSpan} 0

            H ${right}

            Q
                ${width} 0
                ${width} ${radius}

            V ${bottom}

            Q
                ${width} ${height}
                ${right} ${height}

            H ${radius}

            Q
                0 ${height}
                0 ${bottom}

            V ${edgeSpan}

            C
                ${leftC1.x} ${leftC1.y}
                ${leftC2.x} ${leftC2.y}
                ${leftCirclePoint.x} ${leftCirclePoint.y}

            A
                ${cornerRadius}
                ${cornerRadius}
                0
                0
                0
                ${topCirclePoint.x}
                ${topCirclePoint.y}

            C
                ${topC1.x} ${topC1.y}
                ${topC2.x} ${topC2.y}
                ${edgeSpan} 0

            Z
        `
            .replace(/\s+/g, " ")
            .trim();

        let cornerTransform = "";

        if (indentPosition === "top-right") {
            cornerTransform = `
                translate(${width} 0)
                scale(-1 1)
            `
                .replace(/\s+/g, " ")
                .trim();
        }

        if (indentPosition === "bottom-left") {
            cornerTransform = `
                translate(0 ${height})
                scale(1 -1)
            `
                .replace(/\s+/g, " ")
                .trim();
        }

        if (indentPosition === "bottom-right") {
            cornerTransform = `
                translate(${width} ${height})
                scale(-1 -1)
            `
                .replace(/\s+/g, " ")
                .trim();
        }

        return {
            path: cornerPath,
            transform: cornerTransform,
        };
    }, [
        size,
        borderRadius,
        indentPosition,
        indentWidth,
        indentDepth,
        indentRoundness,
    ]);

    const svgViewBox = `
        ${-SVG_PADDING}
        ${-SVG_PADDING}
        ${size.width + SVG_PADDING * 2}
        ${size.height + SVG_PADDING * 2}
    `
        .replace(/\s+/g, " ")
        .trim();

    return (
        <div
            ref={wrapperRef}
            className={`relative h-full w-full ${wrapperClassName}`}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={{
                perspective: `${perspective}px`,
            }}
        >
            <div
                ref={shapeRef}
                className="relative h-full w-full"
                style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                    willChange: "transform",
                }}
            >
                <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    viewBox={svgViewBox}
                    preserveAspectRatio="none"
                    fill="none"
                >
                    <defs>
                        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                            <path d={path} transform={transform} />
                        </clipPath>
                    </defs>

                    <path
                        d={path}
                        transform={transform}
                        className="fill-alter-fg/5 stroke-alter-fg/30"
                        strokeWidth={STROKE_WIDTH}
                        vectorEffect="non-scaling-stroke"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                </svg>

                <div
                    className="relative z-10 flex h-full w-full justify-center"
                    style={{
                        clipPath: `url(#${clipId})`,
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};
