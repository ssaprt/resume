import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react(), tailwindcss(), svgr()],

    envPrefix: ["VITE_", "NEXT_PUBLIC_"],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@utils": path.resolve(__dirname, "./src/utils"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@icons": path.resolve(__dirname, "./src/icons"),
        },
    },
});
