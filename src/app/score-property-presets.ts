import type { TreeNodeData } from "./types";

export type TreeNodePreset = {
    element: string;
    attributes?: Record<string, unknown>;
    children?: TreeNodePreset[];
    text?: string;
};

export type ScorePropertyPreset = {
    icon?: string;
    name: string;
    preset: TreeNodePreset;
};

export type InstrumentPresetCategory = {
    name: string;
    instruments: ScorePropertyPreset[];
};

export function cloneTreeNode(node: TreeNodeData | null): TreeNodeData | null {
    return node
        ? JSON.parse(JSON.stringify(node)) as TreeNodeData
        : null;
}

export function instantiateTreePreset(
    preset: TreeNodePreset,
    options: {
        rootId?: string;
        rootAttributes?: Record<string, unknown>;
    } = {},
): TreeNodeData {
    function instantiate(node: TreeNodePreset, isRoot: boolean): TreeNodeData {
        const children = node.children?.map((child) => instantiate(child, false));
        return {
            id: isRoot && options.rootId
                ? options.rootId
                : `score-properties-${crypto.randomUUID()}`,
            element: node.element,
            attributes: {
                ...(node.attributes ?? {}),
                ...(isRoot ? options.rootAttributes ?? {} : {}),
            },
            ...(children?.length ? { children } : { isLeaf: true }),
            ...(node.text !== undefined ? { text: node.text } : {}),
        };
    }

    return instantiate(preset, true);
}

export function mergeTreePreset(
    current: TreeNodeData,
    preset: TreeNodePreset,
): TreeNodeData {
    return mergeNode(current, preset, true);
}

function mergeNode(
    current: TreeNodeData,
    preset: TreeNodePreset,
    isRoot: boolean,
): TreeNodeData {
    const pendingPresetChildren = new Map<string, TreeNodePreset[]>();
    for (const child of preset.children ?? []) {
        const matches = pendingPresetChildren.get(child.element) ?? [];
        matches.push(child);
        pendingPresetChildren.set(child.element, matches);
    }

    const mergedChildren: TreeNodeData[] = [];
    for (const child of current.children ?? []) {
        const presetMatches = pendingPresetChildren.get(child.element);
        if (!presetMatches) {
            mergedChildren.push(child);
            continue;
        }
        const matchingPreset = presetMatches.shift();
        if (matchingPreset) {
            mergedChildren.push(mergeNode(child, matchingPreset, false));
        }
    }

    for (const presetChildren of pendingPresetChildren.values()) {
        for (const child of presetChildren) {
            mergedChildren.push(instantiateTreePreset(child));
        }
    }

    const merged: TreeNodeData = {
        ...current,
        element: preset.element,
        attributes: isRoot
            ? {
                ...(current.attributes ?? {}),
                ...(preset.attributes ?? {}),
            }
            : { ...(preset.attributes ?? {}) },
        ...(preset.text !== undefined ? { text: preset.text } : {}),
    };
    if (mergedChildren.length) {
        merged.children = mergedChildren;
        merged.isLeaf = false;
    } else {
        delete merged.children;
        merged.isLeaf = true;
    }
    return merged;
}

export function serializeTreeNode(node: TreeNodeData | null): string {
    return node ? JSON.stringify(node) : "";
}
