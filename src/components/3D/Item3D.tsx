import { Center, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type InteractionRef = {
    current: {
        paused: boolean;
    };
};

type Props = {
    sceneRotationY?: number;
    rotationZ?: number;
    autorotate?: boolean;
    autorotateSpeed?: number;
    path: string;
    interactionRef: InteractionRef;
};

const MAX_TILT_ANGLE = THREE.MathUtils.degToRad(20);

export const Item3D = ({
    sceneRotationY = 0,
    rotationZ = 0,
    autorotate = false,
    autorotateSpeed = 20,
    path,
    interactionRef,
}: Props) => {
    const { scene } = useGLTF(path);
    const camera = useThree((state) => state.camera);

    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    const tiltGroupRef = useRef<THREE.Group>(null);

    const faceNormalRef = useRef(new THREE.Vector3());
    const faceUpRef = useRef(new THREE.Vector3());
    const faceRightRef = useRef(new THREE.Vector3());

    const radialRef = useRef(new THREE.Vector3());
    const tiltAxisRef = useRef(new THREE.Vector3());

    const targetTiltQuaternionRef = useRef(new THREE.Quaternion());
    const currentTiltQuaternionRef = useRef(new THREE.Quaternion());

    const dragStartTiltQuaternionRef = useRef(new THREE.Quaternion());
    const dragStartAutoAngleRef = useRef(0);

    const autoAngleRef = useRef(0);
    const isInitializedRef = useRef(false);
    const wasPausedRef = useRef(false);

    useEffect(() => {
        const tiltGroup = tiltGroupRef.current;

        if (!tiltGroup) {
            return;
        }

        const parent = tiltGroup.parent;

        if (!parent) {
            return;
        }

        parent.updateMatrixWorld(true);

        const inverseParentQuaternion = parent
            .getWorldQuaternion(new THREE.Quaternion())
            .invert();

        faceNormalRef.current
            .copy(camera.position)
            .normalize()
            .applyQuaternion(inverseParentQuaternion)
            .normalize();

        faceUpRef.current.set(0, 1, 0).applyQuaternion(inverseParentQuaternion);

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

        currentTiltQuaternionRef.current.copy(tiltGroup.quaternion);
        targetTiltQuaternionRef.current.copy(tiltGroup.quaternion);
        dragStartTiltQuaternionRef.current.copy(tiltGroup.quaternion);

        isInitializedRef.current = true;
    }, [camera, clonedScene]);

    useFrame((_, delta) => {
        const tiltGroup = tiltGroupRef.current;

        if (!tiltGroup || !isInitializedRef.current) {
            return;
        }

        if (interactionRef.current.paused) {
            if (!wasPausedRef.current) {
                wasPausedRef.current = true;

                dragStartAutoAngleRef.current = autoAngleRef.current;

                dragStartTiltQuaternionRef.current.copy(tiltGroup.quaternion);
            }

            tiltGroup.quaternion.copy(dragStartTiltQuaternionRef.current);

            currentTiltQuaternionRef.current.copy(
                dragStartTiltQuaternionRef.current,
            );

            targetTiltQuaternionRef.current.copy(
                dragStartTiltQuaternionRef.current,
            );

            return;
        }

        if (wasPausedRef.current) {
            autoAngleRef.current = dragStartAutoAngleRef.current;

            tiltGroup.quaternion.copy(dragStartTiltQuaternionRef.current);

            currentTiltQuaternionRef.current.copy(
                dragStartTiltQuaternionRef.current,
            );

            targetTiltQuaternionRef.current.copy(
                dragStartTiltQuaternionRef.current,
            );

            wasPausedRef.current = false;
        }

        if (!autorotate) {
            return;
        }

        const speed = Math.max(autorotateSpeed, 0.1) * 0.08;

        autoAngleRef.current += speed * delta;

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
            MAX_TILT_ANGLE,
        );

        const smoothing = 1 - Math.exp(-10 * delta);

        currentTiltQuaternionRef.current.slerp(
            targetTiltQuaternionRef.current,
            smoothing,
        );

        tiltGroup.quaternion.copy(currentTiltQuaternionRef.current);
    });

    return (
        <>
            {/* Общий свет — сохраняет видимость тёмных участков */}
            <ambientLight color="#FFFFFF" intensity={0.45} />

            {/* Мягкое заполнение — смягчает перепады между верхом и низом */}
            <hemisphereLight
                color="#FFFFFF"
                groundColor="#333333"
                intensity={0.8}
            />

            {/* Основной свет спереди — теперь не так сильно засвечивает лицо */}
            <directionalLight
                position={[10, 0, 0]}
                color="rgb(186, 207, 219)"
                intensity={2.2}
            />

            {/* Противоположный свет — уменьшает резкий блик при развороте */}
            <directionalLight
                position={[-10, 0, 0]}
                color="rgb(106, 119, 125)"
                intensity={3.5}
            />

            {/* Переднее верхнее ребро */}
            <directionalLight
                position={[10, 10, 10]}
                color="#DDEAFF"
                intensity={0.5}
            />

            {/* Заднее верхнее ребро */}
            <directionalLight
                position={[-10, 10, 10]}
                color="#DDEAFF"
                intensity={0.5}
            />

            {/* Нижняя передняя грань */}
            <directionalLight
                position={[10, -10, 10]}
                color="#DDEAFF"
                intensity={0.5}
            />

            {/* Нижнее заднее ребро */}
            <directionalLight
                position={[-10, -10, 10]}
                color="#DDEAFF"
                intensity={0.5}
            />

            {/* Передняя грань с правой стороны */}
            <directionalLight
                position={[10, 10, -10]}
                color="#DDEAFF"
                intensity={0.2}
            />

            {/* Верхняя задняя грань */}
            <directionalLight
                position={[-10, 10, -10]}
                color="#DDEAFF"
                intensity={0.5}
            />

            {/* Нижнее боковое ребро */}
            <directionalLight
                position={[10, -10, -10]}
                color="#DDEAFF"
                intensity={0.5}
            />

            {/* Задняя левая грань */}
            <directionalLight
                position={[-10, -10, -10]}
                color="#DDEAFF"
                intensity={0.5}
            />

            <group
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
        </>
    );
};
