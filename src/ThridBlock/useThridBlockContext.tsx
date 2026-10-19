import { useContext } from "react";
import { ThridBlockActionsContext, ThridBlockStateContext } from "./Context";

const useThridBlockState = () => {
    const context = useContext(ThridBlockStateContext);

    if (!context) {
        throw new Error("ThridBlockStateContext provider is missing");
    }

    return context;
};

const useThridBlockActions = () => {
    const context = useContext(ThridBlockActionsContext);

    if (!context) {
        throw new Error("ThridBlockActionsContext provider is missing");
    }

    return context;
};

export const useThridBlockContext = () => {
    const state = useThridBlockState();
    const actions = useThridBlockActions();

    return { ...state, ...actions };
};
