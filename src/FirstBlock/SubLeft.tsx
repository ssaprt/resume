import { motion, useTransform } from "framer-motion";
import { useCallback } from "react";

import { useScrollElementMotion } from "../scroll/useScroll";

const letters = "Location: Georgia, Batumi".split("");
const letters2 = " Available for a full-time position".split("");

export const SubLeft = () => {
    const { ref, leaveProgress } = useScrollElementMotion();

    const setRef = useCallback(
        (element: HTMLDivElement | null) => {
            ref(element?.parentNode?.parentNode as HTMLElement | null);
        },
        [ref],
    );

    return (
        <>
            <div className="mt-1 flex flex-row" ref={setRef}>
                {letters.map((letter, index) => {
                    const delay = index * 0.02;
                    const inputStart = delay;
                    const inputEnd = 0.1 + delay;

                    //eslint-disable-next-line
                    const y = useTransform(
                        leaveProgress,
                        [inputStart, inputEnd],
                        [0, -10],
                    );

                    //eslint-disable-next-line
                    const x = useTransform(
                        leaveProgress,
                        [inputStart, inputEnd],
                        [0, -160],
                    );

                    //eslint-disable-next-line
                    const scale = useTransform(
                        leaveProgress,
                        [inputStart, inputEnd],
                        [1, 0],
                    );

                    return (
                        <motion.span
                            key={`${letter}-${index}`}
                            style={{ y, scale, opacity: scale, x }}
                            className={`transition-all duration-10 ease ${[8, 17].includes(index) && "mr-1"}`}
                        >
                            {letter}
                        </motion.span>
                    );
                })}
            </div>

            <div className="flex flex-row items-center gap-4">
                <div className="mt-[2px] flex flex-row items-center">
                    {letters2.map((letter, index) => {
                        const delay = index * 0.0155;
                        const inputStart = delay;
                        const inputEnd = 0.05 + delay;

                        //eslint-disable-next-line
                        const y = useTransform(
                            leaveProgress,
                            [inputStart, inputEnd],
                            [0, -20],
                        );

                        //eslint-disable-next-line
                        const x = useTransform(
                            leaveProgress,
                            [inputStart, inputEnd],
                            [0, -160],
                        );

                        //eslint-disable-next-line
                        const scale = useTransform(
                            leaveProgress,
                            [inputStart, inputEnd],
                            [1, 0],
                        );

                        return index === 0 ? (
                            <motion.div
                                key={`${letter}-${index}`}
                                style={{ y, opacity: scale, x }}
                                className="relative mr-3 w-2 h-2"
                            >
                                <div className="avalible" />
                                <div className="avalible-ping" />
                            </motion.div>
                        ) : (
                            <motion.span
                                key={`${letter}-${index}`}
                                style={{ y, scale, opacity: scale, x }}
                                className={`transition-all duration-10 ease ${[9, 13, 15, 26].includes(index) && "mr-1"}`}
                            >
                                {letter}
                            </motion.span>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
