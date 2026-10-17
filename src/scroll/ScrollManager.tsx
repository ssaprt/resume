import Lenis from "lenis";
import { deviceManager } from "./DeviceManager";

export type ScrollState = {
    y: number;
    progress: number;
    velocity: number;
    direction: -1 | 0 | 1;
    limit: number;
    viewportHeight: number;
    viewportWidth: number;
};

export type ElementScrollState = {
    visible: boolean;
    intersection: number;
    progress: number;
    top: number;
    bottom: number;
    center: number;
    topProgress: number;
    bottomProgress: number;
    enterProgress: number;
    leaveProgress: number;
    isAbove: boolean;
    isBelow: boolean;
    isEntering: boolean;
    isCenter: boolean;
    isLeaving: boolean;
};

type Listener = () => void;

type ScrollTarget = HTMLElement | number;

export type BlockScrollState = {
    block: number;
    controlled: boolean;

    visible: boolean;
    intersection: number;
    progress: number;
    direction: 1 | -1;

    top: number;
    bottom: number;

    animationTop: number;
    animationBottom: number;

    center: number;
    topProgress: number;
    bottomProgress: number;
    enterProgress: number;
    leaveProgress: number;

    isAbove: boolean;
    isBelow: boolean;
    isEntering: boolean;
    isCenter: boolean;
    isLeaving: boolean;
};

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

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

const isNativeScrollTarget = (target: EventTarget | null) => {
    return (
        target instanceof Element &&
        target.closest("[data-lenis-prevent]") !== null
    );
};

const isControlled = (section: HTMLElement) => {
    return section.dataset.controlScroll === "true";
};

class ScrollManager {
    private lenis: Lenis | null = null;

    private scrollBlocks: HTMLElement[] = [];

    private previousScrollY = 0;

    private blockStates: BlockScrollState[] = [];

    private listeners = new Set<Listener>();

    private elements = new Map<
        HTMLElement,
        {
            state: ElementScrollState;
            listeners: Set<Listener>;
        }
    >();

    private readonly UNCONTROLLED_GUARD_DISTANCE = 100;

    private scrollState: ScrollState = {
        y: 0,
        progress: 0,
        velocity: 0,
        direction: 0,
        limit: 0,
        viewportHeight: 0,
        viewportWidth: 0,
    };

    private sections: HTMLElement[] = [];

    // sections / blocks are re-collected only after the DOM structure changed
    private structureObserver: MutationObserver | null = null;

    private structureDirty = true;

    // layout reads are shared within one synchronous task and dropped right
    // after it (microtask), so nothing stale survives into the next event/frame
    private rectCache = new Map<HTMLElement, DOMRect>();

    private viewportHeightCache: number | null = null;

    private viewportWidthCache: number | null = null;

    private cacheResetScheduled = false;

    private blocksRefreshed = false;

    private isControlAnimating = false;

    private wheelConsumed = false;

    private touchActive = false;

    private touchStartY = 0;

    private touchLastY = 0;
    private touchSessionId = 0;

    private touchConsumed = false;

    private alignedUncontrolledSection: HTMLElement | null = null;

    private alignedUncontrolledDirection: 1 | -1 | null = null;

    private alignedUncontrolledY: number | null = null;
    private wrapper: HTMLElement | null = null;

    private SNAP_DURATION = 1700;

    private readonly ALIGN_DURATION = 0.6;

    private readonly WHEEL_THRESHOLD = 2;

    private readonly TOUCH_THRESHOLD = 0;

    private readonly MAGNET_DISTANCE = 20;

    private readonly EASING = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    private readonly ALIGN_EASING = (t: number) => 1 - Math.pow(1 - t, 2);

    private get viewportHeight() {
        if (this.viewportHeightCache === null) {
            this.viewportHeightCache =
                this.wrapper?.clientHeight || window.innerHeight;

            this.scheduleCacheReset();
        }

        return this.viewportHeightCache;
    }

    private get viewportWidth() {
        if (this.viewportWidthCache === null) {
            this.viewportWidthCache =
                this.wrapper?.clientWidth || window.innerWidth;

            this.scheduleCacheReset();
        }

        return this.viewportWidthCache;
    }

    private getRect(element: HTMLElement) {
        let rect = this.rectCache.get(element);

        if (!rect) {
            rect = element.getBoundingClientRect();

            this.rectCache.set(element, rect);

            this.scheduleCacheReset();
        }

        return rect;
    }

    private scheduleCacheReset() {
        if (this.cacheResetScheduled) {
            return;
        }

        this.cacheResetScheduled = true;

        queueMicrotask(this.invalidateCache);
    }

    private invalidateCache = () => {
        this.rectCache.clear();

        this.viewportHeightCache = null;

        this.viewportWidthCache = null;

        this.blocksRefreshed = false;

        this.cacheResetScheduled = false;
    };

    private markStructureDirty = () => {
        this.structureDirty = true;
    };

    // takeRecords() makes pending DOM changes visible synchronously, so a
    // layout effect that runs right after a commit still sees new sections
    private syncStructure() {
        if (
            this.structureObserver &&
            this.structureObserver.takeRecords().length > 0
        ) {
            this.structureDirty = true;
        }

        if (!this.structureDirty) {
            return false;
        }

        this.structureDirty = false;

        this.invalidateCache();

        this.collectSections();

        this.collectScrollBlocks();

        return true;
    }

    private emit() {
        this.listeners.forEach((listener) => {
            listener();
        });
    }

    private emitElement(item: {
        state: ElementScrollState;
        listeners: Set<Listener>;
    }) {
        item.listeners.forEach((listener) => {
            listener();
        });
    }

    private scheduleSectionsCollect() {
        requestAnimationFrame(() => {
            this.markStructureDirty();
            this.syncStructure();
            this.updateElements();
            this.updateBlockStates();
            this.emit();
        });
    }

    init() {
        if (this.lenis) {
            return;
        }

        const wrapper = document.getElementById("scroll-container");
        const content = document.getElementById("scroll-content");

        if (!wrapper || !content) {
            console.error(
                "ScrollManager: #scroll-container or #scroll-content not found",
            );
            return;
        }

        this.wrapper = wrapper;

        // anything cached before the wrapper was known (viewport size) is void
        this.invalidateCache();

        deviceManager.init();

        this.lenis = new Lenis({
            wrapper,
            content,
            eventsTarget: window,
            autoRaf: true,
            overscroll: false,
            syncTouch: true,
            syncTouchLerp: 0.075,
            touchInertiaExponent: 1.7,
        });

        this.lenis.on("scroll", this.handleScroll);

        window.addEventListener("resize", this.handleResize);

        window.addEventListener("wheel", this.handleWheel, {
            passive: false,
            capture: true,
        });

        window.addEventListener("touchstart", this.handleTouchStart, {
            passive: true,
            capture: true,
        });

        window.addEventListener("touchmove", this.handleTouchMove, {
            passive: false,
            capture: true,
        });

        window.addEventListener("touchend", this.handleTouchEnd, {
            passive: true,
            capture: true,
        });

        this.structureObserver = new MutationObserver(this.markStructureDirty);

        this.structureObserver.observe(wrapper, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["data-scroll-section", "data-scroll-block"],
        });

        this.markStructureDirty();

        this.updateViewport();

        requestAnimationFrame(() => {
            if (!this.lenis) {
                return;
            }

            this.lenis.resize();

            this.markStructureDirty();

            this.updateViewport();
        });

        this.scheduleSectionsCollect();
    }

    destroy() {
        if (!this.lenis) {
            return;
        }

        this.lenis.off("scroll", this.handleScroll);

        window.removeEventListener("resize", this.handleResize);

        window.removeEventListener("wheel", this.handleWheel, true);

        window.removeEventListener("touchstart", this.handleTouchStart, true);

        window.removeEventListener("touchmove", this.handleTouchMove, true);

        window.removeEventListener("touchend", this.handleTouchEnd, true);

        this.lenis.destroy();

        deviceManager.destroy();

        this.lenis = null;

        this.structureObserver?.disconnect();

        this.structureObserver = null;

        this.structureDirty = true;

        this.invalidateCache();

        this.listeners.clear();

        this.elements.clear();

        this.sections = [];

        this.scrollBlocks = [];

        this.blockStates = [];

        this.isControlAnimating = false;

        this.wheelConsumed = false;

        this.touchActive = false;

        this.touchConsumed = false;

        this.touchStartY = 0;

        this.touchLastY = 0;
        this.wrapper = null;

        this.previousScrollY = 0;

        this.clearUncontrolledAlignment();
    }

    getState = () => {
        return this.scrollState;
    };

    subscribe = (listener: Listener) => {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    };

    registerElement(element: HTMLElement) {
        if (this.elements.has(element)) {
            return;
        }

        const item = {
            state: this.calculateElementState(element),
            listeners: new Set<Listener>(),
        };

        this.elements.set(element, item);
    }

    unregisterElement(element: HTMLElement) {
        const item = this.elements.get(element);

        // several hooks may observe the same element: drop it only when the
        // last subscriber is gone, otherwise the others would stop updating
        if (item && item.listeners.size === 0) {
            this.elements.delete(element);
        }
    }

    getElementState(element: HTMLElement | null) {
        if (!element) {
            return emptyElementState;
        }

        return this.elements.get(element)?.state ?? emptyElementState;
    }

    subscribeElement(element: HTMLElement, listener: Listener) {
        this.registerElement(element);

        const item = this.elements.get(element);

        if (!item) {
            return () => {};
        }

        item.listeners.add(listener);

        listener();

        return () => {
            item.listeners.delete(listener);
        };
    }

    private collectSections() {
        this.sections = this.wrapper
            ? Array.from(
                  this.wrapper.querySelectorAll<HTMLElement>(
                      "[data-scroll-section]",
                  ),
              )
            : [];
    }

    private collectScrollBlocks() {
        this.scrollBlocks = this.wrapper
            ? Array.from(
                  this.wrapper.querySelectorAll<HTMLElement>(
                      "[data-scroll-block]",
                  ),
              )
            : [];
    }

    private updateBlockStates() {
        this.syncStructure();

        if (this.scrollBlocks.length === 0) {
            // keep the same array so useScrollBlocks consumers are not woken up
            if (this.blockStates.length > 0) {
                this.blockStates = [];
            }

            return;
        }

        const direction: 1 | -1 =
            this.scrollState.direction === 0 ? 1 : this.scrollState.direction;

        const { anchorIndex, phase } = this.getBlockAnimationFrame();

        this.blockStates = this.scrollBlocks.map((element, block) =>
            this.calculateBlockState(
                element,
                block,
                anchorIndex,
                phase,
                direction,
            ),
        );
    }

    getBlockStates = () => {
        return this.blockStates;
    };

    private getActiveSectionIndex() {
        const viewportCenter = this.viewportHeight / 2;

        let activeIndex = 0;

        for (let index = 0; index < this.sections.length; index++) {
            const rect = this.getRect(this.sections[index]);

            if (rect.top <= viewportCenter) {
                activeIndex = index;
            }
        }

        return activeIndex;
    }

    private getCurrentSectionIndex() {
        const viewportCenter = this.viewportHeight / 2;

        for (let index = 0; index < this.sections.length; index++) {
            const rect = this.getRect(this.sections[index]);

            if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                return index;
            }
        }

        return this.getActiveSectionIndex();
    }

    private isSectionVisible() {
        const viewportHeight = this.viewportHeight;

        return this.sections.some((section) => {
            const rect = this.getRect(section);

            return rect.bottom > 0 && rect.top < viewportHeight;
        });
    }

    private clearUncontrolledAlignment() {
        this.alignedUncontrolledSection = null;

        this.alignedUncontrolledDirection = null;

        this.alignedUncontrolledY = null;
    }

    private markUncontrolledAligned(
        section: HTMLElement,
        direction: 1 | -1,
        targetY: number,
    ) {
        this.alignedUncontrolledSection = section;

        this.alignedUncontrolledDirection = direction;

        this.alignedUncontrolledY = targetY;
    }

    private isAtUncontrolledBoundary(section: HTMLElement, direction: 1 | -1) {
        const rect = this.getRect(section);
        const viewportHeight = this.viewportHeight;
        const epsilon = 8;

        if (direction === -1) {
            return Math.abs(rect.top) <= epsilon;
        }

        return Math.abs(rect.bottom - viewportHeight) <= epsilon;
    }

    private tryProtectUncontrolledBoundary(
        direction: 1 | -1,
        projectedTargetY: number,
    ) {
        if (!this.lenis || this.isControlAnimating) {
            return false;
        }

        const currentIndex = this.getCurrentSectionIndex();

        const current = this.sections[currentIndex];

        const target = this.sections[currentIndex + direction];

        if (!current || !target) {
            return false;
        }

        if (isControlled(current) || !isControlled(target)) {
            return false;
        }

        const rect = this.getRect(current);

        const viewportHeight = this.viewportHeight;

        const scrollY = this.lenis.scroll;

        const boundaryY =
            direction === -1
                ? scrollY + rect.top
                : scrollY + rect.bottom - viewportHeight;

        const guardStartY =
            direction === -1
                ? boundaryY + this.UNCONTROLLED_GUARD_DISTANCE
                : boundaryY - this.UNCONTROLLED_GUARD_DISTANCE;

        if (
            this.alignedUncontrolledSection === current &&
            this.alignedUncontrolledDirection === direction
        ) {
            return false;
        }

        const atBoundary = this.isAtUncontrolledBoundary(current, direction);

        if (atBoundary) {
            this.markUncontrolledAligned(current, direction, boundaryY);

            return false;
        }

        const enteredGuard =
            direction === -1
                ? projectedTargetY <= guardStartY
                : projectedTargetY >= guardStartY;

        if (!enteredGuard) {
            return false;
        }

        this.alignUncontrolled(current, direction, boundaryY);

        return true;
    }

    private alignUncontrolled(
        section: HTMLElement,
        direction: 1 | -1,
        targetY: number,
    ) {
        if (!this.lenis || this.isControlAnimating) {
            return;
        }

        const clampedTargetY = Math.min(Math.max(targetY, 0), this.lenis.limit);

        this.snapTo(
            clampedTargetY,
            this.ALIGN_DURATION,
            () => {
                this.markUncontrolledAligned(
                    section,
                    direction,
                    clampedTargetY,
                );
            },
            this.ALIGN_EASING,
        );
    }

    private resolveMove(direction: 1 | -1): {
        target: ScrollTarget;
        duration: number;
    } | null {
        this.syncStructure();

        if (!this.lenis) {
            return null;
        }

        const activeIndex = this.getCurrentSectionIndex();

        const current = this.sections[activeIndex];

        const target = this.sections[activeIndex + direction];

        if (!current || !target) {
            return null;
        }

        const currentControlled = isControlled(current);

        const targetControlled = isControlled(target);

        if (!currentControlled && targetControlled) {
            const aligned =
                this.alignedUncontrolledSection === current &&
                this.alignedUncontrolledDirection === direction;

            const atBoundary = this.isAtUncontrolledBoundary(
                current,
                direction,
            );

            if (!aligned && !atBoundary) {
                return null;
            }

            this.clearUncontrolledAlignment();

            return {
                target,
                duration: this.SNAP_DURATION,
            };
        }

        if (!currentControlled && !targetControlled) {
            return null;
        }

        if (currentControlled && !targetControlled && direction === -1) {
            const rect = this.getRect(target);

            const targetY =
                this.lenis.scroll + rect.bottom - this.viewportHeight;

            return {
                target: Math.min(Math.max(targetY, 0), this.lenis.limit),
                duration: this.SNAP_DURATION,
            };
        }

        return {
            target,
            duration: this.SNAP_DURATION,
        };
    }

    scrollToSection(index: number) {
        if (!this.lenis || this.isControlAnimating) {
            return;
        }

        this.syncStructure();

        const section = this.sections[index];

        if (!section) {
            return;
        }

        this.clearUncontrolledAlignment();

        this.snapTo(section, this.SNAP_DURATION);
    }

    private snapTo(
        target: ScrollTarget,
        duration: number,
        onComplete?: () => void,
        easing = this.EASING,
    ) {
        if (!this.lenis || this.isControlAnimating) {
            return;
        }
        const touchSessionId = this.touchSessionId;

        this.isControlAnimating = true;

        this.wheelConsumed = true;

        this.touchConsumed = true;

        this.lenis.scrollTo(target, {
            duration,
            easing,
            lock: true,
            force: true,
            onComplete: () => {
                onComplete?.();

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        this.isControlAnimating = false;

                        if (this.touchSessionId === touchSessionId) {
                            this.touchConsumed = this.touchActive;
                        }

                        window.setTimeout(() => {
                            this.wheelConsumed = false;
                        }, 80);
                    });
                });
            },
        });

        // scrollTo may move the scroll position: never reuse rects read before it
        this.invalidateCache();
    }

    private snapToNearControlSection(direction: -1 | 0 | 1) {
        if (!direction || this.isControlAnimating) {
            return;
        }

        for (const section of this.sections) {
            if (!isControlled(section)) {
                continue;
            }

            const top = this.getRect(section).top;

            const isApproachingDown =
                direction === 1 && top > 0 && top < this.MAGNET_DISTANCE;

            const isApproachingUp =
                direction === -1 && top < 0 && -top < this.MAGNET_DISTANCE;

            if (isApproachingDown || isApproachingUp) {
                this.snapTo(section, this.ALIGN_DURATION);

                return;
            }
        }
    }

    set snapDuration(duration: number) {
        this.SNAP_DURATION = duration / 1000;
    }

    private handleWheel = (event: WheelEvent) => {
        if (isNativeScrollTarget(event.target)) {
            return;
        }

        this.syncStructure();

        if (!this.sections.length) {
            return;
        }

        if (!this.isSectionVisible()) {
            return;
        }

        if (this.isControlAnimating) {
            this.consumeWheel(event);

            return;
        }

        if (this.wheelConsumed) {
            this.consumeWheel(event);

            return;
        }

        if (Math.abs(event.deltaY) < this.WHEEL_THRESHOLD) {
            return;
        }

        const direction: 1 | -1 = event.deltaY > 0 ? 1 : -1;

        const currentTarget = this.lenis?.targetScroll ?? this.scrollState.y;

        const projectedTarget = currentTarget + event.deltaY;

        const protectedBoundary = this.tryProtectUncontrolledBoundary(
            direction,
            projectedTarget,
        );

        if (protectedBoundary) {
            this.consumeWheel(event);

            return;
        }

        const move = this.resolveMove(direction);

        if (!move) {
            return;
        }

        event.preventDefault();

        this.wheelConsumed = true;

        this.snapTo(move.target, move.duration);
    };

    private handleTouchStart = (event: TouchEvent) => {
        if (!event.touches.length) {
            return;
        }

        this.syncStructure();

        if (!this.sections.length) {
            return;
        }

        if (!this.isSectionVisible()) {
            return;
        }

        this.touchSessionId += 1;
        this.touchActive = true;

        this.touchStartY = event.touches[0].clientY;

        this.touchLastY = this.touchStartY;

        this.touchConsumed = false;
    };

    private handleTouchMove = (event: TouchEvent) => {
        if (!event.touches.length || !this.sections.length) {
            return;
        }

        if (!this.isSectionVisible()) {
            return;
        }

        if (this.isControlAnimating || this.touchConsumed) {
            if (event.cancelable) {
                event.preventDefault();
            }

            event.stopImmediatePropagation();

            return;
        }

        const currentY = event.touches[0].clientY;

        const totalDelta = this.touchStartY - currentY;

        const stepDelta = this.touchLastY - currentY;

        this.touchLastY = currentY;

        const currentIndex = this.getCurrentSectionIndex();

        const currentSection = this.sections[currentIndex];

        const currentControlled =
            currentSection !== undefined && isControlled(currentSection);

        if (currentControlled) {
            if (event.cancelable) {
                event.preventDefault();
            }

            event.stopImmediatePropagation();
        }

        if (Math.abs(totalDelta) < this.TOUCH_THRESHOLD) {
            return;
        }

        const direction: 1 | -1 = totalDelta > 0 ? 1 : -1;

        const currentTarget = this.lenis?.targetScroll ?? this.scrollState.y;

        const projectedTarget = currentTarget + stepDelta;

        const protectedBoundary = this.tryProtectUncontrolledBoundary(
            direction,
            projectedTarget,
        );

        if (protectedBoundary) {
            if (event.cancelable) {
                event.preventDefault();
            }

            event.stopImmediatePropagation();

            this.touchConsumed = true;

            return;
        }

        const move = this.resolveMove(direction);

        if (!move) {
            return;
        }

        if (event.cancelable) {
            event.preventDefault();
        }

        event.stopImmediatePropagation();

        this.touchConsumed = true;

        this.snapTo(move.target, move.duration);
    };

    private handleTouchEnd = () => {
        this.touchActive = false;
        this.touchStartY = 0;
        this.touchLastY = 0;
        this.touchConsumed = false;
    };

    private consumeWheel(event: WheelEvent) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    //eslint-disable-next-line
    private handleScroll = (event: any) => {
        this.syncStructure();

        const currentScrollY = event.animatedScroll;

        const direction: -1 | 0 | 1 =
            currentScrollY > this.previousScrollY
                ? 1
                : currentScrollY < this.previousScrollY
                  ? -1
                  : 0;

        if (
            this.alignedUncontrolledY !== null &&
            !this.isControlAnimating &&
            !this.touchActive
        ) {
            if (
                Math.abs(currentScrollY - this.alignedUncontrolledY) >
                this.UNCONTROLLED_GUARD_DISTANCE
            ) {
                this.clearUncontrolledAlignment();
            }
        }

        if (direction !== 0 && !this.isControlAnimating) {
            const currentIndex = this.getCurrentSectionIndex();

            const current = this.sections[currentIndex];

            const target = this.sections[currentIndex + direction];

            if (
                current &&
                target &&
                !isControlled(current) &&
                isControlled(target)
            ) {
                this.tryProtectUncontrolledBoundary(
                    direction,
                    this.lenis?.targetScroll ?? currentScrollY,
                );
            }
        }

        this.previousScrollY = currentScrollY;

        this.scrollState = {
            y: currentScrollY,
            progress: event.progress,
            velocity: event.velocity,
            direction,
            limit: event.limit,
            viewportHeight: this.viewportHeight,
            viewportWidth: this.viewportWidth,
        };

        this.updateElements();

        this.updateBlockStates();

        this.emit();

        if (deviceManager.isDesktop) {
            this.snapToNearControlSection(direction);
        }
    };

    private updateElements() {
        this.elements.forEach((item, element) => {
            const nextState = this.calculateElementState(element);

            if (!this.isSameState(item.state, nextState)) {
                item.state = nextState;

                this.emitElement(item);
            }
        });
    }

    refreshBlocks = () => {
        const recollected = this.syncStructure();

        // every useScrollBlock* hook calls this on mount; within one commit the
        // result is identical, so only the first call does the work
        if (!recollected && this.blocksRefreshed) {
            return;
        }

        this.blocksRefreshed = true;

        this.scheduleCacheReset();

        this.updateBlockStates();

        this.emit();
    };

    private getBlockAnimationFrame() {
        const viewportHeight = this.viewportHeight;

        const viewportCenter = viewportHeight / 2;

        let anchorIndex = -1;

        let smallestDistance = Infinity;

        this.scrollBlocks.forEach((element, index) => {
            const rect = this.getRect(element);

            const containsCenter =
                rect.top <= viewportCenter && rect.bottom >= viewportCenter;

            if (containsCenter) {
                anchorIndex = index;

                return;
            }

            const center = rect.top + rect.height / 2;

            const distance = Math.abs(center - viewportCenter);

            if (distance < smallestDistance) {
                smallestDistance = distance;

                anchorIndex = index;
            }
        });

        if (anchorIndex === -1) {
            return {
                anchorIndex: -1,
                phase: 0,
            };
        }

        const anchorRect = this.getRect(this.scrollBlocks[anchorIndex]);

        const top = anchorRect.top / viewportHeight;

        const bottom = anchorRect.bottom / viewportHeight;

        let phase = 0;

        if (top > 0) {
            phase = clamp(top);
        } else if (bottom < 1) {
            phase = clamp(bottom) - 1;
        }

        return {
            anchorIndex,
            phase,
        };
    }

    private calculateBlockAnimationBounds(
        index: number,
        anchorIndex: number,
        phase: number,
    ) {
        const offset = index - anchorIndex;

        const top = offset + phase;

        return {
            top,
            bottom: top + 1,
        };
    }

    private calculateElementState(element: HTMLElement): ElementScrollState {
        const rect = this.getRect(element);

        const viewportHeight = this.viewportHeight;

        const height = rect.height;

        const visibleTop = Math.max(rect.top, 0);

        const visibleBottom = Math.min(rect.bottom, viewportHeight);

        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        const intersection = height > 0 ? clamp(visibleHeight / height) : 0;

        const visible = visibleHeight > 0;

        const progress = clamp(
            (viewportHeight - rect.top) / (viewportHeight + height),
        );

        const top = rect.top / viewportHeight;

        const bottom = rect.bottom / viewportHeight;

        const center = (rect.top + rect.height / 2) / viewportHeight;

        const topProgress = clamp(1 - top);

        const bottomProgress = clamp(bottom);

        const enterProgress = progress;

        const leaveProgress = clamp(
            (viewportHeight - rect.bottom) / (viewportHeight + height),
        );

        const isAbove = rect.bottom <= 0;

        const isBelow = rect.top >= viewportHeight;

        const isEntering =
            rect.top < viewportHeight && rect.bottom > viewportHeight;

        const isLeaving = rect.top < 0 && rect.bottom > 0;

        const isCenter =
            rect.top <= viewportHeight / 2 && rect.bottom >= viewportHeight / 2;

        return {
            visible,
            intersection,
            progress,
            top,
            bottom,
            center,
            topProgress,
            bottomProgress,
            enterProgress,
            leaveProgress,
            isAbove,
            isBelow,
            isEntering,
            isCenter,
            isLeaving,
        };
    }

    private calculateBlockState(
        element: HTMLElement,
        block: number,
        anchorIndex: number,
        phase: number,
        direction: 1 | -1,
    ): BlockScrollState {
        const rect = this.getRect(element);

        const viewportHeight = this.viewportHeight;

        const height = rect.height;

        const top = rect.top / viewportHeight;

        const bottom = rect.bottom / viewportHeight;

        const visibleTop = Math.max(rect.top, 0);

        const visibleBottom = Math.min(rect.bottom, viewportHeight);

        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        const visible = visibleHeight > 0;

        const { top: animationTop, bottom: animationBottom } =
            this.calculateBlockAnimationBounds(block, anchorIndex, phase);

        const intersection = clamp(
            Math.min(animationBottom, 1) - Math.max(animationTop, 0),
        );

        const progress = clamp((1 - animationTop) / 2);

        const enterProgress = clamp(1 - animationTop);

        const leaveProgress = clamp(1 - animationBottom);

        const center = (rect.top + height / 2) / viewportHeight;

        const topProgress = clamp(1 - top);

        const bottomProgress = clamp(bottom);

        const isAbove = rect.bottom <= 0;

        const isBelow = rect.top >= viewportHeight;

        const isEntering =
            rect.top < viewportHeight && rect.bottom > viewportHeight;

        const isLeaving = rect.top < 0 && rect.bottom > 0;

        const isCenter =
            rect.top <= viewportHeight / 2 && rect.bottom >= viewportHeight / 2;

        return {
            block,

            controlled: isControlled(element),

            visible,
            intersection,
            progress,
            direction,

            top,
            bottom,

            animationTop,
            animationBottom,

            center,
            topProgress,
            bottomProgress,

            enterProgress,
            leaveProgress,

            isAbove,
            isBelow,
            isEntering,
            isCenter,
            isLeaving,
        };
    }

    private isSameState(a: ElementScrollState, b: ElementScrollState) {
        return (
            a.visible === b.visible &&
            a.intersection === b.intersection &&
            a.progress === b.progress &&
            a.top === b.top &&
            a.bottom === b.bottom &&
            a.center === b.center &&
            a.topProgress === b.topProgress &&
            a.bottomProgress === b.bottomProgress &&
            a.enterProgress === b.enterProgress &&
            a.leaveProgress === b.leaveProgress &&
            a.isAbove === b.isAbove &&
            a.isBelow === b.isBelow &&
            a.isEntering === b.isEntering &&
            a.isCenter === b.isCenter &&
            a.isLeaving === b.isLeaving
        );
    }

    private updateViewport() {
        if (!this.lenis) {
            return;
        }

        this.scrollState = {
            ...this.scrollState,
            viewportHeight: this.viewportHeight,
            viewportWidth: this.viewportWidth,
            limit: this.lenis.limit,
        };

        this.syncStructure();
        this.updateElements();
        this.updateBlockStates();
        this.emit();
    }

    private handleResize = () => {
        this.invalidateCache();

        this.lenis?.resize();

        this.updateViewport();
    };
}

export const scrollManager = new ScrollManager();
