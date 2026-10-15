export const ProjectSpendTime = (item: { title: string; value: string }) => {
    return (
        <div className="relative z-10 grid w-full grid-cols-[1fr_16px_1fr] items-center">
            <div className="flex min-w-0 items-center justify-end gap-2">
                <span className="shrink-0 text-[12px]!">{item.title}</span>
                <div className="h-px min-w-2 flex-1 bg-gradient-to-r from-transparent to-current/50" />
            </div>

            <div className="relative z-10 flex h-full items-center justify-center">
                <div className="size-1 rounded-full bg-current outline-1 outline-offset-3 outline-current" />
            </div>

            <div className="flex min-w-0 items-center gap-2">
                <div className="h-px min-w-2 flex-1 bg-gradient-to-r from-current/50 to-transparent" />
                <span className="shrink-0 text-[12px]! uppercase">
                    {item.value}
                </span>
            </div>
        </div>
    );
};
