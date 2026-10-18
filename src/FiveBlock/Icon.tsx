import { useDevice } from "../scroll/useDevice";
import { Letters } from "./Letters";

export const Icon = () => {
    const { isMobile } = useDevice();

    const shadow = isMobile
        ? "shadow-[0_0_0px_1px] shadow-curr/50 bg-curr/10 w-[calc(100%-54px)] h-[calc(100%-54px)] bg-app!"
        : "shadow-[0_0_1px_1px] shadow-curr/30 bg-curr/3 w-[calc(100%-66px)] h-[calc(100%-66px)]";

    return (
        <div className="pointer-events-none absolute inset-0 -z-[1] rounded-inherit">
            <Letters needleVariant="slim" />
            <div
                className={` rounded-[12px] absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${shadow}`}
            />
        </div>
    );
};
