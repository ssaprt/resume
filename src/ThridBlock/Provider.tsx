import { useState } from "react";
import { ThridBlockContext } from "./Context";

export const ThridBlockProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [active, setActive] = useState(0);

    return (
        <ThridBlockContext.Provider value={{ active, setActive }}>
            {children}
        </ThridBlockContext.Provider>
    );
};
