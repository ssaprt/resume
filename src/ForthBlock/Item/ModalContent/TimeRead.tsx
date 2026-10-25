import { DynamicSvgIcon } from "../../../components/Icons/DynamicSvgIcon";
import { getItemText } from "../shared/config/getItemText";
import { getReadingTime } from "../shared/config/getReadingTime";
import { useItemContext } from "../shared/hook/useItemContext";
import { Block } from "./Block";

export const TimeRead = () => {
    const project = useItemContext();
    const { minutes, seconds } = getReadingTime(project);
    const symbols = getItemText(project).length;

    return (
        <div className="w-auto grid grid-cols-2 gap-2">
            <Block className="col-center-1 py-2 px-3 rounded-md">
                <div className="row-center-1">
                    <DynamicSvgIcon name="time" className="size-12 fill-curr" />
                    <div className="col-start-0 gap-[3px]">
                        <span className="text-[0.8em]! text-curr/70">
                            Time read
                        </span>
                        <span className="text-[0.7em]!">{`${minutes} min ${seconds} sec`}</span>
                    </div>
                </div>
            </Block>
            <Block className="col-center-1 py-2 px-3 rounded-md">
                <div className="row-center-1">
                    <DynamicSvgIcon
                        name="symbols"
                        className="size-12 fill-curr"
                    />
                    <div className="col-start-0 gap-[3px]">
                        <span className="text-[0.8em]! text-curr/70">
                            Symbols
                        </span>
                        <span className="text-[0.7em]!">{`${symbols} each`}</span>
                    </div>
                </div>
            </Block>
        </div>
    );
};
