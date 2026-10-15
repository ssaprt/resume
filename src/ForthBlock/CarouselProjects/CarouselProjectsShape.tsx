import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    width?: number;
    height?: number;
    centerRadius?: number;
    bladeLength?: number;
    bladeWidth?: number;
    bladeRootAngle?: number;
    bladeCurve?: number;
};

export const CarouselProjectsShape = ({
    children,
    width = 360,
    height = 160,
    centerRadius = 34,
    bladeLength = 175,
    bladeWidth = 72,
    bladeRootAngle = 35,
    bladeCurve = 0.7,
}: Props) => {
    const cx = width / 2;
    const cy = height / 2;

    const radius = Math.min(centerRadius, height / 2 - 1, width / 2 - 1);

    const length = Math.min(bladeLength, width / 2 - 1);

    const alpha = (Math.min(Math.max(bladeRootAngle, 1), 89) * Math.PI) / 180;

    const halfWidth = Math.min(bladeWidth / 2, height / 2 - 1);

    const curve = Math.min(Math.max(bladeCurve, 0), 1);

    const rootHandle = length * (0.12 + curve * 0.18);

    const tipHandle = length * (0.05 + curve * 0.1);

    const rootX = radius * Math.cos(alpha);

    const rootY = radius * Math.sin(alpha);

    const rightUpper = {
        x: cx + rootX,
        y: cy - rootY,
    };

    const rightLower = {
        x: cx + rootX,
        y: cy + rootY,
    };

    const leftUpper = {
        x: cx - rootX,
        y: cy - rootY,
    };

    const leftLower = {
        x: cx - rootX,
        y: cy + rootY,
    };

    const rightTipCenterX = cx + length - halfWidth;

    const leftTipCenterX = cx - length + halfWidth;

    const rightUpperTip = {
        x: rightTipCenterX,
        y: cy - halfWidth,
    };

    const rightLowerTip = {
        x: rightTipCenterX,
        y: cy + halfWidth,
    };

    const leftUpperTip = {
        x: leftTipCenterX,
        y: cy - halfWidth,
    };

    const leftLowerTip = {
        x: leftTipCenterX,
        y: cy + halfWidth,
    };

    const rightUpperTangent = {
        x: Math.sin(alpha),
        y: Math.cos(alpha),
    };

    const rightLowerTangent = {
        x: -Math.sin(alpha),
        y: Math.cos(alpha),
    };

    const leftLowerTangent = {
        x: -Math.sin(alpha),
        y: -Math.cos(alpha),
    };

    const leftUpperTangent = {
        x: Math.sin(alpha),
        y: -Math.cos(alpha),
    };

    const path = `
        M ${cx} ${cy - radius}

        A
            ${radius} ${radius}
            0 0 1
            ${rightUpper.x} ${rightUpper.y}

        C
            ${rightUpper.x + rightUpperTangent.x * rootHandle}
            ${rightUpper.y + rightUpperTangent.y * rootHandle},

            ${rightUpperTip.x - tipHandle}
            ${rightUpperTip.y},

            ${rightUpperTip.x}
            ${rightUpperTip.y}

        A
            ${halfWidth} ${halfWidth}
            0 0 1
            ${rightLowerTip.x} ${rightLowerTip.y}

        C
            ${rightLowerTip.x - tipHandle}
            ${rightLowerTip.y},

            ${rightLower.x - rightLowerTangent.x * rootHandle}
            ${rightLower.y - rightLowerTangent.y * rootHandle},

            ${rightLower.x}
            ${rightLower.y}

        A
            ${radius} ${radius}
            0 0 1
            ${leftLower.x} ${leftLower.y}

        C
            ${leftLower.x + leftLowerTangent.x * rootHandle}
            ${leftLower.y + leftLowerTangent.y * rootHandle},

            ${leftLowerTip.x + tipHandle}
            ${leftLowerTip.y},

            ${leftLowerTip.x}
            ${leftLowerTip.y}

        A
            ${halfWidth} ${halfWidth}
            0 0 1
            ${leftUpperTip.x} ${leftUpperTip.y}

        C
            ${leftUpperTip.x + tipHandle}
            ${leftUpperTip.y},

            ${leftUpper.x - leftUpperTangent.x * rootHandle}
            ${leftUpper.y - leftUpperTangent.y * rootHandle},

            ${leftUpper.x}
            ${leftUpper.y}

        A
            ${radius} ${radius}
            0 0 1
            ${cx} ${cy - radius}

        Z
    `;

    const normalizedPath = path.replace(/\s+/g, " ").trim();

    return (
        <div
            className="relative z-2"
            style={{
                width,
                height,
                clipPath: `path('${normalizedPath}')`,
            }}
        >
            <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox={`0 0 ${width} ${height}`}
                fill="none"
            >
                <path
                    d={normalizedPath}
                    className={`stroke-alter-fg`}
                    strokeWidth="0"
                />
            </svg>

            <div
                className="relative z-10 flex h-full w-full justify-center"
                data-cursor="move"
            >
                {children}
            </div>
        </div>
    );
};
