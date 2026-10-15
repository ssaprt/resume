import { motion } from "framer-motion";
import { Items } from "./Items";
import { ThridBlockProvider } from "./Provider";
import { Title } from "./Title";

export const ThridBlock = () => {
    return (
        <ThridBlockProvider>
            <motion.div className="col-center-2 p-20 pt-4 w-full">
                <div className="absolute -z-1 left-0 top-0 w-full h-screen pointer-events-none" />

                <Title />

                <Items />
            </motion.div>
        </ThridBlockProvider>
    );
};
