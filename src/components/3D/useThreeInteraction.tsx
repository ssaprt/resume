import { useContext } from "react";
import { ThreeInteractionContext } from "./ThreeInteractionContext";

export const useThreeInteraction = () => {
    const context = useContext(ThreeInteractionContext);

    if (!context) {
        throw new Error("useThreeInteraction must be used inside ThreeCanvas");
    }

    return context;
};
