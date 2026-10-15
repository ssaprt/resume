export const resolveDotSize = (gap: number, dotSize?: number) =>
    dotSize ?? Math.min(6, Math.max(2, gap * 0.4));

export const getCarouselDotCount = (
    slideCount: number,
    radius: number,
    gap: number,
    dotSize?: number,
) => {
    if (slideCount <= 0 || radius <= 0) {
        return 0;
    }

    const size = resolveDotSize(gap, dotSize);

    const circumference = 2 * Math.PI * radius;

    const minStep = Math.max(gap + size, 1);

    const capacity = Math.floor(circumference / minStep);

    if (slideCount === 1) {
        return Math.max(1, capacity);
    }

    const grouped = Math.floor(capacity / slideCount) * slideCount;

    return Math.max(slideCount, grouped);
};
