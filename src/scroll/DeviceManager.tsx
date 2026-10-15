export type DeviceType = "mobile" | "desktop";

class DeviceManager {
    private type: DeviceType | null = null;

    private listeners = new Set<() => void>();

    init() {
        this.update();

        window.addEventListener("resize", this.handleResize);
    }

    destroy() {
        window.removeEventListener("resize", this.handleResize);
        this.listeners.clear();
    }

    get isMobile() {
        return this.type === "mobile";
    }

    get isDesktop() {
        return this.type === "desktop";
    }

    get device() {
        return this.type;
    }

    subscribe = (listener: () => void) => {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    };

    private update = () => {
        const nextType: DeviceType = window.matchMedia("(pointer: coarse)")
            .matches
            ? "mobile"
            : "desktop";

        const changed = this.type !== nextType;

        this.type = nextType;

        document.documentElement.dataset.device = nextType;

        if (!changed) {
            return;
        }

        this.listeners.forEach((listener) => {
            listener();
        });
    };

    private handleResize = () => {
        this.update();
    };
}

export const deviceManager = new DeviceManager();
