import type { CSSProperties, ReactNode } from "react";

type Props = {
    children: ReactNode;

    className?: string;
    color: string;
};

export const MobileCard = ({ children, className = "", color }: Props) => {
    return (
        <div
            className={`relative  ${className}`}
            style={
                {
                    "--color": `var(--${color})`,
                } as CSSProperties
            }
        >
            {children}
        </div>
    );
};
