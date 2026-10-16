import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";
import SplitText from "../components/text/ScatterText";
import { useDevice } from "../scroll/useDevice";
import { useScrollElementMotion } from "../scroll/useScroll";

export const CV = () => {
    const { leaveDirection, leaveProgress, ref } = useScrollElementMotion();
    const { isMobile } = useDevice();
    const bg = isMobile ? "bg-alter-fg" : "bg-curr";
    const className = isMobile
        ? "transform scale-y-200 uppercase tracking-[0.4px] text-alter-fg mt-4"
        : "text-center lg:text-3xl! font-rob! pb-1";

    return (
        <div
            ref={ref}
            className="h-full min-w-0 w-full col-center-1 lg:row-center-3 text-curr! justify-between mb-4 lg:mb-auto"
        >
            <div
                className="
                    lg:border-1
                    lg:border-curr/20
                    rounded-[12px]
                    px-0
                    py-0
                    lg:px-6
                    lg:py-2
                    bg-app
                     shrink-0"
            >
                <SplitText
                    text="Download CV"
                    className={className}
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

            {!isMobile && (
                <div className="w-full h-1 border-b-1 border-b-curr/30 mb-1" />
            )}

            <div className="row-center-1 ml-auto">
                <a
                    href="/cv/resume-rus.pdf"
                    download="resume.pdf"
                    data-cursor="button"
                    data-color="curr"
                    data-shadow="0 0 20px 0px"
                    className={`py-2
                        px-4
                        text-[12px]
                        border-1
                        border-current
                        transform
                        hover:-translate-y-[1px]
                        ${bg}
                        text-app
                        hover:bg-transparent
                        hover:text-curr
                        transition-all
                        duration-200
                        row-center-1`}
                >
                    <DynamicSvgIcon
                        name="download"
                        className="w-4 h-4 fill-current"
                    />
                    UKR
                </a>
                <div className={`w-[1px] h-4 ${bg}`} />
                <a
                    href="/cv/resume-rus.pdf"
                    download="resume.pdf"
                    data-cursor="button"
                    data-color="curr"
                    data-shadow="0 0 20px 0px"
                    className={`py-2
                        px-4
                        text-[12px]
                        border-1
                        border-current
                        transform
                        hover:-translate-y-[1px]
                        ${bg}
                        text-app
                        hover:bg-transparent
                        hover:text-curr
                        transition-all
                        duration-200
                        row-center-1`}
                >
                    <DynamicSvgIcon
                        name="download"
                        className="w-4 h-4 fill-current"
                    />
                    RUS
                </a>
                <div className={`w-[1px] h-4 ${bg}`} />
                <a
                    href="/cv/resume-eng.pdf"
                    download="resume.pdf"
                    data-cursor="button"
                    data-color="curr"
                    data-shadow="0 0 20px 0px"
                    className={`py-2
                        px-4
                        text-[12px]
                        border-1
                        border-current
                        transform
                        hover:-translate-y-[1px]
                        ${bg}
                        text-app
                        hover:bg-transparent
                        hover:text-curr
                        transition-all
                        duration-200
                        row-center-1`}
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
