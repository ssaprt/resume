export const Block = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={`
                min-w-0
                h-fit
                flex-none
                p-6
                bg-curr/10
                rounded-[24px]
                    ${className}
                    `}
        >
            {children}
        </div>
    );
};
