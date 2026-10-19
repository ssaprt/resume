import { BottomMenuContent } from "./BottomMenuContent";
import { BottomMenuProvider } from "./shared/BottomMenuProvider";

export const BottomMenu = () => {
    return (
        <BottomMenuProvider>
            <BottomMenuContent />
        </BottomMenuProvider>
    );
};
