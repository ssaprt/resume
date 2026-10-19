import { createContext } from "react";
import type { CardName } from "./config";

export type PropsContext = {
    active: number;
    setActive: (active: number) => void;
    colorName: CardName;
    setColorName: (colorName: CardName) => void;
    activeIndex: number;
    setActiveIndex: (activeIndex: number) => void;
};

export type ThridBlockState = Pick<
    PropsContext,
    "active" | "colorName" | "activeIndex"
>;

export type ThridBlockActions = Pick<
    PropsContext,
    "setActive" | "setColorName" | "setActiveIndex"
>;

export const ThridBlockStateContext = createContext<ThridBlockState | null>(
    null,
);

export const ThridBlockActionsContext = createContext<ThridBlockActions | null>(
    null,
);
