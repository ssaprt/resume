import { createPortal } from "react-dom";
import { Body } from "./Body";
import { Overlay } from "./Overlay";

export const LearningProjectModal = ({
    children,
    open,
    setOpen,
}: {
    children: React.ReactNode;
    open: boolean;
    setOpen: (value: boolean) => void;
}) => {
    const root = document.getElementById("root");

    if (!root) return null;

    return createPortal(
        <Overlay open={open}>
            <Body setOpen={setOpen}>{children}</Body>
        </Overlay>,
        root,
    );
};
