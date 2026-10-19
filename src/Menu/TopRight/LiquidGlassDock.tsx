import {
    useEffect,
    useState,
    type CSSProperties,
    type ReactNode,
    type RefObject,
} from "react";
import LiquidGlass from "./LiquidGlass";

type LiquidGlassDockProps = {
    sceneRef: RefObject<HTMLElement | null>;
    children?: ReactNode;
    repaintKey?: number | string;
    width?: number;
    height?: number;
    radius?: number;
    bottom?: number;
    horizontalInset?: number;
    className?: string;
    style?: CSSProperties;
};

export default function LiquidGlassDock({
    sceneRef,
    children,
    repaintKey,
    width,
    height = 40,
    radius = 20,
    bottom = 16,
    horizontalInset = 16,
    className,
    style,
}: LiquidGlassDockProps) {
    const [viewportWidth, setViewportWidth] = useState(() =>
        typeof window === "undefined" ? 0 : window.innerWidth,
    );

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fullWidth = width === undefined;
    const actualWidth =
        width ?? Math.max(0, viewportWidth - horizontalInset * 2);

    return (
        <LiquidGlass
            sceneRef={sceneRef}
            width={actualWidth}
            height={height}
            radius={radius}
            depth={95}
            splay={9}
            feather={26}
            curve={1.5}
            bias={0.45}
            biasAngle={45}
            blur={0.5}
            chroma={0.02}
            glint={26}
            frost={0.05}
            tint={0}
            repaintKey={repaintKey}
            className={className}
            style={{
                position: "fixed",
                left: fullWidth ? horizontalInset : "50%",
                bottom,
                transform: fullWidth ? undefined : "translateX(-50%)",
                zIndex: 1000,
                maxWidth: "calc(100vw - 16px)",
                ...style,
            }}
        >
            {children}
        </LiquidGlass>
    );
}
