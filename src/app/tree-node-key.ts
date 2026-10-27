import type { TreeNodeData } from "./types";

const localTreeNodeKey = Symbol("localTreeNodeKey");
let nextLocalTreeNodeKey = 0;

type TreeNodeWithLocalKey = TreeNodeData & {
    [localTreeNodeKey]?: string;
};

/**
 * Returns the MEI id when one exists, otherwise an editor-only identity.
 * Symbol properties are preserved by object spreads but omitted from JSON,
 * so unsaved nodes remain addressable without adding ids to the subtree.
 */
export function treeNodeKey(node: TreeNodeData): string {
    if (node.id) return node.id;

    const keyedNode = node as TreeNodeWithLocalKey;
    if (!keyedNode[localTreeNodeKey]) {
        Object.defineProperty(keyedNode, localTreeNodeKey, {
            value: `local-tree-node-${++nextLocalTreeNodeKey}`,
            enumerable: true,
        });
    }
    return keyedNode[localTreeNodeKey] as string;
}
