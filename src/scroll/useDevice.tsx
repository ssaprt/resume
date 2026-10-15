import { useSyncExternalStore } from "react";
import { deviceManager } from "./DeviceManager";

export const useDevice = () => {
    const device = useSyncExternalStore(
        deviceManager.subscribe,
        () => deviceManager.device,
        () => null,
    );

    return {
        device,
        isMobile: device === "mobile",
        isDesktop: device === "desktop",
    };
};
