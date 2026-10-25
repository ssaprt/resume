import { useDevice } from "../../../scroll/useDevice";

export const LearningSection = ({ v, title }: { v: string; title: string }) => {
    const { isMobile } = useDevice();
    const text = isMobile ? "text-[12px]!" : "text-[16px]!";
    return (
        <div className="row-end-1 w-full">
            <span className={`shrink-0 ${text} text-curr`}>{title}</span>
            <div className="w-full h-px mt-[2px] border-b-1 border-dashed border-curr/30" />
            <span className={`shrink-0 ${text} font-rob text-curr`}>{v}</span>
        </div>
    );
};
