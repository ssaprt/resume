import {
    type HTMLAttributes,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useDevice } from "../scroll/useDevice";
import {
    authorIconAnimationConfig,
    type AuthorIconAnimationDefinition,
    type AuthorIconAnimationOrder,
    type AuthorIconHideAnimation,
    type AuthorIconShowAnimation,
} from "./author-icon.config";
import { FACE_PATH_DATA } from "./author-icon.geometry";

type AnimationPhase = "hidden" | "animating" | "shown";
type AnimationSide = "show" | "hide";
type AnimationDirection = "forward" | "backward";

type AnimationRun = {
    id: number;
    definition: AuthorIconAnimationDefinition;
    side: AnimationSide;
    direction: AnimationDirection;
    canonicalStart: number;
    duration: number;
    scatter: number;
    startedAt: number;
    targetVisible: boolean;
};

type AnimationFrame = {
    definition: AuthorIconAnimationDefinition;
    duration: number;
    scatter: number;
    scrub: boolean;
};

type Point = { x: number; y: number };

type ParsedPath = {
    source: string;
    points: Point[];
    segmentLengths: number[];
    length: number;
    centerX: number;
    centerY: number;
};

type DrawOperation = {
    path: ParsedPath;
    start: number;
    end: number;
    alpha: number;
};

export type AuthorIconProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    "onAnimationEnd"
> & {
    visible?: boolean;
    progress?: number;
    show?: AuthorIconShowAnimation;
    hide?: AuthorIconHideAnimation;
    duration?: number;
    scatter?: number;
    strokeWidth?: number;
    showTrigger?: boolean;
    showButtonText?: string;
    hideButtonText?: string;
    onVisibleChange?: (visible: boolean) => void;
    onShowEnd?: () => void;
    onHideEnd?: () => void;
};

const PATH_SOURCES = FACE_PATH_DATA.split(/\s+(?=M)/);
const VIEWBOX_WIDTH = 155;
const VIEWBOX_HEIGHT = 187;
const CENTER_X = VIEWBOX_WIDTH / 2;
const CENTER_Y = VIEWBOX_HEIGHT / 2;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const parsePath = (source: string): ParsedPath => {
    const points: Point[] = [];
    const commandPattern = /[ML]\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/g;

    for (const match of source.matchAll(commandPattern)) {
        points.push({ x: Number(match[1]), y: Number(match[2]) });
    }

    const segmentLengths: number[] = [];
    let length = 0;
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (let index = 0; index < points.length; index += 1) {
        const point = points[index];
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);

        if (index === 0) {
            continue;
        }

        const previous = points[index - 1];
        const segmentLength = Math.hypot(
            point.x - previous.x,
            point.y - previous.y,
        );

        segmentLengths.push(segmentLength);
        length += segmentLength;
    }

    return {
        source,
        points,
        segmentLengths,
        length,
        centerX: Number.isFinite(minX) ? (minX + maxX) / 2 : 0,
        centerY: Number.isFinite(minY) ? (minY + maxY) / 2 : 0,
    };
};

const PATHS = PATH_SOURCES.map(parsePath);
const DELAYS_CACHE = new Map<AuthorIconAnimationOrder, number[]>();

const getStartPosition = (path: string) => {
    const match = path.match(/^M(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

    return {
        x: Number(match?.[1] ?? CENTER_X),
        y: Number(match?.[2] ?? CENTER_Y),
    };
};

const getDelayProgress = (
    path: string,
    index: number,
    order: AuthorIconAnimationOrder,
) => {
    const { x, y } = getStartPosition(path);
    const distanceFromCenter = clamp(Math.hypot(x - 77.5, y - 93.5) / 121.5);

    switch (order) {
        case "top-down":
            return clamp(y / VIEWBOX_HEIGHT);
        case "bottom-up":
            return 1 - clamp(y / VIEWBOX_HEIGHT);
        case "left-right":
            return clamp(x / VIEWBOX_WIDTH);
        case "right-left":
            return 1 - clamp(x / VIEWBOX_WIDTH);
        case "diagonal":
            return clamp((x / VIEWBOX_WIDTH + y / VIEWBOX_HEIGHT) / 2);
        case "diagonal-reverse":
            return 1 - clamp((x / VIEWBOX_WIDTH + y / VIEWBOX_HEIGHT) / 2);
        case "center-out":
            return distanceFromCenter;
        case "outside-in":
            return 1 - distanceFromCenter;
        default:
            return ((index * 73 + index * index * 17) % 101) / 100;
    }
};

const getDelays = (order: AuthorIconAnimationOrder) => {
    let delays = DELAYS_CACHE.get(order);

    if (!delays) {
        delays = PATH_SOURCES.map((path, index) =>
            getDelayProgress(path, index, order),
        );
        DELAYS_CACHE.set(order, delays);
    }

    return delays;
};

const getFragment = (index: number) => ({
    x: (((index * 37) % 21) - 10) * 1.5,
    y: (((index * 53) % 21) - 10) * 1.5,
    rotation: ((((index * 29) % 37) - 18) * Math.PI) / 180,
});

const FRAGMENTS = PATHS.map((_, index) => getFragment(index));

const cubicBezier = (
    progress: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
) => {
    const sample = (t: number, a: number, b: number) =>
        3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;

    let low = 0;
    let high = 1;
    let t = progress;

    for (let index = 0; index < 14; index += 1) {
        t = (low + high) / 2;

        if (sample(t, x1, x2) < progress) {
            low = t;
        } else {
            high = t;
        }
    }

    return sample(t, y1, y2);
};

const easeProgress = (progress: number, easing: string) => {
    const value = clamp(progress);

    if (easing === "linear") {
        return value;
    }

    if (easing === "ease-in") {
        return cubicBezier(value, 0.42, 0, 1, 1);
    }

    if (easing === "ease-out") {
        return cubicBezier(value, 0, 0, 0.58, 1);
    }

    if (easing === "ease-in-out") {
        return cubicBezier(value, 0.42, 0, 0.58, 1);
    }

    const match = easing.match(
        /cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/,
    );

    if (!match) {
        return value;
    }

    return cubicBezier(
        value,
        Number(match[1]),
        Number(match[2]),
        Number(match[3]),
        Number(match[4]),
    );
};

const getPointAtDistance = (path: ParsedPath, distance: number): Point => {
    if (path.points.length === 0) {
        return { x: 0, y: 0 };
    }

    if (distance <= 0 || path.length === 0) {
        return path.points[0];
    }

    let travelled = 0;

    for (let index = 0; index < path.segmentLengths.length; index += 1) {
        const segmentLength = path.segmentLengths[index];
        const nextTravelled = travelled + segmentLength;

        if (distance <= nextTravelled) {
            const start = path.points[index];
            const end = path.points[index + 1];
            const fraction =
                segmentLength === 0
                    ? 0
                    : (distance - travelled) / segmentLength;

            return {
                x: start.x + (end.x - start.x) * fraction,
                y: start.y + (end.y - start.y) * fraction,
            };
        }

        travelled = nextTravelled;
    }

    return path.points[path.points.length - 1];
};

const appendPathRange = (
    context: CanvasRenderingContext2D,
    path: ParsedPath,
    start: number,
    end: number,
) => {
    if (path.points.length < 2 || path.length <= 0 || end <= start) {
        return;
    }

    const startDistance = clamp(start) * path.length;
    const endDistance = clamp(end) * path.length;

    if (endDistance <= startDistance) {
        return;
    }

    const startPoint = getPointAtDistance(path, startDistance);
    context.moveTo(startPoint.x, startPoint.y);

    let travelled = 0;

    for (let index = 0; index < path.segmentLengths.length; index += 1) {
        const segmentLength = path.segmentLengths[index];
        const segmentStart = travelled;
        const segmentEnd = travelled + segmentLength;
        travelled = segmentEnd;

        if (segmentLength <= 0 || segmentEnd <= startDistance) {
            continue;
        }

        if (segmentStart >= endDistance) {
            break;
        }

        const from = path.points[index];
        const to = path.points[index + 1];
        const endOnSegment = Math.min(segmentEnd, endDistance);
        const fraction = (endOnSegment - segmentStart) / segmentLength;

        context.lineTo(
            from.x + (to.x - from.x) * fraction,
            from.y + (to.y - from.y) * fraction,
        );

        if (segmentEnd >= endDistance) {
            break;
        }
    }
};

const getCanvasContext = (
    canvas: HTMLCanvasElement,
    strokeWidth: number,
    strokeColor: string,
) => {
    const rect = canvas.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
        return null;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.max(1, Math.round(rect.width * dpr));
    const pixelHeight = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== pixelWidth) {
        canvas.width = pixelWidth;
    }

    if (canvas.height !== pixelHeight) {
        canvas.height = pixelHeight;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
        return null;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);

    const scale = Math.min(
        rect.width / VIEWBOX_WIDTH,
        rect.height / VIEWBOX_HEIGHT,
    );

    context.translate(
        (rect.width - VIEWBOX_WIDTH * scale) / 2,
        (rect.height - VIEWBOX_HEIGHT * scale) / 2,
    );
    context.scale(scale, scale);
    context.lineWidth = strokeWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = strokeColor;

    return { context, scale };
};

const drawAllPaths = (context: CanvasRenderingContext2D) => {
    context.beginPath();

    for (const path of PATHS) {
        appendPathRange(context, path, 0, 1);
    }

    context.stroke();
};

const drawWholeAnimation = (
    context: CanvasRenderingContext2D,
    definition: AuthorIconAnimationDefinition,
    time: number,
    duration: number,
    strokeColor: string,
) => {
    const keyframes = definition.keyframes;
    const progress = easeProgress(time / duration, definition.easing);
    let alpha: number;
    let scale = 1;
    let blur = 0;
    let glow = 0;

    switch (keyframes) {
        case "author-icon-whole-show-fade":
            alpha = progress;
            break;
        case "author-icon-whole-hide-fade":
            alpha = 1 - progress;
            break;
        case "author-icon-whole-show-bloom":
            alpha =
                progress < 0.55
                    ? (progress / 0.55) * 0.85
                    : 0.85 + ((progress - 0.55) / 0.45) * 0.15;
            scale = 0.9 + progress * 0.1;
            blur = progress < 0.55 ? 4 * (1 - progress / 0.55) : 0;
            glow =
                progress < 0.55
                    ? 6 - (progress / 0.55) * 3
                    : 3 * (1 - (progress - 0.55) / 0.45);
            break;
        case "author-icon-whole-show-focus":
            alpha = progress;
            scale = 1.12 - progress * 0.12;
            blur = 8 * (1 - progress);
            break;
        case "author-icon-whole-show-shockwave":
            alpha = Math.min(1, progress / 0.6);
            scale =
                progress < 0.6
                    ? 0.55 + (progress / 0.6) * 0.51
                    : 1.06 - ((progress - 0.6) / 0.4) * 0.06;
            blur = progress < 0.6 ? 3 * (1 - progress / 0.6) : 0;
            glow =
                progress < 0.6
                    ? 10 - (progress / 0.6) * 6
                    : 4 * (1 - (progress - 0.6) / 0.4);
            break;
        case "author-icon-whole-hide-shrink":
            alpha = 1 - progress;
            scale = 1 - progress * 0.38;
            blur = progress * 4;
            break;
        case "author-icon-whole-hide-flash":
            alpha =
                progress < 0.28
                    ? 1
                    : progress < 0.45
                      ? 1 - ((progress - 0.28) / 0.17) * 0.7
                      : 0.3 * (1 - (progress - 0.45) / 0.55);
            glow =
                progress < 0.28
                    ? 0
                    : progress < 0.45
                      ? 8
                      : 3 * (1 - (progress - 0.45) / 0.55);
            blur = progress >= 0.45 ? ((progress - 0.45) / 0.55) * 2 : 0;
            break;
        default:
            alpha = progress;
    }

    if (alpha <= 0) {
        return;
    }

    context.save();
    context.globalAlpha = clamp(alpha);
    context.translate(CENTER_X, CENTER_Y);
    context.scale(scale, scale);
    context.translate(-CENTER_X, -CENTER_Y);

    if (blur > 0 || glow > 0) {
        const filters = [];

        if (blur > 0) {
            filters.push(`blur(${blur}px)`);
        }

        if (glow > 0) {
            filters.push(`drop-shadow(0 0 ${glow}px ${strokeColor})`);
        }

        context.filter = filters.join(" ");
    }

    drawAllPaths(context);
    context.restore();
};

const drawMaskAnimation = (
    context: CanvasRenderingContext2D,
    definition: AuthorIconAnimationDefinition,
    time: number,
    duration: number,
    scatter: number,
    strokeColor: string,
) => {
    const isHide = definition.keyframes === "author-icon-mask-hide";
    const delays = getDelays(definition.order);
    const mainBuckets: DrawOperation[][] = Array.from({ length: 11 }, () => []);
    const tracerBuckets: DrawOperation[][] = Array.from(
        { length: 11 },
        () => [],
    );
    const hasTracer = Boolean(definition.tracerKeyframes);

    PATHS.forEach((path, index) => {
        const lineDelay = (delays[index] ?? 0) * scatter;
        const rawProgress = clamp((time - lineDelay) / duration);
        const progress = easeProgress(rawProgress, definition.easing);
        const alpha = isHide
            ? progress >= 0.92
                ? clamp((1 - progress) / 0.08)
                : 1
            : progress < 0.08
              ? clamp(progress / 0.08)
              : 1;
        const end = isHide ? 1 - progress : progress;
        const alphaBucket = Math.min(10, Math.round(alpha * 10));

        if (end > 0 && alphaBucket > 0) {
            mainBuckets[alphaBucket].push({
                path,
                start: 0,
                end,
                alpha: alphaBucket / 10,
            });
        }

        if (!hasTracer || alpha <= 0) {
            return;
        }

        const tracerAlpha =
            progress < 0.08
                ? (progress / 0.08) * 0.95
                : progress < 0.86
                  ? 0.95
                  : ((1 - progress) / 0.14) * 0.95;
        const tracerStart = isHide ? progress : Math.max(0, progress - 0.065);
        const tracerEnd = isHide ? Math.min(1, progress + 0.065) : progress;
        const tracerBucket = Math.min(10, Math.round(clamp(tracerAlpha) * 10));

        if (tracerEnd > tracerStart && tracerBucket > 0) {
            tracerBuckets[tracerBucket].push({
                path,
                start: tracerStart,
                end: tracerEnd,
                alpha: tracerBucket / 10,
            });
        }
    });

    mainBuckets.forEach((bucket) => {
        if (bucket.length === 0) {
            return;
        }

        context.globalAlpha = bucket[0].alpha;
        context.beginPath();

        for (const operation of bucket) {
            appendPathRange(
                context,
                operation.path,
                operation.start,
                operation.end,
            );
        }

        context.stroke();
    });

    if (hasTracer) {
        context.save();
        context.filter = `drop-shadow(0 0 2px ${strokeColor})`;

        tracerBuckets.forEach((bucket) => {
            if (bucket.length === 0) {
                return;
            }

            context.globalAlpha = bucket[0].alpha;
            context.beginPath();

            for (const operation of bucket) {
                appendPathRange(
                    context,
                    operation.path,
                    operation.start,
                    operation.end,
                );
            }

            context.stroke();
        });

        context.restore();
    }

    context.globalAlpha = 1;
    context.filter = "none";
};

const drawSegmentAnimation = (
    context: CanvasRenderingContext2D,
    definition: AuthorIconAnimationDefinition,
    time: number,
    duration: number,
    scatter: number,
    viewScale: number,
) => {
    const keyframes = definition.keyframes;
    const isHide = keyframes.includes("-hide-");
    const delays = getDelays(definition.order);
    const pxToUnits = 1 / Math.max(viewScale, 0.001);

    PATHS.forEach((path, index) => {
        const fragment = FRAGMENTS[index];
        const lineDelay = (delays[index] ?? 0) * scatter;
        const rawProgress = clamp((time - lineDelay) / duration);
        const progress = easeProgress(rawProgress, definition.easing);
        let alpha: number;
        const start = 0;
        let end = 1;
        let translateX = 0;
        let translateY = 0;
        let rotation = 0;
        let scale = 1;

        switch (keyframes) {
            case "author-icon-segments-show-scatter":
                alpha = progress;
                translateX = fragment.x * (1 - progress) * pxToUnits;
                translateY = fragment.y * (1 - progress) * pxToUnits;
                rotation = fragment.rotation * (1 - progress);
                scale = 0.65 + progress * 0.35;
                end = progress;
                break;
            case "author-icon-segments-show-rise":
                alpha = progress;
                translateY = (1 - progress) * 18 * pxToUnits;
                scale = 0.94 + progress * 0.06;
                end = progress;
                break;
            case "author-icon-segments-show-unfold": {
                const unfold = clamp(progress / 0.7);
                alpha = unfold;
                rotation = fragment.rotation * (1 - unfold);
                scale =
                    progress < 0.7
                        ? 0.15 + unfold * 0.89
                        : 1.04 - ((progress - 0.7) / 0.3) * 0.04;
                end = progress;
                break;
            }
            case "author-icon-segments-hide-scatter":
                alpha = 1 - progress;
                translateX = fragment.x * progress * pxToUnits;
                translateY = fragment.y * progress * pxToUnits;
                rotation = fragment.rotation * progress;
                scale = 1 - progress * 0.35;
                break;
            case "author-icon-segments-hide-collapse":
                alpha = 1 - progress;
                end = 1 - progress;
                break;
            case "author-icon-segments-hide-fall":
                alpha = 1 - progress;
                translateY = 22 * progress * pxToUnits;
                rotation = fragment.rotation * progress;
                scale = 1 - progress * 0.08;
                break;
            case "author-icon-segments-hide-dissolve":
                alpha = 1 - progress;
                scale = 1 + progress * 0.12;
                break;
            case "author-icon-segments-hide-implode":
                alpha = 1 - progress;
                rotation = fragment.rotation * progress;
                scale = 1 - progress * 0.92;
                end = 1 - progress;
                break;
            default:
                alpha = isHide ? 1 - progress : progress;
                end = isHide ? 1 - progress : progress;
        }

        if (alpha <= 0 || end <= start || scale <= 0) {
            return;
        }

        context.save();
        context.globalAlpha = clamp(alpha);
        context.translate(path.centerX + translateX, path.centerY + translateY);
        context.rotate(rotation);
        context.scale(scale, scale);
        context.translate(-path.centerX, -path.centerY);
        context.beginPath();
        appendPathRange(context, path, start, end);
        context.stroke();
        context.restore();
    });

    context.globalAlpha = 1;
};

const drawCanvasFrame = (
    canvas: HTMLCanvasElement,
    strokeWidth: number,
    strokeColor: string,
    frame: AnimationFrame | null,
    canonicalTime: number,
    phase: AnimationPhase,
) => {
    const canvasState = getCanvasContext(canvas, strokeWidth, strokeColor);

    if (!canvasState) {
        return;
    }

    const { context, scale } = canvasState;

    if (!frame) {
        if (phase === "shown") {
            drawAllPaths(context);
        }
        return;
    }

    if (frame.definition.strategy === "whole") {
        drawWholeAnimation(
            context,
            frame.definition,
            canonicalTime,
            frame.duration,
            strokeColor,
        );
        return;
    }

    if (frame.definition.strategy === "mask") {
        drawMaskAnimation(
            context,
            frame.definition,
            canonicalTime,
            frame.duration,
            frame.scatter,
            strokeColor,
        );
        return;
    }

    drawSegmentAnimation(
        context,
        frame.definition,
        canonicalTime,
        frame.duration,
        frame.scatter,
        scale,
    );
};

const getCanonicalTime = (run: AnimationRun, now: number) => {
    const elapsed = Math.max(0, now - run.startedAt);
    const delta = run.direction === "forward" ? elapsed : -elapsed;

    return Math.min(
        run.duration + run.scatter,
        Math.max(0, run.canonicalStart + delta),
    );
};

const getRunProgress = (run: AnimationRun, now: number) => {
    const totalDuration = run.duration + run.scatter;
    const canonicalTime = getCanonicalTime(run, now);

    return run.side === "show"
        ? canonicalTime / totalDuration
        : 1 - canonicalTime / totalDuration;
};

const AUTHOR_ICON_STYLES = `
.author-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    max-width: 100%;
    max-height: 100%;
    color: var(--foreground, #f2f2f2);
}
.author-icon__canvas {
    display: block;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    max-width: 100%;
    max-height: 100%;
    flex: 0 1 auto;
    aspect-ratio: 155 / 187;
    overflow: visible;
}
.author-icon__trigger {
    width: fit-content;
    min-height: 30px;
    padding: 5px 10px;
    border: 0;
    border-radius: 5px;
    color: inherit;
    background: transparent;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 160ms ease, transform 160ms ease;
}
.author-icon__trigger:hover {
    background: color-mix(in srgb, currentColor 7%, transparent);
}
.author-icon__trigger:active {
    transform: scale(0.97);
}
.author-icon__trigger:focus-visible {
    outline: 1px solid currentColor;
    outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) {
    .author-icon__canvas {
        image-rendering: auto;
    }
}
`;

export const IconAuthor = ({
    visible,
    progress,
    show = "snakes",
    hide = "erase",
    duration,
    scatter,
    strokeWidth = 0.75,
    showTrigger = true,
    showButtonText = "Показать лицо",
    hideButtonText = "Скрыть лицо",
    onVisibleChange,
    onShowEnd,
    onHideEnd,
    className,
    ...props
}: AuthorIconProps) => {
    const controlled = visible !== undefined;
    const showDefinition = authorIconAnimationConfig.show[show];
    const hideDefinition = authorIconAnimationConfig.hide[hide];
    const [internalVisible, setInternalVisible] = useState(false);
    const [phase, setPhase] = useState<AnimationPhase>("hidden");
    const [run, setRun] = useState<AnimationRun | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mounted = useRef(false);
    const runIdRef = useRef(0);
    const runRef = useRef<AnimationRun | null>(null);
    const progressRef = useRef(0);
    const showDefinitionRef =
        useRef<AuthorIconAnimationDefinition>(showDefinition);
    const hideDefinitionRef =
        useRef<AuthorIconAnimationDefinition>(hideDefinition);
    const durationRef = useRef(duration);
    const scatterRef = useRef(scatter);
    const onShowEndRef = useRef(onShowEnd);
    const onHideEndRef = useRef(onHideEnd);

    const targetVisible = controlled ? Boolean(visible) : internalVisible;
    const controlledProgress =
        progress === undefined
            ? null
            : Math.min(
                  100,
                  Math.max(1, Number.isFinite(progress) ? progress : 1),
              ) / 100;
    const progressControlled = controlledProgress !== null;
    const progressDuration = Math.max(1, duration ?? showDefinition.duration);
    const progressScatter = Math.max(0, scatter ?? showDefinition.scatter);
    const scrubTime =
        controlledProgress !== null && controlledProgress < 1
            ? controlledProgress * (progressDuration + progressScatter)
            : null;
    const scrubbing = scrubTime !== null;

    const frame = useMemo<AnimationFrame | null>(() => {
        if (progressControlled) {
            return scrubbing
                ? {
                      definition: showDefinition,
                      duration: progressDuration,
                      scatter: progressScatter,
                      scrub: true,
                  }
                : null;
        }

        return run
            ? {
                  definition: run.definition,
                  duration: run.duration,
                  scatter: run.scatter,
                  scrub: false,
              }
            : null;
    }, [
        progressControlled,
        scrubbing,
        showDefinition,
        progressDuration,
        progressScatter,
        run,
    ]);

    const renderPhase: AnimationPhase = progressControlled
        ? controlledProgress >= 1
            ? "shown"
            : "animating"
        : phase;

    useEffect(() => {
        showDefinitionRef.current = showDefinition;
        hideDefinitionRef.current = hideDefinition;
        durationRef.current = duration;
        scatterRef.current = scatter;
        onShowEndRef.current = onShowEnd;
        onHideEndRef.current = onHideEnd;
    }, [
        duration,
        hideDefinition,
        onHideEnd,
        onShowEnd,
        scatter,
        showDefinition,
    ]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const updateSize = () => {
            const rect = canvas.getBoundingClientRect();
            setCanvasSize((previous) =>
                previous.width === rect.width && previous.height === rect.height
                    ? previous
                    : { width: rect.width, height: rect.height },
            );
        };

        updateSize();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", updateSize);
            return () => window.removeEventListener("resize", updateSize);
        }

        const observer = new ResizeObserver(updateSize);
        observer.observe(canvas);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (controlledProgress !== null) {
            mounted.current = true;
            progressRef.current = controlledProgress;
            runRef.current = null;
            //eslint-disable-next-line
            setRun(null);
            setPhase(controlledProgress >= 1 ? "shown" : "animating");
            return;
        }

        if (!mounted.current) {
            mounted.current = true;

            if (!targetVisible) {
                return;
            }
        }

        const now = performance.now();
        const previousRun = runRef.current;
        const currentProgress = previousRun
            ? clamp(getRunProgress(previousRun, now))
            : progressRef.current;
        const interrupted =
            previousRun !== null &&
            currentProgress > 0.0001 &&
            currentProgress < 0.9999;
        const definition = interrupted
            ? previousRun.definition
            : targetVisible
              ? showDefinitionRef.current
              : hideDefinitionRef.current;
        const side = interrupted
            ? previousRun.side
            : targetVisible
              ? "show"
              : "hide";
        const runDuration = interrupted
            ? previousRun.duration
            : Math.max(1, durationRef.current ?? definition.duration);
        const runScatter = interrupted
            ? previousRun.scatter
            : Math.max(0, scatterRef.current ?? definition.scatter);
        const totalDuration = runDuration + runScatter;
        const canonicalStart =
            side === "show"
                ? currentProgress * totalDuration
                : (1 - currentProgress) * totalDuration;
        const canonicalTarget =
            side === "show"
                ? targetVisible
                    ? totalDuration
                    : 0
                : targetVisible
                  ? 0
                  : totalDuration;

        progressRef.current = currentProgress;

        if (Math.abs(canonicalTarget - canonicalStart) < 0.5) {
            progressRef.current = targetVisible ? 1 : 0;
            runRef.current = null;
            setRun(null);
            setPhase(targetVisible ? "shown" : "hidden");
            return;
        }

        const nextRun: AnimationRun = {
            id: ++runIdRef.current,
            definition,
            side,
            direction:
                canonicalTarget > canonicalStart ? "forward" : "backward",
            canonicalStart,
            duration: runDuration,
            scatter: runScatter,
            startedAt: now,
            targetVisible,
        };

        runRef.current = nextRun;
        setRun(nextRun);
        setPhase("animating");
    }, [controlledProgress, targetVisible]);

    useEffect(() => {
        if (!run || progressControlled) {
            return;
        }

        const totalDuration = run.duration + run.scatter;
        const canonicalTarget =
            run.side === "show"
                ? run.targetVisible
                    ? totalDuration
                    : 0
                : run.targetVisible
                  ? 0
                  : totalDuration;
        const remaining = Math.abs(canonicalTarget - run.canonicalStart);
        const timeout = window.setTimeout(() => {
            if (runRef.current?.id !== run.id) {
                return;
            }

            progressRef.current = run.targetVisible ? 1 : 0;
            runRef.current = null;
            setRun(null);
            setPhase(run.targetVisible ? "shown" : "hidden");

            if (run.targetVisible) {
                onShowEndRef.current?.();
            } else {
                onHideEndRef.current?.();
            }
        }, remaining + 24);

        return () => window.clearTimeout(timeout);
    }, [progressControlled, run]);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas || canvasSize.width <= 0 || canvasSize.height <= 0) {
            return;
        }

        const canvasStyle = window.getComputedStyle(canvas);
        const strokeColor =
            canvasStyle.stroke !== "none"
                ? canvasStyle.stroke
                : canvasStyle.color || "#f2f2f2";
        let animationFrame = 0;

        const draw = (fromAnimationFrame = false) => {
            const activeRun = runRef.current;

            if (progressControlled) {
                drawCanvasFrame(
                    canvas,
                    strokeWidth,
                    strokeColor,
                    frame,
                    scrubTime ?? 0,
                    renderPhase,
                );
                return;
            }

            if (activeRun) {
                drawCanvasFrame(
                    canvas,
                    strokeWidth,
                    strokeColor,
                    {
                        definition: activeRun.definition,
                        duration: activeRun.duration,
                        scatter: activeRun.scatter,
                        scrub: false,
                    },
                    getCanonicalTime(activeRun, performance.now()),
                    "animating",
                );
                animationFrame = window.requestAnimationFrame(() => draw(true));
                return;
            }

            if (fromAnimationFrame) {
                return;
            }

            drawCanvasFrame(
                canvas,
                strokeWidth,
                strokeColor,
                null,
                0,
                renderPhase,
            );
        };

        draw();

        return () => {
            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
            }
        };
    }, [
        canvasSize,
        className,
        controlledProgress,
        frame,
        progressControlled,
        renderPhase,
        run,
        scrubTime,
        strokeWidth,
    ]);

    const toggleVisible = () => {
        const nextVisible = !targetVisible;

        if (!controlled) {
            setInternalVisible(nextVisible);
        }

        onVisibleChange?.(nextVisible);
    };

    const { isMobile } = useDevice();

    const stroke = isMobile ? "stroke-curr" : "stroke-curr";

    return (
        <div
            {...props}
            className={["author-icon", className].filter(Boolean).join(" ")}
        >
            <canvas
                ref={canvasRef}
                className={`author-icon__canvas ${stroke}`}
                role="img"
                aria-label="Лицо, собранное из линий"
                aria-hidden={renderPhase === "hidden"}
            />

            {showTrigger && (
                <button
                    className="author-icon__trigger"
                    type="button"
                    aria-pressed={targetVisible}
                    onClick={toggleVisible}
                >
                    {targetVisible ? hideButtonText : showButtonText}
                </button>
            )}

            <style>{AUTHOR_ICON_STYLES}</style>
        </div>
    );
};
