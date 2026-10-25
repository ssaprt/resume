import { useRef } from "react";
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

            <div className="perspective-[1000px]">
                <MagneticShineButton
                    text="Close"
                    onClick={() => setOpen(false)}
                />
            </div>

            <ScrollBar ref={ref} />
        </div>
    );
};
