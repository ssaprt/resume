import { useState } from "react";
import {
    BottomMenuActionsContext,
    BottomMenuStateContext,
} from "./BottomMenuContext";

export const BottomMenuProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [index, setIndex] = useState(0);
    const [element, setElement] = useState<HTMLElement | null>(null);
    return (
        <BottomMenuStateContext.Provider value={{ index, element }}>
            <BottomMenuActionsContext.Provider value={{ setIndex, setElement }}>
                {children}
            </BottomMenuActionsContext.Provider>
        </BottomMenuStateContext.Provider>
    );
};
