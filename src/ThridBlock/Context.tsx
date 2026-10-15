import { createContext } from "react";

export type PropsContext = {
    active: number;
    setActive: (active: number) => void;
};
export const ThridBlockContext = createContext<PropsContext | null>(null);
