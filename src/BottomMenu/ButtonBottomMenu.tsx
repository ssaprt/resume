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
            data-shadow="0 0 50px 20px"
            ref={ref}
            onClick={() => scrollManager.scrollToSection(indexBlock)}
            className={`
                col-center-0
               
                shrink-0
                ${pointer}
                select-none
                [&_span]:hover:text-curr
                `}
        >
            <span className={`${span} text-curr/50 pointer-events-none`}>
                {textButton}
            </span>
        </div>
    );
};
