import { motion, useTransform } from "framer-motion";
import { useDevice } from "../scroll/useDevice";
import { useScrollElementMotion } from "../scroll/useScroll";

const letters = "I`M A CREATIVE".split("");
const letters2 = "FULLSTACK WEB DEVELOPER".split("");

export const Right = () => {
    const { isDesktop, isMobile } = useDevice();
    const { ref, leaveProgress } = useScrollElementMotion();

    const y = useTransform(
        leaveProgress,
        (progress) => progress * document.documentElement.clientHeight,
    );
    const opacity = useTransform(
        leaveProgress,
        [0, isMobile ? 0.1 : 0.5],
        [1, 0],
    );

    const x = useTransform(leaveProgress, [0, 1], [0, 500]);

    return !isDesktop ? (
        <motion.div
            ref={(e) => ref(e?.parentNode as HTMLElement)}
            className="col-center-3 w-full mt-4
            "
        >
            <h1 className="transform scale-y-200 uppercase tracking-[0.1px] text-[8vw]!">
                I`M A CREATIVE
            </h1>
            <h3 className="transform scale-y-200 uppercase tracking-[0.4px]">
                FULLSTACK WEB DEVELOPER
            </h3>
        </motion.div>
    ) : (
        <motion.div
            style={{ y, opacity, x }}
            ref={(e) => ref(e?.parentNode as HTMLElement)}
            className="flex
            flex-col
            gap-[1px]
            items-start
            z-1
            md:w-1/3
            "
        >
            <div className="flex flex-row gap-0 py-3 pt-4">
                {letters.map((letter, index) => {
                    const reverseIndex = letters.length - 1 - index;
                    const delay = reverseIndex * 0.05;

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
                        [0, 60],
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
                            className="transform scale-y-200 uppercase tracking-[0.1px] transition-all duration-10 ease"
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </motion.h1>
                    );
                })}
            </div>
            <div className="flex flex-row gap-0 py-3 px-[6px]">
                {letters2.map((letter, index) => {
                    const reverseIndex = letters2.length - 1 - index;
                    const delay = reverseIndex * 0.02;

                    const inputStart = delay;
                    const inputEnd = 0.25 + delay;

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
                        [0, 120],
                    );

                    //eslint-disable-next-line
                    const scale = useTransform(
                        leaveProgress,
                        [inputStart, inputEnd],
                        [1, 0],
                    );

                    return (
                        <motion.h3
                            key={`${letter}-${index}`}
                            style={{ y, scale, opacity: scale, x }}
                            className={`transform scale-y-200 uppercase tracking-[0.4px] transition-all duration-10 ease`}
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </motion.h3>
                    );
                })}
            </div>
        </motion.div>
    );
};
