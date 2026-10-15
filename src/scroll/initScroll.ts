import { scrollManager } from "./ScrollManager";

let initialized = false;

export const initScroll = () => {
    if (initialized) {
        return;
    }

    initialized = true;

    scrollManager.init();
};

export const destroyScroll = () => {
    if (!initialized) {
        return;
    }

    initialized = false;

    scrollManager.destroy();
};
