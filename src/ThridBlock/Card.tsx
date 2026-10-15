import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { Item3D } from "../components/3D/Item3D";
import { Asset } from "../shared/AssetLoader/Asset";
import { AssetReady } from "../shared/AssetLoader/AssetReady";
import { types } from "./config";
import { Tilt } from "./Tilt";
import { useThridBlockContext } from "./useThridBlockContext";

type CardName =
    | "react"
    | "next"
    | "typescript"
    | "nestjs"
    | "php"
    | "css"
    | "html"
    | "scss"
    | "mysql"
    | "postgresql"
    | "restapi"
    | "tailwind"
    | "docker"
    | "git";

type Props = {
    type: string;
    name: CardName;
    description: string;
    progress?: number;
    gridRef: React.RefObject<HTMLDivElement | null>;
};

const colors: Record<
    CardName,
    {
        text: string;
        bg: string;
        border: string;
        outline: string;
    }
> = {
    react: {
        text: "text-react",
        bg: "bg-react",
        border: "border-react/20",
        outline: "outline-react",
    },
    next: {
        text: "text-next",
        bg: "bg-next",
        border: "border-next/20",
        outline: "outline-next",
    },
    typescript: {
        text: "text-typescript",
        bg: "bg-typescript",
        border: "border-typescript/20",
        outline: "outline-typescript",
    },
    nestjs: {
        text: "text-nestjs",
        bg: "bg-nestjs",
        border: "border-nestjs/20",
        outline: "outline-nestjs",
    },
    php: {
        text: "text-php",
        bg: "bg-php",
        border: "border-php/20",
        outline: "outline-php",
    },
    css: {
        text: "text-css",
        bg: "bg-css",
        border: "border-css/20",
        outline: "outline-css",
    },
    html: {
        text: "text-html",
        bg: "bg-html",
        border: "border-html/20",
        outline: "outline-html",
    },
    scss: {
        text: "text-scss",
        bg: "bg-scss",
        border: "border-scss/20",
        outline: "outline-scss",
    },
    mysql: {
        text: "text-mysql",
        bg: "bg-mysql",
        border: "border-mysql/20",
        outline: "outline-mysql",
    },
    postgresql: {
        text: "text-postgresql",
        bg: "bg-postgresql",
        border: "border-postgresql/20",
        outline: "outline-postgresql",
    },
    restapi: {
        text: "text-restapi",
        bg: "bg-restapi",
        border: "border-restapi/20",
        outline: "outline-restapi",
    },
    tailwind: {
        text: "text-tailwind",
        bg: "bg-tailwind",
        border: "border-tailwind/20",
        outline: "outline-tailwind",
    },
    docker: {
        text: "text-docker",
        bg: "bg-docker",
        border: "border-docker/20",
        outline: "outline-docker",
    },
    git: {
        text: "text-git",
        bg: "bg-git",
        border: "border-git/20",
        outline: "outline-git",
    },
};

export const Card = ({
    type,
    name,
    description,
    progress = 0,
    gridRef,
}: Props) => {
    const { active } = useThridBlockContext();

    const nameActiveBar = types[active].toLocaleLowerCase();

    const color = colors[name];

    const show =
        nameActiveBar === "all" || nameActiveBar === type.toLocaleLowerCase();

    const cardRef = useRef<HTMLDivElement>(null);

    const previousShowRef = useRef(show);

    const [exit, setExit] = useState(false);

    const [position, setPosition] = useState<{
        left: number;
        top: number;
        width: number;
        height: number;
    } | null>(null);

    useLayoutEffect(() => {
        const card = cardRef.current;
        const grid = gridRef.current;

        if (!card || !grid) {
            return;
        }

        if (previousShowRef.current === show) {
            return;
        }

        if (!show) {
            const cardRect = card.getBoundingClientRect();
            const gridRect = grid.getBoundingClientRect();

            setPosition({
                left: cardRect.left - gridRect.left,
                top: cardRect.top - gridRect.top,
                width: cardRect.width,
                height: cardRect.height,
            });

            setExit(true);
        }

        if (show) {
            setExit(false);
            setPosition(null);
        }

        previousShowRef.current = show;
    }, [show, gridRef]);

    return (
        <div
            ref={cardRef}
            className={`relative h-80 w-full ${color.text}`}
            style={
                exit && position
                    ? {
                          position: "absolute",
                          left: position.left,
                          top: position.top,
                          width: position.width,
                          height: position.height,
                      }
                    : undefined
            }
        >
            <motion.div
                initial={false}
                animate={{
                    opacity: show ? 1 : 0,
                    scale: show ? 1 : 0.94,
                    y: show ? 0 : -16,
                    filter: show ? "blur(0px)" : "blur(15px)",
                }}
                transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                }}
                onAnimationComplete={() => {
                    if (!show) {
                        setExit(true);
                    }
                }}
                className="absolute inset-0"
                style={{
                    pointerEvents: show ? "auto" : "none",
                }}
            >
                <Tilt
                    className={`
                        rounded-[12px]
                        col-stretch-0
                        justify-stretch
                        h-80
                        border-1
                        bg-gradient-to-r from-current/5 to-app
                        ${color.border}
                    `}
                    color={name}
                >
                    <div
                        className={`
                            absolute
                            z-2
                            outline-1
                            outline-offset-2
                            ${color.outline}
                            uppercase
                            right-4
                            top-4
                            border-1
                            ${color.border}
                            ${color.bg}
                            text-app
                            text-sm
                            rounded-[4px]
                            px-2
                        `}
                    >
                        {type}
                    </div>

                    <div className="row-center-0 justify-center w-full aspect-square overflow-hidden z-5">
                        <Canvas
                            className="relative touch-none"
                            camera={{
                                position: [14, 0, 0],
                                fov: 22,
                            }}
                        >
                            <Asset name={name}>
                                <Suspense fallback={null}>
                                    <Item3D
                                        sceneRotationY={0}
                                        autorotate
                                        autorotateSpeed={15}
                                        returnSpeed={1}
                                        path={`/${name}.glb`}
                                    />

                                    <AssetReady name={name} />
                                </Suspense>
                            </Asset>
                        </Canvas>
                    </div>

                    <div className={`col-start-1 p-2`}>
                        <div className="row-center-1 w-full mb-2">
                            <div className="h-[2px] w-1/2 bg-gradient-to-r from-current/50 to-transparent" />
                            <div className="h-[2px] w-1/2 bg-gradient-to-l from-current/50 to-transparent" />
                        </div>
                        <div className="row-center-1 justify-between w-full bg-curr/10 p-1 px-2 rounded-md">
                            <span
                                className={`${color.text} uppercase font-ops pt-1`}
                            >
                                {name}
                            </span>

                            <div className="row-center-1 w-full h-fit overflow-hidden">
                                <div className="relative row-center-1 h-[2px] flex-1 w-full rounded-full">
                                    <div
                                        className={`
                                            absolute
                                            left-0
                                            top-0
                                            h-full
                                            w-full
                                            opacity-50
                                            ${color.bg}
                                        `}
                                    />

                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${progress}%`,
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.15,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className={`
                                            absolute
                                            left-0
                                            top-0
                                            h-full
                                            ${color.bg}
                                            opacity-70
                                        `}
                                    />
                                </div>

                                <span
                                    className={`
                                        text-[11px]!
                                        font-raj
                                        ${color.text}
                                    `}
                                >
                                    {progress}
                                    {` / 100`}
                                </span>
                            </div>
                        </div>

                        <p className={`text-xs font-inter text-curr`}>
                            {description}
                        </p>
                    </div>
                </Tilt>
            </motion.div>
        </div>
    );
};
