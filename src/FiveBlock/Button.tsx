export const Button = ({ children }: { children: React.ReactNode }) => {
    return (
        <button
            className="
            text-[12px]!
            px-3
            py-1
            text-app
            bg-curr
            rounded-[2px]
            shrink-0
            "
        >
            {children}
        </button>
    );
};
