import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useDevice } from "../../scroll/useDevice";
import type { CardName } from "../../ThridBlock/config";
import { useThridBlockContext } from "../../ThridBlock/useThridBlockContext";
import { NextButton, PrevButton } from "./CarouselProjectsArrowButton";
import { CarouselProjectsDots } from "./CarouselProjectsDotButtons";
import { getCarouselDotCount } from "./getCarouselDotCount";
import { usePrevNextButtons } from "./usePrevNextButtons";

const DOT_RADIUS = 20;
const DOT_GAP = 10;
const DOT_SIZE = 6;

type Slide = {
    colorName: CardName;
    item: React.ReactNode;
};

type Props = {
    slides: Slide[];
    options?: EmblaOptionsType;
};

const numberWithinRange = (number: number, min: number, max: number) =>
    Math.min(Math.max(number, min), max);

const modulo = (value: number, count: number) =>
    ((value % count) + count) % count;

export const CarouselProjects = ({ slides, options }: Props) => {
    const { isMobile } = useDevice();
    const { setColorName, setActiveIndex } = useThridBlockContext();

    const copyCount = isMobile ? 3 : slides.length >= 5 ? 1 : 3;
    const middleCopy = copyCount === 1 ? 0 : 1;

    const logicalStartIndex =
        slides.length > 0 ? modulo(options?.startIndex ?? 0, slides.length) : 0;

    const tweenFactorBase = isMobile ? 0.2 : 0.2;

    const slidesRef = useRef(slides);

    slidesRef.current = slides;

    const lastColorName = useRef<CardName | null>(null);

    const renderedSlides = useMemo(
        () =>
            Array.from({ length: copyCount }, (_, copy) =>
                slides.map((slide, index) => ({
                    slide,
                    key: `${copy}-${index}`,
                })),
            ).flat(),
        [slides, copyCount],
    );

    const emblaOptions = useMemo(
        () => ({
            ...options,
            loop: true,
            containScroll: false as const,
            slidesToScroll: 1,
            align: "center" as const,
            startIndex:
                slides.length > 0
                    ? middleCopy * slides.length + logicalStartIndex
                    : 0,
        }),
        [options, slides.length, logicalStartIndex, middleCopy],
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

    const tweenFactor = useRef(0);
    const tweenNodes = useRef<HTMLElement[]>([]);
    const lastScales = useRef<number[]>([]);
    const previousPhysicalIndex = useRef<number | null>(null);
    const activeVirtualDot = useRef(logicalStartIndex);
    const pendingVirtualDot = useRef<number | null>(null);

    const [activeVirtualDotIndex, setActiveVirtualDotIndex] =
        useState(logicalStartIndex);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

    const setTweenNodes = useCallback((api: EmblaCarouselType) => {
        tweenNodes.current = api
            .slideNodes()
            .map(
                (slideNode) =>
                    slideNode.querySelector(
                        ".embla__slide__number",
                    ) as HTMLElement,
            );

        lastScales.current = [];
    }, []);

    const syncActiveSlide = useCallback(
        (api: EmblaCarouselType) => {
            const currentSlides = slidesRef.current;

            if (!currentSlides.length) {
                return;
            }

            const logicalIndex = modulo(
                api.selectedScrollSnap(),
                currentSlides.length,
            );

            setActiveIndex(logicalIndex);

            const nextColor = currentSlides[logicalIndex].colorName;

            if (lastColorName.current !== nextColor) {
                lastColorName.current = nextColor;
                setColorName(nextColor);
            }
        },
        [setActiveIndex, setColorName],
    );

    const setTweenFactor = useCallback(
        (api: EmblaCarouselType) => {
            tweenFactor.current = tweenFactorBase * api.scrollSnapList().length;
        },
        [tweenFactorBase],
    );

    const tweenScale = useCallback((api: EmblaCarouselType) => {
        const engine = api.internalEngine();
        const scrollProgress = api.scrollProgress();
        const loopPoints = engine.options.loop
            ? engine.slideLooper.loopPoints
            : [];

        api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
            engine.slideRegistry[snapIndex].forEach((slideIndex) => {
                let diffToTarget = scrollSnap - scrollProgress;

                const target =
                    loopPoints
                        .find((loopItem) => loopItem.index === slideIndex)
                        ?.target() ?? 0;

                if (target < 0) {
                    diffToTarget = scrollSnap - (1 + scrollProgress);
                }

                if (target > 0) {
                    diffToTarget = scrollSnap + (1 - scrollProgress);
                }

                const scale = numberWithinRange(
                    1 - Math.abs(diffToTarget * tweenFactor.current),
                    0,
                    1,
                );

                const tweenNode = tweenNodes.current[slideIndex];

                if (!tweenNode) {
                    return;
                }

                if (scale === 0 && lastScales.current[slideIndex] === 0) {
                    return;
                }

                lastScales.current[slideIndex] = scale;

                tweenNode.style.transform = `scale(${scale})`;
                tweenNode.style.opacity = `${scale}`;
                tweenNode.style.contentVisibility = scale === 0 ? "hidden" : "";
            });
        });
    }, []);

    const handleSelect = useCallback(
        (api: EmblaCarouselType) => {
            if (!slides.length) {
                return;
            }

            const current = api.selectedScrollSnap();
            const logicalIndex = modulo(current, slides.length);

            syncActiveSlide(api);

            const pending = pendingVirtualDot.current;

            if (
                pending !== null &&
                modulo(pending, slides.length) === logicalIndex
            ) {
                activeVirtualDot.current = pending;
                setActiveVirtualDotIndex(pending);
                pendingVirtualDot.current = null;
                previousPhysicalIndex.current = current;
                return;
            }

            const previous = previousPhysicalIndex.current;
            previousPhysicalIndex.current = current;

            if (previous === null) {
                activeVirtualDot.current = logicalIndex;
                setActiveVirtualDotIndex(logicalIndex);
                return;
            }

            const physicalCount = renderedSlides.length;

            let delta = current - previous;

            if (delta > physicalCount / 2) {
                delta -= physicalCount;
            }

            if (delta < -physicalCount / 2) {
                delta += physicalCount;
            }

            if (!delta) {
                return;
            }

            const nextVirtualDot = activeVirtualDot.current + delta;

            activeVirtualDot.current = nextVirtualDot;
            setActiveVirtualDotIndex(nextVirtualDot);
        },
        [slides.length, renderedSlides.length, syncActiveSlide],
    );

    useEffect(() => {
        activeVirtualDot.current = logicalStartIndex;
        //eslint-disable-next-line
        setActiveVirtualDotIndex(logicalStartIndex);
        previousPhysicalIndex.current = null;
        pendingVirtualDot.current = null;
    }, [logicalStartIndex, slides]);

    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        emblaApi
            .on("reInit", setTweenNodes)
            .on("reInit", setTweenFactor)
            .on("reInit", tweenScale)
            .on("reInit", syncActiveSlide)
            .on("scroll", tweenScale)
            .on("slideFocus", tweenScale)
            .on("select", handleSelect);

        queueMicrotask(() => {
            setTweenNodes(emblaApi);
            setTweenFactor(emblaApi);
            tweenScale(emblaApi);
            syncActiveSlide(emblaApi);

            const current = emblaApi.selectedScrollSnap();

            previousPhysicalIndex.current = current;

            const logicalIndex =
                slides.length > 0 ? modulo(current, slides.length) : 0;

            activeVirtualDot.current = logicalIndex;
            setActiveVirtualDotIndex(logicalIndex);
        });

        return () => {
            emblaApi
                .off("reInit", setTweenNodes)
                .off("reInit", setTweenFactor)
                .off("reInit", tweenScale)
                .off("reInit", syncActiveSlide)
                .off("scroll", tweenScale)
                .off("slideFocus", tweenScale)
                .off("select", handleSelect);
        };
    }, [
        emblaApi,
        slides.length,
        setTweenNodes,
        setTweenFactor,
        tweenScale,
        syncActiveSlide,
        handleSelect,
    ]);

    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        syncActiveSlide(emblaApi);
    }, [emblaApi, slides, syncActiveSlide]);

    const handleDotClick = useCallback(
        (dotIndex: number) => {
            if (!emblaApi || !slides.length) {
                return;
            }

            const dotCount = getCarouselDotCount(
                slides.length,
                DOT_RADIUS,
                DOT_GAP,
                DOT_SIZE,
            );

            if (!dotCount) {
                return;
            }

            const currentVirtualDot = activeVirtualDot.current;

            const targetVirtualDot =
                dotIndex +
                Math.round((currentVirtualDot - dotIndex) / dotCount) *
                    dotCount;

            const logicalIndex = modulo(targetVirtualDot, slides.length);
            const currentPhysical = emblaApi.selectedScrollSnap();

            const candidates = Array.from(
                { length: copyCount },
                (_, copy) => copy * slides.length + logicalIndex,
            );

            const targetPhysical = candidates.reduce((closest, candidate) =>
                Math.abs(candidate - currentPhysical) <
                Math.abs(closest - currentPhysical)
                    ? candidate
                    : closest,
            );

            activeVirtualDot.current = targetVirtualDot;
            setActiveVirtualDotIndex(targetVirtualDot);

            if (targetPhysical === currentPhysical) {
                pendingVirtualDot.current = null;
                return;
            }

            pendingVirtualDot.current = targetVirtualDot;
            emblaApi.scrollTo(targetPhysical);
        },
        [emblaApi, slides.length, copyCount],
    );

    const basis = isMobile ? "basis-[90vw]" : "basis-[40vw]";

    return (
        <div className="col-center-2 w-full">
            <div className="z-4 flex h-full w-full min-w-0 items-center gap-4">
                <div className="h-full min-w-0 flex-1">
                    <div
                        ref={emblaRef}
                        className="embla__viewport relative z-2! h-full w-full"
                    >
                        <div className="embla__container flex h-full w-full">
                            {renderedSlides.map(({ slide, key }) => (
                                <div
                                    className={`embla__slide h-full min-w-0 shrink-0 grow-0 ${basis}`}
                                    key={key}
                                >
                                    <div className="embla__slide__number h-full w-full">
                                        {slide.item}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="z-5 w-full row-center-5 justify-center">
                <PrevButton
                    onClick={onPrevButtonClick}
                    disabled={prevBtnDisabled}
                />

                <CarouselProjectsDots
                    slideCount={slides.length}
                    activeIndex={activeVirtualDotIndex}
                    onClick={handleDotClick}
                    radius={DOT_RADIUS}
                    gap={DOT_GAP}
                    dotSize={DOT_SIZE}
                />

                <NextButton
                    onClick={onNextButtonClick}
                    disabled={nextBtnDisabled}
                />
            </div>
        </div>
    );
};
