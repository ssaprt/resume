import { useScrollElement } from "../scroll/useScroll";
import { Bottom } from "./Bottom";
import { Flip } from "./Flip";
import { Left } from "./Left";
import { Right } from "./Right";

export const SecondBlock = () => {
    const { ref, bottom } = useScrollElement();
    return (
        <div
            className={`col-center-4 lg:row-center-12 justify-start lg:justify-center h-full w-full`}
        >
            <div
                ref={ref}
                className="absolute w-full h-[99.9dvh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />
            <Left />
            <Flip bottom={bottom} />
            <Bottom />
            <Right />
        </div>
    );
};
