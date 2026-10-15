import { motion, useTransform } from "framer-motion";
import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";
import SplitText from "../components/text/ScatterText";
import { ControllerIconAuthor } from "../SecondBlock/ControllerIconAuthor";
import { Bottom } from "./Bottom";
import { CV } from "./CV";
import { useFiveBlockContextProvider } from "./shared/useFiveBlockContextProvider";
import { Socials } from "./Socials";

export const PartOne = () => {
    const { leaveDirection, leaveProgress } = useFiveBlockContextProvider();

    const x = useTransform(leaveProgress, [0, 1], [0, -100]);

    const getAge = (birthDate: Date | string): number => {
        const birth = new Date(birthDate);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();

        const hasBirthdayPassed =
            today.getMonth() > birth.getMonth() ||
            (today.getMonth() === birth.getMonth() &&
                today.getDate() >= birth.getDate());

        if (!hasBirthdayPassed) {
            age--;
        }

        return age;
    };

    return (
        <motion.div className="w-auto h-full col-start-1 justify-start flex-1">
            <div className="row-start-1 pt-14 flex-1">
                <div className="col-start-1 h-full">
                    <motion.div
                        style={{ x }}
                        className="
                    h-auto
                    w-auto
                    min-w-0
                    row-center-1
                    gap-6
                    border-1
                    border-curr/20
                    rounded-[12px]
                    px-6
                    py-2
                    bg-app

                "
                    >
                        <span className="text-curr text-sm!">
                            {getAge(new Date(1995, 7, 25))} years old
                        </span>
                        <div className="w-2 h-2 rounded-full bg-curr/30" />

                        <span className="text-curr text-sm!">
                            {getAge(new Date(2023, 7, 25))} years experience
                        </span>
                        <div className="w-2 h-2 rounded-full bg-curr/30" />

                        <div className="row-center-1">
                            <DynamicSvgIcon
                                name="ukraine"
                                className="fill-curr size-4"
                            />
                            <span className="text-curr text-sm! text-yellow-500!">
                                From Ukraine
                            </span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-curr/30" />
                    </motion.div>
                    <motion.div
                        style={{ x }}
                        className="
                    h-auto
                    w-full
                    min-w-0
                    row-start-1
                    border-1
                    border-curr/20
                    rounded-[12px]
                    p-6
                    bg-app
                "
                    >
                        <div className="flex h-full min-w-0 w-full items-start gap-6">
                            <div className="col-center-4">
                                <div className="size-60 shrink-0">
                                    <ControllerIconAuthor />
                                </div>
                            </div>

                            <div className="col-end-4 w-auto flex-1">
                                <div className="col-start-1 min-w-0 flex-1">
                                    <div className="row-center-2">
                                        <SplitText
                                            text="Contact Me"
                                            className="text-crm! text-3xl! font-rob!"
                                            left={{
                                                x: 0,
                                                y: 0,
                                                rotate: 0,
                                                scale: 1,
                                                opacity: 0,
                                            }}
                                            right={{
                                                x: 0,
                                                y: 0,
                                                rotate: 0,
                                                scale: 1,
                                                opacity: 0,
                                            }}
                                            dir={1}
                                            split={0}
                                            stagger={0.2}
                                            as="h1"
                                            scroll={{
                                                leaveProgress,
                                                leaveDirection,
                                            }}
                                        />
                                        <motion.div className="row-center-0 mt-2 ml-2">
                                            <div className="relative mr-3 size-2">
                                                <div className="avalible" />
                                                <div className="avalible-ping" />
                                            </div>
                                            <span className="text-green-500/80 text-[12px]! font-mono!">
                                                Online
                                            </span>
                                        </motion.div>
                                    </div>

                                    <SplitText
                                        text="I can help you bring any of your ideas to life or answer any questions you may have. Simply get in touch with me using any of the convenient methods listed below"
                                        className="text-start text-crm! text-[18px]! font-inter! pr-16"
                                        left={{
                                            x: 0,
                                            y: 0,
                                            rotate: 0,
                                            scale: 1,
                                            opacity: 0,
                                        }}
                                        right={{
                                            x: 0,
                                            y: 0,
                                            rotate: 0,
                                            scale: 1,
                                            opacity: 0,
                                        }}
                                        dir={1}
                                        split={0}
                                        stagger={0.2}
                                        as="h1"
                                        scroll={{
                                            leaveProgress,
                                            leaveDirection,
                                        }}
                                    />
                                </div>

                                <Socials />
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        style={{ x }}
                        className="
                    h-auto
                    w-full
                    min-w-0
                    px-6
                    pl-0
                    row-start-1
                    gap-6

                "
                    >
                        <CV />
                    </motion.div>
                </div>

                {/* <div className="bg-red-500/10 w-full h-full"></div> */}
            </div>

            <Bottom />
        </motion.div>
    );
};
