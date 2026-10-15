import { useEffect, useState, useSyncExternalStore } from "react";

import { assetLoadStore } from "../shared/AssetLoader/AssetLoadStore";
import {
    setLoaderAnimationFinished,
    useAssetReady,
} from "../shared/AssetLoader/useAssetReady";

const buildLogs = [
    "▲ Next.js 15.2.4",
    "  Creating an optimized production build ...",
    "✓ Compiled successfully",
    "  Linting and checking validity of types ...",
    "  Collecting page data ...",
    "  Generating static pages (1/1)",
    "  Finalizing page optimization ...",
    "  Collecting build traces ...",
    "---------------------------------------------------------------",
    "Route (app)                              Size     First Load JS",
    "┌ ○ /denys-ukhan                         5.2 kB          105 kB",
    "├ ○ /exp                                 1.1 kB          101 kB",
    "├ ● /stack/[slug]                        2.4 kB          123 kB",
    "├ ● /projects/[slug]                     9.2 kB          107 kB",
    "├ ● /contancts/[slug]                    4.6 kB          210 kB",
    "└ ƒ /about/[slug]                        3.0 kB          104 kB",
    "---------------------------------------------------------------",
    "○  (Static)   prerendered as static content",
    "●  (SSG)      prerendered as static HTML (uses generateStaticParams)",
    "ƒ  (Dynamic)  server-rendered on demand",
];

const command = "npm run build & start";
const text = "text-[clamp(8px,2vw,16px)]!";

export const Loader = () => {
    const isReady = useAssetReady();

    const isAssetsReady = useSyncExternalStore(
        (listener) => assetLoadStore.subscribe(listener),
        () => assetLoadStore.isReadyAll,
        () => false,
    );

    const [commandText, setCommandText] = useState("");
    const [visibleCount, setVisibleCount] = useState(0);
    const [commandFinished, setCommandFinished] = useState(false);

    useEffect(() => {
        if (commandText.length >= command.length) {
            //eslint-disable-next-line
            setCommandFinished(true);
            return;
        }

        const timeout = window.setTimeout(() => {
            setCommandText(command.slice(0, commandText.length + 1));
        }, 35);

        return () => window.clearTimeout(timeout);
    }, [commandText]);

    useEffect(() => {
        if (!commandFinished || visibleCount >= buildLogs.length) return;

        const timeout = window.setTimeout(
            () => {
                setVisibleCount((count) => count + 1);
            },
            isAssetsReady ? 40 : 300,
        );

        return () => window.clearTimeout(timeout);
    }, [commandFinished, visibleCount, isAssetsReady]);

    useEffect(() => {
        if (visibleCount >= buildLogs.length) {
            setLoaderAnimationFinished(true);
        }
    }, [visibleCount]);

    if (isReady) return null;

    return (
        <div className="fixed left-0 top-0 z-[10000] h-screen w-screen overflow-hidden bg-app">
            <div className="row-center-1 h-10 w-full bg-fg/3">
                <div className="row-center-1 ml-4">
                    <div className="size-3 rounded-full bg-[#FF605C]" />
                    <div className="size-3 rounded-full bg-[#FFBD44]" />
                    <div className="size-3 rounded-full bg-[#00CA4E]" />
                </div>

                <span className="font-mono text-[16px]! text-fg/25">{">"}</span>

                <span className="pt-[2px] font-mono text-[14px]! text-fg/25">
                    Terminal
                </span>
            </div>

            <div className="h-screen w-full overflow-y-auto p-2">
                <div className="flex items-baseline gap-1">
                    <span className={`shrink-0 p-[2px] ${text} text-alter-fg`}>
                        ../portfolio&gt;
                    </span>

                    <span className={`min-w-0 ${text} text-fg/50!`}>
                        {commandText}

                        {!commandFinished && (
                            <span className="ml-[2px] inline-block animate-pulse">
                                _
                            </span>
                        )}
                    </span>
                </div>

                {buildLogs.slice(0, visibleCount).map((log, i) => (
                    <div key={i} className="row-center-1">
                        <span className={`p-[2px] ${text} text-alter-fg`}>
                            ../portfolio&gt;
                        </span>

                        <span
                            className={`whitespace-pre font-mono text-fg/50 ${text}`}
                        >
                            {log || "\u00A0"}
                        </span>
                    </div>
                ))}

                {commandFinished && (
                    <div className="row-center-1">
                        <span className={`p-[2px] ${text} text-alter-fg`}>
                            ../portfolio&gt;
                        </span>

                        <span className="ml-[2px] inline-block translate-y-[2px] animate-pulse text-fg/50">
                            _
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
