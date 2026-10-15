import { createContext } from "react";
import type { PropsContext } from "./FiveBlockContect.type";

export const FiveBlockContext = createContext<PropsContext | null>(null);
