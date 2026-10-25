import { isValidElement, type ReactNode } from "react";
import type { ItemContextProps } from "../types/Item.type";

function getNodeText(node: ReactNode): string {
    if (node == null || typeof node === "boolean") return "";

    if (typeof node === "string" || typeof node === "number") {
        return String(node);
    }

    if (Array.isArray(node)) {
        return node.map(getNodeText).filter(Boolean).join(" ");
    }

    if (
        isValidElement<{
            children?: ReactNode;
            title?: ReactNode;
            value?: ReactNode;
        }>(node)
    ) {
        const { children, title, value } = node.props;

        return [title, value, children]
            .map(getNodeText)
            .filter(Boolean)
            .join(" ");
    }

    return "";
}

export function getItemText(item: ItemContextProps): string {
    return [item.title, ...(item.learning ?? []).map(getNodeText)]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}
