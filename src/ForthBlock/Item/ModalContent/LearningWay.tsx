import { Block } from "./Block";
import { LearningSection } from "./LeraningSection";

export const LearningWay = () => {
    return (
        <Block className="w-full">
            <h3 className={`mx-auto font-rob! font-bold! text-xl! mb-4`}>
                Learning content
            </h3>
            <LearningSection v="1.0" title="Project concept" />
            <LearningSection v="1.1" title="Goals and objectives" />
            <LearningSection v="1.2" title="Analysis and research" />
            <LearningSection v="1.3" title="Planning" />
            <LearningSection v="1.4" title="Technology Selection" />
            <LearningSection v="1.5" title="Design" />
            <LearningSection v="1.6" title="Development" />
            <LearningSection v="1.7" title="Testing" />
            <LearningSection v="1.8" title="Implementation and launch" />
            <LearningSection v="1.9" title="Results" />
        </Block>
    );
};
