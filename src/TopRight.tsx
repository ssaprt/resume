import { useCallback, useEffect, useRef, useState } from "react";
import { scrollManager } from "./scroll/ScrollManager";

export const TopRight = () => {
    const min = 1000;
    const max = 3000;
    const step = 100;

    const [value, setValue] = useState(1700);
    const ref = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);

    const progress = ((value - min) / (max - min)) * 100;

    const setFromPointer = useCallback((clientX: number) => {
        const element = ref.current;

        if (!element) return;

        const rect = element.getBoundingClientRect();
        const ratio = Math.min(
            Math.max((clientX - rect.left) / rect.width, 0),
            1,
        );

        const rawValue = min + ratio * (max - min);
        const nextValue = Math.round((rawValue - min) / step) * step + min;

        setValue(Math.min(Math.max(nextValue, min), max));
    }, []);

    useEffect(() => {
        scrollManager.snapDuration = value;
    }, [value]);

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            if (!dragging.current) return;

            setFromPointer(event.clientX);
        };

        const handlePointerUp = () => {
            dragging.current = false;
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [setFromPointer]);

    const handlePointerDown = (event: React.PointerEvent) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        setFromPointer(event.clientX);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            setValue((current) => Math.min(current + step, max));
        }

        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            setValue((current) => Math.max(current - step, min));
        }

        if (event.key === "Home") {
            event.preventDefault();
            setValue(min);
        }

        if (event.key === "End") {
            event.preventDefault();
            setValue(max);
        }
    };

    return (
        <div className="fixed right-10 top-4 z-999 flex w-auto flex-col gap-1 hidden">
            <div className="relative flex flex-row items-center justify-between px-2 pb-2">
                <span className="text-[12px]! text-alter-fg">
                    <span className="bg-alter-fg text-app! text-[10px]! py-1 px-[7px] mr-1 rounded-full">{`#`}</span>
                    Speed page inspection
                </span>

                <span className="w-9 text-center text-[12px]! text-alter-fg">
                    {value / 1000} s
                </span>
            </div>

            <div
                ref={ref}
                role="slider"
                tabIndex={0}
                aria-label="Speed page inspection"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
                className="relative h-3 w-full cursor-pointer outline-none"
            >
                <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-alter-fg/15" />

                <div
                    className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-alter-fg/45"
                    style={{ width: `${progress}%` }}
                />

                <div
                    data-cursor="move"
                    style={{
                        left: `${progress}%`,
                    }}
                    className="
                    absolute
                        top-1/2
                        size-10
                        flex
                        items-center
                        justify-center
                        -translate-y-1/2
                        -translate-x-1/2
                        rounded-full

                        hover:[&>div]:shadow-[0_0_10px_6px]
                        "
                >
                    <div
                        className="
                        transition-shadow
                        duration-300
                        ease
                        shadow-[0_0_10px_4px]
                        shadow-alter-fg
                        rounded-full
                        size-1
                        border-2
                        border-alter-fg
                        "
                    ></div>
                </div>
            </div>

            <div
                className={`w-full relative flex flex-row items-end justify-between`}
            >
                {Array.from({ length: (max - min) / step }).map((_, index) => {
                    const value = min + index * step;
                    const everyThousand = value % 500 === 0;
                    const flag = [
                        everyThousand,
                        index === 0,
                        index === (max - min) / step - 1,
                    ].includes(true);

                    return (
                        <div
                            key={value}
                            className={`relative w-[1px] ${
                                flag
                                    ? "h-[10px] bg-alter-fg/80 rounded-t-[24px]"
                                    : "h-[8px] bg-alter-fg/50"
                            } `}
                        >
                            {flag && (
                                <span className="absolute left-1/2 top-[calc(100%+4px)] text-[8px]! text-alter-fg -translate-x-1/2">
                                    {min + step * index + 100 === max
                                        ? max
                                        : min + step * index}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
