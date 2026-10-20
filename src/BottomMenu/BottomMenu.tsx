import { BottomMenuContent } from "./BottomMenuContent";
import { BottomMenuProvider } from "./shared/BottomMenuProvider";

export const BottomMenu = () => {
    return (
        <BottomMenuProvider>
            <BottomMenuContent
    viewLinks={[
                    {
                        label: "RUS",
                        href: "/cv/resume-rus.pdf",
                        target: "_blank",
                    },
                    {
                        label: "ENG",
                        href: "/cv/resume-eng.pdf",
                        target: "_blank",
                    },
                    {
                        label: "UKR",
                        href: "/cv/resume-ukr.pdf",
                        target: "_blank",
                    },
                ]}
                downloadLinks={[
                    {
                        label: "RUS",
                        href: "/cv/resume-rus.pdf",
                        download: true,
                    },
                    {
                        label: "ENG",
                        href: "/cv/resume-eng.pdf",
                        download: true,
                    },
                    {
                        label: "UKR",
                        href: "/cv/resume-ukr.pdf",
                        download: true,
                    },
                ]}
/>
        </BottomMenuProvider>
    );
};
