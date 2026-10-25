import { LearningProjectModal } from "../../../components/modals/learningProject/LearningProjectModal";
import { useItemContext } from "../shared/hook/useItemContext";
import { EachContent } from "./EachContent";
import { LearningWay } from "./LearningWay";
import { TimeRead } from "./TimeRead";
import { Top } from "./Top";
import { VideosBlock } from "./Videos";

export const ModalContent = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
}) => {
    const { learning } = useItemContext();

    return (
        <LearningProjectModal open={open} setOpen={setOpen}>
            <Top />
            <VideosBlock />
            <TimeRead />
            <LearningWay />
            {learning?.map((each, index) => (
                <EachContent key={index} i={index}>
                    {each}
                </EachContent>
            ))}
        </LearningProjectModal>
    );
};
