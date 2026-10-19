import { animate } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import { ButtonBottomMenu } from "./ButtonBottomMenu";
import { useBottomMenu } from "./shared/useBottomMenu";

export const BottomMenuContent = () => {
    const { element } = useBottomMenu();
    const menuRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const hasPositionRef = useRef(false);

    useLayoutEffect(() => {
        const menu = menuRef.current;
        const track = trackRef.current;
        const el = element;

        if (!menu || !track || !el) return;

        let controls: ReturnType<typeof animate> | undefined;

        const update = () => {
            const menuRect = menu.getBoundingClientRect();
            const rect = el.getBoundingClientRect();

            const position = {
                left: rect.left - menuRect.left - 1,
                top: rect.top - menuRect.top - 1,
                width: rect.width,
                height: rect.height,
            };

            controls?.stop();

            if (!hasPositionRef.current) {
                Object.assign(track.style, {
                    left: `${position.left}px`,
                    top: `${position.top}px`,
                    width: `${position.width}px`,
                    height: `${position.height}px`,
                });

                hasPositionRef.current = true;
                return;
            }

            controls = animate(track, position, {
                type: "spring",
                stiffness: 360,
                damping: 25,
                mass: 0.8,
            });
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(menu);
        observer.observe(el);

        window.addEventListener("resize", update);

        return () => {
            controls?.stop();
            observer.disconnect();
            window.removeEventListener("resize", update);
        };
    }, [element]);

    return (
        <div
            ref={menuRef}
            className="
                fixed bottom-1 left-1/2 -translate-x-1/2
                w-auto h-auto rounded-full backdrop-blur-sm
                shadow-[inset_0_0_16px_0px] border-1
                border-curr/30 shadow-curr/30
                row-center-1 p-1
            "
        >
            <ButtonBottomMenu textButton="Main" indexBlock={0} />
            <ButtonBottomMenu textButton="Experience" indexBlock={1} />
            <ButtonBottomMenu textButton="Stack" indexBlock={2} />
            <ButtonBottomMenu textButton="Projects" indexBlock={3} />
            <ButtonBottomMenu textButton="Contacts" indexBlock={4} />

            <div
                ref={trackRef}
                className="
                    pointer-events-none absolute rounded-full
                    backdrop-blur-sm shadow-[inset_0_0_16px_0px]
                    border-1 border-curr/30 shadow-curr/30
                "
            />
        </div>
    );
};
