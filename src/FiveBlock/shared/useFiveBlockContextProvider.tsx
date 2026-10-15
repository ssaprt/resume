import { useContext } from "react";
import { FiveBlockContext } from "./FiveBlockContext";

export const useFiveBlockContextProvider = () => {
    const context = useContext(FiveBlockContext);
    if (!context) {
        throw new Error(
            "useFiveBlockContextProvider must be used within a FiveBlockProvider",
        );
    }

    return context;
};
