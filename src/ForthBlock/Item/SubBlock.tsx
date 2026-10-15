export const SubBlock = ({ titleName }: { titleName: string }) => {
    return (
        <div className="row-center-1 w-full">
            <span
                className="pb-[2px] shrink-0 text-current/80 text-[12px]! row-center-2
            before:content-[''] before:block before:relative before:w-1 before:h-1 before:bg-current/50 before:rounded-full before:outline-1 before:outline-offset-2"
            >
                {titleName}
            </span>
            <div className="h-[1px] w-full bg-gradient-to-r from-current/50 from-[90%] to-transparent " />
        </div>
    );
};
