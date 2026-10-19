import { useEffect, useRef } from "react";
import { scrollManager } from "../scroll/ScrollManager";
import { useDevice } from "../scroll/useDevice";
import { useScroll } from "../scroll/useScroll";
import { useBottomMenu } from "./shared/useBottomMenu";

type Props = {
    textButton: string;
    indexBlock: number;
};

export const ButtonBottomMenu = ({ textButton, indexBlock }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const { setElement } = useBottomMenu();
    const { isMobile } = useDevice();
    const { activeSectionIndex } = useScroll();

    const span = isMobile ? "text-[10px]! px-3 py-2" : "text-[12px]! px-2 py-1";

    const pointer =
        activeSectionIndex === indexBlock ? "pointer-events-none" : "";

    useEffect(() => {
        if (activeSectionIndex === indexBlock && ref.current) {
            setElement(ref.current);
        }
    }, [activeSectionIndex, indexBlock, setElement]);

    return (
        <div
            data-cursor="button"
            data-color="curr"
            ref={ref}
            onClick={(e) => {
                setElement(e.currentTarget);
                scrollManager.scrollToSection(indexBlock);
            }}
            className={`
                col-center-0
                gap-[1px]
                shrink-0
                ${pointer}
                select-none
                `}
        >
            <span
                className={`${span} text-curr/50 hover:text-curr pointer-events-none`}
            >
                {textButton}
            </span>
        </div>
    );
};
