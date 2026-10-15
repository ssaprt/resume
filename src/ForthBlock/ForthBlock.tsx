import { motion, useTransform } from "framer-motion";

import { AnimatedText } from "../components/text/AnimatedText";
import { useScrollElementMotion } from "../scroll/useScroll";
import { GoNext } from "./GoNext";
import { GoPrev } from "./GoPrev";
import { Items } from "./Item/Items";

export const ForthBlock = () => {
    const { ref, enterProgress } = useScrollElementMotion();

    const inputStart = 0.15;
    const inputEnd = 0.45;

    const opacity = useTransform(enterProgress, [inputStart, inputEnd], [0, 1]);
    const w = useTransform(
        enterProgress,
        [inputStart, inputEnd],
        ["100vw", "40px"],
    );

    const y = useTransform(enterProgress, [inputStart, inputEnd], [-60, 0]);

    return (
        <div className="w-full min-h-screen col-stretch-4 justify-center p-20 pt-4">
            <motion.div
                className="w-full row-center-1 justify-center"
                style={{ opacity, y }}
            >
                <GoPrev />
            </motion.div>

            <motion.div className="col-center-4 w-full mb-10">
                <div className="row-center-4 w-full justify-center">
                    <motion.div
                        className="h-[1px]! w-[40px] bg-gradient-to-r from-curr/80 to-transparent"
                        style={{ width: w, opacity }}
                    />
                    <motion.h1
                        style={{ opacity }}
                        className="relative shrink-0 text-nowrap text-curr/80 text-[32px]! font-raj!"
                    >
                        My Projects
                    </motion.h1>

                    <motion.div
                        className="h-[1px]! w-[40px] bg-gradient-to-r from-transparent to-curr/80"
                        style={{ width: w, opacity }}
                    />
                </div>

                <div className="w-2/3 mb-6" ref={ref}>
                    <AnimatedText
                        as="h1"
                        text="Presented here are exclusive production projects by Denys Ukhan. All my works have been fully released and feature complete, operational functionality—with no 'demo' label"
                        className="font-outfit! text-curr! text-5xl! text-center"
                        start={0.4}
                    />
                </div>
            </motion.div>

            <Items />
            <GoNext />
        </div>
    );
};
