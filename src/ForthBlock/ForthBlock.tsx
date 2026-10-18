import { motion } from "framer-motion";

import { AnimatedText } from "../components/text/AnimatedText";
import { useDevice } from "../scroll/useDevice";
import { GoNext } from "./GoNext";
import { GoPrev } from "./GoPrev";
import { Items } from "./Item/Items";

export const ForthBlock = () => {
    const { isMobile } = useDevice();

    const p = isMobile ? "p-0 pt-20" : "p-20";
    const text = isMobile ? "text-2xl!" : "text-4xl!";
    const w = isMobile ? "w-full mb-0" : "w-2/3 mb-6";
    const t = isMobile ? "mt-10" : "mt-0";

    return (
        <div
            className={`w-full min-h-dvh col-stretch-4 justify-center ${p} pt-4`}
        >
            {!isMobile && (
                <motion.div className="w-full row-center-1 justify-center">
                    <GoPrev />
                </motion.div>
            )}

            <motion.div className={`col-center-4 w-full mb-10 ${t}`}>
                <div className="row-center-4 w-full justify-center">
                    <motion.h1 className="relative shrink-0 text-nowrap text-curr/80 text-[32px]! font-ops!">
                        My Projects
                    </motion.h1>
                </div>

                <div className={`${w}`}>
                    {isMobile ? (
                        <h1
                            className={`text-center font-outfit! text-curr! ${text} opacity-80`}
                        >
                            Presented here are exclusive production projects by
                            Denys Ukhan. All my works have been fully released
                            and feature complete, operational functionality—with
                            no 'demo' label
                        </h1>
                    ) : (
                        <AnimatedText
                            as="h1"
                            text={`Presented here are exclusive production projects by Denys Ukhan. All my works have been fully released and feature complete, operational functionality—with no 'demo' label`}
                            className={`font-outfit! text-curr! ${text} text-center`}
                            start={0.4}
                        />
                    )}
                </div>
            </motion.div>

            <Items />
            {!isMobile && <GoNext />}
        </div>
    );
};
