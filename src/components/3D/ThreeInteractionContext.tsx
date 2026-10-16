import { createContext } from "react";

export type InteractionState = {
    paused: boolean;
};

export type InteractionRef = {
    current: InteractionState;
};

export const ThreeInteractionContext = createContext<InteractionRef | null>(
    null,
);
