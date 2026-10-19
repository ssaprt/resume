import SplitText from "../components/text/ScatterText";
import { useDevice } from "../scroll/useDevice";
import { Bottom } from "./Bottom";
import { Fields } from "./Fields";
import { useFiveBlockContextProvider } from "./shared/useFiveBlockContextProvider";

export const PartTwo = () => {
    const { leaveDirection, leaveProgress } = useFiveBlockContextProvider();
    const { isMobile } = useDevice();

    const style = isMobile ? "mb-0" : "";

    return (
        <div className={`col-end-3 justify-end w-auto h-full ${style}`}>
            <div className="row-center-1 w-full justify-end">
                {isMobile ? (
                    <span className="w-full text-curr! text-xs font-raj! opacity-60 mt-auto text-right pt-[1px]">
                        Responds to text input
                    </span>
                ) : (
                    <SplitText
                        text="Responds to text input"
                        className="text-center text-curr! text-xs font-raj! opacity-60 mt-auto max-w-2/4 pt-[1px] mr-2"
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
                )}
            </div>

            <Fields />
            {isMobile && <Bottom />}
        </div>
    );
};
