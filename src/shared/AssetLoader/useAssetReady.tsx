import { useSyncExternalStore } from "react";

import { assetLoadStore } from "./AssetLoadStore";

let isAnimationFinished = false;

const listeners = new Set<() => void>();

export const setLoaderAnimationFinished = (value: boolean) => {
    if (isAnimationFinished === value) return;

    isAnimationFinished = value;

    listeners.forEach((listener) => listener());
};

const subscribeAnimation = (listener: () => void) => {
    listeners.add(listener);

    return () => listeners.delete(listener);
};

export const useAssetReady = () => {
    const isAssetsReady = useSyncExternalStore(
        (listener) => assetLoadStore.subscribe(listener),
        () => assetLoadStore.isReadyAll,
        () => false,
    );

    const isAnimationReady = useSyncExternalStore(
        subscribeAnimation,
        () => isAnimationFinished,
        () => false,
    );

    return isAssetsReady && isAnimationReady;
};
