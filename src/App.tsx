import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import ControlScrollSection from "./components/Sections/ControlScrollSection";
import { UnControlScrollSection } from "./components/Sections/UnControlScrollSection";

import { ThreeCanvas } from "./components/3D/ThreeCanvas";
import DotGrid from "./DotGrid";
import { FirstBlock } from "./FirstBlock/FirstBlock";
import { FiveBlock } from "./FiveBlock/FiveBlock";
import { ForthBlock } from "./ForthBlock/ForthBlock";
import { GlitchTransition } from "./GlitchTransition";
import { Loader } from "./Loader/Loader";
import { Menu } from "./Menu/Menu";

import { BottomMenu } from "./BottomMenu/BottomMenu";
import { ToTop } from "./Menu/ToTop";
import { scrollManager } from "./scroll/ScrollManager";
import { useDevice } from "./scroll/useDevice";
import { SecondBlock } from "./SecondBlock/SecondBlock";
import { useAssetReady } from "./shared/AssetLoader/useAssetReady";
import { ThridBlock } from "./ThridBlock/ThridBlock";

function App() {
    const isAssetReady = useAssetReady();
    const { isDesktop } = useDevice();
    const p = isDesktop ? "p-0" : "pl-0";

    const [modelsPreloaded, setModelsPreloaded] = useState(false);

    useEffect(() => {
        scrollManager.init();

        return () => {
            scrollManager.destroy();
        };
    }, []);

    useEffect(() => {
        scrollManager.snapDuration = isDesktop ? 1700 : 1000;
    }, [isDesktop]);

    const handlePreloadComplete = useCallback(() => {
        setModelsPreloaded(true);
    }, []);

    useEffect(() => {
        if (!modelsPreloaded) {
            return;
        }

        scrollManager.restorePosition();
    }, [modelsPreloaded]);

    return (
        <>
            <ThreeCanvas
                modelsPreloaded={modelsPreloaded}
                onPreloadComplete={handlePreloadComplete}
                returnSpeed={1}
            >
                <div id="scroll-container">
                    {/* {!isDesktop && <div className="mobile-bg" />} */}
                    <div id="scroll-content">
                        {modelsPreloaded && (
                            <main className={`relative w-full ${p}`}>
                                <ControlScrollSection id="1">
                                    <FirstBlock />
                                </ControlScrollSection>

                                <ControlScrollSection id="2">
                                    <SecondBlock />
                                </ControlScrollSection>

                                <UnControlScrollSection id="3">
                                    <ThridBlock />
                                </UnControlScrollSection>

                                <UnControlScrollSection
                                    id="4"
                                    style={{ zIndex: 2 }}
                                >
                                    <ForthBlock />
                                </UnControlScrollSection>
                                {!isDesktop ? (
                                    <UnControlScrollSection id="5">
                                        <FiveBlock />
                                    </UnControlScrollSection>
                                ) : (
                                    <ControlScrollSection id="5">
                                        <FiveBlock />
                                    </ControlScrollSection>
                                )}
                            </main>
                        )}
                    </div>
                </div>
            </ThreeCanvas>

            <Loader />

            <GlitchTransition active={isAssetReady} />

            <DotGrid
                gridSize={10}
                cursorRadius={50}
                falloff={22}
                baseRadius={1}
                maxRadius={2}
                baseOpacity={0.22}
                maxOpacity={0.35}
                distortion={28}
                smoothness={1}
                jellySmoothness={0.11}
                cursorDotSize={8}
                circleOpacity={1}
            />

            {isDesktop && <Menu />}
            {!isDesktop && <ToTop />}

            <BottomMenu />

            <motion.div
                className="pointer-events-none fixed inset-0 z-[9999]"
                initial={{
                    opacity: 1,
                    backdropFilter: "blur(0px)",
                }}
                animate={{
                    opacity: isAssetReady ? 0 : 1,
                    backdropFilter: isAssetReady ? "blur(0px)" : "blur(24px)",
                }}
                transition={{
                    opacity: {
                        duration: 1,
                        ease: "easeOut",
                    },
                    backdropFilter: {
                        duration: 1,
                        ease: [0.22, 1, 0.36, 1],
                    },
                }}
            />
        </>
    );
}

export default App;
