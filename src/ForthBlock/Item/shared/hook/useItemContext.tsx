import { useContext } from "react";
import { ContextItem } from "../context/ContextItem";

export const useItemContext = () => {
    const context = useContext(ContextItem);
    if (!context) {
        throw new Error("useItemContext must be used within a ItemProvider");
    }

    return context;
};
