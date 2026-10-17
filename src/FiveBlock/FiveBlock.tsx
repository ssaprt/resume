import { PartOne } from "./PartOne";
import { PartTwo } from "./PartTwo";

import { FiveBlockProvider } from "./shared/FiveBlockProvider";

export const FiveBlock = () => {
    return (
        <FiveBlockProvider>
            <PartOne />

            <PartTwo />
        </FiveBlockProvider>
    );
};
