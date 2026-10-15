import { useEffect, useState } from "react";
import { colors } from "./Item/shared/config/colors.config";
import { useItemContext } from "./Item/shared/hook/useItemContext";
import { Video } from "./Video";

const GAP = 12;

type VideoPreview = {
    ratio: number;
    frame: string;
};

const getVideoPreview = (src: string): Promise<VideoPreview> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");

        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;

        const cleanup = () => {
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("error", handleError);

            video.pause();
            video.removeAttribute("src");
            video.load();
        };

        const handleLoadedData = () => {
            if (!video.videoWidth || !video.videoHeight) {
                cleanup();

                reject(new Error("Unable to determine video dimensions"));

                return;
            }

            const canvas = document.createElement("canvas");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext("2d");

            if (!context) {
                cleanup();

                reject(new Error("Unable to create canvas context"));

                return;
            }

            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            const frame = canvas.toDataURL("image/jpeg", 0.85);

            const ratio = video.videoWidth / video.videoHeight;

            cleanup();

            resolve({
                ratio,
                frame,
            });
        };

        const handleError = () => {
            cleanup();

            reject(new Error(`Unable to load video preview: ${src}`));
        };

        video.addEventListener("loadeddata", handleLoadedData);

        video.addEventListener("error", handleError);

        video.src = src;
        video.load();
    });
};

export const Videos = () => {
    const { colorName, src, srcMobile } = useItemContext();

    const color = colors[colorName];

    const [desktopPreview, setDesktopPreview] = useState<VideoPreview | null>(
        null,
    );

    const [mobilePreview, setMobilePreview] = useState<VideoPreview | null>(
        null,
    );

    useEffect(() => {
        let cancelled = false;
        //eslint-disable-next-line
        setDesktopPreview(null);
        setMobilePreview(null);

        void getVideoPreview(src)
            .then((preview) => {
                if (!cancelled) {
                    setDesktopPreview(preview);
                }
            })
            .catch(() => {});

        if (srcMobile) {
            void getVideoPreview(srcMobile)
                .then((preview) => {
                    if (!cancelled) {
                        setMobilePreview(preview);
                    }
                })
                .catch(() => {});
        }

        return () => {
            cancelled = true;
        };
    }, [src, srcMobile]);

    if (!desktopPreview || (srcMobile && !mobilePreview)) {
        return (
            <div
                className="w-full"
                style={{
                    visibility: "hidden",
                }}
            />
        );
    }

    if (!srcMobile) {
        return (
            <div className="w-full row-start-3">
                <div
                    className={`relative w-full overflow-hidden rounded-[12px] shadow-[0_0_2px_1px] ${color.shadow}`}
                    style={{
                        aspectRatio: `${desktopPreview.ratio}`,
                    }}
                >
                    <div className="pointer-events-none absolute inset-0 z-2 shadow-[inset_0_0_100px_0] shadow-app" />

                    <Video
                        autoPlay
                        loop
                        muted
                        threshold={0.1}
                        src={src}
                        poster={desktopPreview.frame}
                        className="z-1 block size-full"
                    />
                </div>
            </div>
        );
    }

    const totalRatio = desktopPreview.ratio + mobilePreview!.ratio;

    const availableWidth = `calc(100% - ${GAP}px)`;

    const desktopWidth = `calc(${availableWidth} * ${desktopPreview.ratio} / ${totalRatio})`;

    const mobileWidth = `calc(${availableWidth} * ${mobilePreview!.ratio} / ${totalRatio})`;

    return (
        <div className="flex w-full gap-3">
            <div
                className={`relative shrink-0 overflow-hidden rounded-[12px] shadow-[0_0_2px_1px] ${color.shadow}`}
                style={{
                    width: desktopWidth,
                    aspectRatio: `${desktopPreview.ratio}`,
                }}
            >
                <div className="pointer-events-none absolute inset-0 z-2 shadow-[inset_0_0_100px_0] shadow-app" />

                <Video
                    autoPlay
                    loop
                    muted
                    threshold={0.1}
                    src={src}
                    poster={desktopPreview.frame}
                    className="z-1 block size-full"
                />
            </div>

            <div
                className={`relative shrink-0 overflow-hidden rounded-[12px] shadow-[0_0_2px_1px] ${color.shadow}`}
                style={{
                    width: mobileWidth,
                    aspectRatio: `${mobilePreview!.ratio}`,
                }}
            >
                <div className="pointer-events-none absolute inset-0 z-2 shadow-[inset_0_0_100px_0] shadow-app" />

                <Video
                    autoPlay
                    loop
                    muted
                    threshold={0.1}
                    src={srcMobile}
                    poster={mobilePreview!.frame}
                    className="z-1 block size-full"
                />
            </div>
        </div>
    );
};
