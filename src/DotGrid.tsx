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
    blastX: number;
    blastY: number;
    blastVX: number;
    blastVY: number;
    blastDirX: number;
    blastDirY: number;
    blastImpulse: number;
    blastStartAt: number;
    blastStarted: boolean;
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

const OCTOPUS_MARGIN = 100;
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

const OCTOPUS_CATCH_CHANCE = 0.07;
const OCTOPUS_CATCH_RADIUS = 18;

const EXPLOSION_WAVE_DURATION = 650;
const EXPLOSION_RESPAWN_DELAY = 14500;

const EXPLOSION_MIN_IMPULSE = 7;
const EXPLOSION_IMPULSE_GROWTH = 23;
const EXPLOSION_CURSOR_BOOST = 0.65;
const EXPLOSION_CURSOR_DIRECTION = 0.2;

const EXPLOSION_SHAPE_OFFSET = 1;
const EXPLOSION_SHAPE_DIRECTION = 0.65;

const EXPLOSION_SPRING = 0.008;
const EXPLOSION_DAMPING = 0.94;
const EXPLOSION_POSITION_EPSILON = 0.025;
const EXPLOSION_VELOCITY_EPSILON = 0.025;

const lerp = (current: number, target: number, amount: number) => {
    return current + (target - current) * amount;
};

const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
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
    octopusSpeed = 1.4,
    octopusFleeDistance = 220,
    tentacleCount = 8,
    tentacleSegments = 14,
    tentacleSpacing = 8,
    tentacleWaveAmplitude = 12,
    tentacleWaveLength = 90,
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

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        let cols = 0;
        let rows = 0;

        let octopusField = new Float32Array(0);

        const head = {
            x: 0,
            y: 0,
        };

        const tentacles: { x: number; y: number }[][] = [];
        const blobs: { x: number; y: number; scale: number }[] = [];

        let octopusAngle = Math.random() * Math.PI * 2;
        let octopusCurrentSpeed = octopusSpeed;
        let fan = TENTACLE_FAN_WIDE;
        let wavePhase = 0;
        let pulsePhase = 0;
        let mantleScale = 1;
        let tick = 0;

        let lastFrameTime = 0;
        let explosionActive = false;
        let explosionUntil = 0;
        let wasTouchingOctopus = false;

        const waveNumber = (Math.PI * 2) / tentacleWaveLength;

        const getRestAngle = (index: number) => {
            const step = fan / Math.max(1, tentacleCount - 1);

            return (
                octopusAngle +
                Math.PI +
                (index - (tentacleCount - 1) / 2) * step
            );
        };

        const initOctopus = () => {
            head.x = Math.random() * window.innerWidth;
            head.y = Math.random() * window.innerHeight;

            tentacles.length = 0;
            blobs.length = 0;

            octopusAngle = Math.random() * Math.PI * 2;
            octopusCurrentSpeed = octopusSpeed;
            fan = TENTACLE_FAN_WIDE;
            wavePhase = 0;
            pulsePhase = 0;
            mantleScale = 1;

            for (let k = 0; k < tentacleCount; k++) {
                const restAngle = getRestAngle(k);
                const spine: { x: number; y: number }[] = [];

                for (let i = 0; i < tentacleSegments; i++) {
                    const distance = TENTACLE_ROOT_OFFSET + i * tentacleSpacing;

                    spine.push({
                        x: head.x + Math.cos(restAngle) * distance,
                        y: head.y + Math.sin(restAngle) * distance,
                    });
                }

                tentacles.push(spine);
            }

            const blobCount =
                MANTLE_BLOBS.length + tentacleCount * tentacleSegments;

            for (let i = 0; i < blobCount; i++) {
                blobs.push({
                    x: 0,
                    y: 0,
                    scale: 0,
                });
            }
        };

        const createPoints = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            cols = Math.floor(width / gridSize) + 1;
            rows = Math.floor(height / gridSize) + 1;

            const points: Point[] = [];

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * gridSize;
                    const y = row * gridSize;

                    points.push({
                        x,
                        y,
                        currentX: x,
                        currentY: y,
                        blastX: 0,
                        blastY: 0,
                        blastVX: 0,
                        blastVY: 0,
                        blastDirX: 0,
                        blastDirY: 0,
                        blastImpulse: 0,
                        blastStartAt: 0,
                        blastStarted: false,
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

        const updateOctopus = (
            mouseX: number,
            mouseY: number,
            cursorSpeed: number,
        ) => {
            const width = window.innerWidth;
            const height = window.innerHeight;

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

            const fleeing = nearestSquared < octopusFleeDistance ** 2;

            let dirX: number;
            let dirY: number;

            if (fleeing) {
                const awayX = head.x - mouseX;
                const awayY = head.y - mouseY;
                const awayLength = Math.hypot(awayX, awayY) || 1;

                dirX = awayX / awayLength;
                dirY = awayY / awayLength;
            } else {
                const wander =
                    (Math.sin(tick * 0.011) + Math.sin(tick * 0.0173 + 2)) *
                    0.02;

                dirX = Math.cos(octopusAngle + wander);
                dirY = Math.sin(octopusAngle + wander);
            }

            if (head.x < -OCTOPUS_MARGIN) {
                dirX += 2;
            } else if (head.x > width + OCTOPUS_MARGIN) {
                dirX -= 2;
            }

            if (head.y < -OCTOPUS_MARGIN) {
                dirY += 2;
            } else if (head.y > height + OCTOPUS_MARGIN) {
                dirY -= 2;
            }

            const targetAngle = Math.atan2(dirY, dirX);

            const diff = Math.atan2(
                Math.sin(targetAngle - octopusAngle),
                Math.cos(targetAngle - octopusAngle),
            );

            const maxTurn = fleeing ? 0.15 : 0.05;

            octopusAngle += clamp(diff, -maxTurn, maxTurn);

            const targetSpeed = fleeing
                ? Math.max(
                      octopusSpeed,
                      Math.min(cursorSpeed, OCTOPUS_MAX_SPEED),
                  )
                : octopusSpeed;

            octopusCurrentSpeed = lerp(octopusCurrentSpeed, targetSpeed, 0.2);

            pulsePhase += 0.05 + octopusCurrentSpeed * 0.02;

            const pulse = Math.sin(pulsePhase);

            const moveSpeed = octopusCurrentSpeed * (1 + JET_STRENGTH * pulse);

            mantleScale = 1 - MANTLE_SQUEEZE * pulse;

            head.x += Math.cos(octopusAngle) * moveSpeed;
            head.y += Math.sin(octopusAngle) * moveSpeed;

            wavePhase +=
                octopusCurrentSpeed * waveNumber * TENTACLE_WAVE_SPEED_RATIO +
                TENTACLE_WAVE_IDLE_SPEED;

            const fanTarget = lerp(
                TENTACLE_FAN_WIDE,
                TENTACLE_FAN_NARROW,
                Math.min(1, octopusCurrentSpeed / TENTACLE_FAN_SPEED),
            );

            fan = lerp(fan, fanTarget, 0.05);

            for (let k = 0; k < tentacles.length; k++) {
                const spine = tentacles[k];

                const restAngle = getRestAngle(k);
                const restX = Math.cos(restAngle);
                const restY = Math.sin(restAngle);

                spine[0].x = head.x + restX * TENTACLE_ROOT_OFFSET;

                spine[0].y = head.y + restY * TENTACLE_ROOT_OFFSET;

                for (let i = 1; i < spine.length; i++) {
                    const previous = spine[i - 1];
                    const segment = spine[i];

                    segment.x +=
                        (previous.x + restX * tentacleSpacing - segment.x) *
                        TENTACLE_STIFFNESS;

                    segment.y +=
                        (previous.y + restY * tentacleSpacing - segment.y) *
                        TENTACLE_STIFFNESS;

                    const dx = segment.x - previous.x;
                    const dy = segment.y - previous.y;
                    const length = Math.hypot(dx, dy) || 1;

                    segment.x = previous.x + (dx / length) * tentacleSpacing;

                    segment.y = previous.y + (dy / length) * tentacleSpacing;
                }
            }
        };

        const updateBlobs = () => {
            const forwardX = Math.cos(octopusAngle);
            const forwardY = Math.sin(octopusAngle);

            let blobIndex = 0;

            for (const mantle of MANTLE_BLOBS) {
                const blob = blobs[blobIndex++];

                blob.x = head.x + forwardX * mantle.offset;
                blob.y = head.y + forwardY * mantle.offset;
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

                    const tangentLength = Math.hypot(tangentX, tangentY) || 1;

                    tangentX /= tangentLength;
                    tangentY /= tangentLength;

                    const ramp = count > 1 ? i / (count - 1) : 0;

                    const offset =
                        tentacleWaveAmplitude *
                        ramp *
                        Math.sin(
                            wavePhase -
                                i * tentacleSpacing * waveNumber +
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
            octopusField.fill(0);

            const points = pointsRef.current;

            for (const blob of blobs) {
                const blobRadius = cursorRadius * blob.scale;

                if (blobRadius <= 0) {
                    continue;
                }

                const blobRadiusSquared = blobRadius * blobRadius;
                const blobFalloff = Math.max(1, falloff * blob.scale);

                const twoFalloffSquared = 2 * blobFalloff * blobFalloff;

                const colMin = Math.max(
                    0,
                    Math.ceil((blob.x - blobRadius) / gridSize),
                );

                const colMax = Math.min(
                    cols - 1,
                    Math.floor((blob.x + blobRadius) / gridSize),
                );

                const rowMin = Math.max(
                    0,
                    Math.ceil((blob.y - blobRadius) / gridSize),
                );

                const rowMax = Math.min(
                    rows - 1,
                    Math.floor((blob.y + blobRadius) / gridSize),
                );

                for (let row = rowMin; row <= rowMax; row++) {
                    for (let col = colMin; col <= colMax; col++) {
                        const index = row * cols + col;
                        const point = points[index];

                        if (!point) {
                            continue;
                        }

                        const dx = point.x - blob.x;
                        const dy = point.y - blob.y;

                        const distanceSquared = dx * dx + dy * dy;

                        if (distanceSquared >= blobRadiusSquared) {
                            continue;
                        }

                        const distance = Math.sqrt(distanceSquared);

                        if (distance < 0.001) {
                            continue;
                        }

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
            const headDX = head.x - x;
            const headDY = head.y - y;

            if (
                headDX * headDX + headDY * headDY <=
                OCTOPUS_CATCH_RADIUS * OCTOPUS_CATCH_RADIUS
            ) {
                return true;
            }

            for (const blob of blobs) {
                const dx = blob.x - x;
                const dy = blob.y - y;

                const hitRadius = Math.max(
                    OCTOPUS_CATCH_RADIUS * 0.65,
                    cursorRadius * blob.scale * 0.3,
                );

                if (dx * dx + dy * dy <= hitRadius * hitRadius) {
                    return true;
                }
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
                Math.hypot(centerX, centerY),
                Math.hypot(width - centerX, centerY),
                Math.hypot(centerX, height - centerY),
                Math.hypot(width - centerX, height - centerY),
            );

            const safeMaxDistance = Math.max(1, maxDistance);

            const cursorDirectionLength = Math.hypot(cursorDX, cursorDY) || 0;

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

                const distance = Math.hypot(dx, dy);
                const normalizedDistance = clamp(
                    distance / safeMaxDistance,
                    0,
                    1,
                );

                let dirX =
                    distance > 0.001 ? dx / distance : Math.cos(octopusAngle);

                let dirY =
                    distance > 0.001 ? dy / distance : Math.sin(octopusAngle);

                const fieldOffset = index * 4;

                const shapeX = octopusField[fieldOffset];
                const shapeY = octopusField[fieldOffset + 1];
                const shapeWeight = octopusField[fieldOffset + 2];
                const shapeInfluence = octopusField[fieldOffset + 3];

                let shapeOffsetX = 0;
                let shapeOffsetY = 0;

                if (shapeWeight > 0.0001 && shapeInfluence > 0) {
                    const shapeScale =
                        ((distortion * shapeInfluence) / shapeWeight) *
                        EXPLOSION_SHAPE_OFFSET;

                    shapeOffsetX = shapeX * shapeScale;
                    shapeOffsetY = shapeY * shapeScale;
                }

                const shapeLength = Math.hypot(shapeX, shapeY);

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

                const directionLength = Math.hypot(dirX, dirY) || 1;

                dirX /= directionLength;
                dirY /= directionLength;

                const impulse =
                    (EXPLOSION_MIN_IMPULSE +
                        normalizedDistance * EXPLOSION_IMPULSE_GROWTH) *
                    cursorBoost;

                point.blastX = shapeOffsetX;
                point.blastY = shapeOffsetY;

                point.blastVX = 0;
                point.blastVY = 0;

                point.blastDirX = dirX;
                point.blastDirY = dirY;
                point.blastImpulse = impulse;

                point.blastStartAt =
                    timestamp + normalizedDistance * EXPLOSION_WAVE_DURATION;

                point.blastStarted = false;
            }

            octopusField.fill(0);

            explosionActive = true;
            explosionUntil = timestamp + EXPLOSION_RESPAWN_DELAY;
            wasTouchingOctopus = true;
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
            shadowRef.current = DEFAULT_SHADOW;

            setCursorMode(DEFAULT_CURSOR_MODE);
            setCursorColor(DEFAULT_CURSOR_COLOR);
            setShadow(DEFAULT_SHADOW);
        };

        const render = (timestamp: number) => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const frameScale = lastFrameTime
                ? Math.min((timestamp - lastFrameTime) / (1000 / 60), 2)
                : 1;

            lastFrameTime = timestamp;

            const mouse = mouseRef.current;
            const target = targetMouseRef.current;

            const previousMouseX = mouse.x;
            const previousMouseY = mouse.y;

            mouse.x += (target.x - mouse.x) * smoothness;
            mouse.y += (target.y - mouse.y) * smoothness;

            const cursorDX = mouse.x - previousMouseX;
            const cursorDY = mouse.y - previousMouseY;

            const cursorSpeed = Math.hypot(cursorDX, cursorDY);

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

            if (explosionActive && timestamp >= explosionUntil) {
                explosionActive = false;
                explosionUntil = 0;

                initOctopus();
                updateBlobs();

                wasTouchingOctopus = isTouchingOctopus(mouse.x, mouse.y);
            }

            tick++;

            if (!explosionActive) {
                updateOctopus(mouse.x, mouse.y, cursorSpeed);
                updateBlobs();
                accumulateOctopus();

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
            } else {
                octopusField.fill(0);
            }

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
            const points = pointsRef.current;

            const damping = Math.pow(EXPLOSION_DAMPING, frameScale);

            for (let index = 0; index < points.length; index++) {
                const point = points[index];

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

                const fieldOffset = index * 4;

                const octopusInfluence = octopusField[fieldOffset + 3];

                if (octopusInfluence > 0) {
                    const fieldWeight = octopusField[fieldOffset + 2];

                    const octopusDisplacement =
                        (distortion * octopusInfluence) /
                        Math.max(0.0001, fieldWeight);

                    targetX += octopusField[fieldOffset] * octopusDisplacement;

                    targetY +=
                        octopusField[fieldOffset + 1] * octopusDisplacement;
                }

                point.currentX += (targetX - point.currentX) * jellySmoothness;

                point.currentY += (targetY - point.currentY) * jellySmoothness;

                if (
                    !point.blastStarted &&
                    point.blastStartAt > 0 &&
                    timestamp >= point.blastStartAt
                ) {
                    point.blastStarted = true;

                    point.blastVX = point.blastDirX * point.blastImpulse;

                    point.blastVY = point.blastDirY * point.blastImpulse;
                }

                if (point.blastStarted) {
                    point.blastVX +=
                        -point.blastX * EXPLOSION_SPRING * frameScale;

                    point.blastVY +=
                        -point.blastY * EXPLOSION_SPRING * frameScale;

                    point.blastVX *= damping;
                    point.blastVY *= damping;

                    point.blastX += point.blastVX * frameScale;

                    point.blastY += point.blastVY * frameScale;

                    if (
                        Math.abs(point.blastX) < EXPLOSION_POSITION_EPSILON &&
                        Math.abs(point.blastY) < EXPLOSION_POSITION_EPSILON &&
                        Math.abs(point.blastVX) < EXPLOSION_VELOCITY_EPSILON &&
                        Math.abs(point.blastVY) < EXPLOSION_VELOCITY_EPSILON
                    ) {
                        point.blastX = 0;
                        point.blastY = 0;
                        point.blastVX = 0;
                        point.blastVY = 0;

                        point.blastDirX = 0;
                        point.blastDirY = 0;
                        point.blastImpulse = 0;
                        point.blastStartAt = 0;
                        point.blastStarted = false;
                    }
                }

                const blastDisplacement = Math.hypot(
                    point.blastX,
                    point.blastY,
                );

                const blastInfluence = Math.min(1, blastDisplacement / 45);

                const totalInfluence = Math.max(
                    influence,
                    octopusInfluence,
                    blastInfluence,
                );

                const pointRadius =
                    baseRadius + (maxRadius - baseRadius) * totalInfluence;

                const opacity =
                    baseOpacity + (maxOpacity - baseOpacity) * totalInfluence;

                ctx.beginPath();

                ctx.arc(
                    point.currentX + point.blastX,
                    point.currentY + point.blastY,
                    pointRadius,
                    0,
                    Math.PI * 2,
                );

                ctx.fillStyle = `rgba(${color}, ${opacity})`;
                ctx.fill();
            }

            animationRef.current = requestAnimationFrame(render);
        };

        initOctopus();
        resize();

        animationRef.current = requestAnimationFrame(render);

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
        octopusSpeed,
        octopusFleeDistance,
        tentacleCount,
        tentacleSegments,
        tentacleSpacing,
        tentacleWaveAmplitude,
        tentacleWaveLength,
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
