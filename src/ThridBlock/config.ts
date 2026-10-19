export const types = [
    "All",
    "Frontend",
    "Backend",
    "Lenguage",
    "Markup",
    "Styling",
    "Database",
    "Api",
    "Infrastructure",
];

export type CardName =
    | "curr"
    | "react"
    | "next"
    | "typescript"
    | "nestjs"
    | "php"
    | "css"
    | "html"
    | "scss"
    | "mysql"
    | "postgresql"
    | "restapi"
    | "tailwind"
    | "docker"
    | "git";

export const colors: Record<
    CardName,
    {
        text: string;
        bg: string;
        border: string;
        outline: string;
        fill: string;
    }
> = {
    curr: {
        text: "text-curr",
        bg: "bg-curr",
        border: "border-curr/50",
        outline: "outline-curr",
        fill: "fill-curr",
    },
    react: {
        text: "text-react",
        bg: "bg-react",
        border: "border-react/50",
        outline: "outline-react",
        fill: "fill-react",
    },
    next: {
        text: "text-next",
        bg: "bg-next",
        border: "border-next/50",
        outline: "outline-next",
        fill: "fill-next",
    },
    typescript: {
        text: "text-typescript",
        bg: "bg-typescript",
        border: "border-typescript/50",
        outline: "outline-typescript",
        fill: "fill-typescript",
    },
    nestjs: {
        text: "text-nestjs",
        bg: "bg-nestjs",
        border: "border-nestjs/50",
        outline: "outline-nestjs",
        fill: "fill-nestjs",
    },
    php: {
        text: "text-php",
        bg: "bg-php",
        border: "border-php/50",
        outline: "outline-php",
        fill: "fill-php",
    },
    css: {
        text: "text-css",
        bg: "bg-css",
        border: "border-css/50",
        outline: "outline-css",
        fill: "fill-css",
    },
    html: {
        text: "text-html",
        bg: "bg-html",
        border: "border-html/50",
        outline: "outline-html",
        fill: "fill-html",
    },
    scss: {
        text: "text-scss",
        bg: "bg-scss",
        border: "border-scss/50",
        outline: "outline-scss",
        fill: "fill-scss",
    },
    mysql: {
        text: "text-mysql",
        bg: "bg-mysql",
        border: "border-mysql/50",
        outline: "outline-mysql",
        fill: "fill-mysql",
    },
    postgresql: {
        text: "text-postgresql",
        bg: "bg-postgresql",
        border: "border-postgresql/50",
        outline: "outline-postgresql",
        fill: "fill-postgresql",
    },
    restapi: {
        text: "text-restapi",
        bg: "bg-restapi",
        border: "border-restapi/50",
        outline: "outline-restapi",
        fill: "fill-restapi",
    },
    tailwind: {
        text: "text-tailwind",
        bg: "bg-tailwind",
        border: "border-tailwind/50",
        outline: "outline-tailwind",
        fill: "fill-tailwind",
    },
    docker: {
        text: "text-docker",
        bg: "bg-docker",
        border: "border-docker/50",
        outline: "outline-docker",
        fill: "fill-docker",
    },
    git: {
        text: "text-git",
        bg: "bg-git",
        border: "border-git/50",
        outline: "outline-git",
        fill: "fill-git",
    },
};
