"use client";

type Props = {
    id: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
};

export const UnControlScrollSection = ({ id, style, children }: Props) => {
    return (
        <section
            className="min-h-screen w-9/10 m-auto"
            style={{
                height: "auto",
                transform: "none",
                ...style,
            }}
            data-scroll-section
            data-scroll-block
            data-control-scroll="false"
            data-section-id={id}
        >
            {children}
        </section>
    );
};
