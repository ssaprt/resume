import { useState } from "react";
import { colors } from "./Item/shared/config/colors.config";
import { useItemContext } from "./Item/shared/hook/useItemContext";
import { Video } from "./Video";

const getPoster = (src: string) => src.replace(/\.[^.]+$/, ".webp");

export const Videos = () => {
    const { colorName, src, srcMobile } = useItemContext();

    const color = colors[colorName];

    const desktopPoster = getPoster(src);
    const mobilePoster = srcMobile ? getPoster(srcMobile) : undefined;

    const [desktopRatio, setDesktopRatio] = useState<number | null>(null);
    const [mobileRatio, setMobileRatio] = useState<number | null>(null);

    const handleDesktopPosterLoad = (
        event: React.SyntheticEvent<HTMLImageElement>,
    ) => {
        const image = event.currentTarget;

        if (image.naturalWidth && image.naturalHeight) {
            setDesktopRatio(image.naturalWidth / image.naturalHeight);
        }
    };

    const handleMobilePosterLoad = (
        event: React.SyntheticEvent<HTMLImageElement>,
    ) => {
        const image = event.currentTarget;

        if (image.naturalWidth && image.naturalHeight) {
            setMobileRatio(image.naturalWidth / image.naturalHeight);
        }
    };

    if (!srcMobile || !mobilePoster) {
        return (
            <div
                className={`relative w-full overflow-hidden rounded-[12px] shadow-[0_0_2px_1px] ${color.shadow}`}
                style={{
                    aspectRatio: desktopRatio ?? undefined,
                }}
            >
                <img
                    src={desktopPoster}
                    alt=""
                    draggable={false}
                    className="pointer-events-none block h-auto w-full select-none"
                    onLoad={handleDesktopPosterLoad}
                />

                <div className="absolute inset-0">
                    <Video
                        loop
                        muted
                        playsInline
                        threshold={0.1}
                        src={src}
                        poster={desktopPoster}
                        className="z-1 block size-full object-cover"
                    />
                </div>

                <div className="pointer-events-none absolute inset-0 z-2 shadow-[inset_0_0_100px_0] shadow-app" />
            </div>
        );
    }

    const desktopFlex = desktopRatio ?? 1;
    const mobileFlex = mobileRatio ?? 1;

    return (
        <div className="flex w-full items-start gap-3">
            <div
                className={`relative min-w-0 overflow-hidden rounded-[12px] shadow-[0_0_2px_1px] ${color.shadow}`}
                style={{
                    flex: `${desktopFlex} 1 0%`,
                    aspectRatio: desktopRatio ?? undefined,
                }}
            >
                <img
                    src={desktopPoster}
                    alt=""
                    draggable={false}
                    className="pointer-events-none block h-auto w-full select-none"
                    onLoad={handleDesktopPosterLoad}
                />

                <div className="absolute inset-0">
                    <Video
                        loop
                        muted
                        playsInline
                        threshold={0.1}
                        src={src}
                        poster={desktopPoster}
                        className="z-1 block size-full object-cover"
                    />
                </div>

                <div className="pointer-events-none absolute inset-0 z-2 shadow-[inset_0_0_100px_0] shadow-app" />
            </div>

            <div
                className={`relative min-w-0 overflow-hidden rounded-[12px] shadow-[0_0_2px_1px] ${color.shadow}`}
                style={{
                    flex: `${mobileFlex} 1 0%`,
                    aspectRatio: mobileRatio ?? undefined,
                }}
            >
                <img
                    src={mobilePoster}
                    alt=""
                    draggable={false}
                    className="pointer-events-none block h-auto w-full select-none"
                    onLoad={handleMobilePosterLoad}
                />

                <div className="absolute inset-0">
                    <Video
                        loop
                        muted
                        playsInline
                        threshold={0.1}
                        src={srcMobile}
                        poster={mobilePoster}
                        className="z-1 block size-full object-cover"
                    />
                </div>

                <div className="pointer-events-none absolute inset-0 z-2 shadow-[inset_0_0_100px_0] shadow-app" />
            </div>
        </div>
    );
};
