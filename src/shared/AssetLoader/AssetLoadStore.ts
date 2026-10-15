import { MODEL_ASSETS } from "./AssetManifest";

type Listener = () => void;

class AssetLoadStore {
    private assets = new Map<string, boolean>(
        MODEL_ASSETS.map(({ name }) => [name, false]),
    );

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

    readyMany(names: readonly string[]) {
        let changed = false;

        for (const name of names) {
            if (this.assets.get(name) === true) {
                continue;
            }

            this.assets.set(name, true);
            changed = true;
        }

        if (changed) {
            this.emit();
        }
    }

    reset(name: string) {
        if (!this.assets.has(name)) {
            return;
        }

        if (this.assets.get(name) === false) {
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
        this.assets = new Map(
            MODEL_ASSETS.map(({ name }) => [name, false] as const),
        );

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

    private listeners = new Set<Listener>();

    private emit() {
        for (const listener of this.listeners) {
            listener();
        }
    }
}

export const assetLoadStore = new AssetLoadStore();
