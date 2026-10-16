import { motion, useTransform } from "framer-motion";
import { useRef } from "react";
import { useScrollElementMotion } from "../scroll/useScroll";
import { Card } from "./Card";
import { types } from "./config";
import { useThridBlockContext } from "./useThridBlockContext";

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

export const Items = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const { ref, enterProgress } = useScrollElementMotion();
    const { active } = useThridBlockContext();

    const opacity = useTransform(enterProgress, [0, 0.1], [0, 1]);
    const y = useTransform(enterProgress, [0, 0.1], [90, 0]);
    const pointerEvents = useTransform(
        enterProgress,
        [0, 0.1],
        ["none", "auto"],
    );

    const selectedType = types[active];

    const filteredItems = items.filter((item) => {
        if (!selectedType || normalizeType(selectedType) === "all") {
            return true;
        }

        return normalizeType(item.type) === normalizeType(selectedType);
    });

    return (
        <motion.div
            ref={(element) => {
                gridRef.current = element;
                ref(element);
            }}
            className="relative w-full"
            style={{ y, opacity, pointerEvents }}
        >
            <div className="grid w-full justify-center grid-cols-[repeat(auto-fit,25%)] gap-3">
                {filteredItems.map((item) => (
                    <motion.div
                        key={item.name}
                        layout="position"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            layout: {
                                duration: 0.35,
                                ease: [0.22, 1, 0.36, 1],
                            },
                            opacity: {
                                duration: 0.25,
                            },
                            y: {
                                duration: 0.35,
                                ease: [0.22, 1, 0.36, 1],
                            },
                        }}
                    >
                        <Card
                            gridRef={gridRef}
                            name={item.name}
                            description={item.description}
                            type={item.type}
                            progress={item.progress}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
