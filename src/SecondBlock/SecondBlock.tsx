import { Bottom } from "./Bottom";
import { Flip } from "./Flip";
import { Left } from "./Left";
import { Right } from "./Right";

export const SecondBlock = () => {
    return (
        <div className="col-center-4 md:row-center-12 justify-center h-screen z-5">
            <Left />
            <Flip />
            <Bottom />

            <Right />
        </div>
    );
};
