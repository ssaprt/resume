import { ScrollToFuture } from "scroll-to-future";

export const ScrollBar = ({
    ref,
}: {
    ref: React.RefObject<HTMLDivElement | null>;
}) => {
    return (
        <ScrollToFuture
            target={ref}
            scrollBar={{
                widthTrack: "8px",
                superimposition: "over",
                heightTrack: "86%",
                className: "mt-10!",
            }}
            optionsTheme={{
                thumb: {
                    inactive: {
                        className: "bg-curr/50! t",
                    },
                    hover: {
                        className: "bg-curr/65! t",
                    },
                    active: {
                        className: "bg-curr/80! t",
                    },
                },
                scrollBar: {
                    inactive: {
                        className:
                            "border-1! border-curr/20! shadow-[inset_0_0_16px_0px]! shadow-curr/30!",
                    },
                    hover: {
                        className:
                            "border-1! border-curr/30! shadow-[inset_0_0_16px_0px]! shadow-curr/30!",
                    },
                    active: {
                        className:
                            "border-1! border-curr/30! shadow-[inset_0_0_16px_0px]! shadow-curr/30!",
                    },
                },
            }}
        />
    );
};
