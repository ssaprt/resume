import { AnimatePresence, animate, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";
import { useDevice } from "../scroll/useDevice";
import { ButtonBottomMenu } from "./ButtonBottomMenu";
import { useBottomMenu } from "./shared/useBottomMenu";

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

export const BottomMenuContent = ({ viewLinks, downloadLinks }: Props) => {
    const { element } = useBottomMenu();
    const { isMobile } = useDevice();

    const menuRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const hasPositionRef = useRef(false);
    const panelAnimatingRef = useRef(false);
    const navigationOpenRef = useRef(!isMobile);
    const syncTrackPositionRef = useRef<(() => void) | null>(null);
    const trackAnimationRef = useRef<ReturnType<typeof animate> | null>(null);
    const revealFrameRef = useRef<number | null>(null);
    const panelTransitionIdRef = useRef(0);

    const [navigationOpen, setNavigationOpen] = useState(!isMobile);
    const [cvOpen, setCvOpen] = useState(false);
    const [group, setGroup] = useState<MenuGroup>("view");
    const [trackVisible, setTrackVisible] = useState(false);
    const [buttonSize, setButtonSize] = useState(isMobile ? 40 : 44);
    const [panelTransitionId, setPanelTransitionId] = useState(0);

    const links = group === "view" ? viewLinks : downloadLinks;

    const b = isMobile
        ? "bottom-1 left-2"
        : "bottom-1 -translate-x-1/2 left-[calc(50%+20px)]";

    const cancelTrackReveal = () => {
        if (revealFrameRef.current !== null) {
            cancelAnimationFrame(revealFrameRef.current);
            revealFrameRef.current = null;
        }
    };

    const scheduleTrackReveal = (transitionId: number) => {
        cancelTrackReveal();

        revealFrameRef.current = requestAnimationFrame(() => {
            revealFrameRef.current = requestAnimationFrame(() => {
                revealFrameRef.current = null;

                if (
                    transitionId !== panelTransitionIdRef.current ||
                    !navigationOpenRef.current ||
                    panelAnimatingRef.current
                ) {
                    return;
                }

                syncTrackPositionRef.current?.();

                if (hasPositionRef.current) {
                    setTrackVisible(true);
                }
            });
        });
    };

    useLayoutEffect(() => {
        navigationOpenRef.current = navigationOpen;
    }, [navigationOpen]);

    useLayoutEffect(() => {
        if (!navigationOpen) {
            cancelTrackReveal();
            hasPositionRef.current = false;
            //eslint-disable-next-line
            setTrackVisible(false);
            syncTrackPositionRef.current = null;
            return;
        }

        const menu = menuRef.current;
        const track = trackRef.current;
        const el = element;

        if (!menu || !track || !el) return;

        const readPosition = () => {
            const menuRect = menu.getBoundingClientRect();
            const rect = el.getBoundingClientRect();
            const nextSize = Math.round(menuRect.height);

            if (nextSize > 0) {
                setButtonSize((current) =>
                    current === nextSize ? current : nextSize,
                );
            }

            return {
                left: rect.left - menuRect.left - 1,
                top: rect.top - menuRect.top - 1,
                width: rect.width,
                height: rect.height,
            };
        };

        const applyPosition = () => {
            trackAnimationRef.current?.stop();
            trackAnimationRef.current = null;

            const position = readPosition();

            Object.assign(track.style, {
                left: `${position.left}px`,
                top: `${position.top}px`,
                width: `${position.width}px`,
                height: `${position.height}px`,
            });

            hasPositionRef.current = true;
        };

        syncTrackPositionRef.current = applyPosition;

        const update = () => {
            if (panelAnimatingRef.current) return;

            const position = readPosition();

            trackAnimationRef.current?.stop();
            trackAnimationRef.current = null;

            if (!hasPositionRef.current) {
                Object.assign(track.style, {
                    left: `${position.left}px`,
                    top: `${position.top}px`,
                    width: `${position.width}px`,
                    height: `${position.height}px`,
                });

                hasPositionRef.current = true;
                scheduleTrackReveal(panelTransitionIdRef.current);
                return;
            }

            trackAnimationRef.current = animate(track, position, {
                type: "spring",
                stiffness: 360,
                damping: 25,
                mass: 0.8,
            });
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(menu);
        observer.observe(el);

        window.addEventListener("resize", update);

        return () => {
            trackAnimationRef.current?.stop();
            trackAnimationRef.current = null;

            observer.disconnect();
            window.removeEventListener("resize", update);

            if (syncTrackPositionRef.current === applyPosition) {
                syncTrackPositionRef.current = null;
            }
        };
    }, [element, navigationOpen, isMobile]);

    useEffect(() => {
        if (!cvOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setCvOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [cvOpen]);

    useEffect(
        () => () => {
            cancelTrackReveal();
            trackAnimationRef.current?.stop();
        },
        [],
    );

    const closeCvMenu = () => setCvOpen(false);

    const toggleNavigation = () => {
        const nextOpen = !navigationOpen;
        const nextTransitionId = panelTransitionIdRef.current + 1;

        panelTransitionIdRef.current = nextTransitionId;
        setPanelTransitionId(nextTransitionId);

        navigationOpenRef.current = nextOpen;
        panelAnimatingRef.current = true;

        cancelTrackReveal();
        trackAnimationRef.current?.stop();
        trackAnimationRef.current = null;

        setTrackVisible(false);

        if (!nextOpen) {
            setCvOpen(false);
        }

        setNavigationOpen(nextOpen);
    };

    const handlePanelAnimationStart = (transitionId: number) => {
        if (transitionId !== panelTransitionIdRef.current) return;

        panelAnimatingRef.current = true;
        setTrackVisible(false);
        cancelTrackReveal();

        trackAnimationRef.current?.stop();
        trackAnimationRef.current = null;
    };

    const handlePanelAnimationComplete = (transitionId: number) => {
        if (transitionId !== panelTransitionIdRef.current) return;

        if (!navigationOpenRef.current) {
            panelAnimatingRef.current = false;
            setTrackVisible(false);
            return;
        }

        syncTrackPositionRef.current?.();
        panelAnimatingRef.current = false;

        scheduleTrackReveal(transitionId);
    };

    const menuContent = (
        <div
            className={`overflow-hidden rounded-xl
                border border-fg/10
                p-1 text-fg
                border border-curr/30
                ${
                    isMobile
                        ? "bg-curr/10 shadow-[inset_0_0_50px_0px_rgba(100,116,139,0.3),0_0_1px_1px_rgba(100,116,139,0.7)]"
                        : "bg-app/95 shadow-[inset_0_0_16px_0px_rgba(100,116,139,0.3),0_0_10px_0px_rgba(0,0,0,.55)]"
                }`}
        >
            <div
                role="tablist"
                aria-label="CV actions"
                className="
                    relative grid grid-cols-2
                    rounded-lg bg-curr/15 p-1
                "
            >
                <motion.div
                    aria-hidden="true"
                    className="
                        absolute bottom-1 left-1 top-1
                        w-[calc(50%-4px)]
                        rounded-md bg-curr
                    "
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
                    data-cursor="button"
                    data-color={group === "view" ? "background" : "curr"}
                    data-shadow="0 0 40px 20px"
                    type="button"
                    role="tab"
                    aria-selected={group === "view"}
                    onClick={() => setGroup("view")}
                    className={`
                        relative z-10 rounded-md px-2 py-2.5
                        text-xs font-medium
                        transition-colors duration-200
                        ${
                            group === "view"
                                ? "text-app"
                                : "text-curr/80 hover:text-curr"
                        }
                    `}
                >
                    Open
                </button>

                <button
                    data-cursor="button"
                    data-color={group === "download" ? "background" : "curr"}
                    data-shadow="0 0 40px 20px"
                    type="button"
                    role="tab"
                    aria-selected={group === "download"}
                    onClick={() => setGroup("download")}
                    className={`
                        relative z-10 rounded-md px-2 py-2.5
                        text-xs font-medium
                        transition-colors duration-200
                        ${
                            group === "download"
                                ? "text-app"
                                : "text-curr/80 hover:curr"
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
                            data-cursor="button"
                            data-color="curr"
                            data-shadow="0 0 40px 20px"
                            download={link.download || undefined}
                            onClick={closeCvMenu}
                            className="
                                flex min-h-11 items-center
                                justify-between gap-3
                                rounded-lg px-3 py-3
                                text-sm text-curr
                                transition-colors duration-200
                                hover:bg-curr/10
                                focus-visible:outline-2
                                focus-visible:outline-current
                            "
                        >
                            <span>{link.label}</span>

                            <DynamicSvgIcon
                                name={link.download ? "download" : "link"}
                                className="
                                    size-4 shrink-0
                                    fill-curr opacity-60
                                "
                            />
                        </a>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );

    const portalRoot =
        typeof document !== "undefined"
            ? (document.getElementById("overlay-root") ?? document.body)
            : null;

    return (
        <>
            <div
                className={`
                    fixed ${b} z-[999]
                    flex h-auto min-h-10 w-auto
                    items-stretch gap-2
                    row-center-1
                `}
            >
                {isMobile && (
                    <motion.button
                        type="button"
                        data-cursor="button"
                        data-color="curr"
                        data-shadow="0 0 40px 20px"
                        aria-label={
                            navigationOpen
                                ? "Hide navigation menu"
                                : "Show navigation menu"
                        }
                        aria-controls="bottom-navigation-panel"
                        aria-expanded={navigationOpen}
                        onClick={toggleNavigation}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                        }}
                        style={{
                            width: buttonSize,
                            height: buttonSize,
                        }}
                        className="
                            relative shrink-0 box-border
                            overflow-hidden rounded-full
                            border border-curr/30
                            backdrop-blur-sm
                            shadow-[inset_0_0_16px_0px]
                            shadow-curr/30
                            text-curr
                            flex items-center justify-center p-0
                        "
                    >
                        <span className="relative block size-4">
                            <motion.span
                                className="
                                    absolute left-1/2
                                    h-px w-8/10
                                    rounded-full bg-current
                                "
                                animate={{
                                    top: navigationOpen ? "7.5px" : "3.5px",
                                    rotate: navigationOpen ? 45 : 0,
                                    x: "-50%",
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    transformOrigin: "center center",
                                }}
                            />

                            <motion.span
                                className="
                                    absolute left-1/2 top-[7.5px]
                                    h-px w-8/10
                                    rounded-full bg-current
                                "
                                animate={{
                                    opacity: navigationOpen ? 0 : 1,
                                    scaleX: navigationOpen ? 0 : 1,
                                    x: "-50%",
                                }}
                                transition={{
                                    duration: 0.15,
                                    ease: "easeInOut",
                                }}
                            />

                            <motion.span
                                className="
                                    absolute left-1/2
                                    h-px w-8/10
                                    rounded-full bg-current
                                "
                                animate={{
                                    top: navigationOpen ? "7.5px" : "11.5px",
                                    rotate: navigationOpen ? -45 : 0,
                                    x: "-50%",
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    transformOrigin: "center center",
                                }}
                            />
                        </span>
                    </motion.button>
                )}

                <div className="flex items-stretch gap-2">
                    <AnimatePresence initial={false}>
                        {navigationOpen && (
                            <motion.div
                                key="bottom-navigation-panel"
                                id="bottom-navigation-panel"
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 24,
                                }}
                                onAnimationStart={() =>
                                    handlePanelAnimationStart(panelTransitionId)
                                }
                                onAnimationComplete={() =>
                                    handlePanelAnimationComplete(
                                        panelTransitionId,
                                    )
                                }
                                transition={{
                                    opacity: {
                                        duration: 0.22,
                                        ease: "easeOut",
                                    },
                                    y: {
                                        duration: 0.3,
                                        ease: [0.22, 1, 0.36, 1],
                                    },
                                }}
                                style={{
                                    willChange: "transform, opacity",
                                }}
                                className="
                                    relative min-w-0 shrink-0 h-max
                                    rounded-[24px] backdrop-blur-sm
                                "
                            >
                                <div
                                    ref={menuRef}
                                    style={{
                                        transform: "translateZ(0)",
                                        willChange: "backdrop-filter",
                                    }}
                                    className={`relative w-max
                                        rounded-full border border-curr/30
                                        p-1 ${isMobile ? "px-[4px]" : "px-[6px]"}
                                        shadow-[inset_0_0_16px_0px]
                                        shadow-curr/30
                                        row-center-0`}
                                >
                                    <ButtonBottomMenu
                                        textButton="Main"
                                        indexBlock={0}
                                    />
                                    <ButtonBottomMenu
                                        textButton="Exp"
                                        indexBlock={1}
                                    />
                                    <ButtonBottomMenu
                                        textButton="Stack"
                                        indexBlock={2}
                                    />
                                    <ButtonBottomMenu
                                        textButton="Projects"
                                        indexBlock={3}
                                    />
                                    <ButtonBottomMenu
                                        textButton="Contact"
                                        indexBlock={4}
                                    />

                                    <motion.div
                                        ref={trackRef}
                                        initial={false}
                                        animate={{
                                            opacity: trackVisible ? 1 : 0,
                                        }}
                                        transition={{
                                            opacity: {
                                                duration: 0.35,
                                                ease: "easeOut",
                                            },
                                        }}
                                        className="
                                            pointer-events-none absolute
                                            rounded-full border border-curr/30
                                            bg-curr/5
                                            shadow-[inset_0_0_16px_0px]
                                            shadow-curr/30
                                        "
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence initial={false}>
                        {navigationOpen && (
                            <motion.div
                                key="cv-button"
                                initial={{
                                    opacity: 0,
                                    x: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: 24,
                                }}
                                transition={{
                                    opacity: {
                                        duration: 0.22,
                                        ease: "easeOut",
                                    },
                                    x: {
                                        duration: 0.3,
                                        ease: [0.22, 1, 0.36, 1],
                                    },
                                }}
                                style={{
                                    height: buttonSize,
                                    willChange: "transform, opacity",
                                }}
                                className="relative shrink-0 backdrop-blur-sm rounded-full"
                                onMouseEnter={
                                    !isMobile
                                        ? () => setCvOpen(true)
                                        : undefined
                                }
                                onMouseLeave={
                                    !isMobile ? closeCvMenu : undefined
                                }
                            >
                                <motion.button
                                    type="button"
                                    data-cursor="button"
                                    data-color="curr"
                                    data-shadow="0 0 50px 20px"
                                    aria-label="CV"
                                    aria-haspopup={isMobile ? "dialog" : "menu"}
                                    aria-expanded={cvOpen}
                                    onClick={
                                        isMobile
                                            ? () => setCvOpen((value) => !value)
                                            : undefined
                                    }
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        width: buttonSize,
                                        height: buttonSize,
                                    }}
                                    className="
                                        box-border flex shrink-0
                                        items-center justify-center
                                        rounded-full border border-curr/30
                                        p-0 text-[12px]! text-curr
                                        shadow-[inset_0_0_16px_0px]
                                        shadow-curr/30
                                        
                                    "
                                >
                                    <DynamicSvgIcon
                                        name="cv"
                                        className="size-6/10 fill-curr"
                                    />
                                </motion.button>

                                {!isMobile && (
                                    <AnimatePresence>
                                        {cvOpen && (
                                            <motion.div
                                                key="cv-desktop-menu"
                                                role="menu"
                                                initial={{
                                                    opacity: 0,
                                                    y: 8,
                                                    scale: 0.97,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 6,
                                                    scale: 0.98,
                                                }}
                                                transition={{
                                                    duration: 0.2,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="
                                                    absolute bottom-full right-0
                                                    mb-1 w-50
                                                    origin-bottom-right
                                                    before:content-['']
                                                    before:block
                                                    before:absolute
                                                    before:w-[calc(100%+20px)]
                                                    before:h-[calc(100%+20px)]
                                                    before:-z-1
                                                    before:left-1/2
                                                    before:top-1/2
                                                    before:-translate-x-1/2
                                                    before:-translate-y-1/2
                                                "
                                            >
                                                {menuContent}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {isMobile &&
                portalRoot &&
                createPortal(
                    <AnimatePresence>
                        {cvOpen && (
                            <motion.div
                                key="cv-mobile-backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 0.22,
                                    ease: "easeOut",
                                }}
                                onClick={closeCvMenu}
                                className="
                                    fixed inset-0 z-[2147483647]
                                    flex items-center justify-center
                                    px-5
                                    backdrop-blur-[24px]
                                "
                            >
                                <motion.div
                                    role="dialog"
                                    aria-modal="true"
                                    aria-label="CV actions"
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
                        )}
                    </AnimatePresence>,
                    portalRoot,
                )}
        </>
    );
};
