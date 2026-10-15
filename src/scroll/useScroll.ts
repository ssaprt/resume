import { motionValue } from "framer-motion";
import {
    useCallback,
    useLayoutEffect,
    useState,
    useSyncExternalStore,
} from "react";

import {
    scrollManager,
    type BlockScrollState,
    type ElementScrollState,
} from "./ScrollManager";

const emptyElementState: ElementScrollState = {
    visible: false,
    intersection: 0,
    progress: 0,
    top: 0,
    bottom: 0,
    center: 0,
    topProgress: 0,
    bottomProgress: 0,
    enterProgress: 0,
    leaveProgress: 0,
    isAbove: false,
    isBelow: false,
    isEntering: false,
    isCenter: false,
    isLeaving: false,
};

const POSITION_EPSILON = 0.01;

const getLeave = (state: ElementScrollState) => {
    const leaveTopProgress = Math.min(Math.max(-state.top, 0), 1);

    const leaveBottomProgress = Math.min(Math.max(state.bottom - 1, 0), 1);

    return {
        leaveTopProgress,
        leaveBottomProgress,
        leaveProgress: Math.max(leaveTopProgress, leaveBottomProgress),
        leaveDirection:
            leaveTopProgress > 0 ? -1 : leaveBottomProgress > 0 ? 1 : 0,
    };
};

const getIsAnimationComplete = (state: ElementScrollState) => {
    return Math.abs(state.top) <= POSITION_EPSILON;
};

class ElementScrollStore {
    private element: HTMLElement | null = null;

    private unsubscribeManager: (() => void) | null = null;

    private listeners = new Set<() => void>();

    private snapshot = emptyElementState;

    subscribe = (listener: () => void) => {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    };

    getSnapshot = () => {
        return this.snapshot;
    };

    getServerSnapshot = () => {
        return emptyElementState;
    };

    setElement = (element: HTMLElement | null) => {
        if (this.element === element) {
            return;
        }

        this.unsubscribeManager?.();
        this.unsubscribeManager = null;

        if (this.element) {
            scrollManager.unregisterElement(this.element);
        }

        this.element = element;

        if (!element) {
            this.snapshot = emptyElementState;

            this.emit();

            return;
        }

        scrollManager.registerElement(element);

        this.snapshot = scrollManager.getElementState(element);

        this.unsubscribeManager = scrollManager.subscribeElement(
            element,
            () => {
                const next = scrollManager.getElementState(element);

                if (next === this.snapshot) {
                    return;
                }

                this.snapshot = next;

                this.emit();
            },
        );

        this.emit();
    };

    private emit() {
        for (const listener of this.listeners) {
            listener();
        }
    }
}

export const useScroll = () => {
    return useSyncExternalStore(
        scrollManager.subscribe,
        scrollManager.getState,
        scrollManager.getState,
    );
};

export const useScrollElement = () => {
    const [store] = useState(() => new ElementScrollStore());

    const ref = useCallback(
        (node: HTMLElement | null) => {
            store.setElement(node);
        },
        [store],
    );

    const state = useSyncExternalStore(
        store.subscribe,
        store.getSnapshot,
        store.getServerSnapshot,
    );

    const {
        leaveTopProgress,
        leaveBottomProgress,
        leaveProgress,
        leaveDirection,
    } = getLeave(state);

    const isAnimationComplete = getIsAnimationComplete(state);

    return {
        ref,
        ...state,
        leaveProgress,
        leaveTopProgress,
        leaveBottomProgress,
        leaveDirection,
        isAnimationComplete,
    };
};

export const useScrollElementMotion = () => {
    const [store] = useState(() => new ElementScrollStore());

    const [leaveProgress] = useState(() => motionValue(0));
    const [leaveDirection] = useState(() => motionValue(0));
    const [enterProgress] = useState(() => motionValue(0));
    const [intersection] = useState(() => motionValue(0));

    const ref = useCallback(
        (node: HTMLElement | null) => {
            store.setElement(node);
        },
        [store],
    );

    useLayoutEffect(() => {
        const sync = () => {
            const state = store.getSnapshot();
            const leave = getLeave(state);

            leaveProgress.set(leave.leaveProgress);
            leaveDirection.set(leave.leaveDirection);
            enterProgress.set(Math.min(Math.max(state.enterProgress, 0), 1));
            intersection.set(Math.min(Math.max(state.intersection, 0), 1));
        };

        sync();

        let scheduled = false;
        let active = true;

        const unsubscribe = store.subscribe(() => {
            if (scheduled) return;

            scheduled = true;

            queueMicrotask(() => {
                scheduled = false;

                if (active) sync();
            });
        });

        return () => {
            active = false;
            unsubscribe();
        };
    }, [store, leaveProgress, leaveDirection, enterProgress, intersection]);

    const isAnimationComplete = useSyncExternalStore(
        store.subscribe,
        () => getIsAnimationComplete(store.getSnapshot()),
        () => getIsAnimationComplete(store.getServerSnapshot()),
    );

    return {
        ref,
        enterProgress,
        leaveProgress,
        leaveDirection,
        intersection,
        isAnimationComplete,
    };
};

export const useScrollBlocks = (): BlockScrollState[] => {
    useLayoutEffect(() => {
        scrollManager.refreshBlocks();
    }, []);

    return useSyncExternalStore(
        scrollManager.subscribe,
        scrollManager.getBlockStates,
        scrollManager.getBlockStates,
    );
};

export const useScrollBlockMotion = (index: number) => {
    const [animationTop] = useState(() => motionValue(0));
    const [animationBottom] = useState(() => motionValue(1));
    const [enterProgress] = useState(() => motionValue(0));
    const [intersection] = useState(() => motionValue(0));

    useLayoutEffect(() => {
        scrollManager.refreshBlocks();

        const sync = () => {
            const block = scrollManager.getBlockStates()[index];

            if (!block) {
                animationTop.set(1);
                animationBottom.set(1);
                enterProgress.set(0);
                intersection.set(0);

                return;
            }

            animationTop.set(block.animationTop);
            animationBottom.set(block.animationBottom);
            enterProgress.set(Math.min(Math.max(1 - block.animationTop, 0), 1));
            intersection.set(block.intersection);
        };

        sync();

        let scheduled = false;
        let active = true;

        const unsubscribe = scrollManager.subscribe(() => {
            if (scheduled) {
                return;
            }

            scheduled = true;

            queueMicrotask(() => {
                scheduled = false;

                if (active) {
                    sync();
                }
            });
        });

        return () => {
            active = false;
            unsubscribe();
        };
    }, [index, animationTop, animationBottom, enterProgress, intersection]);

    return {
        animationTop,
        animationBottom,
        enterProgress,
        intersection,
    };
};
