import { createContext } from "react";
import type { ItemContextProps } from "../types/Item.type";

export const ContextItem = createContext<ItemContextProps | null>(null);
