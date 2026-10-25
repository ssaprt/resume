export type Names = "two-peters" | "curr" | "gmoon" | "crm" | "radio";

export type Text = {
    aboutProject: string;
    developmentTools: string[];
};

export type ItemProps = {
    title: string;
    value: string;
};

export type ItemContextProps = {
    title: string;
    iconName: string;
    colorName: Names;
    src: string;
    srcMobile?: string;
    colorGlass: string;
    delay: number;
    text: Text;
    projectProps: ItemProps[];
    dir: -1 | 1;
    learning?: React.ReactNode[];
};
