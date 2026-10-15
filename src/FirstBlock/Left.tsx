import { motion, useTransform } from "framer-motion";

import SplitText from "../components/text/ScatterText";
import { useDevice } from "../scroll/useDevice";
import { useScrollElementMotion } from "../scroll/useScroll";
import { SubLeft } from "./SubLeft";

const letters = ["D", "e", "n", "y", "s", "U", "k", "h", "a", "n"];

export const Left = () => {
    const { ref, leaveProgress, leaveDirection } = useScrollElementMotion();
    const { isMobile } = useDevice();

    const y = useTransform(
        [leaveProgress, leaveDirection],
        ([progress, direction]: number[]) =>
            -document.documentElement.clientHeight * direction * progress,
    );

    const opacity = useTransform(leaveProgress, [0, 0.65], [1, 0]);
    const x = useTransform(leaveProgress, [0, 1], [0, -500]);

    return isMobile ? (
        <motion.div
            style={{ opacity }}
            ref={(e) => ref(e?.parentNode as HTMLElement)}
            className="col-center-1 mt-10"
        >
            <SplitText
                text="DENYS UKHAN"
                className="uppercase tracking-[0.1px] text-4xl!"
                left={{
                    x: 0,
                    y: 10,
                    rotate: 0,
                    scale: 0,
                    opacity: 0,
                }}
                right={{
                    x: 0,
                    y: 10,
                    rotate: 0,
                    scale: 0,
                    opacity: 0,
                }}
                split={0.5}
                stagger={0.05}
                as="h1"
                scroll={{
                    leaveProgress,
                    leaveDirection,
                }}
            />
            <span>Location: Georgia, Batumi</span>
            <div className="row-center-0">
                <motion.div className="relative mr-3 w-2 h-2">
                    <div className="avalible" />
                    <div className="avalible-ping" />
                </motion.div>
                <span>Available for a full-time position</span>
            </div>
        </motion.div>
    ) : (
        <motion.div
            style={{ y, opacity, x }}
            ref={(e) => ref(e?.parentNode as HTMLElement)}
            className="flex flex-col gap-[1px] items-center md:items-end z-1 transform text-white w-full md:w-1/3 
                        p-4
                        overflow-hidden"
        >
            <div className="flex flex-row gap-2">
                <div className="flex flex-row gap-0 py-3 pt-4">
                    {letters.map((letter, index) => {
                        const delay = index * 0.05;

                        const inputStart = delay;
                        const inputEnd = 0.25 + delay;

                        //eslint-disable-next-line
                        const y = useTransform(
                            leaveProgress,
                            [inputStart, inputEnd],
                            [0, 20],
                        );
                        //eslint-disable-next-line
                        const x = useTransform(
                            leaveProgress,
                            [inputStart, inputEnd],
                            [0, -60],
                        );
                        //eslint-disable-next-line
                        const scale = useTransform(
                            leaveProgress,
                            [inputStart, inputEnd],
                            [1, 0],
                        );

                        return (
                            <motion.h1
                                key={`${letter}-${index}`}
                                style={{ y, scale, opacity: scale, x }}
                                className={`transform scale-y-200 uppercase tracking-[0.1px] transition-all duration-10 ease ${index === 5 && "ml-2"}`}
                            >
                                {letter === " " ? "\u00A0" : letter}
                            </motion.h1>
                        );
                    })}
                </div>
            </div>

            <SubLeft />
        </motion.div>
    );
};
