import type { ReactNode } from "react";

type Props = {
    id: string;
    children: ReactNode;
    className?: string;
};

export default function ControlScrollSection({
    id,
    children,
    className,
}: Props) {
    return (
        <section
            data-scroll-section
            data-scroll-block
            data-control-scroll="true"
            data-section-id={id}
            className={`h-screen ${className}`}
        >
            {children}
        </section>
    );
}
