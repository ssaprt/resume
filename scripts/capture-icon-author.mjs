import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const URL = "http://localhost:5173";

const OUTPUT_DIR = "./tmp/icon-author-frames";
const OUTPUT = "./icon-author.webm";

const WIDTH = 800;
const HEIGHT = 800;

const FPS = 60;
const DURATION = 13700;

const FRAME_TIME = 1000 / FPS;

const runFfmpeg = (args) =>
    new Promise((resolve, reject) => {
        const process = spawn("ffmpeg", args, {
            stdio: "inherit",
            shell: true,
        });

        process.on("error", reject);

        process.on("close", (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            reject(
                new Error(
                    `FFmpeg завершился с кодом ${code}`,
                ),
            );
        });
    });

const main = async () => {
    if (existsSync(OUTPUT_DIR)) {
        await rm(OUTPUT_DIR, {
            recursive: true,
            force: true,
        });
    }

    await mkdir(OUTPUT_DIR, {
        recursive: true,
    });

    const browser = await chromium.launch({
        channel: "chrome",
        headless: true,
    });

    const page = await browser.newPage({
        viewport: {
            width: WIDTH,
            height: HEIGHT,
        },
        deviceScaleFactor: 1,
    });

    await page.goto(URL, {
        waitUntil: "networkidle",
    });

    await page.waitForTimeout(500);

    const svg = page
        .locator('svg[viewBox="0 0 155 187"]')
        .first();

    await svg.waitFor({
        state: "visible",
        timeout: 10000,
    });

    await page.evaluate(() => {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.style.margin = "0";
    });

    await page.waitForTimeout(300);

    const totalFrames = Math.ceil(
        (DURATION / 1000) * FPS,
    );

    console.log(
        `Запись ${totalFrames} кадров при ${FPS} FPS`,
    );

    const startTime = performance.now();

    for (
        let frame = 0;
        frame < totalFrames;
        frame += 1
    ) {
        const targetTime =
            startTime + frame * FRAME_TIME;

        const now = performance.now();
        const waitTime = targetTime - now;

        if (waitTime > 0) {
            await page.waitForTimeout(waitTime);
        }

        const pngBuffer = await page.screenshot({
            type: "png",
            omitBackground: true,
        });

        const filename =
            `${OUTPUT_DIR}/frame-${String(frame).padStart(5, "0")}.png`;

        await writeFile(filename, pngBuffer);

        if (frame % FPS === 0) {
            const seconds = (
                frame / FPS
            ).toFixed(2);

            console.log(
                `Кадр ${frame}/${totalFrames} — ${seconds}s`,
            );
        }
    }

    await browser.close();

    console.log("Сборка WebM...");

    await runFfmpeg([
        "-y",

        "-framerate",
        String(FPS),

        "-i",
        `${OUTPUT_DIR}/frame-%05d.png`,

        "-c:v",
        "libvpx-vp9",

        "-pix_fmt",
        "yuva420p",

        "-auto-alt-ref",
        "0",

        "-b:v",
        "0",

        "-crf",
        "18",

        OUTPUT,
    ]);

    console.log("");
    console.log(`WebM готов: ${OUTPUT}`);
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});