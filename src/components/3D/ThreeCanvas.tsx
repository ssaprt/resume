import { View } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, type PropsWithChildren } from "react";
import { ModelBatchPreloader } from "../../shared/AssetLoader/ModelBatchPreloader";
import {
    ThreeInteractionContext,
    type InteractionState,
} from "./ThreeInteractionContext";

type ThreeCanvasProps = PropsWithChildren<{
    className?: string;
    returnSpeed?: number;
    modelsPreloaded: boolean;
    onPreloadComplete: () => void;
}>;

export const ThreeCanvas = ({
    children,
    className = "relative isolate",

    modelsPreloaded,
    onPreloadComplete,
}: ThreeCanvasProps) => {
    const eventSourceRef = useRef<HTMLDivElement>(null);

    const interactionRef = useRef<InteractionState>({
        paused: false,
    });

    return (
        <ThreeInteractionContext.Provider value={interactionRef}>
            <div ref={eventSourceRef} className={className}>
                {children}

                <Canvas
                    eventSource={eventSourceRef}
                    frameloop={modelsPreloaded ? "always" : "never"}
                    dpr={modelsPreloaded ? [1, 1.5] : 1}
                    camera={{
                        position: [10, 0, 0],
                        fov: 12,
                    }}
                    gl={{
                        alpha: true,
                        antialias: true,
                        powerPreference: "high-performance",
                    }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        opacity: modelsPreloaded ? 1 : 0,
                        zIndex: 20,
                    }}
                >
                    {!modelsPreloaded && (
                        <ModelBatchPreloader onComplete={onPreloadComplete} />
                    )}

                    <View.Port />
                </Canvas>
            </div>
        </ThreeInteractionContext.Provider>
    );
};
