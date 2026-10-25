export const ButtonHide = ({
    setOpen,
}: {
    setOpen: (open: boolean) => void;
}) => {
    return (
        <div
            data-cursor="magnetic"
            data-color="curr"
            data-shadow="0 0 50px 20px"
            onClick={() => setOpen(false)}
            className="sticky
            top-4 w-full
            h-6
            flex
            items-center
            justify-center
            rounded-full
            z-56
            "
        >
            <div
                className="
                    w-20
                    h-2
                    rounded-full
                    border border-curr/30
                    shadow-[inset_0_0_16px_0px]
                    shadow-curr/30
                    cursor-pointer
                                    "
            />
        </div>
    );
};
