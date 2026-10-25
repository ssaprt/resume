import { AnimatePresence, motion } from "framer-motion";

export const Overlay = ({
    open,
    children,
}: {
    open: boolean;
    children: React.ReactNode;
}) => {
    return (
        <AnimatePresence mode="sync">
            {open && (
                <div
                    data-lenis-prevent
                    key="learning-project-modal"
                    className="
                        fixed
                        z-[9998]
                        w-full
                        h-dvh
                        bottom-0
                        left-0
                        flex
                        items-end
                        justify-center
                        
                        "
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { duration: 0.23, delay: 0.3 },
                        }}
                        exit={{
                            opacity: 0,
                            transition: {
                                opacity: { duration: 0.13 },
                            },
                        }}
                        className="
                            absolute
                            inset-0
                            shadow-[inset_0_-400px_300px_-300px]
                            shadow-curr/70
                            backdrop-blur-[4px]
                            "
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: 1,
                            y: 0,

                            transition: {
                                duration: 0.5,
                                ease: "easeInOut",
                            },
                        }}
                        exit={{
                            opacity: 0,
                            y: 10,
                            filter: "blur(4px)",
                            transition: {
                                duration: 0.5,
                            },
                        }}
                        className="
                            relative 
                            w-[min(100vw,600px)]
                            shrink-0
                            h-[95dvh]
                            col-center-0
                            overflow-hidden
                            rounded-t-[60px]
                            backdrop-blur-[8px]
                            border-1 border-b-0 border-curr/30
                            shadow-[inset_0_0_16px_0px_rgba(100,116,139,0.3),inset_0_50px_10px_-50px_rgba(100,116,139,0.5)]
                            text-curr
                            bg-app/50
                            "
                    >
                        <div className="absolute w-full -bottom-15 h-0 z-55 pointer-events-none shadow-[0_-40px_20px_40px] shadow-app/70" />
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            exit={{
                                opacity: 0,
                                transition: { duration: 0, delay: 0 },
                            }}
                            transition={{
                                duration: 2,
                                delay: 0,
                            }}
                            className="absolute inset-0 z-50 pointer-events-none bg-app backdrop-blur-[4px]"
                        />

                        <div className="absolute w-full h-0 z-54 pointer-events-none shadow-[0_0_40px_40px] shadow-app" />

                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
