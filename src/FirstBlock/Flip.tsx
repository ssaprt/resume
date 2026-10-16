import { motion } from "framer-motion";

import { ThreeModelView } from "../components/3D/ThreeModelView";
import { useScrollElement } from "../scroll/useScroll";

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
                <div className="absolute! inset-0! w-full! h-full!">
                    <ThreeModelView
                        assetName="one"
                        path="/one.glb"
                        autorotate
                        autorotateSpeed={15}
                        rotationZ={rotationZ}
                        returnSpeed={1}
                        camera={{
                            position: [10, 0, 0],
                            fov: 12,
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};
