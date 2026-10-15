import { TopIndentShape } from "./TopIndentShape";

export type CollectionItem = {
    name: string;
    src: string;
};

export const CurrentSlideProject = () => {
    return (
        <div className="grid grid-cols-2 gap-8 w-full h-full min-h-screen">
            <TopIndentShape
                borderRadius={24}
                indentWidth={50}
                indentDepth={30}
                indentRoundness={0.8}
                maxRotateX={4}
                maxRotateY={4}
                perspective={1000}
                tiltSpeed={0.03}
                indentPosition="top-right"
            >
                s
            </TopIndentShape>
            <TopIndentShape
                borderRadius={24}
                indentWidth={50}
                indentDepth={30}
                indentRoundness={0.8}
                maxRotateX={4}
                maxRotateY={4}
                perspective={1000}
                tiltSpeed={0.03}
                indentPosition="top-left"
            >
                s
            </TopIndentShape>

            <TopIndentShape
                borderRadius={24}
                maxRotateX={4}
                maxRotateY={4}
                perspective={1000}
                tiltSpeed={0.03}
                indentPosition="none"
            >
                s
            </TopIndentShape>
            <TopIndentShape
                borderRadius={24}
                maxRotateX={4}
                maxRotateY={4}
                perspective={1000}
                tiltSpeed={0.03}
                indentPosition="none"
            >
                s
            </TopIndentShape>
        </div>
    );
};
