import { useEffect, useRef, useState } from "react";

type VideoProps = Omit<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    "src" | "poster" | "autoPlay"
> & {
    threshold?: number;
    src: string;
    poster: string;
};

export const Video = ({
    threshold = 0.1,
    src,
    poster,
    ...props
}: VideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isNear, setIsNear] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        const preloadObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsNear(true);
                    preloadObserver.disconnect();
                }
            },
            {
                rootMargin: "500px 0px",
                threshold: 0,
            },
        );

        const visibilityObserver = new IntersectionObserver(
            ([entry]) => {
                const visible = entry.isIntersecting;

                setIsInView(visible);

                if (!visible) {
                    video.pause();
                }
            },
            { threshold },
        );

        preloadObserver.observe(video);
        visibilityObserver.observe(video);

        return () => {
            preloadObserver.disconnect();
            visibilityObserver.disconnect();
            video.pause();
        };
    }, [threshold]);

    useEffect(() => {
        const video = videoRef.current;

        if (!video || !isNear || !src) return;

        const handleLoadedData = () => {
            setIsLoaded(true);
        };

        const handleEmptied = () => {
            setIsLoaded(false);
        };

        setIsLoaded(false);

        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("emptied", handleEmptied);

        if (video.readyState >= 2) {
            setIsLoaded(true);
        }

        return () => {
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("emptied", handleEmptied);
        };
    }, [isNear, src]);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        if (isNear && isInView) {
            void video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, [isNear, isInView, src]);

    return (
        <div className="relative size-full">
            <video
                {...props}
                ref={videoRef}
                src={isNear ? src : undefined}
                poster={poster}
                preload={isNear ? "metadata" : "none"}
                data-loaded={isLoaded}
            />
        </div>
    );
};
