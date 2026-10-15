import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

import ControlScrollSection from "./components/Sections/ControlScrollSection";
import { UnControlScrollSection } from "./components/Sections/UnControlScrollSection";
import DotGrid from "./DotGrid";
import { FirstBlock } from "./FirstBlock/FirstBlock";
import { FiveBlock } from "./FiveBlock/FiveBlock";
import { ForthBlock } from "./ForthBlock/ForthBlock";
import { GlitchTransition } from "./GlitchTransition";
import { Loader } from "./Loader/Loader";
import { Menu } from "./Menu/Menu";
import { SecondBlock } from "./SecondBlock/SecondBlock";
import { ModelBatchPreloader } from "./shared/AssetLoader/ModelBatchPreloader";
import { useAssetReady } from "./shared/AssetLoader/useAssetReady";
import { ThridBlock } from "./ThridBlock/ThridBlock";
import { TopRight } from "./TopRight";

function App() {
    const isAssetReady = useAssetReady();

    const [modelsPreloaded, setModelsPreloaded] = useState(false);

    const handlePreloadComplete = useCallback(() => {
        setModelsPreloaded(true);
    }, []);

    return (
        <>
            {!modelsPreloaded && (
                <Canvas
                    frameloop="never"
                    dpr={1}
                    gl={{
                        antialias: false,
                        alpha: true,
                    }}
                    style={{
                        position: "fixed",
                        left: 0,
                        top: 0,
                        width: 1,
                        height: 1,
                        opacity: 0,
                        pointerEvents: "none",
                    }}
                >
                    <ModelBatchPreloader onComplete={handlePreloadComplete} />
                </Canvas>
            )}

            <Loader />

            <GlitchTransition active={isAssetReady} />

            <DotGrid
                gridSize={10}
                cursorRadius={50}
                falloff={22}
                baseRadius={1}
                maxRadius={2}
                baseOpacity={0.12}
                maxOpacity={0.35}
                distortion={28}
                smoothness={1}
                jellySmoothness={0.11}
                cursorDotSize={8}
                circleOpacity={1}
            />

            <TopRight />
            <Menu />

            {modelsPreloaded && (
                <div className="relative w-full">
                    <ControlScrollSection id="1">
                        <FirstBlock />
                    </ControlScrollSection>

                    <ControlScrollSection id="2">
                        <SecondBlock />
                    </ControlScrollSection>

                    <UnControlScrollSection id="3">
                        <ThridBlock />
                    </UnControlScrollSection>

                    <UnControlScrollSection id="4" style={{ zIndex: 2 }}>
                        <ForthBlock />
                    </UnControlScrollSection>

                    <ControlScrollSection id="5" className="z-1">
                        <FiveBlock />
                    </ControlScrollSection>
                </div>
            )}

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
