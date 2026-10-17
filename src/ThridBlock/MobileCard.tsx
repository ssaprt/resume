import type { CSSProperties, ReactNode } from "react";

type Props = {
    children: ReactNode;

    className?: string;
    color: string;
};

export const MobileCard = ({ children, className = "", color }: Props) => {
    const bsh = `0px 0px 0px 1px var(--${color})`;
    return (
        <div
            className={`relative overflow-hidden p-2 ${className} before:content-['']
                before:absolute
                before:w-full
                before:h-full
                before:bottom-0
                before:left-0
                before:bg-current/5 before:-z-10`}
            style={
                {
                    "--color": `var(--${color})`,
                    boxShadow: bsh,
                } as CSSProperties
            }
        >
            {children}
        </div>
    );
};
