export type ModelAsset = {
    name: string;
    path: string;
};

export const MODEL_ASSETS = [
    { name: "one", path: "/one.glb" },
    { name: "two", path: "/two.glb" },
    { name: "css", path: "/css.glb" },
    { name: "docker", path: "/docker.glb" },
    { name: "git", path: "/git.glb" },
    { name: "html", path: "/html.glb" },
    { name: "mysql", path: "/mysql.glb" },
    { name: "nestjs", path: "/nestjs.glb" },
    { name: "next", path: "/next.glb" },
    { name: "php", path: "/php.glb" },
    { name: "postgresql", path: "/postgresql.glb" },
    { name: "react", path: "/react.glb" },
    { name: "restapi", path: "/restapi.glb" },
    { name: "scss", path: "/scss.glb" },
    { name: "tailwind", path: "/tailwind.glb" },
    { name: "typescript", path: "/typescript.glb" },
] as const satisfies readonly ModelAsset[];

export const MODEL_CHUNK_SIZE = 4;

export const MODEL_ASSET_CHUNKS = Array.from(
    {
        length: Math.ceil(MODEL_ASSETS.length / MODEL_CHUNK_SIZE),
    },
    (_, index) =>
        MODEL_ASSETS.slice(
            index * MODEL_CHUNK_SIZE,
            (index + 1) * MODEL_CHUNK_SIZE,
        ),
);
