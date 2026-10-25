import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { DynamicSvgIcon } from "./components/Icons/DynamicSvgIcon";
import { useDevice } from "./scroll/useDevice";
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
    mobileScale?: number;
    octopusSpeed?: number;
    octopusFleeDistance?: number;
    tentacleCount?: number;
    tentacleSegments?: number;
    tentacleSpacing?: number;
    tentacleWaveAmplitude?: number;
    tentacleWaveLength?: number;
};

type Point = {
    x: number;
    y: number;
    currentX: number;
    currentY: number;
    blastHitAt: number;
    blastRebornAt: number;
    blastDirX: number;
    blastDirY: number;
    blastDistance: number;
    // Оптимизация: кеш для батчинга
    drawX: number;
    drawY: number;
    drawR: number;
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

type OctopusPhase = "hidden" | "active";

type OctopusStep =
    | {
          type: "go";
          x: number;
          y: number;
          speed: number;
          wander: number;
          reach?: number;
      }
    | {
          type: "hold";
          x: number;
          y: number;
          duration: number;
      };

type ScenarioName =
    | "cross"
    | "skirt"
    | "corner"
    | "peek"
    | "explore"
    | "dash"
    | "weave";

type ScenarioContext = {
    w: number;
    h: number;
    side: number;
    t: number;
    size: number;
    hideDistance: number;
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
                className="relative size-5 fill-current text-current [&_*]:!fill-current [&_*]:!stroke-current"
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
                className="relative size-5 fill-current text-current [&_*]:!fill-current [&_*]:!stroke-current"
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
                className="relative size-5 fill-current text-current [&_*]:!fill-current [&_*]:!stroke-current"
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
                className="relative size-5 fill-current text-current [&_*]:!fill-current [&_*]:!stroke-current"
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

const OCTOPUS_MAX_SPEED = 14;
const MANTLE_BLOBS = [
    { offset: -6, scale: 1 },
    { offset: 12, scale: 1.15 },
    { offset: 30, scale: 0.9 },
];

const TENTACLE_ROOT_SCALE = 0.7;
const TENTACLE_TIP_SCALE = 0.25;
const TENTACLE_ROOT_OFFSET = 12;
const TENTACLE_STIFFNESS = 0.12;
const TENTACLE_FAN_WIDE = 2.6;
const TENTACLE_FAN_NARROW = 0.9;
const TENTACLE_FAN_SPEED = 6;
const TENTACLE_PHASE_STEP = 0.9;
const TENTACLE_WAVE_SPEED_RATIO = 1.5;
const TENTACLE_WAVE_IDLE_SPEED = 0.05;
const JET_STRENGTH = 0.6;
const MANTLE_SQUEEZE = 0.12;

const OCTOPUS_CATCH_CHANCE = 0.5;
const OCTOPUS_CATCH_RADIUS = 18;

const OCTOPUS_HIDDEN_MIN = 2000;
const OCTOPUS_HIDDEN_MAX = 6500;
const OCTOPUS_FIRST_DELAY_MIN = 800;
const OCTOPUS_FIRST_DELAY_MAX = 2000;
const OCTOPUS_MAX_ACTIVE = 90000;
const OCTOPUS_TRANSIT_SPEED = 1.7;
const OCTOPUS_DASH_SPEED = 3.4;
const OCTOPUS_HOLD_SPEED = 0.3;
const OCTOPUS_HOLD_RADIUS = 40;
const OCTOPUS_WANDER = 0.15;
const OCTOPUS_EXIT_EXTRA = 70;

const SCENARIO_WEIGHTS: Record<ScenarioName, number> = {
    cross: 3,
    skirt: 3,
    corner: 2,
    peek: 2,
    explore: 2,
    dash: 1.5,
    weave: 2,
};

const EXPLOSION_WAVE_DURATION = 2600;
const EXPLOSION_WAVE_CURVE = 0.85;
const EXPLOSION_LEAD = 220;
const EXPLOSION_PRE_PUSH = 6;
const EXPLOSION_FLASH_SIZE = 1.35;
const EXPLOSION_FLASH_OPACITY = 0.95;
const EXPLOSION_FLASH_DURATION = 500;
const EXPLOSION_FLY_DURATION = 1300;
const EXPLOSION_FLY_MIN = 28;
const EXPLOSION_FLY_MAX = 230;
const EXPLOSION_FLY_DECAY = 650;
const EXPLOSION_ANGLE_JITTER = 0.35;
const EXPLOSION_CURSOR_BOOST = 0.65;
const EXPLOSION_CURSOR_DIRECTION = 0.2;
const EXPLOSION_SHAPE_DIRECTION = 0.65;
const EXPLOSION_REGROW_START = 2200;
const EXPLOSION_REGROW_SPREAD = 5500;
const EXPLOSION_REGROW_JITTER = 700;
const EXPLOSION_GROW_DURATION = 2400;
const EXPLOSION_REGROW_DRIFT = 10;
const EXPLOSION_RETURN_DELAY = 3000;

const lerp = (current: number, target: number, amount: number) => {
    return current + (target - current) * amount;
};

const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
};

const rand = (min: number, max: number) => {
    return min + Math.random() * (max - min);
};

const resolveCursorColor = (value?: string) => {
    if (!value) return DEFAULT_CURSOR_COLOR;
    return `var(--${value})`;
};

const SIDE_INWARD = [
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
];

const borderPoint = (
    side: number,
    t: number,
    depth: number,
    w: number,
    h: number,
) => {
    switch (side) {
        case 0:
            return { x: t * w, y: -depth };
        case 1:
            return { x: w + depth, y: t * h };
        case 2:
            return { x: t * w, y: h + depth };
        default:
            return { x: -depth, y: t * h };
    }
};

const crossLength = (side: number, w: number, h: number) => {
    return side % 2 === 0 ? h : w;
};

const randomSideExcept = (side: number) => {
    return (side + 1 + Math.floor(Math.random() * 3)) % 4;
};

const go = (
    x: number,
    y: number,
    speed = OCTOPUS_TRANSIT_SPEED,
    wander = 1,
    reach?: number,
): OctopusStep => ({
    type: "go",
    x,
    y,
    speed,
    wander,
    reach,
});

const hold = (x: number, y: number, duration: number): OctopusStep => ({
    type: "hold",
    x,
    y,
    duration,
});

const pickScenario = (last: ScenarioName | null): ScenarioName => {
    const names = (Object.keys(SCENARIO_WEIGHTS) as ScenarioName[]).filter(
        (name) => name !== last,
    );
    const total = names.reduce((sum, name) => sum + SCENARIO_WEIGHTS[name], 0);
    let roll = Math.random() * total;

    for (const name of names) {
        roll -= SCENARIO_WEIGHTS[name];
        if (roll <= 0) return name;
    }
    return names[names.length - 1];
};

const buildScenario = (
    name: ScenarioName,
    context: ScenarioContext,
): OctopusStep[] => {
    const { w, h, side, t, size, hideDistance } = context;
    const across = crossLength(side, w, h);
    const exitDepth = hideDistance + OCTOPUS_EXIT_EXTRA * size;

    const exitAt = (
        exitSide: number,
        exitT: number,
        speed = OCTOPUS_TRANSIT_SPEED,
        wander = 1,
    ) => {
        const point = borderPoint(
            exitSide,
            clamp(exitT, 0.05, 0.95),
            exitDepth,
            w,
            h,
        );
        return go(point.x, point.y, speed, wander);
    };

    switch (name) {
        case "cross": {
            const x = w * rand(0.35, 0.65);
            const y = h * rand(0.35, 0.65);
            return [go(x, y), exitAt(randomSideExcept(side), rand(0.15, 0.85))];
        }
        case "skirt": {
            const depth = Math.min(rand(150, 280) * size, across * 0.4);
            const preferred = t < 0.5 ? 1 : -1;
            const dirSign = Math.random() < 0.8 ? preferred : -preferred;
            const room = dirSign > 0 ? 0.95 - t : t - 0.05;
            const travel = Math.max(0.15, Math.min(room, rand(0.35, 0.65)));
            const pace = rand(0.9, 1.6);
            const first = borderPoint(side, t, -depth, w, h);
            const steps: OctopusStep[] = [go(first.x, first.y, pace)];

            for (let i = 1; i <= 3; i++) {
                const along = clamp(t + (dirSign * travel * i) / 3, 0.03, 0.97);
                const wobble = (i % 2 === 0 ? -1 : 1) * rand(10, 35) * size;
                const point = borderPoint(side, along, -(depth + wobble), w, h);
                steps.push(go(point.x, point.y, pace));
            }
            steps.push(exitAt(side, t + dirSign * travel, pace));
            return steps;
        }
        case "corner": {
            const depth = Math.min(rand(130, 220) * size, w * 0.35, h * 0.35);
            const nearer = t < 0.5 ? 0 : 1;
            const cornerEnd = Math.random() < 0.8 ? nearer : 1 - nearer;
            const adjacent = [
                [3, 1],
                [0, 2],
                [3, 1],
                [0, 2],
            ][side][cornerEnd];
            const vertical = side % 2 === 1 ? side : adjacent;
            const horizontal = side % 2 === 0 ? side : adjacent;
            const cornerX = vertical === 3 ? depth : w - depth;
            const cornerY = horizontal === 0 ? depth : h - depth;
            const adjacentCornerT =
                adjacent % 2 === 0
                    ? vertical === 3
                        ? 0
                        : 1
                    : horizontal === 0
                      ? 0
                      : 1;
            const adjacentT =
                adjacentCornerT === 0 ? rand(0.25, 0.5) : rand(0.5, 0.75);

            const first = borderPoint(side, t, -depth, w, h);
            const along = borderPoint(adjacent, adjacentT, -depth, w, h);
            return [
                go(first.x, first.y),
                go(cornerX, cornerY),
                go(along.x, along.y),
                exitAt(adjacent, adjacentT),
            ];
        }
        case "peek": {
            const depth = rand(40, 100) * size;
            const shift = rand(-0.12, 0.12);
            const first = borderPoint(side, t, -depth, w, h);
            const steps: OctopusStep[] = [
                go(first.x, first.y, 1.2, 0.6, 22 * size),
                hold(first.x, first.y, rand(2200, 4200)),
            ];
            if (Math.random() < 0.55) {
                const second = borderPoint(
                    side,
                    clamp(t + shift, 0.05, 0.95),
                    -depth * rand(0.8, 1.4),
                    w,
                    h,
                );
                steps.push(
                    go(second.x, second.y, 0.9, 0.6, 22 * size),
                    hold(second.x, second.y, rand(1500, 3000)),
                );
            }
            steps.push(exitAt(side, t + shift, OCTOPUS_TRANSIT_SPEED, 0.4));
            return steps;
        }
        case "explore": {
            const stops = 1 + Math.floor(Math.random() * 3);
            const steps: OctopusStep[] = [];
            for (let i = 0; i < stops; i++) {
                const x = w * rand(0.15, 0.85);
                const y = h * rand(0.15, 0.85);
                steps.push(go(x, y, rand(1.2, 1.9)));
                if (Math.random() < 0.6)
                    steps.push(hold(x, y, rand(1500, 3200)));
            }
            steps.push(exitAt(Math.floor(Math.random() * 4), rand(0.15, 0.85)));
            return steps;
        }
        case "dash": {
            const exitSide =
                Math.random() < 0.7 ? (side + 2) % 4 : randomSideExcept(side);
            const middle = borderPoint(
                side,
                rand(0.2, 0.8),
                -across * rand(0.3, 0.55),
                w,
                h,
            );
            return [
                go(middle.x, middle.y, OCTOPUS_DASH_SPEED, 0.3),
                exitAt(exitSide, rand(0.15, 0.85), OCTOPUS_DASH_SPEED, 0.3),
            ];
        }
        case "weave": {
            const count = 4 + Math.floor(Math.random() * 3);
            const amplitude = rand(0.12, 0.22);
            let sign = Math.random() < 0.5 ? 1 : -1;
            const steps: OctopusStep[] = [];
            for (let k = 1; k <= count; k++) {
                const point = borderPoint(
                    side,
                    clamp(t + sign * amplitude, 0.05, 0.95),
                    -(across * k) / (count + 1),
                    w,
                    h,
                );
                steps.push(go(point.x, point.y, 1.6, 0.5));
                sign = -sign;
            }
            steps.push(exitAt((side + 2) % 4, t, 1.6, 0.5));
            return steps;
        }
    }
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
    mobileScale = 0.75,
    octopusSpeed = 1.4,
    octopusFleeDistance = 220,
    tentacleCount = 8,
    tentacleSegments = 14,
    tentacleSpacing = 8,
    tentacleWaveAmplitude = 12,
    tentacleWaveLength = 90,
    className,
}: Props) {
    const { isMobile } = useDevice();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const isReady = useAssetReady();

    // Оптимизация хуков: Избегаем реинициализации всего эффекта при изменении каждого пропа
    const configRef = useRef({
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
        octopusSpeed,
        octopusFleeDistance,
        tentacleCount,
        tentacleSegments,
        tentacleSpacing,
        tentacleWaveAmplitude,
        tentacleWaveLength,
    });

    useEffect(() => {
        Object.assign(configRef.current, {
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
            octopusSpeed,
            octopusFleeDistance,
            tentacleCount,
            tentacleSegments,
            tentacleSpacing,
            tentacleWaveAmplitude,
            tentacleWaveLength,
        });
    });

    const mouseRef = useRef({ x: -1000, y: -1000 });
    const targetMouseRef = useRef({ x: -1000, y: -1000 });
    const pointsRef = useRef<Point[]>([]);
    const animationRef = useRef<number>(0);
    const clickRef = useRef(0);
    const clickTargetRef = useRef(0);
    const cursorModeRef = useRef({ target: "default" });
    const cursorColorRef = useRef(DEFAULT_CURSOR_COLOR);
    const shadowRef = useRef(DEFAULT_SHADOW);

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
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const uiScale = isMobile ? mobileScale : 1;
        const grid = gridSize * uiScale;

        // Эти параметры пересчитываются один раз на перерисовку внутри `render`
        // поэтому мы можем безопасно менять props без фризов
        let cols = 0;
        let rows = 0;
        let octopusField = new Float32Array(0);

        const head = { x: 0, y: 0 };
        const tentacles: { x: number; y: number }[][] = [];
        const blobs: { x: number; y: number; scale: number }[] = [];

        let octopusAngle = 0;
        let octopusCurrentSpeed = configRef.current.octopusSpeed * uiScale;
        let fan = TENTACLE_FAN_WIDE;
        let wavePhase = 0;
        let pulsePhase = 0;
        let mantleScale = 1;
        let tick = 0;

        let phase: OctopusPhase = "hidden";
        let hiddenUntil =
            performance.now() +
            rand(OCTOPUS_FIRST_DELAY_MIN, OCTOPUS_FIRST_DELAY_MAX);

        let plan: OctopusStep[] = [];
        let stepIndex = 0;
        let stepStartedAt = 0;
        let activeStartedAt = 0;
        let hasAppeared = false;
        let escaping = false;
        let holdSeed = 0;
        let cruiseSpeed = OCTOPUS_TRANSIT_SPEED;
        let lastScenario: ScenarioName | null = null;
        let wasTouchingOctopus = false;

        let explosionActive = false;
        let explosionStartAt = 0;
        let explosionEndAt = 0;
        let explosionCenterX = 0;
        let explosionCenterY = 0;
        let explosionMaxDistance = 1;

        const getRestAngle = (index: number) => {
            const tc = configRef.current.tentacleCount;
            const step = fan / Math.max(1, tc - 1);
            return octopusAngle + Math.PI + (index - (tc - 1) / 2) * step;
        };

        const placeOctopus = (x: number, y: number, angle: number) => {
            const cfg = configRef.current;
            head.x = x;
            head.y = y;
            octopusAngle = angle;
            octopusCurrentSpeed =
                cfg.octopusSpeed * uiScale * OCTOPUS_TRANSIT_SPEED;
            fan = TENTACLE_FAN_NARROW;
            wavePhase = Math.random() * Math.PI * 2;
            pulsePhase = Math.random() * Math.PI * 2;
            mantleScale = 1;
            tentacles.length = 0;

            for (let k = 0; k < cfg.tentacleCount; k++) {
                const restAngle = getRestAngle(k);
                const spine: { x: number; y: number }[] = [];
                for (let i = 0; i < cfg.tentacleSegments; i++) {
                    const distance =
                        (TENTACLE_ROOT_OFFSET + i * cfg.tentacleSpacing) *
                        uiScale;
                    spine.push({
                        x: head.x + Math.cos(restAngle) * distance,
                        y: head.y + Math.sin(restAngle) * distance,
                    });
                }
                tentacles.push(spine);
            }

            const blobCount =
                MANTLE_BLOBS.length + cfg.tentacleCount * cfg.tentacleSegments;
            while (blobs.length < blobCount)
                blobs.push({ x: 0, y: 0, scale: 0 });
            blobs.length = blobCount;
        };

        const createPoints = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            cols = Math.floor(width / grid) + 1;
            rows = Math.floor(height / grid) + 1;

            const points: Point[] = [];
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * grid;
                    const y = row * grid;
                    points.push({
                        x,
                        y,
                        currentX: x,
                        currentY: y,
                        blastHitAt: 0,
                        blastRebornAt: 0,
                        blastDirX: 0,
                        blastDirY: 0,
                        blastDistance: 0,
                        drawX: x,
                        drawY: y,
                        drawR: 0,
                    });
                }
            }

            pointsRef.current = points;
            octopusField = new Float32Array(points.length * 4);
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

        // --- Octopus Handlers ---
        const startScenario = (timestamp: number) => {
            const cfg = configRef.current;
            const w = window.innerWidth;
            const h = window.innerHeight;
            const side = Math.floor(Math.random() * 4);
            const t = rand(0.15, 0.85);

            const tailLength =
                (TENTACLE_ROOT_OFFSET +
                    (cfg.tentacleSegments - 1) * cfg.tentacleSpacing) *
                uiScale;
            const tipReach = cfg.cursorRadius * TENTACLE_TIP_SCALE * uiScale;
            const mantleReach = Math.max(
                ...MANTLE_BLOBS.map(
                    (blob) =>
                        (Math.abs(blob.offset) +
                            cfg.cursorRadius * blob.scale) *
                        uiScale,
                ),
            );
            const hideDistance =
                Math.max(tailLength + tipReach, mantleReach) + 12 * uiScale;

            const spawn = borderPoint(side, t, hideDistance, w, h);
            const inward = SIDE_INWARD[side];
            placeOctopus(
                spawn.x,
                spawn.y,
                Math.atan2(inward.y, inward.x) + rand(-0.25, 0.25),
            );

            const name = pickScenario(lastScenario);
            lastScenario = name;
            plan = buildScenario(name, {
                w,
                h,
                side,
                t,
                size: uiScale,
                hideDistance,
            });

            stepIndex = 0;
            stepStartedAt = timestamp;
            activeStartedAt = timestamp;
            hasAppeared = false;
            escaping = false;
            holdSeed = Math.random() * 100;
            cruiseSpeed = OCTOPUS_TRANSIT_SPEED;
            wasTouchingOctopus = false;
            phase = "active";
        };

        const hideOctopus = (timestamp: number) => {
            phase = "hidden";
            hiddenUntil =
                timestamp + rand(OCTOPUS_HIDDEN_MIN, OCTOPUS_HIDDEN_MAX);
            plan = [];
            escaping = false;
            wasTouchingOctopus = false;
            octopusField.fill(0);
        };

        const beginEscape = (awayX: number, awayY: number) => {
            const cfg = configRef.current;
            const length = Math.sqrt(awayX * awayX + awayY * awayY) || 1;
            const dirX = awayX / length;
            const dirY = awayY / length;

            const tailLength =
                (TENTACLE_ROOT_OFFSET +
                    (cfg.tentacleSegments - 1) * cfg.tentacleSpacing) *
                uiScale;
            const tipReach = cfg.cursorRadius * TENTACLE_TIP_SCALE * uiScale;
            const mantleReach = Math.max(
                ...MANTLE_BLOBS.map(
                    (blob) =>
                        (Math.abs(blob.offset) +
                            cfg.cursorRadius * blob.scale) *
                        uiScale,
                ),
            );
            const hideDistance =
                Math.max(tailLength + tipReach, mantleReach) + 12 * uiScale;

            const limit = hideDistance + OCTOPUS_EXIT_EXTRA * uiScale;
            let distance = Infinity;

            if (dirX > 0.001)
                distance = Math.min(
                    distance,
                    (window.innerWidth + limit - head.x) / dirX,
                );
            else if (dirX < -0.001)
                distance = Math.min(distance, (-limit - head.x) / dirX);

            if (dirY > 0.001)
                distance = Math.min(
                    distance,
                    (window.innerHeight + limit - head.y) / dirY,
                );
            else if (dirY < -0.001)
                distance = Math.min(distance, (-limit - head.y) / dirY);

            distance = Math.max(0, distance);
            plan = [
                go(
                    head.x + dirX * distance,
                    head.y + dirY * distance,
                    OCTOPUS_TRANSIT_SPEED,
                ),
            ];
            stepIndex = 0;
            escaping = true;
        };

        const isOctopusVisible = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            for (const blob of blobs) {
                const radius =
                    configRef.current.cursorRadius * blob.scale * uiScale;
                if (
                    blob.x + radius > 0 &&
                    blob.x - radius < width &&
                    blob.y + radius > 0 &&
                    blob.y - radius < height
                ) {
                    return true;
                }
            }
            return false;
        };

        const updateOctopus = (
            timestamp: number,
            mouseX: number,
            mouseY: number,
            cursorSpeed: number,
        ) => {
            const cfg = configRef.current;
            const baseSpeed = cfg.octopusSpeed * uiScale;
            let nearestSquared =
                (head.x - mouseX) ** 2 + (head.y - mouseY) ** 2;

            for (const spine of tentacles) {
                for (const segment of spine) {
                    const dx = segment.x - mouseX;
                    const dy = segment.y - mouseY;
                    nearestSquared = Math.min(
                        nearestSquared,
                        dx * dx + dy * dy,
                    );
                }
            }

            const fleeing = nearestSquared < cfg.octopusFleeDistance ** 2;
            const maxTurn = fleeing ? 0.15 : 0.05;

            let desiredAngle = octopusAngle;
            let targetSpeed = baseSpeed * cruiseSpeed;

            if (fleeing) {
                const awayX = head.x - mouseX;
                const awayY = head.y - mouseY;
                if (!escaping) beginEscape(awayX, awayY);
                desiredAngle = Math.atan2(awayY, awayX);
                targetSpeed = Math.max(
                    baseSpeed * OCTOPUS_TRANSIT_SPEED,
                    Math.min(cursorSpeed, OCTOPUS_MAX_SPEED),
                );
            } else {
                const step = plan[stepIndex];
                if (step?.type === "go") {
                    const dx = step.x - head.x;
                    const dy = step.y - head.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const turnRadius = octopusCurrentSpeed / maxTurn;
                    const reach =
                        step.reach ?? Math.max(70 * uiScale, turnRadius * 1.1);

                    cruiseSpeed = step.speed;
                    targetSpeed = baseSpeed * step.speed;

                    if (distance <= reach) {
                        stepIndex++;
                        stepStartedAt = timestamp;
                    } else {
                        const sway =
                            (Math.sin(tick * 0.011) +
                                Math.sin(tick * 0.0173 + 2)) *
                            OCTOPUS_WANDER;
                        desiredAngle = Math.atan2(dy, dx) + sway * step.wander;
                    }
                } else if (step?.type === "hold") {
                    const dx = step.x - head.x;
                    const dy = step.y - head.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    targetSpeed = baseSpeed * OCTOPUS_HOLD_SPEED;

                    if (timestamp - stepStartedAt >= step.duration) {
                        stepIndex++;
                        stepStartedAt = timestamp;
                    } else if (distance > OCTOPUS_HOLD_RADIUS * uiScale) {
                        desiredAngle = Math.atan2(dy, dx);
                    } else {
                        desiredAngle =
                            octopusAngle +
                            Math.sin(tick * 0.017 + holdSeed) * 0.03;
                    }
                }
            }

            const diff = Math.atan2(
                Math.sin(desiredAngle - octopusAngle),
                Math.cos(desiredAngle - octopusAngle),
            );
            octopusAngle += clamp(diff, -maxTurn, maxTurn);
            octopusCurrentSpeed = lerp(octopusCurrentSpeed, targetSpeed, 0.2);
            pulsePhase += 0.05 + octopusCurrentSpeed * 0.02;

            const pulse = Math.sin(pulsePhase);
            const moveSpeed = octopusCurrentSpeed * (1 + JET_STRENGTH * pulse);
            mantleScale = 1 - MANTLE_SQUEEZE * pulse;

            head.x += Math.cos(octopusAngle) * moveSpeed;
            head.y += Math.sin(octopusAngle) * moveSpeed;

            const waveNumber =
                (Math.PI * 2) / (cfg.tentacleWaveLength * uiScale);
            wavePhase +=
                octopusCurrentSpeed * waveNumber * TENTACLE_WAVE_SPEED_RATIO +
                TENTACLE_WAVE_IDLE_SPEED;

            const fanTarget = lerp(
                TENTACLE_FAN_WIDE,
                TENTACLE_FAN_NARROW,
                Math.min(
                    1,
                    octopusCurrentSpeed / (TENTACLE_FAN_SPEED * uiScale),
                ),
            );
            fan = lerp(fan, fanTarget, 0.05);

            for (let k = 0; k < tentacles.length; k++) {
                const spine = tentacles[k];
                const restAngle = getRestAngle(k);
                const restX = Math.cos(restAngle);
                const restY = Math.sin(restAngle);

                spine[0].x = head.x + restX * TENTACLE_ROOT_OFFSET * uiScale;
                spine[0].y = head.y + restY * TENTACLE_ROOT_OFFSET * uiScale;

                for (let i = 1; i < spine.length; i++) {
                    const previous = spine[i - 1];
                    const segment = spine[i];

                    segment.x +=
                        (previous.x +
                            restX * cfg.tentacleSpacing * uiScale -
                            segment.x) *
                        TENTACLE_STIFFNESS;
                    segment.y +=
                        (previous.y +
                            restY * cfg.tentacleSpacing * uiScale -
                            segment.y) *
                        TENTACLE_STIFFNESS;

                    const dx = segment.x - previous.x;
                    const dy = segment.y - previous.y;
                    const length = Math.sqrt(dx * dx + dy * dy) || 1;

                    segment.x =
                        previous.x +
                        (dx / length) * cfg.tentacleSpacing * uiScale;
                    segment.y =
                        previous.y +
                        (dy / length) * cfg.tentacleSpacing * uiScale;
                }
            }
        };

        const updateBlobs = () => {
            const cfg = configRef.current;
            const waveNumber =
                (Math.PI * 2) / (cfg.tentacleWaveLength * uiScale);
            const forwardX = Math.cos(octopusAngle);
            const forwardY = Math.sin(octopusAngle);
            let blobIndex = 0;

            for (const mantle of MANTLE_BLOBS) {
                const blob = blobs[blobIndex++];
                blob.x = head.x + forwardX * mantle.offset * uiScale;
                blob.y = head.y + forwardY * mantle.offset * uiScale;
                blob.scale = mantle.scale * mantleScale;
            }

            for (let k = 0; k < tentacles.length; k++) {
                const spine = tentacles[k];
                const count = spine.length;

                for (let i = 0; i < count; i++) {
                    const previous = spine[Math.max(0, i - 1)];
                    const next = spine[Math.min(count - 1, i + 1)];

                    let tangentX = previous.x - next.x;
                    let tangentY = previous.y - next.y;
                    const tangentLength =
                        Math.sqrt(tangentX * tangentX + tangentY * tangentY) ||
                        1;

                    tangentX /= tangentLength;
                    tangentY /= tangentLength;

                    const ramp = count > 1 ? i / (count - 1) : 0;
                    const offset =
                        cfg.tentacleWaveAmplitude *
                        uiScale *
                        ramp *
                        Math.sin(
                            wavePhase -
                                i * cfg.tentacleSpacing * uiScale * waveNumber +
                                k * TENTACLE_PHASE_STEP,
                        );

                    const blob = blobs[blobIndex++];
                    blob.x = spine[i].x - tangentY * offset;
                    blob.y = spine[i].y + tangentX * offset;
                    blob.scale = lerp(
                        TENTACLE_ROOT_SCALE,
                        TENTACLE_TIP_SCALE,
                        ramp,
                    );
                }
            }
        };

        const accumulateOctopus = () => {
            const cfg = configRef.current;
            octopusField.fill(0);
            const points = pointsRef.current;

            for (const blob of blobs) {
                const blobRadius = cfg.cursorRadius * blob.scale * uiScale;
                if (blobRadius <= 0) continue;

                const blobRadiusSquared = blobRadius * blobRadius;
                const blobFalloff = Math.max(
                    1,
                    cfg.falloff * blob.scale * uiScale,
                );
                const twoFalloffSquared = 2 * blobFalloff * blobFalloff;

                const colMin = Math.max(
                    0,
                    Math.ceil((blob.x - blobRadius) / grid),
                );
                const colMax = Math.min(
                    cols - 1,
                    Math.floor((blob.x + blobRadius) / grid),
                );
                const rowMin = Math.max(
                    0,
                    Math.ceil((blob.y - blobRadius) / grid),
                );
                const rowMax = Math.min(
                    rows - 1,
                    Math.floor((blob.y + blobRadius) / grid),
                );

                for (let row = rowMin; row <= rowMax; row++) {
                    for (let col = colMin; col <= colMax; col++) {
                        const index = row * cols + col;
                        const point = points[index];
                        if (!point) continue;

                        const dx = point.x - blob.x;
                        const dy = point.y - blob.y;
                        const distanceSquared = dx * dx + dy * dy;

                        if (distanceSquared >= blobRadiusSquared) continue;

                        const distance = Math.sqrt(distanceSquared);
                        if (distance < 0.001) continue;

                        const weight = Math.exp(
                            -distanceSquared / twoFalloffSquared,
                        );
                        const offset = index * 4;

                        octopusField[offset] += (dx / distance) * weight;
                        octopusField[offset + 1] += (dy / distance) * weight;
                        octopusField[offset + 2] += weight;

                        if (weight > octopusField[offset + 3]) {
                            octopusField[offset + 3] = weight;
                        }
                    }
                }
            }
        };

        const isTouchingOctopus = (x: number, y: number) => {
            const cfg = configRef.current;
            const catchRadius = OCTOPUS_CATCH_RADIUS * uiScale;
            if ((head.x - x) ** 2 + (head.y - y) ** 2 <= catchRadius ** 2)
                return true;

            for (const blob of blobs) {
                const dx = blob.x - x;
                const dy = blob.y - y;
                const hitRadius = Math.max(
                    catchRadius * 0.65,
                    cfg.cursorRadius * blob.scale * uiScale * 0.3,
                );
                if (dx * dx + dy * dy <= hitRadius * hitRadius) return true;
            }
            return false;
        };

        const explodeOctopus = (
            timestamp: number,
            cursorDX: number,
            cursorDY: number,
            cursorSpeed: number,
        ) => {
            const centerX = head.x;
            const centerY = head.y;
            const width = window.innerWidth;
            const height = window.innerHeight;

            const maxDistance = Math.max(
                1,
                Math.sqrt(centerX ** 2 + centerY ** 2),
                Math.sqrt((width - centerX) ** 2 + centerY ** 2),
                Math.sqrt(centerX ** 2 + (height - centerY) ** 2),
                Math.sqrt((width - centerX) ** 2 + (height - centerY) ** 2),
            );

            const cursorDirectionLength = Math.sqrt(
                cursorDX * cursorDX + cursorDY * cursorDY,
            );
            const cursorDirectionX =
                cursorDirectionLength > 0.001
                    ? cursorDX / cursorDirectionLength
                    : 0;
            const cursorDirectionY =
                cursorDirectionLength > 0.001
                    ? cursorDY / cursorDirectionLength
                    : 0;

            const cursorMotion = clamp(cursorSpeed / OCTOPUS_MAX_SPEED, 0, 1);
            const cursorBoost = 1 + cursorMotion * EXPLOSION_CURSOR_BOOST;
            const points = pointsRef.current;

            for (let index = 0; index < points.length; index++) {
                const point = points[index];
                const dx = point.x - centerX;
                const dy = point.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const normalized = clamp(distance / maxDistance, 0, 1);

                let dirX =
                    distance > 0.001 ? dx / distance : Math.cos(octopusAngle);
                let dirY =
                    distance > 0.001 ? dy / distance : Math.sin(octopusAngle);

                const fieldOffset = index * 4;
                const shapeX = octopusField[fieldOffset];
                const shapeY = octopusField[fieldOffset + 1];
                const shapeInfluence = octopusField[fieldOffset + 3];
                const shapeLength = Math.sqrt(
                    shapeX * shapeX + shapeY * shapeY,
                );

                if (shapeLength > 0.001 && shapeInfluence > 0) {
                    const shapeBlend = clamp(
                        shapeInfluence * EXPLOSION_SHAPE_DIRECTION,
                        0,
                        EXPLOSION_SHAPE_DIRECTION,
                    );
                    dirX = lerp(dirX, shapeX / shapeLength, shapeBlend);
                    dirY = lerp(dirY, shapeY / shapeLength, shapeBlend);
                }

                if (cursorDirectionLength > 0.001) {
                    dirX = lerp(
                        dirX,
                        cursorDirectionX,
                        cursorMotion * EXPLOSION_CURSOR_DIRECTION,
                    );
                    dirY = lerp(
                        dirY,
                        cursorDirectionY,
                        cursorMotion * EXPLOSION_CURSOR_DIRECTION,
                    );
                }

                const jitter = (Math.random() - 0.5) * EXPLOSION_ANGLE_JITTER;
                const cos = Math.cos(jitter);
                const sin = Math.sin(jitter);
                const rotatedX = dirX * cos - dirY * sin;
                const rotatedY = dirX * sin + dirY * cos;
                const rotatedLength =
                    Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY) || 1;
                const falloffByDistance = Math.exp(
                    -distance / (EXPLOSION_FLY_DECAY * uiScale),
                );

                point.blastDistance =
                    (EXPLOSION_FLY_MIN +
                        (EXPLOSION_FLY_MAX - EXPLOSION_FLY_MIN) *
                            falloffByDistance) *
                    uiScale *
                    cursorBoost *
                    (0.75 + Math.random() * 0.5);
                point.blastDirX = rotatedX / rotatedLength;
                point.blastDirY = rotatedY / rotatedLength;
                point.blastHitAt =
                    timestamp +
                    EXPLOSION_WAVE_DURATION *
                        Math.pow(normalized, EXPLOSION_WAVE_CURVE) +
                    Math.random() * 40;
                point.blastRebornAt =
                    timestamp +
                    EXPLOSION_REGROW_START +
                    EXPLOSION_REGROW_SPREAD * Math.pow(normalized, 0.9) +
                    Math.random() * EXPLOSION_REGROW_JITTER;
            }

            octopusField.fill(0);
            explosionActive = true;
            explosionStartAt = timestamp;
            explosionCenterX = centerX;
            explosionCenterY = centerY;
            explosionMaxDistance = maxDistance;

            explosionEndAt =
                timestamp +
                EXPLOSION_REGROW_START +
                EXPLOSION_REGROW_SPREAD +
                EXPLOSION_REGROW_JITTER +
                EXPLOSION_GROW_DURATION +
                120;
            phase = "hidden";
            hiddenUntil = explosionEndAt + EXPLOSION_RETURN_DELAY;
            plan = [];
            escaping = false;
            wasTouchingOctopus = false;
        };

        const drawShockwave = (timestamp: number) => {
            const elapsed = timestamp - explosionStartAt;
            if (elapsed < 0) return;

            if (elapsed < EXPLOSION_FLASH_DURATION) {
                const k = 1 - elapsed / EXPLOSION_FLASH_DURATION;
                const flashRadius = (120 + 220 * (1 - k)) * uiScale;
                const gradient = ctx.createRadialGradient(
                    explosionCenterX,
                    explosionCenterY,
                    0,
                    explosionCenterX,
                    explosionCenterY,
                    flashRadius,
                );
                gradient.addColorStop(
                    0,
                    `rgba(${configRef.current.color}, ${0.4 * k * k})`,
                );
                gradient.addColorStop(1, `rgba(${configRef.current.color}, 0)`);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(
                    explosionCenterX,
                    explosionCenterY,
                    flashRadius,
                    0,
                    Math.PI * 2,
                );
                ctx.fill();
            }

            if (elapsed < EXPLOSION_WAVE_DURATION) {
                const n = elapsed / EXPLOSION_WAVE_DURATION;
                const radius =
                    explosionMaxDistance *
                    Math.pow(n, 1 / EXPLOSION_WAVE_CURVE);
                const width = (60 + 90 * n) * uiScale;
                const inner = Math.max(0, radius - width);
                const outer = radius + width * 0.15;

                if (outer > 1) {
                    const gradient = ctx.createRadialGradient(
                        explosionCenterX,
                        explosionCenterY,
                        inner,
                        explosionCenterX,
                        explosionCenterY,
                        outer,
                    );
                    const alpha = 0.22 * Math.pow(1 - n, 1.5);
                    gradient.addColorStop(
                        0,
                        `rgba(${configRef.current.color}, 0)`,
                    );
                    gradient.addColorStop(
                        0.85,
                        `rgba(${configRef.current.color}, ${alpha})`,
                    );
                    gradient.addColorStop(
                        1,
                        `rgba(${configRef.current.color}, 0)`,
                    );
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(
                        explosionCenterX,
                        explosionCenterY,
                        outer,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                }
            }
        };

        const updateCursorMode = (element: Element | null) => {
            if (isMobile) return;
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

            const nextShadow = shadowValue ?? DEFAULT_SHADOW;
            if (shadowRef.current !== nextShadow) {
                shadowRef.current = nextShadow;
                setShadow(nextShadow);
            }

            if (cursorModeRef.current.target !== mode) {
                cursorModeRef.current.target = mode;
                setCursorMode(CURSOR_MODES[mode] ?? DEFAULT_CURSOR_MODE);
            }
        };

        const handlePointerMove = (event: PointerEvent) => {
            if (isMobile) return;
            targetMouseRef.current.x = event.clientX;
            targetMouseRef.current.y = event.clientY;
            updateCursorMode(event.target as Element | null);
        };

        const handlePointerDown = (event: PointerEvent) => {
            if (isMobile) return;
            clickTargetRef.current = 1;
            updateCursorMode(event.target as Element | null);
        };

        const handlePointerUp = () => {
            if (isMobile) return;
            clickTargetRef.current = 0;
        };

        const handlePointerLeave = () => {
            if (isMobile) return;
            targetMouseRef.current.x = -1000;
            targetMouseRef.current.y = -1000;
            clickTargetRef.current = 0;
            cursorModeRef.current.target = "default";
            cursorColorRef.current = DEFAULT_CURSOR_COLOR;
            shadowRef.current = DEFAULT_SHADOW;

            setCursorMode(DEFAULT_CURSOR_MODE);
            setCursorColor(DEFAULT_CURSOR_COLOR);
            setShadow(DEFAULT_SHADOW);
        };

        // --- Батчинг Отрисовки Оптимизация ---
        const OPACITY_STEPS = 20;
        const opacityBuckets: Point[][] = Array.from(
            { length: OPACITY_STEPS + 1 },
            () => [],
        );
        let colorCacheStr = "";
        let colorCache: string[] = [];

        const render = (timestamp: number) => {
            const cfg = configRef.current;
            const width = window.innerWidth;
            const height = window.innerHeight;
            const mouse = mouseRef.current;
            const target = targetMouseRef.current;

            const previousMouseX = mouse.x;
            const previousMouseY = mouse.y;

            mouse.x += (target.x - mouse.x) * cfg.smoothness;
            mouse.y += (target.y - mouse.y) * cfg.smoothness;

            const cursorDX = mouse.x - previousMouseX;
            const cursorDY = mouse.y - previousMouseY;
            const cursorSpeed = isMobile
                ? 0
                : Math.sqrt(cursorDX * cursorDX + cursorDY * cursorDY);

            const cursorX = isMobile ? -10000 : mouse.x;
            const cursorY = isMobile ? -10000 : mouse.y;

            clickRef.current +=
                (clickTargetRef.current - clickRef.current) * 0.2;
            const click = isMobile ? 0 : clickRef.current;
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

            if (explosionActive && timestamp >= explosionEndAt) {
                explosionActive = false;
                for (const point of pointsRef.current) point.blastHitAt = 0;
            }

            tick++;

            if (
                phase === "hidden" &&
                !explosionActive &&
                timestamp >= hiddenUntil
            ) {
                startScenario(timestamp);
            }

            if (phase === "active") {
                updateOctopus(timestamp, cursorX, cursorY, cursorSpeed);
                updateBlobs();

                if (isOctopusVisible()) {
                    hasAppeared = true;
                } else if (
                    (hasAppeared && stepIndex >= plan.length - 1) ||
                    timestamp - activeStartedAt > OCTOPUS_MAX_ACTIVE
                ) {
                    hideOctopus(timestamp);
                }
            }

            if (phase === "active") {
                accumulateOctopus();
                if (!isMobile) {
                    const touching = isTouchingOctopus(mouse.x, mouse.y);
                    if (touching && !wasTouchingOctopus) {
                        if (Math.random() < OCTOPUS_CATCH_CHANCE) {
                            explodeOctopus(
                                timestamp,
                                cursorDX,
                                cursorDY,
                                cursorSpeed,
                            );
                        } else {
                            wasTouchingOctopus = true;
                        }
                    } else {
                        wasTouchingOctopus = touching;
                    }
                }
            } else {
                octopusField.fill(0);
                wasTouchingOctopus = false;
            }

            ctx.clearRect(0, 0, width, height);
            if (explosionActive) drawShockwave(timestamp);

            if (!isMobile && cursorRef.current) {
                const scale = animation.scale * (1 - click * 0.5);
                cursorRef.current.style.transform = `translate3d(${mouse.x - cfg.cursorDotSize / 2}px, ${mouse.y - cfg.cursorDotSize / 2}px, 0) scale(${scale})`;
                cursorRef.current.style.opacity = `${animation.opacity}`;
            }

            if (!isMobile && circleRef.current) {
                circleRef.current.style.transform = `translate3d(${mouse.x - cfg.cursorRadius}px, ${mouse.y - cfg.cursorRadius}px, 0) scale(${animation.borderScale})`;
                circleRef.current.style.opacity = `${cfg.circleOpacity}`;
                circleRef.current.style.setProperty(
                    "--cursor-circle-opacity",
                    `${animation.circleOpacity}`,
                );
                circleRef.current.style.setProperty(
                    "--cursor-circle-scale",
                    `${animation.circleScale}`,
                );
            }

            const points = pointsRef.current;
            const prePush = EXPLOSION_PRE_PUSH * uiScale;

            // Закешированные статические вычисления для кадров
            const distortionPx = cfg.distortion * uiScale;
            const dotBase = cfg.baseRadius * uiScale;
            const dotMax = cfg.maxRadius * uiScale;
            const pointBaseOpacity = isMobile
                ? Math.max(cfg.baseOpacity, 0.45)
                : cfg.baseOpacity;
            const pointMaxOpacity = isMobile
                ? Math.max(cfg.maxOpacity, 0.75)
                : cfg.maxOpacity;
            const radiusSquared = cfg.cursorRadius * cfg.cursorRadius;
            const falloffSquared = cfg.falloff * cfg.falloff;
            const maxFalloffDistSq = falloffSquared * 16;

            if (colorCacheStr !== cfg.color) {
                colorCacheStr = cfg.color;
                colorCache = Array.from(
                    { length: OPACITY_STEPS + 1 },
                    (_, i) => `rgba(${cfg.color}, ${i / OPACITY_STEPS})`,
                );
            }

            for (let i = 0; i <= OPACITY_STEPS; i++)
                opacityBuckets[i].length = 0;

            for (let index = 0; index < points.length; index++) {
                const point = points[index];
                const dx = point.x - cursorX;
                const dy = point.y - cursorY;
                const distanceSquared = dx * dx + dy * dy;

                let targetX = point.x;
                let targetY = point.y;

                let globalFalloff = 0;
                if (!isMobile && distanceSquared < maxFalloffDistSq) {
                    globalFalloff = Math.exp(
                        -distanceSquared / (2 * falloffSquared),
                    );
                }

                const influence =
                    !isMobile && distanceSquared < radiusSquared
                        ? globalFalloff
                        : 0;
                const distance = Math.sqrt(distanceSquared);

                if (distance > 0.001) {
                    const dirX = dx / distance;
                    const dirY = dy / distance;
                    let displacement = 0;

                    if (influence > 0) {
                        displacement += distortionPx * influence;
                    }

                    if (
                        !isMobile &&
                        (click > 0 || animation.distortion > 0) &&
                        globalFalloff > 0
                    ) {
                        let compression = 0;
                        if (click > 0)
                            compression += distortionPx * globalFalloff * click;
                        if (animation.distortion > 0)
                            compression +=
                                distortionPx *
                                animation.distortion *
                                globalFalloff;
                        displacement -= compression;
                    }

                    targetX += dirX * displacement;
                    targetY += dirY * displacement;
                }

                const fieldOffset = index * 4;
                const octopusInfluence = octopusField[fieldOffset + 3];

                if (octopusInfluence > 0) {
                    const fieldWeight = octopusField[fieldOffset + 2];
                    const octopusDisplacement =
                        (distortionPx * octopusInfluence) /
                        Math.max(0.0001, fieldWeight);
                    targetX += octopusField[fieldOffset] * octopusDisplacement;
                    targetY +=
                        octopusField[fieldOffset + 1] * octopusDisplacement;
                }

                point.currentX +=
                    (targetX - point.currentX) * cfg.jellySmoothness;
                point.currentY +=
                    (targetY - point.currentY) * cfg.jellySmoothness;

                const totalInfluence = Math.max(influence, octopusInfluence);
                let pointRadius = dotBase + (dotMax - dotBase) * totalInfluence;
                let opacity =
                    pointBaseOpacity +
                    (pointMaxOpacity - pointBaseOpacity) * totalInfluence;

                let drawX = point.currentX;
                let drawY = point.currentY;

                if (point.blastHitAt > 0) {
                    const age = timestamp - point.blastHitAt;
                    if (age >= -EXPLOSION_LEAD) {
                        if (age < 0) {
                            const s = 1 + age / EXPLOSION_LEAD;
                            const glow = s * s * (3 - 2 * s);
                            pointRadius = lerp(
                                pointRadius,
                                dotMax * EXPLOSION_FLASH_SIZE,
                                glow,
                            );
                            opacity = lerp(
                                opacity,
                                EXPLOSION_FLASH_OPACITY,
                                glow,
                            );
                            drawX += point.blastDirX * prePush * glow;
                            drawY += point.blastDirY * prePush * glow;
                        } else if (age < EXPLOSION_FLY_DURATION) {
                            const p = age / EXPLOSION_FLY_DURATION;
                            const eased = 1 - Math.pow(1 - p, 3);
                            const travel =
                                prePush +
                                Math.max(0, point.blastDistance - prePush) *
                                    eased;
                            const glow = Math.exp(-p * 5);
                            pointRadius =
                                (dotBase +
                                    (dotMax * EXPLOSION_FLASH_SIZE - dotBase) *
                                        glow) *
                                (1 - 0.55 * p);
                            opacity =
                                (pointBaseOpacity +
                                    (EXPLOSION_FLASH_OPACITY -
                                        pointBaseOpacity) *
                                        glow) *
                                (1 - p * p);
                            drawX += point.blastDirX * travel;
                            drawY += point.blastDirY * travel;
                        } else if (timestamp < point.blastRebornAt) {
                            continue;
                        } else {
                            const growth =
                                (timestamp - point.blastRebornAt) /
                                EXPLOSION_GROW_DURATION;
                            if (growth >= 1) {
                                point.blastHitAt = 0;
                            } else {
                                const s = growth * growth * (3 - 2 * growth);
                                const bloom =
                                    Math.sin(Math.PI * growth) * (1 - growth);
                                pointRadius =
                                    pointRadius * s * (1 + 0.5 * bloom);
                                opacity = Math.min(
                                    1,
                                    opacity * s + 0.6 * bloom,
                                );
                                const drift =
                                    EXPLOSION_REGROW_DRIFT * uiScale * (1 - s);
                                drawX -= point.blastDirX * drift;
                                drawY -= point.blastDirY * drift;
                            }
                        }
                    }
                }

                point.drawX = drawX;
                point.drawY = drawY;
                point.drawR = Math.max(0, pointRadius);

                if (opacity > 0) {
                    const bucketIdx = Math.min(
                        OPACITY_STEPS,
                        Math.max(0, Math.round(opacity * OPACITY_STEPS)),
                    );
                    opacityBuckets[bucketIdx].push(point);
                }
            }

            for (let i = 0; i <= OPACITY_STEPS; i++) {
                const bucket = opacityBuckets[i];
                if (bucket.length === 0) continue;

                ctx.fillStyle = colorCache[i];
                ctx.beginPath();
                for (let j = 0; j < bucket.length; j++) {
                    const p = bucket[j];
                    ctx.moveTo(p.drawX + p.drawR, p.drawY);
                    ctx.arc(p.drawX, p.drawY, p.drawR, 0, Math.PI * 2);
                }
                ctx.fill();
            }

            animationRef.current = requestAnimationFrame(render);
        };

        placeOctopus(-10000, -10000, 0);
        resize();

        animationRef.current = requestAnimationFrame(render);

        window.addEventListener("resize", resize);

        if (!isMobile) {
            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerdown", handlePointerDown);
            window.addEventListener("pointerup", handlePointerUp);
            window.addEventListener("pointerleave", handlePointerLeave);
        }

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointerleave", handlePointerLeave);
        };
    }, [isMobile, mobileScale, gridSize]);

    useEffect(() => {
        document.body.classList.toggle(
            "custom-cursor-active",
            isReady && !isMobile,
        );
        return () => {
            document.body.classList.remove("custom-cursor-active");
        };
    }, [isReady, isMobile]);

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

            {isReady && !isMobile && (
                <>
                    <div
                        ref={circleRef}
                        className="
                            before:content-[''] before:absolute before:left-1/2 before:top-1/2 
                            before:w-[33%] before:h-[33%] before:-translate-x-1/2 before:-translate-y-1/2 
                            before:rounded-full before:border before:border-[var(--cursor-color)] 
                            before:opacity-[var(--cursor-circle-opacity)] before:scale-[var(--cursor-circle-scale)] 
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
                                <span className="absolute flex items-center justify-center text-current">
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
