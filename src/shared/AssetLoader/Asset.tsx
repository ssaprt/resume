import type { ReactNode } from "react";
import { useEffect } from "react";

import { assetLoadStore } from "./AssetLoadStore";

type AssetProps = {
    name: string;
    children: ReactNode;
};

export const Asset = ({ name, children }: AssetProps) => {
    useEffect(() => {
        assetLoadStore.register(name);
    }, [name]);

    return children;
};
