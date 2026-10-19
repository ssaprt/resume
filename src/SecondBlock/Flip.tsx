import { motion } from "framer-motion";

import { ThreeModelView } from "../components/3D/ThreeModelView";

export const Flip = ({ bottom }: { bottom: number }) => {
    const rotationZ = bottom * Math.PI;

    return (
        <motion.div
            data-cursor="move"
            data-color="foreground"
            data-shadow="0 0 0"
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
                        returnSpeed={1}
                        assetName="two"
                        path="/two.glb"
                        autorotate
                        enabled
                        autorotateSpeed={15}
                        rotationZ={rotationZ}
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
