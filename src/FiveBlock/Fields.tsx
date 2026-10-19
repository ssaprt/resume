import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";
import { ProcessingStatus } from "../components/loaders/ProcessingStatus";
import SplitText from "../components/text/ScatterText";
import { useDevice } from "../scroll/useDevice";
import { useSendMailMutation } from "../services/mailer";
import { Field } from "./Field";
import { Icon } from "./Icon";
import { useFiveBlockContextProvider } from "./shared/useFiveBlockContextProvider";

type FormProps = {
    name: string;
    email: string;
    message: string;
    agree: boolean;
};

type SubmitStatus = "idle" | "sending" | "received" | "success" | "error";

type StepState = "pending" | "loading" | "completed" | "error";

const STEP_DURATION = 4000;
const NEXT_STEP_DURATION = STEP_DURATION;
const FINAL_SEGMENT_DURATION = 180;
const SUCCESS_RESET_DELAY = 3000;
const RESET_DURATION = 300;

const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

const STEPS = [
    { id: "ready", label: "Ready" },
    { id: "sending", label: "Sending" },
    { id: "received", label: "Received" },
    { id: "success", label: "Success" },
] as const;

type MotionControls = ReturnType<typeof useAnimationControls>;

const animateConnectorToNearEnd = (
    controls: MotionControls,
    duration: number,
) =>
    controls.start({
        scaleX: 0.9,
        transition: {
            duration: Math.max(0, duration - FINAL_SEGMENT_DURATION) / 1000,
            ease: "linear",
        },
    });

const completeConnector = (controls: MotionControls) =>
    controls.start({
        scaleX: 1,
        transition: {
            duration: FINAL_SEGMENT_DURATION / 1000,
            ease: "linear",
        },
    });

const animateConnector = async (controls: MotionControls, duration: number) => {
    await animateConnectorToNearEnd(controls, duration);
    await completeConnector(controls);
};

const resetConnector = (controls: MotionControls) =>
    controls.start({
        scaleX: 0,
        transition: {
            duration: RESET_DURATION / 1000,
            ease: "easeInOut",
        },
    });

const getStepState = (
    index: number,
    status: SubmitStatus,
    finished: boolean,
): StepState => {
    if (index === 0) return "completed";

    if (status === "error") {
        return index === 1 ? "error" : "pending";
    }

    if (status === "idle") return "pending";

    const activeIndex =
        status === "sending" ? 1 : status === "received" ? 2 : finished ? 4 : 3;

    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "loading";

    return "pending";
};

export const Fields = () => {
    const { leaveProgress, leaveDirection } = useFiveBlockContextProvider();

    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [finished, setFinished] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const { isMobile } = useDevice();

    const readyToSending = useAnimationControls();
    const sendingToReceived = useAnimationControls();
    const receivedToSuccess = useAnimationControls();

    const connectorControls = [
        readyToSending,
        sendingToReceived,
        receivedToSuccess,
    ];

    const methods = useForm<FormProps>();
    const [sendMail] = useSendMailMutation();

    const onSubmit = async (data: FormProps) => {
        if (
            status === "sending" ||
            status === "received" ||
            status === "success" ||
            isResetting
        ) {
            return;
        }

        connectorControls.forEach((controls) => {
            controls.stop();
            controls.set({ scaleX: 0 });
        });

        setIsResetting(false);
        setFinished(false);
        setStatus("sending");

        const minimumDuration = delay(STEP_DURATION - FINAL_SEGMENT_DURATION);

        const firstConnectorAnimation = animateConnectorToNearEnd(
            readyToSending,
            STEP_DURATION,
        );

        try {
            await Promise.all([
                minimumDuration,
                firstConnectorAnimation,
                sendMail(
                    (() => {
                        const formData = new FormData();

                        formData.append("name", data.name);
                        formData.append("email", data.email);
                        formData.append("message", data.message);

                        return formData;
                    })(),
                ).unwrap(),
            ]);
        } catch (error) {
            await Promise.all([minimumDuration, firstConnectorAnimation]);

            await completeConnector(readyToSending);

            console.error(error);
            setStatus("error");
            return;
        }

        await completeConnector(readyToSending);

        setStatus("received");

        await animateConnector(sendingToReceived, NEXT_STEP_DURATION);

        setStatus("success");

        await animateConnector(receivedToSuccess, NEXT_STEP_DURATION);

        setFinished(true);

        await delay(SUCCESS_RESET_DELAY);

        setIsResetting(true);
        setStatus("idle");
        setFinished(false);

        await Promise.all(connectorControls.map(resetConnector));

        setIsResetting(false);
    };

    const isBusy =
        isResetting ||
        status === "sending" ||
        status === "received" ||
        status === "success";

    const overlay = isMobile
        ? "w-full min-w-0 p-10"
        : "w-auto min-w-[360px] ml-auto p-12";

    const shadow = isMobile
        ? "shadow-[0_0_0px_1px] shadow-curr/50 bg-curr/10"
        : "shadow-[0_0_1px_1px] shadow-curr/30 bg-curr/3";

    const text = isMobile ? "text-2xl!" : "text-3xl!";
    const ts = isMobile ? "text-[8px]!" : "text-[10px]!";

    return (
        <FormProvider {...methods}>
            <form
                noValidate
                onSubmit={methods.handleSubmit(onSubmit)}
                className={`${overlay} h-auto rounded-[12px] col-start-8 ${shadow}`}
            >
                {isMobile && (
                    <div
                        className={`
                                                       absolute
                                                       left-10
                                                       -top-[11px]
                                                        z-2
                                                       
                                                        
                                                        uppercase
                                                       
                                                        
                                                        ${shadow}
                                                        bg-app!
                                                        text-curr
                                                        text-sm
                                                        rounded-[4px]
                                                        px-2
                            
                                                    `}
                    >
                        <DynamicSvgIcon
                            name="sort_left"
                            className="size-[35px] fill-app absolute -left-[21px] -top-[7px] -z-2"
                        />
                        <DynamicSvgIcon
                            name="sort_left"
                            className="size-[35px] fill-curr/40 absolute -left-[21px] -top-[7px]"
                        />
                        <DynamicSvgIcon
                            name="sort_left"
                            className="size-[35px] fill-app absolute -right-[21px] -top-[7px] transform scale-x-[-1] -z-2"
                        />
                        <DynamicSvgIcon
                            name="sort_left"
                            className="size-[35px] fill-curr/40 absolute -right-[21px] -top-[7px] transform scale-x-[-1]"
                        />
                        Form
                    </div>
                )}
                <Icon />

                <div className="w-full col-end-1">
                    <SplitText
                        text="Write me your question"
                        className={`text-center text-curr! ${text} font-osw!`}
                        left={{
                            x: 0,
                            y: 0,
                            rotate: 0,
                            scale: 1,
                            opacity: 1,
                        }}
                        right={{
                            x: 0,
                            y: 0,
                            rotate: 0,
                            scale: 1,
                            opacity: 1,
                        }}
                        dir={1}
                        split={0}
                        as="h1"
                        scroll={{ leaveProgress, leaveDirection }}
                    />

                    <SplitText
                        text="- It's free"
                        className={`text-center text-curr! ${text} font-osw! opacity-80`}
                        left={{
                            x: 0,
                            y: 0,
                            rotate: 0,
                            scale: 1,
                            opacity: 1,
                        }}
                        right={{
                            x: 0,
                            y: 0,
                            rotate: 0,
                            scale: 1,
                            opacity: 1,
                        }}
                        dir={1}
                        split={0}
                        as="h1"
                        scroll={{ leaveProgress, leaveDirection }}
                    />
                </div>

                <div className="w-full h-[1px] bg-curr/20" />

                <div className="row-center-4">
                    <Field
                        field="name"
                        text="Your Name"
                        placeholder="John Doe"
                    />

                    <Field
                        field="email"
                        type="email"
                        text="Your Email"
                        placeholder="ym@gmail.com"
                    />
                </div>

                <Field
                    type="textarea"
                    field="message"
                    text="Your Message"
                    placeholder="Please tell me why you would like to work with me, or what problem you have encountered..."
                    required
                />

                <div className="row-center-1 justify-between w-full">
                    <div className="col-start-1 w-full">
                        <div className="relative mt-3 w-full">
                            {STEPS.slice(0, -1).map((step, index) => (
                                <div
                                    key={step.id}
                                    className="absolute top-3 h-px"
                                    style={{
                                        left: `calc(${12.5 + index * 25}% + 12px)`,
                                        width: "calc(25% - 24px)",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-curr/20" />

                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={connectorControls[index]}
                                        className={`absolute inset-0 origin-left ${
                                            status === "error" && index === 0
                                                ? "bg-red-500"
                                                : "bg-curr"
                                        }`}
                                    />
                                </div>
                            ))}

                            <div className="relative grid grid-cols-4">
                                {STEPS.map((step, index) => {
                                    const stepState = getStepState(
                                        index,
                                        status,
                                        finished,
                                    );

                                    return (
                                        <div
                                            key={step.id}
                                            className="flex min-w-0 flex-col items-center gap-2"
                                        >
                                            <div
                                                className={`relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full`}
                                            >
                                                <AnimatePresence
                                                    initial={false}
                                                    mode="sync"
                                                >
                                                    <motion.div
                                                        key={stepState}
                                                        initial={{
                                                            opacity: 0,
                                                            scale: 0.55,
                                                            rotate: -20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            scale: 1,
                                                            rotate: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            scale: 0.7,
                                                            rotate: 15,
                                                        }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 350,
                                                            damping: 24,
                                                            mass: 0.6,
                                                        }}
                                                        className="absolute inset-0 flex items-center justify-center"
                                                    >
                                                        {stepState ===
                                                        "completed" ? (
                                                            <DynamicSvgIcon
                                                                name="done"
                                                                className="size-7/10 fill-curr"
                                                            />
                                                        ) : stepState ===
                                                          "loading" ? (
                                                            <ProcessingStatus
                                                                size={16}
                                                                className="-ml-[9px]"
                                                            />
                                                        ) : stepState ===
                                                          "error" ? (
                                                            <DynamicSvgIcon
                                                                name="error"
                                                                className="size-full fill-red-500"
                                                            />
                                                        ) : (
                                                            <span className="size-2 rounded-full bg-curr" />
                                                        )}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>

                                            <motion.span
                                                animate={{
                                                    opacity:
                                                        stepState ===
                                                        "completed"
                                                            ? 1
                                                            : stepState ===
                                                                "loading"
                                                              ? 0.55
                                                              : stepState ===
                                                                  "error"
                                                                ? 1
                                                                : 0.3,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: "easeOut",
                                                }}
                                                className={`whitespace-nowrap ${ts} uppercase tracking-wider ${
                                                    stepState === "completed"
                                                        ? "text-curr"
                                                        : stepState ===
                                                            "loading"
                                                          ? "text-curr/50"
                                                          : stepState ===
                                                              "error"
                                                            ? "text-red-500"
                                                            : "text-curr/25"
                                                }`}
                                            >
                                                {stepState === "error"
                                                    ? "Error"
                                                    : step.label}
                                            </motion.span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isBusy}
                        data-cursor="button"
                        data-color="curr"
                        className="
                            z-2
                            p-4
                            px-6
                            rounded-full
                            bg-curr
                            text-app
                            ml-auto
                            border-1
                            border-transparent
                            font-raj
                            uppercase
                            font-medium
                            tracking-widest
                            hover:bg-curr/30
                            hover:text-curr
                            hover:border-curr
                            transition-all
                            duration-300
                            active:transform
                            active:scale-95
                            active:bg-curr/10
                            disabled:opacity-50
                            disabled:pointer-events-none
                        "
                    >
                        Send
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};
