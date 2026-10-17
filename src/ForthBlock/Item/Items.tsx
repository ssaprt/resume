import { motion } from "framer-motion";
import { useTransform } from "motion/react";
import { useDevice } from "../../scroll/useDevice";
import { useScrollElementMotion } from "../../scroll/useScroll";
import { Item } from "./Item";

export const Items = () => {
    const { ref, enterProgress } = useScrollElementMotion();
    const { isMobile } = useDevice();

    const opacity = useTransform(
        enterProgress,
        [0.1, 0.1001],
        [isMobile ? 1 : 0.5, 1],
    );
    const y = useTransform(enterProgress, [0, 0.0001], [isMobile ? 1 : 90, 0]);
    const pointerEvents = useTransform(
        enterProgress,
        [0, 0.0001],
        [isMobile ? "auto" : "none", "auto"],
    );
    return (
        <motion.div
            ref={ref}
            style={{ opacity, y, pointerEvents }}
            className="grid w-full grid-cols-1 items-stretch gap-3 md:grid-cols-2 xl:grid-cols-2 transition-all duration-900"
        >
            <Item
                dir={-1}
                text={{
                    aboutProject: `This is the website of the "2 Petra" winery, founded by the famous brothers. The company produces its own line of wines—including signature labels—and operates a distribution network spanning more than 48 retail chains. It is involved in hundreds of events, such as trade fairs, wine festivals, and tastings. The founders continue to actively develop their brand`,
                    developmentTools: [
                        "Next.js",
                        "Tailwind",
                        "Framer Motion",
                        "React Three Fiber",
                        "RTK",
                        "MobX",
                        "SQL",
                        "REST",
                        "Telegram Bot",
                        "PHP",
                        "CORS",
                        "Cookies",
                        "X-Access-Token",
                        "LocalStorage",
                        "React Hook Form",
                        "Nginx",
                        "Docker",
                        "ESLint",
                        "Prettier",
                        "Git",
                        "Lenis",
                        "SVG",
                        "SSR",
                        "ISR",
                        "TypeScript",
                        "HTML",
                        "SCSS",
                        "CSS",
                        "DevOps",
                        "CI/CD",
                        "Ubuntu",
                        "Blender",
                    ],
                }}
                iconName="circle"
                title="Two-Peters"
                src="/videos/two-peters.mp4"
                srcMobile="/videos/two-peters-mobile.mp4"
                colorName="two-peters"
                colorGlass="rgba(38, 38, 38, .9)"
                delay={600}
                projectProps={[
                    { title: "Start of development", value: "2024 YEAR" },
                    { title: "End of development", value: "2025 YEAR" },
                    { title: "Duration", value: "7 MONTHS" },
                    { title: "Designer", value: "DENYS UKHAN" },
                    { title: "Backender", value: "DENYS UKHAN" },
                    { title: "Frontender", value: "DENYS UKHAN" },
                    { title: "Budget", value: "5 000 $" },
                ]}
            />

            <Item
                dir={1}
                text={{
                    aboutProject: `Utility Lab is a developer-focused portal featuring React and Next.js components, CSS generators, pseudo-element references, and frontend utilities. Fully API-driven, it automatically updates content on every page load and supports version control for tracking changes. At the moment, the project is being populated with new content, ideas, and utilities.`,
                    developmentTools: [
                        "React",
                        "Tailwind",
                        "RTK",
                        "Nest.js",
                        "MobX",
                        "REST",
                        "React Hook Form",
                        "Docker",
                        "ESLint",
                        "Prettier",
                        "Git",
                        "SVG",
                        "SPA",
                        "TypeScript",
                        "LocalStorage",
                        "HTML",
                        "SCSS",
                        "CSS",
                        "React Context API",
                        "LLM Agent",
                        "CI/CD",
                        "Ubuntu",
                        "DevOps",
                    ],
                }}
                iconName="mana"
                title="Utility-lab"
                src="/videos/utility-lab.mp4"
                srcMobile="/videos/utility-lab-mobile.mp4"
                colorName="crm"
                colorGlass="rgba(100, 116, 139, .9)"
                delay={600}
                projectProps={[
                    { title: "Start of development", value: "2026 YEAR" },
                    { title: "End of development", value: "In development" },
                    { title: "Duration", value: "In development" },
                    { title: "Designer", value: "DENYS UKHAN" },
                    { title: "Backender", value: "DENYS UKHAN" },
                    { title: "Frontender", value: "DENYS UKHAN" },
                    { title: "Budget", value: "Breadcrumbs" },
                ]}
            />

            <Item
                dir={-1}
                text={{
                    aboutProject: `Custom-built CRM & Business Management System.
Authentication and authorization: management of users, permissions, access rights, and roles.
Management of sales locations, events, tours, and products. Includes a geo-presence management module. Integration with partner APIs (for deliveries, shipments, and inventory levels).
Comprehensive system for handling and moderating customer reviews.
Order processing manager.`,
                    developmentTools: [
                        "React",
                        "Tailwind",
                        "Framer Motion",
                        "React Three Fiber",
                        "RTK",
                        "MobX",
                        "SQL",
                        "REST",
                        "PHP",
                        "React Hook Form",
                        "Nginx",
                        "Docker",
                        "CORS",
                        "LocalStorage",
                        "Telegram Bot",
                        "Cookies",
                        "X-Access-Token",
                        "ESLint",
                        "Prettier",
                        "Git",
                        "Lenis",
                        "SVG",
                        "SPA",
                        "TypeScript",
                        "HTML",
                        "SCSS",
                        "CSS",
                        "DevOps",
                        "CI/CD",
                        "Ubuntu",
                        "Blender",
                    ],
                }}
                iconName="two-peters"
                title="Business MS"
                src="/videos/panel-two-peters.mp4"
                colorName="two-peters"
                colorGlass="rgba(0,0,0,.55)"
                delay={600}
                projectProps={[
                    { title: "Start of development", value: "2024 YEAR" },
                    { title: "End of development", value: "2025 YEAR" },
                    { title: "Duration", value: "7 MONTHS" },
                    { title: "Designer", value: "DENYS UKHAN" },
                    { title: "Backender", value: "DENYS UKHAN" },
                    { title: "Frontender", value: "DENYS UKHAN" },
                    { title: "Budget", value: "4 000 $" },
                ]}
            />

            <Item
                dir={1}
                text={{
                    aboutProject: `A radio module designed for seamless integration into any project. It utilizes a modular layout and interfaces with a custom API that aggregates over 50,000 radio stations from around the world. It features extensive filtering capabilities based on quality, codec, genre, country, language, and bitrate.
It displays comprehensive information for each station, including the album, artist, track title, and the station's website.`,
                    developmentTools: [
                        "React",
                        "Tailwind",
                        "Framer Motion",
                        "RTK",
                        "MobX",
                        "ORM",
                        "REST",
                        "Nest.js",
                        "React Hook Form",
                        "Docker",
                        "ESLint",
                        "Prettier",
                        "LocalStorage",
                        "Git",
                        "SVG",
                        "SPA",
                        "TypeScript",
                        "HTML",
                        "SCSS",
                        "CSS",
                        "DevOps",
                        "CI/CD",
                        "Ubuntu",
                    ],
                }}
                iconName="radio"
                title="RadioDock"
                src="/videos/utility-lab-radio.mp4"
                colorName="curr"
                colorGlass="rgba(38, 38, 38, .9)"
                delay={600}
                projectProps={[
                    { title: "Start of development", value: "2026 YEAR" },
                    { title: "End of development", value: "2026 YEAR" },
                    { title: "Duration", value: "1 WEEK" },
                    { title: "Designer", value: "DENYS UKHAN" },
                    { title: "Backender", value: "DENYS UKHAN" },
                    { title: "Frontender", value: "DENYS UKHAN" },
                    { title: "Budget", value: "Breadcrumbs" },
                ]}
            />

            <Item
                dir={-1}
                text={{
                    aboutProject: `One of the most interesting projects created without using modern libraries: an online platform featuring user authentication, real-time chat between members, and a rewards and bonus system. The store focused on selling smoking accessories and themed apparel. The creator wanted to fully develop the community aspect, despite the platform's specific commercial focus. Features included a comprehensive profile customization system (avatars, user details, visibility settings, friend and ignore lists, user blocking, and achievement levels linked to discount tiers), a global real-time chat for all members, an auction system for platform placements, and much more`,
                    developmentTools: [
                        "Vanilla JS",
                        "JQuery",
                        "HTML",
                        "CSS",
                        "SVG",
                        "PHP",
                        "SQL",
                        "Nginx",
                        "CORS",
                        "LocalStorage",
                        "X-Access-Token",
                        "Cookies",
                    ],
                }}
                iconName="gmoon"
                title="GMoon"
                src="/videos/gmoon.mp4"
                srcMobile="/videos/gmoon-mobile.mp4"
                colorName="gmoon"
                colorGlass="rgba(83, 222, 203, 0.543)"
                delay={600}
                projectProps={[
                    { title: "Start of development", value: "2022 YEAR" },
                    { title: "End of development", value: "2023 YEAR" },
                    { title: "Duration", value: "11 MONTHS" },
                    { title: "Designer", value: "DENYS UKHAN" },
                    { title: "Backender", value: "DENYS UKHAN" },
                    { title: "Frontender", value: "DENYS UKHAN" },
                    {
                        title: "Budget",
                        value: isMobile
                            ? "1 percent"
                            : "1 percent of the profit",
                    },
                ]}
            />

            <Item
                dir={1}
                text={{
                    aboutProject: `Custom-built CRM system.
Authentication and authorization: management of users, permissions, access rights, and roles.
Management of sales locations, events, tours, and products. Includes a geo-presence management module. Integration with partner APIs (for deliveries, shipments, and inventory levels).
Comprehensive system for handling and moderating customer reviews.
Order processing manager.`,
                    developmentTools: [
                        "Vanilla JS",
                        "JQuery",
                        "HTML",
                        "CSS",
                        "SVG",
                        "PHP",
                        "SQL",
                        "Nginx",
                        "CORS",
                        "LocalStorage",
                        "X-Access-Token",
                        "Cookies",
                    ],
                }}
                iconName="crm"
                title="Custom CRM"
                src="/videos/crm.mp4"
                srcMobile="/videos/crm-mobile.mp4"
                colorName="crm"
                colorGlass="rgba(199, 199, 199, 0.569)"
                delay={600}
                projectProps={[
                    { title: "Start of development", value: "2022 YEAR" },
                    { title: "End of development", value: "2023 YEAR" },
                    { title: "Duration", value: "4 MONTHS" },
                    { title: "Designer", value: "DENYS UKHAN" },
                    { title: "Backender", value: "DENYS UKHAN" },
                    { title: "Frontender", value: "DENYS UKHAN" },
                    {
                        title: "Budget",
                        value: isMobile
                            ? "1 percent"
                            : "1 percent of the profit",
                    },
                ]}
            />
        </motion.div>
    );
};
