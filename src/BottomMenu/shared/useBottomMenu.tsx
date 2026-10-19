import { useContext } from "react";
import {
    BottomMenuActionsContext,
    BottomMenuStateContext,
} from "./BottomMenuContext";

const useActions = () => {
    const context = useContext(BottomMenuActionsContext);

    if (!context) {
        throw new Error("ThridBlockActionsContext provider is missing");
    }

    return context;
};

const useState = () => {
    const context = useContext(BottomMenuStateContext);

    if (!context) {
        throw new Error("ThridBlockStateContext provider is missing");
    }

    return context;
};

export const useBottomMenu = () => {
    const actions = useActions();
    const state = useState();

    return { ...actions, ...state };
};
