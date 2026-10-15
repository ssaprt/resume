import { useContext } from "react";
import { ThridBlockContext } from "./Context";

export const useThridBlockContext = () => {
    const context = useContext(ThridBlockContext);
    if (!context) {
        throw new Error(
            "useThridBlockContext must be used within a ThridBlockProvider",
        );
    }
    return context;
};
