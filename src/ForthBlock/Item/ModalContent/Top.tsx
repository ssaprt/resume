import { DynamicSvgIcon } from "../../../components/Icons/DynamicSvgIcon";
import { useItemContext } from "../shared/hook/useItemContext";

export const Top = () => {
    const { iconName, title } = useItemContext();

    return (
        <div className="col-center-5 w-full">
            <div className="col-center-0 gap-5">
                <div
                    className="
                        size-30
                        col-center-0
                        justify-center"
                >
                    <DynamicSvgIcon
                        name={iconName}
                        className="w-full h-auto fill-curr"
                    />
                </div>
                <h1 className="transform scale-y-150 tracking-[0.1px] text-[40px]!">
                    {title}
                </h1>
            </div>
        </div>
    );
};
