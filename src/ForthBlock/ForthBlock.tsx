import { motion } from "framer-motion";

import { AnimatedText } from "../components/text/AnimatedText";
import SplitText from "../components/text/ScatterText";
import { useDevice } from "../scroll/useDevice";
import { useScrollElementMotion } from "../scroll/useScroll";
import { GoNext } from "./GoNext";
import { Items } from "./Item/Items";

export const ForthBlock = () => {
    const { isMobile } = useDevice();
    const { leaveDirection, leaveProgress, ref } = useScrollElementMotion();

    const p = isMobile ? "p-0 pt-10" : "p-20 pb-10";
    const text = isMobile ? "text-2xl!" : "text-4xl!";
    const w = isMobile ? "w-full mb-0" : "w-2/3 mb-6";
    const t = isMobile ? "mt-0" : "mt-10";

    return (
        <div
            className={`w-full min-h-dvh col-stretch-4 justify-center ${p} pt-4`}
        >
            {!isMobile ? (
                <div ref={ref} className={`col-center-4 w-full mb-10 ${t}`}>
                    <div className="row-center-4 w-full justify-center">
                        <SplitText
                            text="My Projects"
                            className="relative shrink-0 text-nowrap text-curr/80 text-[32px]! font-ops!"
                            left={{
                                x: 0,
                                y: -50,
                                rotate: 0,
                                scale: 1,
                                opacity: 0,
                            }}
                            right={{
                                x: 0,
                                y: -50,
                                rotate: 0,
                                scale: 1,
                                opacity: 0,
                            }}
                            stagger={0.1}
                            as="h1"
                            dir={-1}
                            scroll={{ leaveProgress, leaveDirection }}
                        />
                    </div>
                    <div className={`${w}`}>
                        <AnimatedText
                            as="h1"
                            text={`Presented here are exclusive production projects by Denys Ukhan. All my works have been fully released and feature complete, operational functionality—with no 'demo' label`}
                            className={`font-outfit! text-curr! ${text} text-center`}
                            start={0.4}
                        />
                    </div>
                </div>
            ) : (
                <div ref={ref} className={`col-center-4 w-full mb-10 ${t}`}>
                    <div className="row-center-4 w-full justify-center">
                        <motion.h1 className="relative shrink-0 text-nowrap text-curr/80 text-[32px]! font-ops!">
                            My Projects
                        </motion.h1>
                    </div>
                    <h1
                        className={`text-center font-outfit! text-curr! ${text} opacity-80`}
                    >
                        Presented here are exclusive production projects by
                        Denys Ukhan. All my works have been fully released and
                        feature complete, operational functionality—with no
                        'demo' label
                    </h1>
                </div>
            )}

            <Items />
            {!isMobile && <GoNext />}
        </div>
    );
};
