import { motion, useTransform } from "framer-motion";

import { useScrollElementMotion } from "../scroll/useScroll";

import { IconHeartFilled } from "@tabler/icons-react";
import { useDevice } from "../scroll/useDevice";
import { SubLeft } from "./SubLeft";

const letters = "exp erience".split("");

export const Left = () => {
    const { ref, leaveProgress, leaveDirection } = useScrollElementMotion();
    const { isMobile } = useDevice();

    const y = useTransform(
        [leaveProgress, leaveDirection],
        ([progress, direction]: number[]) =>
            -document.documentElement.clientHeight * direction * progress,
    );

    const opacity = useTransform(leaveProgress, [0, 1], [1, 0]);

    const x = useTransform(leaveProgress, [0, 1], [0, -500]);

    return isMobile ? (
        <motion.div
            style={{ opacity }}
            ref={(e) => ref(e?.parentNode?.firstChild as HTMLElement)}
            className="w-full col-center-1 justify-center text-alter-fg mt-10"
        >
            <div className="row-center-0 w-full justify-center">
                <h1 className="transform scale-y-200 uppercase tracking-[0.1px] text-[9vw]! text-app bg-alter-fg mr-1 px-1 text-base/7 pt-[4px] -mt-2">
                    EXP
                </h1>
                <h1 className="transform scale-y-200 uppercase tracking-[0.1px] text-[9vw]!">
                    ERIENCE
                </h1>
            </div>
            <motion.span className={`mt-4`}>
                3 years of experience in web
            </motion.span>

            <motion.div className="row-center-1 size-4 w-full justify-center">
                <IconHeartFilled className="text-alter-fg size-4" />
                <span>Hobbies and lifestyle</span>
            </motion.div>
        </motion.div>
    ) : (
        <motion.div
            style={{ y, opacity, x }}
            ref={(e) => ref(e?.parentNode?.firstChild as HTMLElement)}
            className="col-center-1 gap-[1px] items-center md:items-end z-1 transform text-alter-fg w-full md:w-1/3 p-4 overflow-hidden"
        >
            <div className="flex flex-row gap-2">
                <div className="flex flex-row gap-0 py-3 pt-4">
                    {letters.map((letter, index) => {
                        const reverseIndex = letters.length - 1 - index;
                        const delay = reverseIndex * 0.055;
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
                            [0, -60],
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
                                className={`transform scale-y-160 uppercase tracking-[0.1px] transition-all duration-10 ease pt-1 ${[0, 1, 2].includes(index) && "text-app bg-alter-fg -mr-[1px] -ml-[1px] px-1"}`}
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
