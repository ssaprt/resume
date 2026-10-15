import { scrollManager } from "../scroll/ScrollManager";

export const GoPrev = () => {
    return (
        <div
            data-cursor="button"
            onClick={() => scrollManager.scrollToSection(3)}
            className="
                relative
                w-40
                h-10
                cursor-pointer"
        >
            <div
                className="
               absolute
                w-[3px]
                h-10
                left-1/2
                transform
                -translate-x-1/2
                rotate-180
                bottom-0
                bg-curr/10
                
                overflow-hidden
            "
            >
                <div
                    className="
                    absolute
                    w-[2px]
                    left-[0.5px]
                    top-0
                    bg-curr/70
                    rounded-lg
                    animate-scroll-line
                "
                />
            </div>
        </div>
    );
};
