import { learningSections } from "../dataItem/v";

export const EachContent = ({
    i,
    children,
}: {
    i: number;
    children: React.ReactNode;
}) => {
    const item = learningSections[i];

    return (
        <div className={`col-start-2 w-full`}>
            <div className={`row-center-1`}>
                <h3>{item.v}</h3>
                <h3>{item.title}</h3>
            </div>
            <div>{children}</div>
        </div>
    );
};
