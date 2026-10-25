"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type Side = "top" | "right" | "bottom" | "left";

export type Edge = {
    from: string;
    to: string;
    type?: "auto" | "straight" | "curve" | "rounded";
    fromSide?: Side | "auto";
    toSide?: Side | "auto";
    radius?: number;
    color?: string;
    dash?: string;
    width?: number;
    bendAt?: number;
    offset?: number;
    fromOffset?: number;
    toOffset?: number;
};

type PathData = {
    id: string;
    d: string;
    edge: Edge;
};

type Props = {
    edges: Edge[];
    children: ReactNode;
    className?: string;
};

type Point = {
    x: number;
    y: number;
};

type Normal = Point;

const isHorizontal = (side: Side) => side === "left" || side === "right";

function getNormal(side: Side): Normal {
    switch (side) {
        case "top":
            return { x: 0, y: -1 };
        case "right":
            return { x: 1, y: 0 };
        case "bottom":
            return { x: 0, y: 1 };
        case "left":
            return { x: -1, y: 0 };
    }
}

function getAutoSides(from: DOMRect, to: DOMRect): [Side, Side] {
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);

    const dy = to.top + to.height / 2 - (from.top + from.height / 2);

    if (Math.abs(dx) >= Math.abs(dy)) {
        return dx >= 0 ? ["right", "left"] : ["left", "right"];
    }

    return dy >= 0 ? ["bottom", "top"] : ["top", "bottom"];
}

function getAnchor(rect: DOMRect, bounds: DOMRect, side: Side): Point {
    const left = rect.left - bounds.left;
    const right = rect.right - bounds.left;
    const top = rect.top - bounds.top;
    const bottom = rect.bottom - bounds.top;

    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    switch (side) {
        case "top":
            return { x: centerX, y: top };
        case "right":
            return { x: right, y: centerY };
        case "bottom":
            return { x: centerX, y: bottom };
        case "left":
            return { x: left, y: centerY };
    }
}

function createCurve(
    start: Point,
    end: Point,
    fromSide: Side,
    toSide: Side,
): string {
    const distance = Math.hypot(end.x - start.x, end.y - start.y);

    const bend = Math.min(100, Math.max(20, distance * 0.35));

    const a = getNormal(fromSide);
    const b = getNormal(toSide);

    return [
        `M ${start.x} ${start.y}`,
        `C ${start.x + a.x * bend} ${start.y + a.y * bend},`,
        `${end.x + b.x * bend} ${end.y + b.y * bend},`,
        `${end.x} ${end.y}`,
    ].join(" ");
}

function createRoundedPath(
    start: Point,
    end: Point,
    fromSide: Side,
    radius: number,
    bendAt = 0.5,
): string {
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const horizontal = isHorizontal(fromSide);

    if (horizontal) {
        if (Math.abs(dy) < 1) {
            return `M ${x1} ${y1} L ${x2} ${y2}`;
        }

        const midX = x1 + (x2 - x1) * bendAt;
        const sx = Math.sign(dx) || (fromSide === "right" ? 1 : -1);
        const sy = Math.sign(dy);

        const r = Math.min(radius, Math.abs(dx) / 2, Math.abs(dy) / 2);

        if (r < 1) {
            return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
        }

        return [
            `M ${x1} ${y1}`,
            `L ${midX - sx * r} ${y1}`,
            `Q ${midX} ${y1} ${midX} ${y1 + sy * r}`,
            `L ${midX} ${y2 - sy * r}`,
            `Q ${midX} ${y2} ${midX + sx * r} ${y2}`,
            `L ${x2} ${y2}`,
        ].join(" ");
    }

    if (Math.abs(dx) < 1) {
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    const midY = y1 + (y2 - y1) * bendAt;
    const sy = Math.sign(dy) || (fromSide === "bottom" ? 1 : -1);
    const sx = Math.sign(dx);

    const r = Math.min(radius, Math.abs(dy) / 2, Math.abs(dx) / 2);

    if (r < 1) {
        return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
    }

    return [
        `M ${x1} ${y1}`,
        `L ${x1} ${midY - sy * r}`,
        `Q ${x1} ${midY} ${x1 + sx * r} ${midY}`,
        `L ${x2 - sx * r} ${midY}`,
        `Q ${x2} ${midY} ${x2} ${midY + sy * r}`,
        `L ${x2} ${y2}`,
    ].join(" ");
}

function createPath(
    start: Point,
    end: Point,
    fromSide: Side,
    toSide: Side,
    edge: Edge,
): string {
    if (edge.type === "straight") {
        return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }

    if (edge.type === "curve") {
        return createCurve(start, end, fromSide, toSide);
    }

    const sameAxis = isHorizontal(fromSide) === isHorizontal(toSide);

    if (!sameAxis) {
        const radius = edge.radius ?? 16;

        const r = Math.min(
            radius,
            Math.abs(end.x - start.x) / 2,
            Math.abs(end.y - start.y) / 2,
        );

        if (!isHorizontal(fromSide)) {
            // Сначала вертикально, затем горизонтально.
            const sy = fromSide === "bottom" ? 1 : -1;
            const sx = toSide === "right" ? -1 : 1;

            return [
                `M ${start.x} ${start.y}`,
                `L ${start.x} ${end.y - sy * r}`,
                `Q ${start.x} ${end.y} ${start.x + sx * r} ${end.y}`,
                `L ${end.x} ${end.y}`,
            ].join(" ");
        }

        // Сначала горизонтально, затем вертикально.
        const sx = fromSide === "right" ? 1 : -1;
        const sy = toSide === "top" ? 1 : -1;

        return [
            `M ${start.x} ${start.y}`,
            `L ${end.x - sx * r} ${start.y}`,
            `Q ${end.x} ${start.y} ${end.x} ${start.y + sy * r}`,
            `L ${end.x} ${end.y}`,
        ].join(" ");
    }

    return createRoundedPath(
        start,
        end,
        fromSide,
        edge.radius ?? 16,
        edge.bendAt,
    );
}

export const GraphDiagram = ({ edges, children, className = "" }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [geometry, setGeometry] = useState<{
        width: number;
        height: number;
        paths: PathData[];
    }>({
        width: 0,
        height: 0,
        paths: [],
    });

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let frame = 0;

        const update = () => {
            cancelAnimationFrame(frame);

            frame = requestAnimationFrame(() => {
                const bounds = container.getBoundingClientRect();

                const nodes = new Map<string, HTMLElement>();

                container
                    .querySelectorAll<HTMLElement>("[data-tree-node]")
                    .forEach((element) => {
                        const id = element.dataset.treeNode;
                        if (id) nodes.set(id, element);
                    });

                const paths: PathData[] = edges.flatMap((edge, index) => {
                    const from = nodes.get(edge.from);
                    const to = nodes.get(edge.to);

                    if (!from || !to) return [];

                    const fromRect = from.getBoundingClientRect();
                    const toRect = to.getBoundingClientRect();

                    const [autoFrom, autoTo] = getAutoSides(fromRect, toRect);

                    const fromSide =
                        edge.fromSide && edge.fromSide !== "auto"
                            ? edge.fromSide
                            : autoFrom;

                    const toSide =
                        edge.toSide && edge.toSide !== "auto"
                            ? edge.toSide
                            : autoTo;

                    const startAnchor = getAnchor(fromRect, bounds, fromSide);
                    const endAnchor = getAnchor(toRect, bounds, toSide);

                    const fromOffset = edge.fromOffset ?? edge.offset ?? 0;
                    const toOffset = edge.toOffset ?? edge.offset ?? 0;

                    const fromNormal = getNormal(fromSide);
                    const toNormal = getNormal(toSide);

                    const start = {
                        x: startAnchor.x + fromNormal.x * fromOffset,
                        y: startAnchor.y + fromNormal.y * fromOffset,
                    };

                    const end = {
                        x: endAnchor.x + toNormal.x * toOffset,
                        y: endAnchor.y + toNormal.y * toOffset,
                    };

                    return [
                        {
                            id: `${edge.from}-${edge.to}-${index}`,
                            edge,
                            d: createPath(start, end, fromSide, toSide, edge),
                        },
                    ];
                });

                setGeometry((previous) => {
                    const unchanged =
                        previous.width === bounds.width &&
                        previous.height === bounds.height &&
                        previous.paths.length === paths.length &&
                        previous.paths.every(
                            (path, index) =>
                                path.d === paths[index].d &&
                                path.edge === paths[index].edge,
                        );

                    if (unchanged) return previous;

                    return {
                        width: bounds.width,
                        height: bounds.height,
                        paths,
                    };
                });
            });
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(container);

        container
            .querySelectorAll<HTMLElement>("[data-tree-node]")
            .forEach((element) => observer.observe(element));

        window.addEventListener("resize", update);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("resize", update);
        };
    }, [edges, children]);

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
                viewBox={`0 0 ${geometry.width} ${geometry.height}`}
                preserveAspectRatio="none"
                fill="none"
            >
                {geometry.paths.map(({ id, d, edge }) => (
                    <path
                        key={id}
                        d={d}
                        stroke={edge.color ?? "currentColor"}
                        strokeWidth={edge.width ?? 1.5}
                        strokeDasharray={edge.dash ?? "5 6"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ))}
            </svg>

            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
};
