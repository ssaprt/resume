export type AuthorIconAnimationOrder =
    | "random"
    | "top-down"
    | "bottom-up"
    | "left-right"
    | "right-left"
    | "diagonal"
    | "diagonal-reverse"
    | "center-out"
    | "outside-in";
export type AuthorIconAnimationStrategy = "mask" | "whole" | "segments";

export type AuthorIconAnimationDefinition = {
    label: string;
    strategy: AuthorIconAnimationStrategy;
    duration: number;
    scatter: number;
    easing: string;
    keyframes: string;
    tracerKeyframes?: string;
    order: AuthorIconAnimationOrder;
};

export const authorIconAnimationConfig = {
    show: {
        snakes: {
            label: "Змеи",
            strategy: "mask",
            duration: 1500,
            scatter: 1200,
            easing: "cubic-bezier(0.2, 0.72, 0.25, 1)",
            keyframes: "author-icon-mask-show",
            tracerKeyframes: "author-icon-tracer-show",
            order: "random",
        },
        draw: {
            label: "Прорисовка",
            strategy: "mask",
            duration: 1350,
            scatter: 1000,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            keyframes: "author-icon-mask-show",
            order: "top-down",
        },
        scatter: {
            label: "Сборка из фрагментов",
            strategy: "segments",
            duration: 900,
            scatter: 700,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            keyframes: "author-icon-segments-show-scatter",
            order: "random",
        },
        fade: {
            label: "Плавное появление",
            strategy: "whole",
            duration: 700,
            scatter: 0,
            easing: "ease-out",
            keyframes: "author-icon-whole-show-fade",
            order: "center-out",
        },
        bloom: {
            label: "Проявление из свечения",
            strategy: "whole",
            duration: 1000,
            scatter: 0,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            keyframes: "author-icon-whole-show-bloom",
            order: "center-out",
        },
        scan: {
            label: "Сканирование",
            strategy: "mask",
            duration: 1050,
            scatter: 950,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            keyframes: "author-icon-mask-show",
            tracerKeyframes: "author-icon-tracer-show",
            order: "left-right",
        },
        diagonal: {
            label: "Диагональная прорисовка",
            strategy: "mask",
            duration: 1150,
            scatter: 900,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            keyframes: "author-icon-mask-show",
            order: "diagonal",
        },
        rise: {
            label: "Подъём линий",
            strategy: "segments",
            duration: 850,
            scatter: 550,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            keyframes: "author-icon-segments-show-rise",
            order: "bottom-up",
        },
        unfold: {
            label: "Раскрытие фрагментов",
            strategy: "segments",
            duration: 900,
            scatter: 650,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            keyframes: "author-icon-segments-show-unfold",
            order: "center-out",
        },
        focus: {
            label: "Фокусировка",
            strategy: "whole",
            duration: 900,
            scatter: 0,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            keyframes: "author-icon-whole-show-focus",
            order: "center-out",
        },
        shockwave: {
            label: "Ударная волна",
            strategy: "whole",
            duration: 800,
            scatter: 0,
            easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            keyframes: "author-icon-whole-show-shockwave",
            order: "center-out",
        },
    },
    hide: {
        erase: {
            label: "Стирание линий",
            strategy: "mask",
            duration: 1100,
            scatter: 850,
            easing: "cubic-bezier(0.55, 0, 0.75, 0.45)",
            keyframes: "author-icon-mask-hide",
            order: "bottom-up",
        },
        snakes: {
            label: "Уходящие змеи",
            strategy: "mask",
            duration: 1250,
            scatter: 900,
            easing: "cubic-bezier(0.55, 0, 0.75, 0.45)",
            keyframes: "author-icon-mask-hide",
            tracerKeyframes: "author-icon-tracer-hide",
            order: "random",
        },
        scatter: {
            label: "Распад на фрагменты",
            strategy: "segments",
            duration: 850,
            scatter: 600,
            easing: "cubic-bezier(0.7, 0, 0.84, 0)",
            keyframes: "author-icon-segments-hide-scatter",
            order: "outside-in",
        },
        fade: {
            label: "Плавное исчезновение",
            strategy: "whole",
            duration: 600,
            scatter: 0,
            easing: "ease-in",
            keyframes: "author-icon-whole-hide-fade",
            order: "outside-in",
        },
        collapse: {
            label: "Стягивание линий",
            strategy: "segments",
            duration: 900,
            scatter: 550,
            easing: "cubic-bezier(0.7, 0, 0.84, 0)",
            keyframes: "author-icon-segments-hide-collapse",
            order: "outside-in",
        },
        scan: {
            label: "Обратное сканирование",
            strategy: "mask",
            duration: 1000,
            scatter: 850,
            easing: "cubic-bezier(0.55, 0, 0.75, 0.45)",
            keyframes: "author-icon-mask-hide",
            tracerKeyframes: "author-icon-tracer-hide",
            order: "right-left",
        },
        diagonal: {
            label: "Диагональное стирание",
            strategy: "mask",
            duration: 1050,
            scatter: 850,
            easing: "cubic-bezier(0.55, 0, 0.75, 0.45)",
            keyframes: "author-icon-mask-hide",
            order: "diagonal-reverse",
        },
        fall: {
            label: "Падение линий",
            strategy: "segments",
            duration: 800,
            scatter: 550,
            easing: "cubic-bezier(0.7, 0, 0.84, 0)",
            keyframes: "author-icon-segments-hide-fall",
            order: "top-down",
        },
        dissolve: {
            label: "Растворение",
            strategy: "segments",
            duration: 850,
            scatter: 600,
            easing: "ease-in",
            keyframes: "author-icon-segments-hide-dissolve",
            order: "random",
        },
        implode: {
            label: "Имплозия",
            strategy: "segments",
            duration: 850,
            scatter: 500,
            easing: "cubic-bezier(0.7, 0, 0.84, 0)",
            keyframes: "author-icon-segments-hide-implode",
            order: "outside-in",
        },
        shrink: {
            label: "Сжатие",
            strategy: "whole",
            duration: 700,
            scatter: 0,
            easing: "cubic-bezier(0.7, 0, 0.84, 0)",
            keyframes: "author-icon-whole-hide-shrink",
            order: "outside-in",
        },
        flash: {
            label: "Вспышка",
            strategy: "whole",
            duration: 650,
            scatter: 0,
            easing: "ease-in",
            keyframes: "author-icon-whole-hide-flash",
            order: "outside-in",
        },
    },
} as const satisfies {
    show: Record<string, AuthorIconAnimationDefinition>;
    hide: Record<string, AuthorIconAnimationDefinition>;
};

export type AuthorIconShowAnimation =
    keyof typeof authorIconAnimationConfig.show;

export type AuthorIconHideAnimation =
    keyof typeof authorIconAnimationConfig.hide;

export const authorIconShowAnimations = Object.keys(
    authorIconAnimationConfig.show,
) as AuthorIconShowAnimation[];

export const authorIconHideAnimations = Object.keys(
    authorIconAnimationConfig.hide,
) as AuthorIconHideAnimation[];
