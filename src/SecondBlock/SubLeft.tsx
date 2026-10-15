import { motion, useTransform } from "framer-motion";
import { useCallback } from "react";

import { IconHeartFilled } from "@tabler/icons-react";
import { useScrollElementMotion } from "../scroll/useScroll";

const letters = "3 years of experience in web".split("");
const letters2 = " Hobbiesandlifestyle".split("");

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
                    const reverseIndex = letters.length - 1 - index;
                    const delay = reverseIndex * 0.02;
                    const inputStart = 0.55 - delay;
                    const inputEnd = 1 - delay;

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
                            className={`transition-all duration-10 ease ${[1, 6, 9, 20, 23].includes(index) && "mr-1"}`}
                        >
                            {letter}
                        </motion.span>
                    );
                })}
            </div>

            <div className="flex flex-row items-center gap-4">
                <div className="mt-[2px] flex flex-row items-center">
                    {letters2.map((letter, index) => {
                        const reverseIndex = letters.length - 1 - index;
                        const delay = reverseIndex * 0.0155;
                        const inputStart = 0.45 - delay;
                        const inputEnd = 1 - delay;

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
                                style={{ y, opacity: scale, x }}
                                className="relative mr-2 size-4"
                                key={`${letter}-${index}`}
                            >
                                <IconHeartFilled className="text-alter-fg size-4" />
                            </motion.div>
                        ) : (
                            <motion.span
                                key={`${letter}-${index}`}
                                style={{ y, scale, opacity: scale, x }}
                                className={`transition-all duration-10 ease ${[7, 10].includes(index) && "mr-1"}`}
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
