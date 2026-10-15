import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { NextButton, PrevButton } from "./CarouselProjectsArrowButton";
import { CarouselProjectsDots } from "./CarouselProjectsDotButtons";
import { CarouselProjectsShape } from "./CarouselProjectsShape";
import { getCarouselDotCount } from "./getCarouselDotCount";
import { usePrevNextButtons } from "./usePrevNextButtons";

const TWEEN_FACTOR_BASE = 0.52;

const COPY_COUNT = 5;
const MIDDLE_COPY = 2;

const DOT_RADIUS = 52;
const DOT_GAP = 10;
const DOT_SIZE = 6;

const numberWithinRange = (number: number, min: number, max: number): number =>
    Math.min(Math.max(number, min), max);

const modulo = (value: number, count: number) =>
    ((value % count) + count) % count;

type Props = {
    slides: React.ReactNode[];
    options?: EmblaOptionsType;
};

export const CarouselProjects = ({ slides, options }: Props) => {
    const logicalStartIndex =
        slides.length > 0 ? modulo(options?.startIndex ?? 0, slides.length) : 0;

    const renderedSlides = useMemo(
        () =>
            Array.from({ length: COPY_COUNT }, (_, copy) =>
                slides.map((node, index) => ({
                    node,
                    key: `${copy}-${index}`,
                })),
            ).flat(),
        [slides],
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
                    ? MIDDLE_COPY * slides.length + logicalStartIndex
                    : 0,
        }),
        [options, slides.length, logicalStartIndex],
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

    const containerRef = useRef<HTMLDivElement>(null);

    const [sizes, setSizes] = useState({
        width: 0,
        height: 100,
    });

    const tweenFactor = useRef(0);
    const tweenNodes = useRef<HTMLElement[]>([]);
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
    }, []);

    const setTweenFactor = useCallback((api: EmblaCarouselType) => {
        tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
    }, []);

    const tweenScale = useCallback((api: EmblaCarouselType) => {
        const engine = api.internalEngine();
        const scrollProgress = api.scrollProgress();

        api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
            let diffToTarget = scrollSnap - scrollProgress;
            const slidesInSnap = engine.slideRegistry[snapIndex];

            slidesInSnap.forEach((slideIndex) => {
                if (engine.options.loop) {
                    engine.slideLooper.loopPoints.forEach((loopItem) => {
                        const target = loopItem.target();

                        if (slideIndex === loopItem.index && target !== 0) {
                            const sign = Math.sign(target);

                            if (sign === -1) {
                                diffToTarget =
                                    scrollSnap - (1 + scrollProgress);
                            }

                            if (sign === 1) {
                                diffToTarget =
                                    scrollSnap + (1 - scrollProgress);
                            }
                        }
                    });
                }

                const tweenValue =
                    1 - Math.abs(diffToTarget * tweenFactor.current);

                const scale = numberWithinRange(tweenValue, 0, 1);

                const tweenNode = tweenNodes.current[slideIndex];

                if (!tweenNode) return;

                tweenNode.style.transform = `scale(${scale})`;
                tweenNode.style.opacity = `${scale}`;
            });
        });
    }, []);

    useLayoutEffect(() => {
        const element = containerRef.current;

        if (!element) return;

        const updateSize = () => {
            const rect = element.getBoundingClientRect();

            setSizes({
                width: rect.width,
                height: rect.height,
            });
        };

        updateSize();

        const resizeObserver = new ResizeObserver(updateSize);

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const handleSelect = useCallback(
        (api: EmblaCarouselType) => {
            if (!slides.length) return;

            const current = api.selectedScrollSnap();
            const logicalIndex = modulo(current, slides.length);

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

            if (!delta) return;

            const nextVirtualDot = activeVirtualDot.current + delta;

            activeVirtualDot.current = nextVirtualDot;
            setActiveVirtualDotIndex(nextVirtualDot);
        },
        [slides.length, renderedSlides.length],
    );

    useEffect(() => {
        activeVirtualDot.current = logicalStartIndex;
        setActiveVirtualDotIndex(logicalStartIndex);
        previousPhysicalIndex.current = null;
        pendingVirtualDot.current = null;
    }, [logicalStartIndex, slides.length]);

    useEffect(() => {
        if (!emblaApi) return;

        emblaApi
            .on("reInit", setTweenNodes)
            .on("reInit", setTweenFactor)
            .on("reInit", tweenScale)
            .on("scroll", tweenScale)
            .on("slideFocus", tweenScale)
            .on("select", handleSelect);

        queueMicrotask(() => {
            setTweenNodes(emblaApi);
            setTweenFactor(emblaApi);
            tweenScale(emblaApi);

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
        handleSelect,
    ]);

    const handleDotClick = useCallback(
        (dotIndex: number) => {
            if (!emblaApi || !slides.length) return;

            const dotCount = getCarouselDotCount(
                slides.length,
                DOT_RADIUS,
                DOT_GAP,
                DOT_SIZE,
            );

            if (!dotCount) return;

            const currentVirtualDot = activeVirtualDot.current;

            const targetVirtualDot =
                dotIndex +
                Math.round((currentVirtualDot - dotIndex) / dotCount) *
                    dotCount;

            const logicalIndex = modulo(targetVirtualDot, slides.length);

            const currentPhysical = emblaApi.selectedScrollSnap();

            const candidates = Array.from(
                { length: COPY_COUNT },
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
        [emblaApi, slides.length],
    );

    return (
        <div className="relative flex w-full flex-col items-center">
            <CarouselProjectsDots
                slideCount={slides.length}
                activeIndex={activeVirtualDotIndex}
                onClick={handleDotClick}
                radius={DOT_RADIUS}
                gap={DOT_GAP}
                dotSize={DOT_SIZE}
            />

            <div className="flex h-[100px] w-full min-w-0 items-center gap-4">
                <PrevButton
                    onClick={onPrevButtonClick}
                    disabled={prevBtnDisabled}
                />

                <div ref={containerRef} className="h-full min-w-0 flex-1">
                    <CarouselProjectsShape
                        width={sizes.width}
                        height={sizes.height}
                        bladeLength={sizes.width / 2}
                        bladeWidth={sizes.height}
                        centerRadius={70}
                        bladeRootAngle={sizes.height}
                        bladeCurve={40}
                    >
                        <div
                            ref={emblaRef}
                            className="embla__viewport relative z-2! h-full w-full overflow-hidden"
                        >
                            <div className="embla__container flex h-full">
                                {renderedSlides.map(({ node, key }) => (
                                    <div
                                        className="embla__slide h-full min-w-0 shrink-0 grow-0 basis-1/3"
                                        key={key}
                                    >
                                        <div className="embla__slide__number h-full w-full rounded-[24px]">
                                            {node}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CarouselProjectsShape>
                </div>

                <NextButton
                    onClick={onNextButtonClick}
                    disabled={nextBtnDisabled}
                />
            </div>
        </div>
    );
};
