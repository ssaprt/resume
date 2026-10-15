import { useGLTF } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { MODEL_ASSET_CHUNKS, type ModelAsset } from "./AssetManifest";

type PreloadItemProps = {
    asset: ModelAsset;
    onLoaded: (name: string) => void;
};

const PreloadItem = ({ asset, onLoaded }: PreloadItemProps) => {
    useGLTF(asset.path);

    useEffect(() => {
        onLoaded(asset.name);
    }, [asset.name, onLoaded]);

    return null;
};

type ModelBatchPreloaderProps = {
    onComplete: () => void;
};

export const ModelBatchPreloader = ({
    onComplete,
}: ModelBatchPreloaderProps) => {
    const [chunkIndex, setChunkIndex] = useState(0);
    const loadedNamesRef = useRef(new Set<string>());

    const currentChunk = MODEL_ASSET_CHUNKS[chunkIndex];

    const handleItemLoaded = useCallback(
        (name: string) => {
            if (loadedNamesRef.current.has(name)) {
                return;
            }

            loadedNamesRef.current.add(name);

            const chunk = MODEL_ASSET_CHUNKS[chunkIndex];

            if (
                chunk?.every(({ name: assetName }) =>
                    loadedNamesRef.current.has(assetName),
                )
            ) {
                setChunkIndex((index) => index + 1);
            }
        },
        [chunkIndex],
    );

    useEffect(() => {
        if (chunkIndex >= MODEL_ASSET_CHUNKS.length) {
            onComplete();
        }
    }, [chunkIndex, onComplete]);

    if (!currentChunk) {
        return null;
    }

    return (
        <>
            {currentChunk.map((asset) => (
                <Suspense key={asset.name} fallback={null}>
                    <PreloadItem asset={asset} onLoaded={handleItemLoaded} />
                </Suspense>
            ))}
        </>
    );
};
