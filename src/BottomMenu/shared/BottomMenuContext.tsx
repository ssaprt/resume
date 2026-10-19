import { createContext } from "react";

export type BottomMenuContextProps = {
    index: number;
    setIndex: (index: number) => void;
    element: HTMLElement | null;
    setElement: (element: HTMLElement | null) => void;
};

export type BottomMenuContextActionsProps = Pick<
    BottomMenuContextProps,
    "setIndex" | "setElement"
>;

export type BottomMenuContextStateProps = Pick<
    BottomMenuContextProps,
    "index" | "element"
>;

export const BottomMenuActionsContext =
    createContext<BottomMenuContextActionsProps | null>(null);

export const BottomMenuStateContext =
    createContext<BottomMenuContextStateProps | null>(null);
