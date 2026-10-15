type VideoPreview = {
    ratio: number;
    frame: string;
};

export const getVideoPreview = (src: string): Promise<VideoPreview> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");

        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = "anonymous";

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

            cleanup();

            resolve({
                ratio: video.videoWidth / video.videoHeight,
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
