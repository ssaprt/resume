type Listener = () => void;

class AssetLoadStore {
    private assets = new Map<string, boolean>();
    private listeners = new Set<Listener>();

    register(name: string) {
        if (this.assets.has(name)) {
            return;
        }

        this.assets.set(name, false);
        this.emit();
    }

    ready(name: string) {
        if (this.assets.get(name) === true) {
            return;
        }

        this.assets.set(name, true);
        this.emit();
    }

    reset(name: string) {
        if (!this.assets.has(name)) {
            return;
        }

        this.assets.set(name, false);
        this.emit();
    }

    remove(name: string) {
        if (!this.assets.delete(name)) {
            return;
        }

        this.emit();
    }

    clear() {
        this.assets.clear();
        this.emit();
    }

    isReady(name: string) {
        return this.assets.get(name) === true;
    }

    get isReadyAll() {
        if (this.assets.size === 0) {
            return false;
        }

        for (const ready of this.assets.values()) {
            if (!ready) {
                return false;
            }
        }

        return true;
    }

    subscribe(listener: Listener) {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    private emit() {
        for (const listener of this.listeners) {
            listener();
        }
    }
}

export const assetLoadStore = new AssetLoadStore();
