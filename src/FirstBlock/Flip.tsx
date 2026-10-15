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
            data-color="foreground"
            data-shadow="0 0 0"
            ref={(element) => ref(element?.parentNode as HTMLElement)}
            className="
                relative
                flex
                flex-row
                items-center
                w-6/8
                max-w-[340px]
                lg:max-w-full
                lg:w-1/3
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
                    <Asset name="one">
                        <Suspense fallback={null}>
                            <Item3D
                                rotationZ={rotationZ}
                                autorotate
                                autorotateSpeed={15}
                                returnSpeed={1}
                                path="/one.glb"
                            />
                            <AssetReady name="one" />
                        </Suspense>
                    </Asset>
                </Canvas>
            </div>
        </motion.div>
    );
};
