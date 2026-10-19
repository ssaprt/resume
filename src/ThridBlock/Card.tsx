import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { ThreeModelView } from "../components/3D/ThreeModelView";
import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";
import { useDevice } from "../scroll/useDevice";
import { colors, types, type CardName } from "./config";
import { Tilt } from "./Tilt";
import { useThridBlockContext } from "./useThridBlockContext";

type Props = {
    type: string;
    name: CardName;
    description: string;
    progress?: number;
    gridRef?: React.RefObject<HTMLDivElement | null>;
    className?: string;
};

export const Card = ({
    type,
    name,
    description,
    progress = 0,
    gridRef,
    className = "",
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
        const grid = gridRef?.current;

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

    const { isMobile } = useDevice();
    const h = isMobile ? "h-100" : "h-80";

    return (
        <div
            ref={cardRef}
            className={`relative ${h} w-full ${color.text} ${className}`}
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
                className="absolute inset-0"
                style={{
                    pointerEvents: show ? "auto" : "none",
                }}
            >
                {isMobile ? (
                    <div
                        className={`
                            rounded-[12px]
                         bg-current/10
                        border-1
                        py-6
                        px-4
                        col-stretch-0
                        justify-stretch
                        h-full
                        ${color.text}
                   
                    `}
                    >
                        <div
                            className={`
                           absolute
                           right-5
                           -top-3
                            z-2
                           
                            
                            uppercase
                           
                            border-1
                            outline-current
                            bg-app
                            text-current
                            text-sm
                            rounded-[4px]
                            px-2

                        `}
                        >
                            <DynamicSvgIcon
                                name="sort_left"
                                className="size-[35px] fill-current absolute -left-[21px] -top-[7px]"
                            />

                            <DynamicSvgIcon
                                name="sort_left"
                                className="size-[35px] fill-current absolute -right-[21px] -top-[7px] transform scale-x-[-1]"
                            />
                            {type}
                        </div>
                        <div className="row-center-0 justify-center w-full aspect-square overflow-hidden z-5">
                            <ThreeModelView
                                assetName={name}
                                path={`/${name}.glb`}
                                autorotate
                                autorotateSpeed={15}
                                returnSpeed={1}
                                rotationZ={0}
                                camera={{
                                    position: [12, 0, 0],
                                    fov: 24,
                                }}
                            />
                        </div>
                        <div className={`col-start-1 p-2`}>
                            <div className="row-center-1 justify-between w-full p-1 px-2 rounded-md">
                                <span
                                    className={`text-current uppercase font-ops text-xl`}
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
                                            bg-current
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
                                            bg-current
                                            opacity-70
                                        `}
                                        />
                                    </div>

                                    <span
                                        className={`
                                        text-[12px]!
                                        font-ops
                                        text-current
                                    `}
                                    >
                                        {progress}
                                        {` / 100`}
                                    </span>
                                </div>
                            </div>

                            <p
                                className={`text-[16px] px-2 font-inter text-current`}
                            >
                                {description}
                            </p>
                        </div>
                    </div>
                ) : (
                    <Tilt
                        className={`
                        rounded-[12px]
                        col-stretch-0
                        justify-stretch
                        h-80
                       
                        bg-gradient-to-r from-current/5 to-app
                    
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
                            <ThreeModelView
                                assetName={name}
                                path={`/${name}.glb`}
                                autorotate
                                autorotateSpeed={15}
                                returnSpeed={1}
                                rotationZ={0}
                                enabled={false}
                                camera={{
                                    position: [12, 0, 0],
                                    fov: 24,
                                }}
                            />
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

                                        <div
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

                            <p
                                className={`text-xs p-2 font-inter ${color.text}`}
                            >
                                {description}
                            </p>
                        </div>
                    </Tilt>
                )}
            </motion.div>
        </div>
    );
};
