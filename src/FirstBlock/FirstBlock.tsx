import { Bottom } from "./Bottom";
import { Flip } from "./Flip";
import { Left } from "./Left";
import { Right } from "./Right";

export const FirstBlock = () => {
    return (
        <div className="col-center-4 md:row-center-12 justify-center h-full">
            <Left />
            <Flip />
            <Bottom />
            <Right />
        </div>
    );
};
