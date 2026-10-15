import { motion } from "framer-motion";
import { useTransform } from "motion/react";
import { useRef } from "react";
import { useScrollElementMotion } from "../scroll/useScroll";
import { Card } from "./Card";

export const Items = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const { ref, enterProgress } = useScrollElementMotion();

    const opacity = useTransform(enterProgress, [0, 0.1], [0, 1]);
    const y = useTransform(enterProgress, [0, 0.1], [90, 0]);
    const pointerEvents = useTransform(
        enterProgress,
        [0, 0.1],
        ["none", "auto"],
    );

    return (
        <motion.div
            ref={(e) => {
                gridRef.current = e;
                ref(e);
            }}
            className="relative w-full"
            style={{ y, opacity, pointerEvents }}
        >
            <div className="grid w-full justify-center grid-cols-[repeat(auto-fit,45%)] gap-3">
                <Card
                    gridRef={gridRef}
                    name="nestjs"
                    description="A framework for building scalable server-side applications with Node.js"
                    type="backend"
                    progress={70}
                />

                <Card
                    gridRef={gridRef}
                    name="restapi"
                    description="An architectural style for building scalable web APIs using standard HTTP methods"
                    type="api"
                    progress={100}
                />

                <Card
                    gridRef={gridRef}
                    name="react"
                    description="A library for building interactive user interfaces"
                    type="frontend"
                    progress={98}
                />
                <Card
                    gridRef={gridRef}
                    name="next"
                    description="A React framework for building fast, full-stack web applications"
                    type="frontend"
                    progress={92}
                />

                <Card
                    gridRef={gridRef}
                    name="typescript"
                    description="A typed programming language that improves JavaScript development"
                    type="lenguage"
                    progress={100}
                />

                <Card
                    gridRef={gridRef}
                    name="php"
                    description="A server-side language for building dynamic web applications and APIs"
                    type="lenguage"
                    progress={90}
                />

                <Card
                    gridRef={gridRef}
                    name="html"
                    description="A markup language for structuring web pages and content"
                    type="Markup"
                    progress={100}
                />

                <Card
                    gridRef={gridRef}
                    name="tailwind"
                    description="A utility-first CSS framework for building modern and responsive user interfaces"
                    type="styling"
                    progress={100}
                />

                <Card
                    gridRef={gridRef}
                    name="css"
                    description="A styling language for designing the appearance and layout of web pages"
                    type="Styling"
                    progress={100}
                />

                <Card
                    gridRef={gridRef}
                    name="scss"
                    description="A CSS preprocessor that adds variables, nesting, mixins, and other features"
                    type="Styling"
                    progress={96}
                />

                <Card
                    gridRef={gridRef}
                    name="mysql"
                    description="A relational database management system for storing and managing structured data"
                    type="Database"
                    progress={90}
                />

                <Card
                    gridRef={gridRef}
                    name="postgresql"
                    description="A powerful open-source database for storing and managing structured data"
                    type="Database"
                    progress={90}
                />

                <Card
                    gridRef={gridRef}
                    name="docker"
                    description="An open-source platform that automates the deployment, scaling, and management of applications"
                    type="Infrastructure"
                    progress={70}
                />

                <Card
                    gridRef={gridRef}
                    name="git"
                    description="A distributed version control system for tracking changes in source code"
                    type="Infrastructure"
                    progress={70}
                />
            </div>
        </motion.div>
    );
};
