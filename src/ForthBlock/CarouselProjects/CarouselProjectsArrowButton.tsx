import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { DynamicSvgIcon } from "../../components/Icons/DynamicSvgIcon";
import { useDevice } from "../../scroll/useDevice";
import { colors } from "../../ThridBlock/config";
import { useThridBlockContext } from "../../ThridBlock/useThridBlockContext";

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
    children?: ReactNode;
};

export const PrevButton = ({ children, disabled, ...props }: ButtonProps) => {
    const { colorName } = useThridBlockContext();
    const color = colors[colorName];
    const { isMobile } = useDevice();

    const size = isMobile ? "size-14" : "size-10";

    return (
        <motion.button
            data-cursor="button"
            data-color={colorName}
            type="button"
            disabled={disabled}
            className={`rounded-full z-5 ${
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
                className={`${size}  ${color.fill} transform`}
            />

            {children}
        </motion.button>
    );
};

export const NextButton = ({ children, disabled, ...props }: ButtonProps) => {
    const { colorName } = useThridBlockContext();
    const color = colors[colorName];
    const { isMobile } = useDevice();

    const size = isMobile ? "size-14" : "size-10";

    return (
        <motion.button
            data-cursor="button"
            data-color={colorName}
            type="button"
            disabled={disabled}
            className={`rounded-full z-5 ${color.text} ${
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
                className={`${size}  ${color.fill} transform -scale-x-100`}
            />

            {children}
        </motion.button>
    );
};
