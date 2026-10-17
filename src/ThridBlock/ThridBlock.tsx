import { motion } from "framer-motion";
import { useDevice } from "../scroll/useDevice";
import { Items } from "./Items";
import { ThridBlockProvider } from "./Provider";
import { Title } from "./Title";

export const ThridBlock = () => {
    const { isMobile } = useDevice();
    const p = isMobile ? "p-4" : "p-20";

    return (
        <ThridBlockProvider>
            <motion.div className={`col-center-2 ${p} pt-4 w-full`}>
                <div className="absolute -z-1 left-0 top-0 w-full h-dvh pointer-events-none" />

                <Title />

                <Items />
            </motion.div>
        </ThridBlockProvider>
    );
};
