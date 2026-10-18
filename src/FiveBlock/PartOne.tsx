import { motion } from "framer-motion";
import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";
import SplitText from "../components/text/ScatterText";
import { useDevice } from "../scroll/useDevice";
import { ControllerIconAuthor } from "../SecondBlock/ControllerIconAuthor";
import { Bottom } from "./Bottom";
import { CV } from "./CV";
import { useFiveBlockContextProvider } from "./shared/useFiveBlockContextProvider";
import { Socials } from "./Socials";

export const PartOne = () => {
    const { leaveDirection, leaveProgress } = useFiveBlockContextProvider();
    const { isMobile } = useDevice();

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

    const overlay = isMobile
        ? "col-center-1 justify-start"
        : "col-start-1 justify-start";
    const container = isMobile ? "col-center-1" : "row-start-1 pt-[50px]";
    const pTop = isMobile
        ? "px-3 py-2 gap-2 w-full justify-between"
        : "px-6 py-2 gap-6";
    const textTop = isMobile ? "text-[10px]!" : "text-sm!";
    const inner = isMobile ? "col-center-6" : "row-start-6";

    const shadow = isMobile
        ? "shadow-[0_0_0px_1px] shadow-curr/50 bg-curr/10"
        : "shadow-[0_0_1px_1px] shadow-curr/30 bg-curr/3";

    return (
        <motion.div className={`w-auto h-full ${overlay} flex-1`}>
            {isMobile && (
                <h1
                    className={`text-center font-outfit! text-curr! text-[1.2em] opacity-80 mb-6`}
                >
                    Contacts
                </h1>
            )}
            <div className={`${container} flex-1`}>
                <div className={`col-start-3 h-full`}>
                    <div
                        className={` h-auto
                    w-auto
                    min-w-0
                    row-center-1
                    
                   
                    rounded-[12px]
                    ${pTop}
                    ${shadow}
                
                    `}
                    >
                        <span className={`text-curr ${textTop}`}>
                            {getAge(new Date(1995, 7, 25))} years old
                        </span>
                        <div className="w-2 h-2 rounded-full bg-curr/30" />

                        <span className={`text-curr ${textTop}`}>
                            {getAge(new Date(2023, 7, 25))} years experience
                        </span>
                        <div className="w-2 h-2 rounded-full bg-curr/30" />

                        <div className="row-center-1">
                            <DynamicSvgIcon
                                name="ukraine"
                                className="fill-curr size-4"
                            />
                            <span
                                className={`text-curr ${textTop} text-yellow-500!`}
                            >
                                From Ukraine
                            </span>
                        </div>
                    </div>
                    <div
                        className={`h-auto
                    w-full
                    min-w-0
                   ${container}
                    rounded-[12px]
                    p-6
                        ${shadow}
                    `}
                    >
                        <div className={`h-full min-w-0 w-full ${inner}`}>
                            <div className="col-center-4">
                                <div className="size-60 shrink-0">
                                    <ControllerIconAuthor />
                                </div>
                            </div>

                            <div className="col-end-4 w-auto flex-1">
                                <div className="col-start-1 min-w-0 flex-1">
                                    <div className={`row-center-2`}>
                                        {isMobile ? (
                                            <h1
                                                className={`text-curr! text-3xl! font-rob! mt-1`}
                                            >
                                                Let's talk
                                            </h1>
                                        ) : (
                                            <SplitText
                                                text="Let's talk"
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
                                        )}
                                        <motion.div
                                            className={`row-center-0 mt-1 ml-2`}
                                        >
                                            <div
                                                className={`relative mr-3 size-2`}
                                            >
                                                <div className="avalible" />
                                                <div className="avalible-ping" />
                                            </div>
                                            <span className="text-green-500/80 text-[12px]! font-mono!">
                                                Online
                                            </span>
                                        </motion.div>
                                    </div>

                                    {isMobile ? (
                                        <h1 className="text-start text-curr! text-[18px]! font-inter!">
                                            I can help you bring any of your
                                            ideas to life or answer any
                                            questions you may have. Simply get
                                            in touch with me using any of the
                                            convenient methods listed below
                                        </h1>
                                    ) : (
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
                                    )}
                                </div>

                                <Socials />
                            </div>
                        </div>
                    </div>
                    {!isMobile && (
                        <div
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
                        </div>
                    )}
                </div>

                {/* <div className="bg-red-500/10 w-full h-full"></div> */}
            </div>

            {!isMobile && <Bottom />}
        </motion.div>
    );
};
