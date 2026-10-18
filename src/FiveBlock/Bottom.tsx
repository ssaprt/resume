import { useDevice } from "../scroll/useDevice";

export const Bottom = () => {
    const { isMobile } = useDevice();
    const m = isMobile
        ? "[&_*]:text-[16px]! col-end-3"
        : "pl-6 [&_*]:text-[12px]! row-center-2";

    return (
        <div className={`w-full mt-auto p-3 flex-wrap ${m}`}>
            <span className="text-curr shrink-0">
                2026 - all rights reserved
            </span>
            {!isMobile && (
                <div className="size-1 rounded-full bg-crm/50 shrink-0" />
            )}
            <span className="text-curr shrink-0">
                Designed and developed by Denys Ukhan
            </span>
            {!isMobile && (
                <div className="size-1 rounded-full bg-crm/50 shrink-0" />
            )}
            <span className="text-curr shrink-0">
                fasingtondenzel@gmail.com
            </span>
        </div>
    );
};
