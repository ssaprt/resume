import { useEffect, useRef, useState } from "react";
import { useFiveBlockContextProvider } from "../FiveBlock/shared/useFiveBlockContextProvider";
import {
    authorIconAnimationConfig,
    type AuthorIconHideAnimation,
    type AuthorIconShowAnimation,
} from "./author-icon.config";
import { IconAuthor } from "./IconAuthorOptimized";

//eslint-disable-next-line
export const authorIconShowAnimations = [
    "snakes",
    "draw",
    "scan",
    "diagonal",
] as const satisfies readonly AuthorIconShowAnimation[];

//eslint-disable-next-line
export const authorIconHideAnimations = [
    "erase",
    "snakes",
    "scatter",
    "collapse",
    "scan",
    "diagonal",
    "fall",
    "implode",
] as const satisfies readonly AuthorIconHideAnimation[];

type AnimationConfig = {
    show: AuthorIconShowAnimation;
    hide: AuthorIconHideAnimation;
};

const MAX_PLAYBACKS = 999;

const getRandomItem = <T,>(items: readonly T[]): T => {
    return items[Math.floor(Math.random() * items.length)]!;
};

const getCompatibleHideAnimation = (
    show: AuthorIconShowAnimation,
): AuthorIconHideAnimation => {
    const strategy = authorIconAnimationConfig.show[show].strategy;

    const compatibleAnimations = authorIconHideAnimations.filter(
        (animation) =>
            authorIconAnimationConfig.hide[animation].strategy === strategy,
    );

    return getRandomItem(compatibleAnimations);
};

export const ControllerIconAuthor = () => {
    const [config, setConfig] = useState<AnimationConfig>({
        show: "draw",
        hide: "erase",
    });

    const { enterProgress, intersection } = useFiveBlockContextProvider();
    const [view, setView] = useState(false);

    const isActiveRef = useRef(false);
    const previousIntersectionRef = useRef(0);
    const playbackCountRef = useRef(0);
    const finishedRef = useRef(false);

    useEffect(() => {
        const threshold = 0.15;
        const epsilon = 0.001;

        previousIntersectionRef.current = intersection.get();

        const activate = () => {
            if (isActiveRef.current) return;

            isActiveRef.current = true;
            playbackCountRef.current = 0;
            finishedRef.current = false;

            setConfig((prev) => ({
                show: getRandomItem(authorIconShowAnimations),
                hide: prev.hide,
            }));

            setView(true);
        };

        const deactivate = () => {
            if (!isActiveRef.current) return;

            isActiveRef.current = false;

            if (finishedRef.current) {
                finishedRef.current = false;
                setView(false);
                return;
            }

            setView(false);
        };

        const sync = () => {
            const currentIntersection = intersection.get();
            const previousIntersection = previousIntersectionRef.current;
            const delta = currentIntersection - previousIntersection;

            if (delta > epsilon && enterProgress.get() >= threshold) {
                activate();
            } else if (delta < -epsilon) {
                deactivate();
            }

            previousIntersectionRef.current = currentIntersection;
        };

        if (intersection.get() > 0 && enterProgress.get() >= threshold) {
            activate();
        }

        const unsubscribeEnter = enterProgress.on("change", sync);
        const unsubscribeIntersection = intersection.on("change", sync);

        return () => {
            unsubscribeEnter();
            unsubscribeIntersection();
        };
    }, [enterProgress, intersection]);

    const handleShowEnd = () => {
        if (!isActiveRef.current) return;

        playbackCountRef.current += 1;

        if (playbackCountRef.current >= MAX_PLAYBACKS) {
            finishedRef.current = true;
            return;
        }

        setConfig((prev) => ({
            ...prev,
            hide: getCompatibleHideAnimation(prev.show),
        }));

        setView(false);
    };

    const handleHideEnd = () => {
        if (!isActiveRef.current) return;

        setConfig((prev) => ({
            show: getRandomItem(authorIconShowAnimations),
            hide: prev.hide,
        }));

        setView(true);
    };

    return (
        <div className="relative z-3 flex size-full items-center justify-center">
            <IconAuthor
                className="size-full"
                visible={view}
                show={config.show}
                hide={config.hide}
                duration={1000}
                showTrigger={false}
                onShowEnd={handleShowEnd}
                onHideEnd={handleHideEnd}
            />
        </div>
    );
};
