import { useState } from "react";
import {
    authorIconAnimationConfig,
    type AuthorIconHideAnimation,
    type AuthorIconShowAnimation,
} from "./author-icon.config";
import { IconAuthor } from "./IconAuthor";

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

export const Test = () => {
    const [view, setView] = useState(true);
    const [config, setConfig] = useState<AnimationConfig>({
        show: "draw",
        hide: "erase",
    });
    const handleShowEnd = () => {
        setConfig((prev) => ({
            ...prev,
            hide: getCompatibleHideAnimation(prev.show),
        }));
        setView(false);
    };
    const handleHideEnd = () => {
        setConfig((prev) => ({
            ...prev,
            show: getRandomItem(authorIconShowAnimations),
        }));
        setView(true);
    };

    return (
        <div className="flex size-100">
            {" "}
            <IconAuthor
                visible={view}
                show={config.show}
                hide={config.hide}
                duration={500}
                showTrigger={false}
                onShowEnd={handleShowEnd}
                onHideEnd={handleHideEnd}
            />
        </div>
    );
};
