import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";
import SplitText from "../components/text/ScatterText";
import { useFiveBlockContextProvider } from "./shared/useFiveBlockContextProvider";

export const CV = () => {
    const { leaveDirection, leaveProgress } = useFiveBlockContextProvider();

    return (
        <div className="h-full min-w-0 w-full row-center-3 text-curr! justify-between">
            <div
                className="border-1
                    border-curr/20
                    rounded-[12px]
                    px-6
                    py-2
                    bg-app
                     shrink-0"
            >
                <SplitText
                    text="Download CV"
                    className="text-center text-3xl! font-rob! pb-1"
                    left={{
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                        opacity: 1,
                    }}
                    right={{
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                        opacity: 1,
                    }}
                    dir={-1}
                    split={0}
                    stagger={0.2}
                    as="h1"
                    scroll={{ leaveProgress, leaveDirection }}
                />
            </div>

            <div className="w-full h-1 border-b-1 border-b-curr/30 mb-1" />

            <div className="row-center-1 ml-auto">
                <a
                    href="/cv/resume-rus.pdf"
                    download="resume.pdf"
                    data-cursor="button"
                    data-color="curr"
                    data-shadow="0 0 20px 0px"
                    className="
                        py-2
                        px-4
                        text-[12px]
                        border-1
                        border-current
                        transform
                        hover:-translate-y-[1px]
                        bg-curr
                        text-app
                        hover:bg-transparent
                        hover:text-curr
                        transition-all
                        duration-200
                        row-center-1
                        "
                >
                    <DynamicSvgIcon
                        name="download"
                        className="w-4 h-4 fill-current"
                    />
                    UKR
                </a>
                <div className="w-[1px] h-4 bg-current" />
                <a
                    href="/cv/resume-rus.pdf"
                    download="resume.pdf"
                    data-cursor="button"
                    data-color="curr"
                    data-shadow="0 0 20px 0px"
                    className="
                        py-2
                        px-4
                        text-[12px]
                        border-1
                        border-current
                        transform
                        hover:-translate-y-[1px]
                        bg-curr
                        text-app
                        hover:bg-transparent
                        hover:text-curr
                        transition-all
                        duration-200
                        row-center-1
                        "
                >
                    <DynamicSvgIcon
                        name="download"
                        className="w-4 h-4 fill-current"
                    />
                    RUS
                </a>
                <div className="w-[1px] h-4 bg-current" />
                <a
                    href="/cv/resume-eng.pdf"
                    download="resume.pdf"
                    data-cursor="button"
                    data-color="curr"
                    data-shadow="0 0 20px 0px"
                    className="
                        py-2
                        px-4
                        text-[12px]
                        border-1
                        border-current
                        transform
                        hover:-translate-y-[1px]
                        bg-curr
                        text-app
                        hover:bg-transparent
                        hover:text-curr
                        transition-all
                        duration-200
                        row-center-1
                        "
                >
                    <DynamicSvgIcon
                        name="download"
                        className="w-4 h-4 fill-current"
                    />
                    ENG
                </a>
            </div>
        </div>
    );
};
