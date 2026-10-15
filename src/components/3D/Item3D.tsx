import { Center, OrbitControls, useGLTF } from "@react-three/drei";

import { useFrame, useThree } from "@react-three/fiber";

import { useEffect, useMemo, useRef, useState } from "react";

import { createRoot, type Root } from "react-dom/client";

import * as THREE from "three";

import {
    authorIconAnimationConfig,
    type AuthorIconHideAnimation,
    type AuthorIconShowAnimation,
} from "../../FirstBlock/author-icon.config";

import { IconAuthor } from "../../FirstBlock/IconAuthor";

type Props = {
    loading?: (loading: boolean) => void;
    sceneRotationY?: number;
    rotationZ?: number;
    autorotate?: boolean;
    autorotateSpeed?: number;
    returnSpeed?: number;
    htmlPosition?: [number, number, number];
    htmlRotation?: [number, number, number];
    htmlScale?: number;
    htmlPortal?: HTMLDivElement | null;
    path: string;
};

//eslint-disable-next-line
export const authorIconShowAnimations = [
    "snakes",
    "draw",
    "scan",
    "diagonal",
] as const satisfies readonly AuthorIconShowAnimation[];

//eslint-disable-next-line
export const authorIconHideAnimations = [
    "erase",
    "snakes",
    "scatter",
    "collapse",
    "scan",
    "diagonal",
    "fall",
    "implode",
] as const satisfies readonly AuthorIconHideAnimation[];

type AnimationConfig = {
    show: AuthorIconShowAnimation;
    hide: AuthorIconHideAnimation;
};

const getRandomItem = <T,>(items: readonly T[]): T => {
    return items[Math.floor(Math.random() * items.length)]!;
};

const getCompatibleHideAnimation = (
    show: AuthorIconShowAnimation,
): AuthorIconHideAnimation => {
    const strategy = authorIconAnimationConfig.show[show].strategy;

    const compatibleAnimations = authorIconHideAnimations.filter(
        (animation) =>
            authorIconAnimationConfig.hide[animation].strategy === strategy,
    );

    return getRandomItem(compatibleAnimations);
};

const SVG_WIDTH = 155;
const SVG_HEIGHT = 187;

export const Item3D = ({
    sceneRotationY = 0,
    rotationZ = 0,
    autorotate = false,
    autorotateSpeed = 20,
    returnSpeed = 2,
    htmlPosition = [-0.4, 0.2, -0.1],
    htmlRotation = [1.6, 0, Math.PI / 2 + THREE.MathUtils.degToRad(1)],
    htmlScale = 1,
    htmlPortal = null,
    path,
}: Props) => {
    const { scene } = useGLTF(path);
    const { camera, gl } = useThree();

    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    const htmlFront = useMemo(
        () => clonedScene.getObjectByName("HTML_FRONT"),
        [clonedScene],
    );

    const groupRef = useRef<THREE.Group>(null);
    const tiltGroupRef = useRef<THREE.Group>(null);
    //eslint-disable-next-line
    const controlsRef = useRef<any>(null);

    const htmlRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<Root | null>(null);

    const worldPositionRef = useRef(new THREE.Vector3());
    const worldQuaternionRef = useRef(new THREE.Quaternion());
    const worldScaleRef = useRef(new THREE.Vector3());

    const localOffsetRef = useRef(new THREE.Vector3());
    const localQuaternionRef = useRef(new THREE.Quaternion());
    const finalQuaternionRef = useRef(new THREE.Quaternion());

    const xAxisRef = useRef(new THREE.Vector3());
    const yAxisRef = useRef(new THREE.Vector3());

    const centerProjectedRef = useRef(new THREE.Vector3());
    const xProjectedRef = useRef(new THREE.Vector3());
    const yProjectedRef = useRef(new THREE.Vector3());

    const faceNormalRef = useRef(new THREE.Vector3());
    const faceUpRef = useRef(new THREE.Vector3());
    const faceRightRef = useRef(new THREE.Vector3());

    const radialRef = useRef(new THREE.Vector3());
    const tiltAxisRef = useRef(new THREE.Vector3());

    const targetTiltQuaternionRef = useRef(new THREE.Quaternion());

    const currentTiltQuaternionRef = useRef(new THREE.Quaternion());

    const dragStartTiltQuaternionRef = useRef(new THREE.Quaternion());

    const identityQuaternionRef = useRef(new THREE.Quaternion());

    const initialCameraPositionRef = useRef(new THREE.Vector3());

    const initialControlsTargetRef = useRef(new THREE.Vector3());

    const returnStartDirectionRef = useRef(new THREE.Vector3());

    const returnTargetDirectionRef = useRef(new THREE.Vector3());

    const returnCurrentDirectionRef = useRef(new THREE.Vector3());

    const returnQuaternionRef = useRef(new THREE.Quaternion());

    const returnCurrentQuaternionRef = useRef(new THREE.Quaternion());

    const returnCurrentTargetRef = useRef(new THREE.Vector3());

    const returnRadiusRef = useRef(0);

    const autoAngleRef = useRef(0);

    const dragStartAutoAngleRef = useRef(0);

    const returnProgressRef = useRef(0);

    const isUserInteractingRef = useRef(false);
    const isReturnWaitingRef = useRef(false);
    const isReturningRef = useRef(false);

    const returnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const initialControlsSavedRef = useRef(false);

    const [view, setView] = useState(true);

    const [config, setConfig] = useState<AnimationConfig>({
        show: "draw",
        hide: "erase",
    });

    const handleShowEnd = () => {
        setConfig((prev) => ({
            ...prev,
            hide: getCompatibleHideAnimation(prev.show),
        }));

        setView(false);
    };

    const handleHideEnd = () => {
        setConfig((prev) => ({
            ...prev,
            show: getRandomItem(authorIconShowAnimations),
        }));

        setView(true);
    };

    useEffect(() => {
        if (!htmlPortal) {
            return;
        }

        const root = createRoot(htmlPortal);

        rootRef.current = root;

        return () => {
            root.unmount();

            if (rootRef.current === root) {
                rootRef.current = null;
            }
        };
    }, [htmlPortal]);

    useEffect(() => {
        const root = rootRef.current;

        if (!root || !htmlPortal) {
            return;
        }

        root.render(
            <div
                ref={htmlRef}
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: SVG_WIDTH,
                    height: SVG_HEIGHT,
                    pointerEvents: "none",
                    transformOrigin: "0 0",
                    willChange: "transform",
                    display: view ? "block" : "none",
                }}
            >
                <IconAuthor
                    visible={view}
                    show={config.show}
                    hide={config.hide}
                    duration={500}
                    showTrigger={false}
                    onShowEnd={handleShowEnd}
                    onHideEnd={handleHideEnd}
                />
            </div>,
        );
    }, [htmlPortal, view, config.show, config.hide]);

    useEffect(() => {
        const controls = controlsRef.current?.controls || controlsRef.current;

        const tiltGroup = tiltGroupRef.current;

        if (!controls || !tiltGroup) {
            return;
        }

        initialCameraPositionRef.current.copy(controls.object.position);

        initialControlsTargetRef.current.copy(controls.target);

        controls.saveState();

        initialControlsSavedRef.current = true;

        const parent = tiltGroup.parent;

        if (parent) {
            parent.updateMatrixWorld(true);

            const parentQuaternion = parent.getWorldQuaternion(
                new THREE.Quaternion(),
            );

            faceNormalRef.current
                .copy(initialCameraPositionRef.current)
                .sub(initialControlsTargetRef.current)
                .normalize()
                .applyQuaternion(parentQuaternion.clone().invert())
                .normalize();

            faceUpRef.current
                .set(0, 1, 0)
                .applyQuaternion(parentQuaternion.clone().invert());

            faceUpRef.current.addScaledVector(
                faceNormalRef.current,
                -faceUpRef.current.dot(faceNormalRef.current),
            );

            if (faceUpRef.current.lengthSq() < 0.000001) {
                faceUpRef.current
                    .set(1, 0, 0)
                    .addScaledVector(
                        faceNormalRef.current,
                        -faceNormalRef.current.dot(faceNormalRef.current),
                    );
            }

            faceUpRef.current.normalize();

            faceRightRef.current
                .crossVectors(faceNormalRef.current, faceUpRef.current)
                .normalize();
        }

        const handleStart = () => {
            isUserInteractingRef.current = true;
            isReturnWaitingRef.current = false;
            isReturningRef.current = false;
            returnProgressRef.current = 0;

            if (returnTimeoutRef.current) {
                clearTimeout(returnTimeoutRef.current);
                returnTimeoutRef.current = null;
            }

            dragStartAutoAngleRef.current = autoAngleRef.current;

            dragStartTiltQuaternionRef.current.copy(tiltGroup.quaternion);

            currentTiltQuaternionRef.current.copy(tiltGroup.quaternion);

            targetTiltQuaternionRef.current.copy(tiltGroup.quaternion);
        };

        const handleEnd = () => {
            isUserInteractingRef.current = false;
            isReturnWaitingRef.current = true;
            isReturningRef.current = false;
            returnProgressRef.current = 0;

            if (returnTimeoutRef.current) {
                clearTimeout(returnTimeoutRef.current);
            }

            returnTimeoutRef.current = setTimeout(() => {
                if (isUserInteractingRef.current) {
                    isReturnWaitingRef.current = false;
                    returnTimeoutRef.current = null;
                    return;
                }

                isReturnWaitingRef.current = false;

                const currentDirection = returnStartDirectionRef.current
                    .copy(controls.object.position)
                    .sub(controls.target);

                const currentRadius = currentDirection.length();

                if (currentRadius <= 0) {
                    returnTimeoutRef.current = null;
                    return;
                }

                currentDirection.normalize();

                const targetDirection = returnTargetDirectionRef.current
                    .copy(initialCameraPositionRef.current)
                    .sub(initialControlsTargetRef.current);

                const targetRadius = targetDirection.length();

                if (targetRadius <= 0) {
                    returnTimeoutRef.current = null;
                    return;
                }

                targetDirection.normalize();

                returnRadiusRef.current = targetRadius;

                returnCurrentTargetRef.current.copy(controls.target);

                returnQuaternionRef.current.setFromUnitVectors(
                    currentDirection,
                    targetDirection,
                );

                returnCurrentQuaternionRef.current.identity();

                returnProgressRef.current = 0;

                isReturningRef.current = true;

                returnTimeoutRef.current = null;
            }, 2000);
        };

        controls.addEventListener("start", handleStart);
        controls.addEventListener("end", handleEnd);

        return () => {
            controls.removeEventListener("start", handleStart);
            controls.removeEventListener("end", handleEnd);

            if (returnTimeoutRef.current) {
                clearTimeout(returnTimeoutRef.current);
                returnTimeoutRef.current = null;
            }
        };
    }, []);

    useFrame((_, delta) => {
        const controls = controlsRef.current?.controls || controlsRef.current;

        const tiltGroup = tiltGroupRef.current;

        if (!controls || !tiltGroup) {
            return;
        }

        if (
            !isUserInteractingRef.current &&
            !isReturnWaitingRef.current &&
            !isReturningRef.current &&
            autorotate
        ) {
            const speed = Math.max(autorotateSpeed, 0.1) * 0.08;

            autoAngleRef.current += speed * delta;

            const maxTiltRadians = THREE.MathUtils.degToRad(20);

            const angle = autoAngleRef.current;

            radialRef.current
                .copy(faceUpRef.current)
                .multiplyScalar(Math.cos(angle))
                .addScaledVector(faceRightRef.current, Math.sin(angle))
                .normalize();

            tiltAxisRef.current
                .crossVectors(faceNormalRef.current, radialRef.current)
                .normalize();

            targetTiltQuaternionRef.current.setFromAxisAngle(
                tiltAxisRef.current,
                maxTiltRadians,
            );

            const smoothing = 1 - Math.exp(-10 * delta);

            currentTiltQuaternionRef.current.slerp(
                targetTiltQuaternionRef.current,
                smoothing,
            );

            tiltGroup.quaternion.copy(currentTiltQuaternionRef.current);
        }

        if (isUserInteractingRef.current) {
            tiltGroup.quaternion.copy(dragStartTiltQuaternionRef.current);

            currentTiltQuaternionRef.current.copy(
                dragStartTiltQuaternionRef.current,
            );

            targetTiltQuaternionRef.current.copy(
                dragStartTiltQuaternionRef.current,
            );
        }

        if (isReturningRef.current && !isUserInteractingRef.current) {
            returnProgressRef.current += Math.max(returnSpeed, 0.01) * delta;

            const progress = THREE.MathUtils.clamp(
                returnProgressRef.current,
                0,
                1,
            );

            const easedProgress = progress * progress * (3 - 2 * progress);

            returnCurrentTargetRef.current.lerp(
                initialControlsTargetRef.current,
                easedProgress,
            );

            returnCurrentQuaternionRef.current.slerpQuaternions(
                identityQuaternionRef.current,
                returnQuaternionRef.current,
                easedProgress,
            );

            returnCurrentDirectionRef.current
                .copy(returnStartDirectionRef.current)
                .applyQuaternion(returnCurrentQuaternionRef.current)
                .normalize();

            controls.target.copy(returnCurrentTargetRef.current);

            controls.object.position
                .copy(returnCurrentTargetRef.current)
                .add(
                    returnCurrentDirectionRef.current.multiplyScalar(
                        returnRadiusRef.current,
                    ),
                );

            currentTiltQuaternionRef.current.slerpQuaternions(
                dragStartTiltQuaternionRef.current,
                dragStartTiltQuaternionRef.current,
                easedProgress,
            );

            tiltGroup.quaternion.copy(currentTiltQuaternionRef.current);

            controls.update();

            if (progress >= 1) {
                controls.object.position.copy(initialCameraPositionRef.current);

                controls.target.copy(initialControlsTargetRef.current);

                controls.update();

                tiltGroup.quaternion.copy(dragStartTiltQuaternionRef.current);

                currentTiltQuaternionRef.current.copy(
                    dragStartTiltQuaternionRef.current,
                );

                targetTiltQuaternionRef.current.copy(
                    dragStartTiltQuaternionRef.current,
                );

                autoAngleRef.current = dragStartAutoAngleRef.current;

                returnProgressRef.current = 0;

                isReturningRef.current = false;
            }
        }

        const element = htmlRef.current;

        if (!element || !htmlFront || !htmlPortal) {
            return;
        }

        const canvas = gl.domElement;

        const canvasRect = canvas.getBoundingClientRect();

        const portalRect = htmlPortal.getBoundingClientRect();

        htmlFront.updateWorldMatrix(true, false);

        const position = worldPositionRef.current;

        const quaternion = worldQuaternionRef.current;

        const scale = worldScaleRef.current;

        htmlFront.getWorldPosition(position);
        htmlFront.getWorldQuaternion(quaternion);
        htmlFront.getWorldScale(scale);

        localOffsetRef.current
            .set(htmlPosition[0], htmlPosition[1], htmlPosition[2])
            .multiply(scale)
            .applyQuaternion(quaternion);

        position.add(localOffsetRef.current);

        localQuaternionRef.current.setFromEuler(
            new THREE.Euler(htmlRotation[0], htmlRotation[1], htmlRotation[2]),
        );

        finalQuaternionRef.current
            .copy(quaternion)
            .multiply(localQuaternionRef.current);

        const x = xAxisRef.current
            .set(1, 0, 0)
            .applyQuaternion(finalQuaternionRef.current)
            .multiplyScalar(scale.x * htmlScale);

        const y = yAxisRef.current
            .set(0, 1, 0)
            .applyQuaternion(finalQuaternionRef.current)
            .multiplyScalar(scale.y * htmlScale);

        const center = centerProjectedRef.current;

        const projectedX = xProjectedRef.current;

        const projectedY = yProjectedRef.current;

        center.copy(position).project(camera);

        projectedX.copy(position).add(x).project(camera);

        projectedY.copy(position).add(y).project(camera);

        const centerX =
            canvasRect.left -
            portalRect.left +
            (center.x * 0.5 + 0.5) * canvasRect.width;

        const centerY =
            canvasRect.top -
            portalRect.top +
            (-center.y * 0.5 + 0.5) * canvasRect.height;

        const xX =
            canvasRect.left -
            portalRect.left +
            (projectedX.x * 0.5 + 0.5) * canvasRect.width;

        const xY =
            canvasRect.top -
            portalRect.top +
            (-projectedX.y * 0.5 + 0.5) * canvasRect.height;

        const yX =
            canvasRect.left -
            portalRect.left +
            (projectedY.x * 0.5 + 0.5) * canvasRect.width;

        const yY =
            canvasRect.top -
            portalRect.top +
            (-projectedY.y * 0.5 + 0.5) * canvasRect.height;

        const ax = xX - centerX;
        const ay = xY - centerY;
        const bx = yX - centerX;
        const by = yY - centerY;

        const tx = centerX - (ax * SVG_WIDTH) / 2 - (bx * SVG_HEIGHT) / 2;

        const ty = centerY - (ay * SVG_WIDTH) / 2 - (by * SVG_HEIGHT) / 2;

        element.style.display =
            view && center.z > -1 && center.z < 1 ? "block" : "none";

        element.style.transform = `matrix(${ax},${ay},${bx},${by},${tx},${ty})`;
    });

    return (
        <>
            <ambientLight color="#FFFFFF" intensity={0.35} />

            <hemisphereLight groundColor="#333333" intensity={0.8} />

            <directionalLight
                position={[10, 0, 0]}
                color="rgb(186, 207, 219)"
                intensity={5}
            />

            <directionalLight
                position={[-10, 0, 0]}
                color="rgb(106, 119, 125)"
                intensity={11}
            />

            <directionalLight
                position={[10, 10, 10]}
                color="#DDEAFF"
                intensity={1}
            />
            {/* ребра*/}
            <directionalLight
                position={[-10, 10, 10]}
                color="#DDEAFF"
                intensity={1}
            />
            {/* низ спереди*/}
            <directionalLight
                position={[10, -10, 10]}
                color="#DDEAFF"
                intensity={1}
            />
            {/* ребра*/}
            <directionalLight
                position={[-10, -10, 10]}
                color="#DDEAFF"
                intensity={1}
            />
            {/* лицо вправо*/}
            <directionalLight
                position={[10, 10, -10]}
                color="#DDEAFF"
                intensity={0.3}
            />
            {/* зад сверху*/}
            <directionalLight
                position={[-10, 10, -10]}
                color="#DDEAFF"
                intensity={1}
            />
            {/* ребра*/}
            <directionalLight
                position={[10, -10, -10]}
                color="#DDEAFF"
                intensity={1}
            />
            {/*зад слева*/}
            <directionalLight
                position={[-10, -10, -10]}
                color="#DDEAFF"
                intensity={1}
            />

            <group
                ref={groupRef}
                rotation={[
                    0,
                    THREE.MathUtils.degToRad(sceneRotationY),
                    rotationZ,
                ]}
            >
                <group ref={tiltGroupRef}>
                    <Center>
                        <group rotation={[0, 0, Math.PI / 2]}>
                            <primitive object={clonedScene} />
                        </group>
                    </Center>
                </group>
            </group>

            <OrbitControls
                ref={controlsRef}
                autoRotate={false}
                autoRotateSpeed={autorotateSpeed}
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.8}
                makeDefault
            />
        </>
    );
};
