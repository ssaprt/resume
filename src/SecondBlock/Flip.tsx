import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";

import { Suspense } from "react";
import { Item3D } from "../components/3D/Item3D";
import { useScrollElement } from "../scroll/useScroll";
import { Asset } from "../shared/AssetLoader/Asset";
import { AssetReady } from "../shared/AssetLoader/AssetReady";

export const Flip = () => {
    const { ref, bottom } = useScrollElement();

    const rotationZ = bottom * Math.PI;

    return (
        <motion.div
            data-cursor="move"
            data-color="alter-foreground"
            ref={(element) => ref(element?.parentNode as HTMLElement)}
            className="
                relative
                flex
                flex-row
                items-center
                w-2/3 md:w-1/3
                h-auto
                aspect-square
                justify-center
                rounded-full
                overflow-visible
                p-0
                z-2
            "
        >
            <div
                className="
            three-canvas
            relative
            w-full
            h-full
            overflow-visible
            rounded-full"
            >
                <Canvas
                    className="absolute! inset-0! w-full! h-full!"
                    camera={{
                        position: [10, 0, 0],
                        fov: 12,
                    }}
                >
                    <Asset name="two">
                        <Suspense fallback={null}>
                            <Item3D
                                rotationZ={rotationZ}
                                autorotate
                                autorotateSpeed={15}
                                returnSpeed={1}
                                path="/two.glb"
                            />
                            <AssetReady name="two" />
                        </Suspense>
                    </Asset>
                </Canvas>
            </div>
        </motion.div>
    );
};
