import clsx from "clsx";
import {
    type ChangeEvent,
    type FocusEvent,
    type HTMLAttributes,
    type ReactNode,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { ScrollToFuture } from "scroll-to-future";
import styles from "./TextAreaWithScrollBar.module.scss";

interface Props extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "onChange"
> {
    children?: ReactNode;
    name: string;
    placeholder?: string;
    emoji?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    backValue: (value: string) => void;
    dataLoadingMode?: {
        loading: boolean;
        error: boolean;
        success?: boolean;
    };
    textareaId?: string;
    textareaRef?: (element: HTMLTextAreaElement | null) => void;
    onTextareaBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
    invalid?: boolean;
    textareaClassName?: string;
    required?: boolean;
}

const getTextValue = (value: ReactNode): string => {
    if (typeof value === "string" || typeof value === "number") {
        return String(value);
    }

    return "";
};

const resizeTextarea = (textarea: HTMLTextAreaElement) => {
    const computedStyle = window.getComputedStyle(textarea);

    const minHeight = Number.parseFloat(computedStyle.minHeight) || 0;
    const parsedMaxHeight = Number.parseFloat(computedStyle.maxHeight);
    const maxHeight = Number.isNaN(parsedMaxHeight)
        ? Infinity
        : parsedMaxHeight;

    const currentValue = textarea.value;

    textarea.style.height = "auto";

    if (!currentValue && textarea.placeholder) {
        textarea.value = textarea.placeholder;
    }

    const borderHeight =
        (Number.parseFloat(computedStyle.borderTopWidth) || 0) +
        (Number.parseFloat(computedStyle.borderBottomWidth) || 0);

    const contentHeight = textarea.scrollHeight + borderHeight;

    textarea.value = currentValue;

    const height = Math.min(maxHeight, Math.max(minHeight, contentHeight));

    textarea.style.height = `${height}px`;
    textarea.style.overflowY = contentHeight > maxHeight ? "auto" : "hidden";
};

export const TextAreaWithScrollBar = ({
    children,
    name,
    placeholder,
    backValue,
    emoji = false,
    className,
    style,
    dataLoadingMode,
    disabled = false,
    readOnly = false,
    textareaId,
    textareaRef,
    onTextareaBlur,
    invalid = false,
    textareaClassName,
    required = false,
    ...props
}: Props) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const [internalValue, setInternalValue] = useState(() =>
        getTextValue(children),
    );

    const hasExternalValue = children !== undefined;

    const externalValue = getTextValue(children);

    const value = hasExternalValue ? externalValue : internalValue;

    const loading = dataLoadingMode?.loading === true;

    const error = invalid || (!loading && dataLoadingMode?.error === true);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const text = event.currentTarget.value;

        setInternalValue(text);
        backValue(text);
    };

    useLayoutEffect(() => {
        const textarea = ref.current;

        if (!textarea) {
            return;
        }

        resizeTextarea(textarea);
    }, [value, placeholder, textareaClassName]);

    useEffect(() => {
        const textarea = ref.current;

        if (!textarea) {
            return;
        }

        let previousWidth = textarea.getBoundingClientRect().width;

        const observer = new ResizeObserver(([entry]) => {
            if (!entry || entry.contentRect.width === previousWidth) {
                return;
            }

            previousWidth = entry.contentRect.width;
            resizeTextarea(textarea);
        });

        observer.observe(textarea);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            data-lenis-prevent
            ref={containerRef}
            className={clsx(styles.textareaOverlay, className, "mt-3")}
            style={style}
            {...props}
        >
            <textarea
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                ref={(element) => {
                    ref.current = element;
                    textareaRef?.(element);
                }}
                id={textareaId}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onBlur={onTextareaBlur}
                aria-invalid={error}
                aria-required={required}
                aria-readonly={readOnly}
                className={clsx(
                    styles.textarea,
                    emoji && styles.emoji,
                    `
            bg-transparent
            border-b-1
            pr-3
            border-crm/50
            text-curr
            text-1xl!
            font-jetbrains-mono
            w-full
            placeholder:text-crm/50
            outline-none
            transition
            focus:border-curr
            focus:ring-0
            focus:ring-curr
            disabled:cursor-not-allowed
            disabled:bg-transparent
            aria-invalid:border-nestjs
        `,
                    textareaClassName,
                )}
            />

            <ScrollToFuture
                target={ref}
                scrollBar={{
                    widthTrack: "6px",
                    superimposition: "over",
                    heightTrack: "80%",
                }}
                optionsTheme={{
                    thumb: {
                        inactive: {
                            className: "bg-curr/30!",
                        },
                        hover: {
                            className: "bg-curr/50!",
                        },
                        active: {
                            className: "bg-curr/80!",
                        },
                    },
                }}
            />
        </div>
    );
};

TextAreaWithScrollBar.displayName = "TextAreaWithScrollBar";
