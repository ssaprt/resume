import type { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";

type UsePrevNextButtons = {
    prevBtnDisabled: boolean;
    nextBtnDisabled: boolean;
    onPrevButtonClick: () => void;
    onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
    emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtons => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const onPrevButtonClick = useCallback(() => {
        emblaApi?.scrollPrev();
    }, [emblaApi]);

    const onNextButtonClick = useCallback(() => {
        emblaApi?.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback((api: EmblaCarouselType) => {
        setPrevBtnDisabled(!api.canScrollPrev());
        setNextBtnDisabled(!api.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        emblaApi.on("reInit", onSelect).on("select", onSelect);

        queueMicrotask(() => {
            onSelect(emblaApi);
        });

        return () => {
            emblaApi.off("reInit", onSelect).off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    };
};
