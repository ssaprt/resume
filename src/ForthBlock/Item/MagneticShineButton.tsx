import { useRef, useState } from "react";

export const MagneticShineButton = ({
    onClick,
    text,
}: {
    onClick: () => void;
    text: string;
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    // Отслеживаем позицию мыши внутри кнопки
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <>
            <style>{`
                @keyframes shine {
                    0% { transform: translateX(-150%) skewX(-20deg); }
                    60% { transform: translateX(150%) skewX(-20deg); }
                    100% { transform: translateX(150%) skewX(-20deg); }
                }
            `}</style>

            <button
                onClick={onClick}
                ref={buttonRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="
                    relative 
                    overflow-hidden
                    py-2 
                    px-4 
                    rounded-[24px] 
                    border border-curr/30 
                    text-curr
                    backdrop-blur-[2px]
                    mt-4
                "
            >
                <div
                    className="absolute inset-y-0 -left-[25%] pointer-events-none w-[150%] bg-gradient-to-r from-transparent via-curr/20 to-transparent opacity-70"
                    style={{ animation: "shine 4s infinite linear" }}
                />

                <div
                    className="absolute pointer-events-none rounded-full bg-curr/10 transition-all duration-500 ease-out"
                    style={{
                        left: mousePos.x,
                        top: mousePos.y,
                        width: isHovered ? "300px" : "0px",
                        height: isHovered ? "300px" : "0px",
                        transform: "translate(-50%, -50%)",
                    }}
                />

                <span className="relative z-10 pointer-events-none">
                    {text}
                </span>
            </button>
        </>
    );
};
