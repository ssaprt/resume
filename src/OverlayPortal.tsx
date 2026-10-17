import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export const OverlayPortal = ({ children }: PropsWithChildren) => {
    const root = document.getElementById("overlay-root");

    if (!root) return null;

    return createPortal(children, root);
};
