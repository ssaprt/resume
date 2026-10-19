import { useMemo, useState } from "react";
import { ThridBlockActionsContext, ThridBlockStateContext } from "./Context";
import type { CardName } from "./config";

export const ThridBlockProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [active, setActive] = useState(0);
    const [colorName, setColorName] = useState<CardName>("curr" as CardName);

    const [activeIndex, setActiveIndex] = useState(0);

    const stateValue = useMemo(
        () => ({ active, colorName, activeIndex }),
        [active, colorName, activeIndex],
    );

    const actionsValue = useMemo(
        () => ({ setActive, setColorName, setActiveIndex }),
        [setActive, setColorName, setActiveIndex],
    );

    return (
        <ThridBlockActionsContext.Provider value={actionsValue}>
            <ThridBlockStateContext.Provider value={stateValue}>
                {children}
            </ThridBlockStateContext.Provider>
        </ThridBlockActionsContext.Provider>
    );
};
