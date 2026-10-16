import { OrbitControls, PerspectiveCamera, View } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { useDevice } from "../../scroll/useDevice";

import { Asset } from "../../shared/AssetLoader/Asset";
import { AssetReady } from "../../shared/AssetLoader/AssetReady";
import { Item3D } from "./Item3D";
import { ThreeInteractionContext } from "./ThreeInteractionContext";

type ThreeModelViewProps = {
    assetName: string;
    path: string;
    rotationZ?: number;
    sceneRotationY?: number;
    autorotate?: boolean;
    autorotateSpeed?: number;
    returnSpeed?: number;
    camera: {
        position: [number, number, number];
        fov: number;
    };
};

type InteractionRef = {
    current: {
        paused: boolean;
    };
};

type ViewControlsProps = {
    domElement: HTMLElement;
    interactionRef: InteractionRef;
    returnSpeed: number;
};

const INITIAL_TARGET = new THREE.Vector3(0, 0, 0);

const ViewControls = ({
    domElement,
    interactionRef,
    returnSpeed,
}: ViewControlsProps) => {
    const { isDesktop } = useDevice();
    const camera = useThree((state) => state.camera);

    const controlsRef = useRef<OrbitControlsImpl | null>(null);

    const initialPositionRef = useRef(new THREE.Vector3());
    const initialTargetRef = useRef(new THREE.Vector3());

    const startTargetRef = useRef(new THREE.Vector3());
    const startDirectionRef = useRef(new THREE.Vector3());
    const targetDirectionRef = useRef(new THREE.Vector3());
    const currentDirectionRef = useRef(new THREE.Vector3());

    const returnQuaternionRef = useRef(new THREE.Quaternion());
    const currentQuaternionRef = useRef(new THREE.Quaternion());
    const identityQuaternionRef = useRef(new THREE.Quaternion());

    const returnRadiusRef = useRef(0);
    const returnProgressRef = useRef(0);
    const returningRef = useRef(false);

    const returnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const controls = controlsRef.current;

        if (!controls) {
            return;
        }

        controls.target.copy(INITIAL_TARGET);
        controls.update();
        controls.saveState();

        initialPositionRef.current.copy(camera.position);
        initialTargetRef.current.copy(controls.target);

        return () => {
            if (returnTimeoutRef.current) {
                clearTimeout(returnTimeoutRef.current);
                returnTimeoutRef.current = null;
            }
        };
    }, [camera, domElement]);

    const handleStart = useCallback(() => {
        if (returnTimeoutRef.current) {
            clearTimeout(returnTimeoutRef.current);
            returnTimeoutRef.current = null;
        }

        returningRef.current = false;
        interactionRef.current.paused = true;
    }, [interactionRef]);

    const handleEnd = useCallback(() => {
        interactionRef.current.paused = true;

        if (returnTimeoutRef.current) {
            clearTimeout(returnTimeoutRef.current);
        }

        returnTimeoutRef.current = setTimeout(() => {
            returnTimeoutRef.current = null;

            const controls = controlsRef.current;

            if (!controls) {
                returningRef.current = false;
                interactionRef.current.paused = false;
                return;
            }

            startTargetRef.current.copy(controls.target);

            const startDirection = startDirectionRef.current
                .copy(camera.position)
                .sub(controls.target);

            const currentRadius = startDirection.length();

            if (currentRadius <= 0) {
                returningRef.current = false;
                interactionRef.current.paused = false;
                return;
            }

            startDirection.normalize();

            const targetDirection = targetDirectionRef.current
                .copy(initialPositionRef.current)
                .sub(initialTargetRef.current);

            if (targetDirection.lengthSq() <= 0) {
                returningRef.current = false;
                interactionRef.current.paused = false;
                return;
            }

            targetDirection.normalize();

            returnRadiusRef.current = currentRadius;

            returnQuaternionRef.current.setFromUnitVectors(
                startDirection,
                targetDirection,
            );

            currentQuaternionRef.current.identity();

            returnProgressRef.current = 0;
            returningRef.current = true;
        }, 2000);
    }, [camera, interactionRef]);

    useFrame((_, delta) => {
        if (!returningRef.current) {
            return;
        }

        const controls = controlsRef.current;

        if (!controls) {
            returningRef.current = false;
            interactionRef.current.paused = false;
            return;
        }

        returnProgressRef.current = Math.min(
            returnProgressRef.current + Math.max(returnSpeed, 0.01) * delta,
            1,
        );

        const progress = returnProgressRef.current;
        const eased = progress * progress * (3 - 2 * progress);

        currentQuaternionRef.current.slerpQuaternions(
            identityQuaternionRef.current,
            returnQuaternionRef.current,
            eased,
        );

        currentDirectionRef.current
            .copy(startDirectionRef.current)
            .applyQuaternion(currentQuaternionRef.current)
            .normalize();

        controls.target.lerpVectors(
            startTargetRef.current,
            initialTargetRef.current,
            eased,
        );

        camera.position
            .copy(controls.target)
            .addScaledVector(
                currentDirectionRef.current,
                returnRadiusRef.current,
            );

        controls.update();

        if (progress >= 1) {
            camera.position.copy(initialPositionRef.current);
            controls.target.copy(initialTargetRef.current);
            controls.update();

            returningRef.current = false;
            interactionRef.current.paused = false;
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            camera={camera}
            domElement={domElement}
            enabled={isDesktop}
            enableDamping
            dampingFactor={0.08}
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.8}
            autoRotate={false}
            onStart={handleStart}
            onEnd={handleEnd}
        />
    );
};

export const ThreeModelView = ({
    assetName,
    path,
    rotationZ = 0,
    sceneRotationY = 0,
    autorotate = false,
    autorotateSpeed = 20,
    returnSpeed = 1,
    camera,
}: ThreeModelViewProps) => {
    const [viewElement, setViewElement] = useState<HTMLElement | null>(null);

    const interactionRef = useRef({
        paused: false,
    });

    const handleViewRef = useCallback(
        (node: HTMLElement | THREE.Group | null) => {
            setViewElement(node instanceof HTMLElement ? node : null);
        },
        [],
    );

    return (
        <ThreeInteractionContext.Provider value={interactionRef}>
            <View
                ref={handleViewRef}
                className="three-canvas relative h-full w-full overflow-visible rounded-full"
            >
                <PerspectiveCamera
                    makeDefault
                    position={camera.position}
                    fov={camera.fov}
                    near={0.1}
                    far={1000}
                />

                {viewElement && (
                    <ViewControls
                        domElement={viewElement}
                        interactionRef={interactionRef}
                        returnSpeed={returnSpeed}
                    />
                )}

                <Asset name={assetName}>
                    <Suspense fallback={null}>
                        <Item3D
                            path={path}
                            rotationZ={rotationZ}
                            sceneRotationY={sceneRotationY}
                            autorotate={autorotate}
                            autorotateSpeed={autorotateSpeed}
                            interactionRef={interactionRef}
                        />

                        <AssetReady name={assetName} />
                    </Suspense>
                </Asset>
            </View>
        </ThreeInteractionContext.Provider>
    );
};
