import type { SVGProps } from "react";

type TablerIconProps = SVGProps<SVGSVGElement> & {
    name: string;
};

export const TablerIcon = ({ name, className, ...props }: TablerIconProps) => {
    const iconUrl = `/tabler-sprite.svg#tabler-${name}`;

    return (
        <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            aria-hidden="true"
            className={className}
            {...props}
        >
            <use href={iconUrl} xlinkHref={iconUrl} />
        </svg>
    );
};
