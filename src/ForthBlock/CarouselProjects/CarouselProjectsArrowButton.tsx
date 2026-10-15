import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { DynamicSvgIcon } from "../../components/Icons/DynamicSvgIcon";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
    children?: ReactNode;
};

export const PrevButton = ({ children, disabled, ...props }: ButtonProps) => {
    return (
        <motion.button
            type="button"
            disabled={disabled}
            className={`rounded-full ${
                disabled
                    ? "embla__button embla__button--prev embla__button--disabled"
                    : "embla__button embla__button--prev"
            }`}
            animate={{
                opacity: disabled ? 0.35 : 1,
                scale: disabled ? 0.9 : 1,
            }}
            whileTap={
                disabled
                    ? undefined
                    : {
                          scale: 0.82,
                      }
            }
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
            }}
            {...props}
        >
            <DynamicSvgIcon
                name="arrow-left.svg"
                className="size-5 fill-alter-fg transform -rotate-90"
            />

            {children}
        </motion.button>
    );
};

export const NextButton = ({ children, disabled, ...props }: ButtonProps) => {
    return (
        <motion.button
            type="button"
            disabled={disabled}
            className={`rounded-full ${
                disabled
                    ? "embla__button embla__button--next embla__button--disabled"
                    : "embla__button embla__button--next"
            }`}
            animate={{
                opacity: disabled ? 0.35 : 1,
                scale: disabled ? 0.9 : 1,
            }}
            whileTap={
                disabled
                    ? undefined
                    : {
                          scale: 0.82,
                      }
            }
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
            }}
            {...props}
        >
            <DynamicSvgIcon
                name="arrow-left.svg"
                className="size-5 fill-alter-fg scale-[-1] transform -rotate-90"
            />

            {children}
        </motion.button>
    );
};
