import { useMemo } from "react";

import { CarouselProjects } from "../ForthBlock/CarouselProjects/CarouselProjects";
import { useDevice } from "../scroll/useDevice";
import { types } from "./config";
import { useThridBlockContext } from "./useThridBlockContext";

import type { EmblaOptionsType } from "embla-carousel";

import { Card } from "./Card";
import type { CardName } from "./config";

// type ItemDetailsProps = {
//     index: number;
//     type: string;
//     description: string;
//     progress: number;
//     colorClass: string;
// };

// const ItemDetails = ({
//     index,
//     type,
//     description,
//     progress,
//     colorClass,
// }: ItemDetailsProps) => {
//     const { activeIndex } = useThridBlockContext();
//     const isActive = activeIndex === index;
//     const { isMobile } = useDevice();

//     const count = useMotionValue(0);
//     const roundedProgress = useTransform(count, (value) => Math.round(value));

//     useEffect(() => {
//         if (!isActive) {
//             return;
//         }

//         count.set(0);

//         const controls = animate(count, progress, {
//             duration: 2,
//             delay: 0.3,
//             ease: [0.22, 1, 0.36, 1],
//         });

//         return () => controls.stop();
//     }, [count, isActive, progress]);

//     const pr = isMobile ? "pr-0 h-36" : "pr-6 h-30";

//     return (
//         <AnimatePresence initial={false}>
//             {isActive && (
//                 <motion.div
//                     key={index}
//                     initial={{
//                         width: 0,
//                     }}
//                     animate={{
//                         width: "auto",
//                     }}
//                     exit={{
//                         width: 0,
//                         transition: {
//                             width: {
//                                 duration: 1,
//                                 delay: 0.15,
//                                 ease: [0.22, 1, 0.36, 1],
//                             },
//                         },
//                     }}
//                     transition={{
//                         width: {
//                             duration: 1,
//                             ease: [0.22, 1, 0.36, 1],
//                         },
//                     }}
//                     className="shrink-0 overflow-hidden"
//                     style={{
//                         flexShrink: 0,
//                     }}
//                 >
//                     <motion.div
//                         initial={{
//                             opacity: 0,
//                             scale: isMobile ? 0.85 : 0.9,
//                             x: isMobile ? 0 : -50,
//                             y: isMobile ? 50 : 0,
//                         }}
//                         animate={{
//                             opacity: 1,
//                             scale: 1,
//                             x: 0,
//                             y: 0,
//                             transition: {
//                                 duration: 0.6,
//                                 delay: isMobile ? 0.5 : 0.25,
//                                 ease: [0.22, 1, 0.36, 1],
//                             },
//                         }}
//                         exit={{
//                             opacity: 0,
//                             scale: isMobile ? 0.85 : 0.9,
//                             x: isMobile ? 0 : -50,
//                             y: isMobile ? 50 : 0,
//                             transition: {
//                                 duration: 0.12,
//                                 ease: "linear",
//                             },
//                         }}
//                         style={{
//                             width: "max-content",
//                             maxWidth: "min(80vw, 28rem)",
//                         }}
//                         className={`col-end-5 ${pr}`}
//                     >
//                         <div
//                             className="
//                                 z-2
//                                 ml-auto
//                                 uppercase
//                                 border-1
//                                 outline-current
//                                 bg-app
//                                 text-current
//                                 text-sm
//                                 rounded-[4px]
//                                 px-2
//                             "
//                         >
//                             {type}
//                         </div>

//                         <span
//                             className={`${colorClass} text-end font-rob! text-sm/5`}
//                         >
//                             {description}
//                         </span>

//                         <div className="row-center-1 w-full h-fit overflow-hidden">
//                             <div className="relative row-center-1 h-[2px] flex-1 w-full rounded-full">
//                                 <div
//                                     className="
//                                         absolute
//                                         left-0
//                                         top-0
//                                         h-full
//                                         w-full
//                                         opacity-50
//                                         bg-current
//                                     "
//                                 />

//                                 <motion.div
//                                     initial={{ width: 0 }}
//                                     animate={{
//                                         width: `${progress}%`,
//                                     }}
//                                     transition={{
//                                         duration: 2,
//                                         delay: 0.3,
//                                         ease: [0.22, 1, 0.36, 1],
//                                     }}
//                                     className="
//                                         absolute
//                                         left-0
//                                         top-0
//                                         h-full
//                                         bg-current
//                                         opacity-70
//                                     "
//                                 />
//                             </div>

//                             <span
//                                 className="
//                                     text-[12px]!
//                                     font-ops
//                                     text-current
//                                 "
//                             >
//                                 <motion.span
//                                     className="
//                                     text-[12px]!
//                                     font-ops
//                                     text-current
//                                 "
//                                 >
//                                     {roundedProgress}
//                                 </motion.span>{" "}
//                                 / 100
//                             </span>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// };

const CAROUSEL_OPTIONS: EmblaOptionsType = {
    loop: true,
    startIndex: 1,
};

const items = [
    {
        name: "nestjs",
        description:
            "A framework for building scalable server-side applications with Node.js",
        type: "backend",
        progress: 70,
    },
    {
        name: "restapi",
        description:
            "An architectural style for building scalable web APIs using standard HTTP methods",
        type: "api",
        progress: 100,
    },
    {
        name: "react",
        description: "A library for building interactive user interfaces",
        type: "frontend",
        progress: 98,
    },
    {
        name: "next",
        description:
            "A React framework for building fast, full-stack web applications",
        type: "frontend",
        progress: 92,
    },
    {
        name: "typescript",
        description:
            "A typed programming language that improves JavaScript development",
        type: "lenguage",
        progress: 100,
    },
    {
        name: "php",
        description:
            "A server-side language for building dynamic web applications and APIs",
        type: "lenguage",
        progress: 90,
    },
    {
        name: "html",
        description: "A markup language for structuring web pages and content",
        type: "Markup",
        progress: 100,
    },
    {
        name: "tailwind",
        description:
            "A utility-first CSS framework for building modern and responsive user interfaces",
        type: "styling",
        progress: 100,
    },
    {
        name: "css",
        description:
            "A styling language for designing the appearance and layout of web pages",
        type: "Styling",
        progress: 100,
    },
    {
        name: "scss",
        description:
            "A CSS preprocessor that adds variables, nesting, mixins, and other features",
        type: "Styling",
        progress: 96,
    },
    {
        name: "mysql",
        description:
            "A relational database management system for storing and managing structured data",
        type: "Database",
        progress: 90,
    },
    {
        name: "postgresql",
        description:
            "A powerful open-source database for storing and managing structured data",
        type: "Database",
        progress: 90,
    },
    {
        name: "docker",
        description:
            "An open-source platform that automates the deployment, scaling, and management of applications",
        type: "Infrastructure",
        progress: 70,
    },
    {
        name: "git",
        description:
            "A distributed version control system for tracking changes in source code",
        type: "Infrastructure",
        progress: 70,
    },
] as const;

const normalizeType = (value: string) =>
    value.toLowerCase().trim().replace("lenguage", "language");

export const ItemsTest = () => {
    const { active } = useThridBlockContext();
    const { isMobile } = useDevice();

    const layoutClass = isMobile ? "col-center-1" : "row-center-1";
    // const size = isMobile ? "size-50 scale-160" : "size-80 scale-120";

    const slides = useMemo(() => {
        const selectedType = types[active];

        return items
            .filter((item) => {
                if (!selectedType || normalizeType(selectedType) === "all") {
                    return true;
                }

                return normalizeType(item.type) === normalizeType(selectedType);
            })
            .map((item) => {
                // const color = colors[item.name as CardName];

                return {
                    colorName: item.name as CardName,
                    item: isMobile ? (
                        <Card
                            description={item.description}
                            type={item.type}
                            progress={item.progress}
                            name={item.name}
                            className="mx-2"
                        />
                    ) : (
                        <Card
                            description={item.description}
                            type={item.type}
                            progress={item.progress}
                            name={item.name}
                        />
                    ),
                };
            });
    }, [active, layoutClass]);

    return (
        <div className="w-full">
            <CarouselProjects slides={slides} options={CAROUSEL_OPTIONS} />
        </div>
    );
};
