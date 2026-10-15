import { useEffect } from "react";

import { assetLoadStore } from "./AssetLoadStore";

type AssetReadyProps = {
    name: string;
};

export const AssetReady = ({ name }: AssetReadyProps) => {
    useEffect(() => {
        assetLoadStore.ready(name);
    }, [name]);

    return null;
};
