import { useFrame, useThree } from "@react-three/fiber";

import { createRoot, type Root } from "react-dom/client";

import { useLayoutEffect, useRef } from "react";

import type { CSSProperties, ReactNode } from "react";

import * as THREE from "three";

type Props = {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    pointerEvents?: CSSProperties["pointerEvents"];
};

type DomState = {
    outer: HTMLDivElement;
    inner: HTMLDivElement;
    content: HTMLDivElement;
};

const clamp = (value: number, min: number, max: number) => {
    return Math.min(max, Math.max(min, value));
};

const quaternionToCssRotation = (quaternion: THREE.Quaternion) => {
    const w = clamp(quaternion.w, -1, 1);

    const angle = 2 * Math.acos(w);

    const sinHalf = Math.sqrt(Math.max(0, 1 - w * w));

    if (sinHalf < 0.000001) {
        return "rotate3d(1,0,0,0rad)";
    }

    const x = quaternion.x / sinHalf;

    const y = quaternion.y / sinHalf;

    const z = quaternion.z / sinHalf;

    return `rotate3d(${x},${y},${z},${angle}rad)`;
};

export const StableHtml = ({
    children,
    className,
    style,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    pointerEvents = "auto",
}: Props) => {
    const { gl, camera, size } = useThree();

    const groupRef = useRef<THREE.Group>(null);

    const domRef = useRef<DomState | null>(null);

    const rootRef = useRef<Root | null>(null);

    const cameraMatrixRef = useRef(new THREE.Matrix4());

    const cameraPositionRef = useRef(new THREE.Vector3());

    const cameraQuaternionRef = useRef(new THREE.Quaternion());

    const cameraScaleRef = useRef(new THREE.Vector3());

    const objectPositionRef = useRef(new THREE.Vector3());

    const objectQuaternionRef = useRef(new THREE.Quaternion());

    const objectScaleRef = useRef(new THREE.Vector3());

    useLayoutEffect(() => {
        const target = gl.domElement.parentElement;

        if (!target) {
            return;
        }

        const outer = document.createElement("div");

        const inner = document.createElement("div");

        const content = document.createElement("div");

        outer.style.position = "absolute";

        outer.style.top = "0";
        outer.style.left = "0";
        outer.style.pointerEvents = "none";
        outer.style.overflow = "visible";
        outer.style.transformStyle = "preserve-3d";
        outer.style.transformOrigin = "0 0";

        inner.style.position = "absolute";

        inner.style.top = "0";
        inner.style.left = "0";
        inner.style.transformStyle = "preserve-3d";
        inner.style.transformOrigin = "0 0";

        content.style.position = "absolute";

        content.style.top = "0";
        content.style.left = "0";
        content.style.transformOrigin = "0 0";

        inner.appendChild(content);
        outer.appendChild(inner);
        target.appendChild(outer);

        const root = createRoot(content);

        domRef.current = {
            outer,
            inner,
            content,
        };

        rootRef.current = root;

        return () => {
            root.unmount();

            if (outer.parentNode === target) {
                target.removeChild(outer);
            }

            rootRef.current = null;
            domRef.current = null;
        };
    }, [gl]);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root) {
            return;
        }

        root.render(
            <div
                className={className}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transformOrigin: "0 0",
                    pointerEvents,
                    ...style,
                }}
            >
                {children}
            </div>,
        );
    }, [children, className, pointerEvents, style]);

    useFrame(() => {
        const dom = domRef.current;

        const group = groupRef.current;

        if (!dom || !group) {
            return;
        }

        camera.updateMatrixWorld();

        group.updateWorldMatrix(true, false);

        const widthHalf = size.width / 2;

        const heightHalf = size.height / 2;

        const projectionElement = camera.projectionMatrix.elements[5];

        const fov = projectionElement * heightHalf;

        dom.outer.style.width = `${size.width}px`;

        dom.outer.style.height = `${size.height}px`;

        dom.outer.style.perspective = `${fov}px`;

        const cameraMatrix = cameraMatrixRef.current;

        cameraMatrix.copy(camera.matrixWorldInverse);

        const cameraElements = cameraMatrix.elements;

        cameraElements[1] *= -1;
        cameraElements[5] *= -1;
        cameraElements[9] *= -1;
        cameraElements[13] *= -1;

        cameraMatrix.decompose(
            cameraPositionRef.current,
            cameraQuaternionRef.current,
            cameraScaleRef.current,
        );

        const cameraPosition = cameraPositionRef.current;

        const cameraRotation = quaternionToCssRotation(
            cameraQuaternionRef.current,
        );

        const cameraScale = cameraScaleRef.current;

        dom.outer.style.transform = [
            `translateZ(${fov}px)`,
            `translate3d(${cameraPosition.x}px,${cameraPosition.y}px,${cameraPosition.z}px)`,
            cameraRotation,
            `scale3d(${cameraScale.x},${cameraScale.y},${cameraScale.z})`,
            `translate3d(${widthHalf}px,${heightHalf}px,0)`,
        ].join(" ");

        const objectPosition = objectPositionRef.current;

        const objectQuaternion = objectQuaternionRef.current;

        const objectScale = objectScaleRef.current;

        group.getWorldPosition(objectPosition);

        group.getWorldQuaternion(objectQuaternion);

        group.getWorldScale(objectScale);

        const factor = 40;

        objectPosition.x /= factor;
        objectPosition.y /= factor;
        objectPosition.z /= factor;

        objectScale.x /= factor;
        objectScale.y /= factor;
        objectScale.z /= factor;

        const objectRotation = quaternionToCssRotation(objectQuaternion);

        dom.inner.style.transform = [
            "translate(-50%,-50%)",
            `translate3d(${objectPosition.x}px,${objectPosition.y}px,${objectPosition.z}px)`,
            objectRotation,
            `scale3d(${objectScale.x},${objectScale.y},${objectScale.z})`,
        ].join(" ");
    });

    return (
        <group
            ref={groupRef}
            position={position}
            rotation={rotation}
            scale={scale}
        />
    );
};
