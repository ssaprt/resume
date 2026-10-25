import { useRef } from "react";
import { Fields } from "../../../FiveBlock/Fields";
import { FiveBlockProvider } from "../../../FiveBlock/shared/FiveBlockProvider";
import { MagneticShineButton } from "../../../ForthBlock/Item/MagneticShineButton";
import { useDevice } from "../../../scroll/useDevice";
import { ButtonHide } from "./ButtonHide";
import { ScrollBar } from "./ScrollBar";

export const Body = ({
    setOpen,
    children,
}: {
    setOpen: (open: boolean) => void;
    children: React.ReactNode;
}) => {
    const { isMobile } = useDevice();
    const ref = useRef<HTMLDivElement>(null);
    return (
        <div
            ref={ref}
            className={`
              w-full
                            flex-1
                            min-h-0
                            overflow-y-auto
                            col-center-10
                            ${isMobile ? "p-4" : "p-10"}
                            pt-0
                            rounded-[40px_40px_0_0]`}
        >
            <ButtonHide setOpen={setOpen} />
            {children}

            <span className="text-2xl! -mb-20 mt-10 max-w-8/10 text-center">
                If there’s something you’d like to ask
            </span>
            <FiveBlockProvider>
                <Fields unused />
            </FiveBlockProvider>
            <div className="perspective-[1000px] -mt-16">
                <MagneticShineButton
                    text="Close"
                    onClick={() => setOpen(false)}
                />
            </div>

            <ScrollBar ref={ref} />
        </div>
    );
};
