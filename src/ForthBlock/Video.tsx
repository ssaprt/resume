import { useEffect, useRef, useState } from "react";

type VideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
    threshold?: number;
};

export const Video = ({
    threshold = 0.1,
    src,
    poster,
    ...props
}: VideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isInView, setIsInView] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [isSourceAssigned, setIsSourceAssigned] = useState(false);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);

                    if (!isSourceAssigned) {
                        setIsSourceAssigned(true);
                    }
                } else {
                    setIsInView(false);
                    video.pause();
                }
            },
            { threshold },
        );

        observer.observe(video);

        return () => {
            observer.disconnect();
            video.pause();
        };
    }, [threshold, isSourceAssigned]);

    useEffect(() => {
        const video = videoRef.current;

        if (!video || !isSourceAssigned || !src) {
            return;
        }

        const handleLoadedData = () => {
            setIsLoaded(true);
        };

        video.addEventListener("loadeddata", handleLoadedData);

        video.src = src;
        video.load();

        return () => {
            video.removeEventListener("loadeddata", handleLoadedData);
        };
    }, [src, isSourceAssigned]);

    useEffect(() => {
        const video = videoRef.current;

        if (!video || !isInView || !isLoaded) {
            return;
        }

        void video.play().catch(() => {});
    }, [isInView, isLoaded]);

    return (
        <div className="relative size-full">
            <video
                ref={videoRef}
                muted
                playsInline
                preload="none"
                poster={poster}
                data-loaded={isLoaded}
                {...props}
            />
        </div>
    );
};
