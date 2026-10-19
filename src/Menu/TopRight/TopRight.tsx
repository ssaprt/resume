import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { DynamicSvgIcon } from "../../components/Icons/DynamicSvgIcon";
import { useDevice } from "../../scroll/useDevice";

type MenuLink = {
    label: string;
    href: string;
    download?: boolean | string;
    target?: "_blank" | "_self";
};

type Props = {
    viewLinks: [MenuLink, MenuLink, MenuLink];
    downloadLinks: [MenuLink, MenuLink, MenuLink];
};

type MenuGroup = "view" | "download";

export const TopRight = ({ viewLinks, downloadLinks }: Props) => {
    const { isMobile } = useDevice();

    const [open, setOpen] = useState(false);
    const [group, setGroup] = useState<MenuGroup>("view");

    const over = isMobile ? "top-[36px] -right-[50px]" : "top-5 right-5";

    const buttonStyle = isMobile
        ? "px-[12px] pl-2 py-[6px] text-[12px] active:scale-[0.9]"
        : "px-[14px] py-[5px] text-[16px] active:scale-[0.98]";

    const links = group === "view" ? viewLinks : downloadLinks;

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const closeMenu = () => setOpen(false);

    const toggleMenu = () => setOpen((value) => !value);

    const menuContent = (
        <div
            className="
                overflow-hidden
                rounded-xl
                border
                border-fg/10
                bg-app/95
                p-1
                text-fg
                shadow-[0_12px_36px_-12px_rgba(0,0,0,0.7)]
                backdrop-blur-xl
            "
        >
            <div
                role="tablist"
                aria-label="CV actions"
                className="relative grid grid-cols-2 rounded-lg bg-fg/5 p-1"
            >
                <motion.div
                    aria-hidden="true"
                    className="
        absolute
        bottom-1
        left-1
        top-1
        w-[calc(50%-4px)]
        rounded-md
        bg-alter-fg
    "
                    initial={{
                        x: group === "view" ? "0%" : "100%",
                    }}
                    animate={{
                        x: group === "view" ? "0%" : "100%",
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                        mass: 0.7,
                    }}
                />

                <button
                    type="button"
                    role="tab"
                    aria-selected={group === "view"}
                    onClick={() => setGroup("view")}
                    className={`
                        relative
                        z-10
                        rounded-md
                        px-2
                        py-2.5
                        text-xs
                        font-medium
                        transition-colors
                        duration-200
                        ${
                            group === "view"
                                ? "text-app"
                                : "text-fg/60 hover:text-fg"
                        }
                    `}
                >
                    Open
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={group === "download"}
                    onClick={() => setGroup("download")}
                    className={`
                        relative
                        z-10
                        rounded-md
                        px-2
                        py-2.5
                        text-xs
                        font-medium
                        transition-colors
                        duration-200
                        ${
                            group === "download"
                                ? "text-app"
                                : "text-fg/60 hover:text-fg"
                        }
                    `}
                >
                    Download
                </button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={group}
                    role="group"
                    initial={{
                        opacity: 0,
                        x: group === "view" ? -8 : 8,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    exit={{
                        opacity: 0,
                        x: group === "view" ? 8 : -8,
                    }}
                    transition={{
                        duration: 0.16,
                        ease: "easeOut",
                    }}
                    className="mt-1 flex flex-col gap-0.5"
                >
                    {links.map((link, index) => (
                        <a
                            key={`${group}-${index}-${link.label}`}
                            role="menuitem"
                            href={link.href}
                            target={link.target}
                            rel={
                                link.target === "_blank"
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                            download={link.download || undefined}
                            onClick={closeMenu}
                            className="
                                flex
                                min-h-11
                                items-center
                                justify-between
                                gap-3
                                rounded-lg
                                px-3
                                py-3
                                text-sm
                                text-alter-fg
                                transition-colors
                                duration-200
                                hover:bg-fg/10
                                focus-visible:outline-2
                                focus-visible:outline-current
                            "
                        >
                            <span>{link.label}</span>

                            {link.download ? (
                                <DynamicSvgIcon
                                    name="download"
                                    className="size-4 shrink-0 opacity-60 fill-alter-fg"
                                />
                            ) : (
                                <DynamicSvgIcon
                                    name="link"
                                    className="size-4 shrink-0 opacity-60 fill-alter-fg"
                                />
                            )}
                        </a>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );

    return (
        <div
            data-cursor="button"
            data-color="alter-foreground"
            onMouseEnter={!isMobile ? () => setOpen(true) : undefined}
            onMouseLeave={!isMobile ? closeMenu : undefined}
            className={`fixed z-[999] ${over}`}
        >
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={isMobile ? toggleMenu : undefined}
                className={`
                    pattern-noise
                    relative
                    appearance-none
                    inline-flex
                    items-center
                    justify-center
                    rounded-[24px]
                    bg-[linear-gradient(135deg,var(--alter-foreground),#ff8a00)]
                    text-[var(--background)]
                    shadow-[0px_8px_22px_-8px_#ff8a00]
                    font-ops
                    leading-[1.2]
                    tracking-[0.2px]
                    cursor-pointer
                    transition-all
                    duration-[240ms]
                    ease-[ease]
                    hover:bg-[linear-gradient(135deg,#f49a00,#f49a00)]
                    hover:text-[#291800]
                    hover:-translate-y-[3px]
                    focus-visible:outline-2
                    focus-visible:outline-current
                    focus-visible:outline-offset-[3px]
                    active:translate-y-px
                    ${buttonStyle}
                `}
            >
                <span
                    aria-hidden="true"
                    className="
                        absolute
                        left-1/2
                        top-0
                        h-full
                        w-px
                        -translate-x-1/2
                        border-l
                        border-dashed
                        border-app
                    "
                />

                {!isMobile ? (
                    <DynamicSvgIcon name="download" className="ml-1 h-5 w-4" />
                ) : (
                    <span className="pt-[2px] text-[10px]!">CV</span>
                )}

                <span className="pl-5 pt-[2px]">CV</span>
            </button>

            <AnimatePresence>
                {open &&
                    (isMobile ? (
                        <motion.div
                            key="cv-mobile-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            onClick={closeMenu}
                            className="
                                fixed
                                inset-0
                                z-[10000]
                                flex
                                items-center
                                justify-center
                                bg-curr/30
                                px-5
                                backdrop-blur-[2px]
                            "
                        >
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 18,
                                    scale: 0.96,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.97,
                                }}
                                transition={{
                                    duration: 0.24,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                onClick={(event) => event.stopPropagation()}
                                className="w-full max-w-sm"
                            >
                                {menuContent}
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="cv-desktop-menu"
                            role="menu"
                            initial={{
                                opacity: 0,
                                y: -8,
                                scale: 0.97,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: -6,
                                scale: 0.98,
                            }}
                            transition={{
                                duration: 0.2,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="
                                absolute
                                right-0
                                top-full
                                w-56
                                origin-top-right
                                pt-2
                            "
                        >
                            {menuContent}
                        </motion.div>
                    ))}
            </AnimatePresence>
        </div>
    );
};
