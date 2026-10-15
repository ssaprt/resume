import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";

type SocialProps = {
    iconName: string;
    link: string;
    title: string;
    userName?: string;
};

export const Social = ({ iconName, link, title }: SocialProps) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;

        const timer = setTimeout(() => {
            setCopied(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <div className="row-center-1 text-curr/80 w-full font-mono!">
            <div className="row-center-1 mr-auto">
                <DynamicSvgIcon
                    name={iconName}
                    className="size-5 fill-current"
                />

                <span className="text-[12px]!">{title}</span>
            </div>

            <div
                data-cursor="button"
                data-color="curr"
                data-shadow="0 0 40px 10px"
                className="relative shrink-0"
            >
                <motion.button
                    type="button"
                    animate={{ scale: copied ? 0.95 : 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 12,
                        mass: 0.6,
                    }}
                    onClick={handleCopy}
                    aria-label="Copy link"
                    className="row-center-1 shrink-0 p-[2px] transform transition-transform duration-300 hover:-translate-y-1"
                >
                    <DynamicSvgIcon
                        name="copy"
                        className="size-6 fill-current"
                    />
                </motion.button>

                <AnimatePresence>
                    {copied && (
                        <motion.span
                            initial={{ opacity: 0, y: 5, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -3, scale: 0.95 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-curr px-2 py-1 text-[11px] text-app shadow-lg"
                        >
                            Copied
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <a
                data-cursor="button"
                data-color="curr"
                data-shadow="0 0 40px 10px"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${title}`}
                className="row-center-1 shrink-0 p-[2px] transform transition-transform duration-300 hover:-translate-y-1"
            >
                <DynamicSvgIcon name="link" className="size-6 fill-current" />
            </a>
        </div>
    );
};
