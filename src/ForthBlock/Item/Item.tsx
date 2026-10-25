import { motion, type MotionStyle } from "framer-motion";
import {
    Fragment,
    useEffect,
    useRef,
    useState,
    type PointerEvent,
} from "react";
import { DynamicSvgIcon } from "../../components/Icons/DynamicSvgIcon";
import { useDevice } from "../../scroll/useDevice";
import { Videos } from "../Videos";
import { MagneticShineButton } from "./MagneticShineButton";
import { ModalContent } from "./ModalContent/ModalContent";
import { ProjectSpendTime } from "./ProjectSpendTime";
import { colors } from "./shared/config/colors.config";
import { ContextItem } from "./shared/context/ContextItem";
import type { ItemContextProps } from "./shared/types/Item.type";
import { SubBlock } from "./SubBlock";

const MAX_ROTATE_X = 2;
const MAX_ROTATE_Y = 2;
const PERSPECTIVE = 800;
const TILT_SPEED = 0.08;

const clampTilt = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

export const Item = ({
    colorGlass,
    colorName,
    delay,
    iconName,
    src,
    srcMobile,
    title,
    text,
    projectProps,
    dir,
    learning,
}: ItemContextProps) => {
    const color = colors[colorName];
    const { isMobile } = useDevice();
    const [open, setOpen] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const tiltRef = useRef<HTMLDivElement>(null);

    const targetRotation = useRef({
        x: 0,
        y: 0,
    });

    const currentRotation = useRef({
        x: 0,
        y: 0,
    });

    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const element = tiltRef.current;

        if (!element) return;

        if (isMobile) {
            targetRotation.current = { x: 0, y: 0 };
            currentRotation.current = { x: 0, y: 0 };

            element.style.transform = "none";

            return;
        }

        const animateTilt = () => {
            const current = currentRotation.current;
            const target = targetRotation.current;

            current.x += (target.x - current.x) * TILT_SPEED;
            current.y += (target.y - current.y) * TILT_SPEED;

            const element = tiltRef.current;

            if (element) {
                element.style.transform = `
                    perspective(${PERSPECTIVE}px)
                    rotateX(${current.x}deg)
                    rotateY(${current.y}deg)
                `;
            }

            animationFrameRef.current = requestAnimationFrame(animateTilt);
        };

        animationFrameRef.current = requestAnimationFrame(animateTilt);

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [isMobile]);

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (isMobile) return;

        const element = wrapperRef.current;

        if (!element) return;

        const rect = element.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const normalizedX = clampTilt(x * 2 - 1, -1, 1);
        const normalizedY = clampTilt(y * 2 - 1, -1, 1);

        targetRotation.current = {
            x: -normalizedY * MAX_ROTATE_X,
            y: normalizedX * MAX_ROTATE_Y,
        };
    };

    const handlePointerLeave = () => {
        if (isMobile) return;

        targetRotation.current = {
            x: 0,
            y: 0,
        };
    };

    const stack = isMobile ? "text-[1.3em]" : "text-[2em]";
    const t = isMobile ? "text-[10px]!" : "text-[12px]!";
    const mt = isMobile ? "mt-2" : "mt-0";
    const shadow = isMobile
        ? "shadow-[0_0_0px_1px] shadow-current/50 bg-current/10"
        : "shadow-[0_0_1px_1px] shadow-current/30 bg-current/3";

    return (
        <ContextItem.Provider
            value={{
                colorGlass,
                colorName,
                dir,
                delay,
                text,
                iconName,
                src,
                srcMobile,
                title,
                projectProps,
                learning,
            }}
        >
            <motion.div
                ref={(element) => {
                    wrapperRef.current = element;
                }}
                data-cursor="magnetic"
                data-color="curr"
                data-shadow="0 0 200px 60px"
                className="h-full w-full"
                onPointerMove={isMobile ? undefined : handlePointerMove}
                onPointerLeave={isMobile ? undefined : handlePointerLeave}
            >
                <motion.div
                    ref={tiltRef}
                    style={
                        {
                            transform: isMobile ? "none" : undefined,
                            transformStyle: isMobile ? "flat" : "preserve-3d",
                            transformOrigin: "center center",
                            willChange: isMobile ? "auto" : "transform",
                            "--color": `var(--${colorName})`,
                        } as MotionStyle
                    }
                    className={`
                        relative
                        flex
                        h-full
                        w-full
                        col-center-1
                        overflow-hidden
                        ${shadow}
                        rounded-[12px]
                        p-4
                        
                        ${color.text}
                        before:content-['']
                        before:absolute
                        before:w-full
                        before:h-full
                        before:bottom-0
                        before:left-0
                        hover:before:bg-current/3
                        before:-z-10
                    `}
                >
                    <div className="row-center-1 justify-start p-2 mb-4">
                        <span
                            className={`
                                absolute right-2 top-1
                                py-1 px-2
                                ${t}
                                shadow-[0_0_1px_1px]
                                rounded-full
                                ${color.shadow}
                            `}
                        >
                            FULL STACK
                        </span>

                        <div className="col-start-3">
                            <div className={`row-center-2 ${mt}`}>
                                <div className="w-16 h-16 row-center-1 justify-center rounded-full p-2 shrink-0">
                                    <DynamicSvgIcon
                                        name={`${iconName}.svg`}
                                        className={`w-full h-full ${color.fill}`}
                                    />
                                </div>

                                <h3 className={`font-manrope! ${stack}`}>
                                    {title}
                                </h3>
                            </div>

                            <div className="col-start-1 w-full">
                                <SubBlock titleName="About" />
                                <p>{text.aboutProject}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-start-3 w-full grid-cols-[3fr_2fr] items-stretch gap-3">
                        <div className="min-w-0">
                            <Videos />
                        </div>

                        <div className="flex h-full min-h-0 min-w-0 flex-col rounded-[12px] mt-6">
                            {projectProps.map((item, i) => (
                                <Fragment key={i}>
                                    <ProjectSpendTime {...item} />

                                    {i !== projectProps.length - 1 && (
                                        <div className="mx-auto w-px min-h-[14px] flex-1 bg-current/10" />
                                    )}
                                </Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="col-start-1 w-full mt-6">
                        <SubBlock titleName="Developer small suitcase" />

                        <div className="row-center-1 flex-wrap">
                            {text.developmentTools.map((tool, i) => (
                                <p
                                    className="py-1 px-2 rounded-[12px] border-1 border-current/30 text-[12px]!"
                                    key={i}
                                >
                                    {tool}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="mt-auto perspective-[1000px] ml-auto">
                        <MagneticShineButton
                            text="Learning project way"
                            onClick={() => setOpen(true)}
                        />
                    </div>
                </motion.div>
            </motion.div>
            <ModalContent open={open} setOpen={setOpen} />
        </ContextItem.Provider>
    );
};
