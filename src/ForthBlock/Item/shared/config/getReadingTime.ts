import type { ItemContextProps } from "../types/Item.type";
import { getItemText } from "./getItemText";

export function getReadingTime(item: ItemContextProps): {
    minutes: number;
    seconds: number;
} {
    const text = getItemText(item);
    const words = text ? text.split(/\s+/).length : 0;

    const totalSeconds = Math.ceil((words / 200) * 60);

    return {
        minutes: Math.floor(totalSeconds / 60),
        seconds: totalSeconds % 60,
    };
}
