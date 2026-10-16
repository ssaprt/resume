import { motion, useTransform } from "framer-motion";

import { useScrollElementMotion } from "../scroll/useScroll";

import { useEffect, useState } from "react";
import { CV } from "../FiveBlock/CV";
import { useDevice } from "../scroll/useDevice";
import { FixIt } from "./FixIt";
import { SkillLetter } from "./SkillLetter";

const letters = "#> MY SKILLS".split("");

const skillGroups = [
    " React / Next.js / TypeScript",
    " Redux & RTK / MobX / Context",
    " Nest.js / SQL / PHP / PostgreSQL / REST",
    " Motion / Three.js / WebGL",
    " HTML5 / [S]CSS3 / Tailwind",
    " Ant / My own components",
    " Git / Docker / Nginx",
    " ESLint / Prettier",
    "",
];

export const Right = () => {
    const { isMobile } = useDevice();
    const [replacedIcons, setReplacedIcons] = useState<Record<number, boolean>>(
        {},
    );
    const { ref, leaveProgress, leaveDirection, isAnimationComplete } =
        useScrollElementMotion();

    const [showFail, setShowFail] = useState(false);

    const y = useTransform(
        [leaveProgress, leaveDirection],
        ([progress, direction]: number[]) =>
            -document.documentElement.clientHeight * direction * progress,
    );

    const buttonY = useTransform(
        leaveProgress,
        [0, 1],
        [0, skillGroups.length * -20],
    );
    const buttonX = useTransform(leaveProgress, [0, 0.6], [0, 60]);
    const rotate = useTransform(
        leaveProgress,
        [0, 0.6],
        [0, skillGroups.length * -5],
    );
    const opacityButton = useTransform(leaveProgress, [0, 0.3], [1, 0]);

    useEffect(() => {
        if (!isAnimationComplete) {
            //eslint-disable-next-line
            setReplacedIcons({});
            setShowFail(false);
            return;
        }

        const timers = skillGroups.map((_, groupIndex) => {
            const delay = groupIndex * 400;

            return window.setTimeout(() => {
                setReplacedIcons((prev) => ({
                    ...prev,
                    [groupIndex]: true,
                }));

                if (groupIndex === skillGroups.length - 1) {
                    setShowFail(true);
                }
            }, delay);
        });

        return () => {
            timers.forEach(window.clearTimeout);
        };
    }, [isAnimationComplete]);

    const opacity = useTransform(leaveProgress, [0, 1], [1, 0]);

    const x = useTransform(leaveProgress, [0, 1], [0, 500]);

    return isMobile ? (
        <div ref={(e) => ref(e?.parentNode as HTMLElement)}>
            <CV />
        </div>
    ) : (
        <motion.div
            style={{ y, opacity, x }}
            ref={(e) => ref(e?.parentNode as HTMLElement)}
            className="col-start-0 gap-[1px] items-center z-1 w-full md:w-1/3 text-alter-fg"
        >
            <div className="flex flex-row gap-0 py-2 pt-4">
                {letters.map((letter, index) => {
                    const delay = index * 0.05;
                    const inputStart = 0.55 - delay;
                    const inputEnd = 1 - delay;

                    // eslint-disable-next-line
                    const y = useTransform(
                        leaveProgress,
                        [inputStart, inputEnd],
                        [0, 20],
                    );

                    // eslint-disable-next-line
                    const x = useTransform(
                        leaveProgress,
                        [inputStart, inputEnd],
                        [0, 60],
                    );

                    // eslint-disable-next-line
                    const scale = useTransform(
                        leaveProgress,
                        [inputStart, inputEnd],
                        [1, 0],
                    );

                    return (
                        <motion.h1
                            key={`${letter}-${index}`}
                            style={{
                                y,
                                scale,
                                opacity: scale,
                                x,
                            }}
                            className={`transform scale-y-200 uppercase tracking-[0.1px] transition-colors duration-1200 ease ${
                                [0, 1].includes(index) &&
                                isAnimationComplete &&
                                "text-green-500"
                            }`}
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </motion.h1>
                    );
                })}
            </div>

            <div className="col-stretch-1">
                {skillGroups.map((group, groupIndex) => {
                    const groupLetters = group.split("");

                    return (
                        <div
                            key={group}
                            className={`flex flex-row items-center gap-0 ${groupIndex === 0 ? "pt-2" : "pt-[2px]"} px-[6px] pl-[2px]`}
                        >
                            {groupIndex !== skillGroups.length - 1 ? (
                                groupLetters.map((letter, index) => (
                                    <SkillLetter
                                        key={`${letter}-${index}`}
                                        letter={letter}
                                        groupIndex={groupIndex}
                                        index={index}
                                        leaveProgress={leaveProgress}
                                        isAnimationComplete={
                                            isAnimationComplete
                                        }
                                        replaced={replacedIcons[groupIndex]}
                                    />
                                ))
                            ) : (
                                <>
                                    {" I have a good job"
                                        .split("")
                                        .map((letter, index) => (
                                            <SkillLetter
                                                key={`${letter}-${index}`}
                                                letter={letter}
                                                groupLength={skillGroups.length}
                                                groupIndex={groupIndex}
                                                index={index}
                                                leaveProgress={leaveProgress}
                                                isAnimationComplete={
                                                    isAnimationComplete
                                                }
                                                replaced={
                                                    replacedIcons[groupIndex]
                                                }
                                                showFail={showFail}
                                            />
                                        ))}
                                    <motion.a
                                        data-cursor="button"
                                        data-color="nestjs"
                                        href="https://t.me/itauction"
                                        target="_blank"
                                        style={{
                                            y: buttonY,
                                            rotate,
                                            x: buttonX,
                                            opacity: opacityButton,
                                        }}
                                        className={`
                                                ml-2
                                                py-1
                                                px-4
                                                rounded-[4px_4px_0_0]
                                                transition-[opacity,border,background-color,background,box-shadow]
                                                duration-200
                                                hover:bg-red-500/30
                                                hover:duration-30
                                                hover:cursor-pointer
                                                ease
                                                overflow-visible
                                                outline-none
                                                shadow-[inset_0_10px_20px_-10px]
                                                ${showFail ? "shadow-rose-500/50" : "shadow-rose-500/0"}
                                                ${showFail ? "bg-rose-500/10" : "bg-transparent"}
                                                ${!showFail ? "pointer-events-none" : "pointer-events-auto"}
                                                border-b-1
                                                ${showFail ? "border-rose-500" : "border-transparent"} relative flex flex-row gap-[1px]
                                                `}
                                    >
                                        {"Fix it"
                                            .split("")
                                            .map((letter, index) => (
                                                <FixIt
                                                    key={`${letter}-${index}`}
                                                    letter={letter}
                                                    groupLength={
                                                        skillGroups.length
                                                    }
                                                    groupIndex={groupIndex}
                                                    index={index}
                                                    leaveProgress={
                                                        leaveProgress
                                                    }
                                                    showFail={showFail}
                                                />
                                            ))}
                                    </motion.a>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};
