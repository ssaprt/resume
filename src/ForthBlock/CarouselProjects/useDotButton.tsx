import type { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";

type UseDotButton = {
    selectedIndex: number;
    scrollSnaps: number[];
    onDotButtonClick: (index: number) => void;
};

export const useDotButton = (
    emblaApi: EmblaCarouselType | undefined,
): UseDotButton => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onDotButtonClick = useCallback(
        (index: number) => {
            emblaApi?.scrollTo(index);
        },
        [emblaApi],
    );

    const onInit = useCallback((api: EmblaCarouselType) => {
        setScrollSnaps(api.scrollSnapList());
        setSelectedIndex(api.selectedScrollSnap());
    }, []);

    const onSelect = useCallback((api: EmblaCarouselType) => {
        setSelectedIndex(api.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        emblaApi.on("reInit", onInit).on("select", onSelect);

        queueMicrotask(() => {
            onInit(emblaApi);
        });

        return () => {
            emblaApi.off("reInit", onInit).off("select", onSelect);
        };
    }, [emblaApi, onInit, onSelect]);

    return {
        selectedIndex,
        scrollSnaps,
        onDotButtonClick,
    };
};
