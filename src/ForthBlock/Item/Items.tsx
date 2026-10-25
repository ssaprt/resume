import { motion } from "framer-motion";
import { useTransform } from "motion/react";
import { useDevice } from "../../scroll/useDevice";
import { useScrollElementMotion } from "../../scroll/useScroll";
import { Item } from "./Item";
import { aboutProject } from "./dataItem/aboutProject";
import { devTools } from "./dataItem/devTools";
import { learningProject } from "./dataItem/projectLearning";
import { projectProps } from "./dataItem/projectProps";

export const Items = () => {
    const { ref, enterProgress } = useScrollElementMotion();
    const { isMobile } = useDevice();

    const { twoPeters, utilityLab, twoPetersPanel, crm, radioDock, gmoon } =
        projectProps;
    const {
        aboutCrm,
        aboutRadioDock,
        aboutGmoon,
        aboutTwoPeters,
        aboutUtilityLab,
        aboutTwoPetersPanel,
    } = aboutProject;
    const {
        learningTwoPeters,
        learningUtilityLab,
        learningTwoPetersPanel,
        learningRadioDock,
        learningGmoon,
        learningCrm,
    } = learningProject;

    const opacity = useTransform(
        enterProgress,
        [0.1, 0.1001],
        [isMobile ? 1 : 0.5, 1],
    );
    const y = useTransform(enterProgress, [0, 0.0001], [isMobile ? 1 : 90, 0]);
    const pointerEvents = useTransform(
        enterProgress,
        [0, 0.0001],
        [isMobile ? "auto" : "none", "auto"],
    );
    return (
        <motion.div
            ref={ref}
            style={{ opacity, y, pointerEvents }}
            className="grid w-full grid-cols-1 items-stretch gap-3 md:grid-cols-2 xl:grid-cols-2 transition-all duration-900"
        >
            <Item
                dir={-1}
                text={{
                    aboutProject: aboutTwoPeters,
                    developmentTools: devTools.twoPeters,
                }}
                iconName="circle"
                title="Two-Peters"
                src="/videos/two-peters.mp4"
                srcMobile="/videos/two-peters-mobile.mp4"
                colorName="curr"
                colorGlass="rgba(38, 38, 38, .9)"
                delay={600}
                projectProps={twoPeters}
                learning={learningTwoPeters}
            />

            <Item
                dir={1}
                text={{
                    aboutProject: aboutUtilityLab,
                    developmentTools: devTools.utilityLab,
                }}
                iconName="mana"
                title="Utility-lab"
                src="/videos/utility-lab.mp4"
                srcMobile="/videos/utility-lab-mobile.mp4"
                colorName="curr"
                colorGlass="rgba(100, 116, 139, .9)"
                delay={600}
                projectProps={utilityLab}
                learning={learningUtilityLab}
            />

            <Item
                dir={-1}
                text={{
                    aboutProject: aboutTwoPetersPanel,
                    developmentTools: devTools.twoPetersPanel,
                }}
                iconName="two-peters"
                title="Business MS"
                src="/videos/panel-two-peters.mp4"
                colorName="curr"
                colorGlass="rgba(0,0,0,.55)"
                delay={600}
                projectProps={twoPetersPanel}
                learning={learningTwoPetersPanel}
            />

            <Item
                dir={1}
                text={{
                    aboutProject: aboutRadioDock,
                    developmentTools: devTools.radioDock,
                }}
                iconName="radio"
                title="RadioDock"
                src="/videos/utility-lab-radio.mp4"
                colorName="curr"
                colorGlass="rgba(38, 38, 38, .9)"
                delay={600}
                projectProps={radioDock}
                learning={learningRadioDock}
            />

            <Item
                dir={-1}
                text={{
                    aboutProject: aboutGmoon,
                    developmentTools: devTools.gmoon,
                }}
                iconName="gmoon"
                title="GMoon"
                src="/videos/gmoon.mp4"
                srcMobile="/videos/gmoon-mobile.mp4"
                colorName="curr"
                colorGlass="rgba(83, 222, 203, 0.543)"
                delay={600}
                projectProps={gmoon}
                learning={learningGmoon}
            />

            <Item
                dir={1}
                text={{
                    aboutProject: aboutCrm,
                    developmentTools: devTools.crm,
                }}
                iconName="crm"
                title="Custom CRM"
                src="/videos/crm.mp4"
                srcMobile="/videos/crm-mobile.mp4"
                colorName="curr"
                colorGlass="rgba(199, 199, 199, 0.569)"
                delay={600}
                projectProps={crm}
                learning={learningCrm}
            />
        </motion.div>
    );
};
