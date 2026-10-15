import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";
import SplitText from "../components/text/ScatterText";
import { Fields } from "./Fields";
import { useFiveBlockContextProvider } from "./shared/useFiveBlockContextProvider";

import { motion } from "framer-motion";

export const PartTwo = () => {
    const { leaveDirection, leaveProgress } = useFiveBlockContextProvider();

    return (
        <motion.div style={{}} className="col-end-3 justify-end w-auto h-full">
            <div className="row-center-1 w-full justify-end">
                <DynamicSvgIcon name="arr" className="size-4 fill-crm/60" />
                <SplitText
                    text="Responds to text input"
                    className="text-center text-crm! text-xs font-raj! opacity-60 mt-auto max-w-2/4 pt-[1px] mr-2"
                    left={{
                        x: 0,
                        y: 0,
                        rotate: 20,
                        scale: 0,
                        opacity: 0,
                    }}
                    right={{
                        x: 0,
                        y: 0,
                        rotate: 20,
                        scale: 0,
                        opacity: 0,
                    }}
                    dir={-1}
                    split={0}
                    as="span"
                    scroll={{ leaveProgress, leaveDirection }}
                />
            </div>

            <Fields />
        </motion.div>
    );
};
