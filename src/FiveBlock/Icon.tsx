import { motion } from "framer-motion";
import { useTransform } from "motion/react";
import { Letters } from "./Letters";
import { useFiveBlockContextProvider } from "./shared/useFiveBlockContextProvider";

export const Icon = () => {
    const { leaveProgress } = useFiveBlockContextProvider();

    const rotate = useTransform(leaveProgress, [0, 1], [0, 180]);

    return (
        <motion.div
            style={{ rotate }}
            className="
                row-center-1
                justify-center
                bg-app
                border-1
                border-curr/20
                rounded-full
                p-4
                size-50
                absolute
                left-0
                top-0
                transform
                -translate-x-1/2
                -translate-y-1/2
                z-2
                "
        >
            <div
                className="
                                    absolute
                                    left-1/2
                                    top-1/2
                                    transform
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    w-[calc(100%-54px)]
                                    h-[calc(100%-54px)]
                                    pointer-events-none
                                    border-1
                                    border-curr/20
                                    
                                    rounded-full"
            />
            <Letters needleVariant="star" />
        </motion.div>
    );
};
