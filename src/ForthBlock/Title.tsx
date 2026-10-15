import { DynamicSvgIcon } from "../components/Icons/DynamicSvgIcon";
import { CarouselProjects } from "./CarouselProjects/CarouselProjects";

export const Title = () => {
    return (
        <div className="row-center-2 w-full justify-between border-y-1 border-y-alter-fg/40 bg-alter-fg/10">
            <h1
                className={`relative shrink-0 text-nowrap text-alter-fg text-[28px]!`}
            >
                Projects
            </h1>
            <div className="row-center-1 w-full max-w-[340px]">
                <CarouselProjects
                    slides={[
                        <DynamicSvgIcon
                            name="moon.svg"
                            className="w-full h-auto aspect-square fill-alter-fg"
                        />,
                        <DynamicSvgIcon
                            name="circle.svg"
                            className="w-full h-auto aspect-square fill-alter-fg p-1"
                        />,
                        <DynamicSvgIcon
                            name="mana.svg"
                            className="w-full h-auto aspect-square fill-alter-fg p-1"
                        />,
                    ]}
                    options={{
                        loop: true,
                        startIndex: 1,
                    }}
                />
            </div>
        </div>
    );
};
