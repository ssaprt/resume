import type { ComponentType, SVGProps } from "react";

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

const modules = import.meta.glob("../../icons/*.svg", {
    eager: true,
    query: "?react",
}) as Record<string, { default: SvgComponent }>;

const icons = Object.fromEntries(
    Object.entries(modules).map(([path, module]) => [path, module.default]),
) as Record<string, SvgComponent>;

export const DynamicSvgIcon = ({
    name,
    className,
    ...props
}: {
    name: string;
    className?: string;
    //eslint-disable-next-line
    [key: string]: any;
}) => {
    const iconName = name.endsWith(".svg") ? name : `${name}.svg`;

    const Icon = icons[`../../icons/${iconName}`];

    if (!Icon) {
        return null;
    }

    return <Icon {...props} className={className} />;
};

DynamicSvgIcon.displayName = "DynamicSvgIcon";
