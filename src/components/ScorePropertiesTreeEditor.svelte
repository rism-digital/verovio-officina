<script lang="ts">
    import propertiesSchema from "../app/properties.json";
    import type { ResolvedMenuEntry } from "../app/action-resolver";
    import type { ElementDef } from "../app/rng-loader";
    import type {
        EditActionSetParam,
        TargetedContextAction,
        TreeDropPosition,
        TreeNodeData,
    } from "../app/types";
    import { treeNodeKey } from "../app/tree-node-key";
    import ScorePropertiesAttributeList from "./ScorePropertiesAttributeList.svelte";
    import Tree from "./Tree.svelte";

    export let value: TreeNodeData | null = null;
    export let disabledElements: string[] = [];
    export let preventDelete: string[] = ["staffGrp", "staffDef"];
    export let preventDeleteIfContains: Record<string, string[]> = {};
    export let moveTargets: Record<string, string[]> = {};
    export let reorderableElements: string[] = [];

    let selectedNodeId: string | null = null;
    const ancestors: TreeNodeData[] = [];
    const elementDefinitions = propertiesSchema as Record<string, ElementDef>;

    function findNodeByKey(
        node: TreeNodeData | null,
        key: string | null,
    ): TreeNodeData | null {
        if (!node || !key) return null;
        if (treeNodeKey(node) === key) return node;
        for (const child of node.children ?? []) {
            const found = findNodeByKey(child, key);
            if (found) return found;
        }
        return null;
    }

    function findParentByChildKey(
        node: TreeNodeData | null,
        childKey: string,
    ): TreeNodeData | null {
        if (!node?.children?.length) return null;
        if (node.children.some((child) => treeNodeKey(child) === childKey)) {
            return node;
        }
        for (const child of node.children) {
            const parent = findParentByChildKey(child, childKey);
            if (parent) return parent;
        }
        return null;
    }

    function removeNodeByKey(
        node: TreeNodeData | null,
        key: string,
    ): TreeNodeData | null {
        if (!node || treeNodeKey(node) === key) return null;
        if (!node.children?.length) return node;
        return {
            ...node,
            children: node.children
                .map((child) => removeNodeByKey(child, key))
                .filter((child): child is TreeNodeData => child !== null),
        };
    }

    function replaceNodeByKey(
        node: TreeNodeData | null,
        key: string | null,
        updater: (node: TreeNodeData) => TreeNodeData,
    ): TreeNodeData | null {
        if (!node || !key) return node;
        if (treeNodeKey(node) === key) return updater(node);
        if (!node.children?.length) return node;
        return {
            ...node,
            children: node.children.map((child) =>
                replaceNodeByKey(child, key, updater) as TreeNodeData,
            ),
        };
    }

    function isNodeDisabled(node: TreeNodeData | null): boolean {
        return Boolean(node && disabledElements.includes(node.element));
    }

    function hasDescendantElement(
        node: TreeNodeData,
        elementNames: Set<string>,
    ): boolean {
        for (const child of node.children ?? []) {
            if (
                elementNames.has(child.element)
                || hasDescendantElement(child, elementNames)
            ) {
                return true;
            }
        }
        return false;
    }

    function canDeleteNode(node: TreeNodeData): boolean {
        if (node === value || preventDelete.includes(node.element)) return false;
        const protectedDescendants = preventDeleteIfContains[node.element] ?? [];
        return !hasDescendantElement(node, new Set(protectedDescendants));
    }

    function handleTreeSelect(id: string) {
        if (!isNodeDisabled(findNodeByKey(value, id))) selectedNodeId = id;
    }

    function canAddChild(node: TreeNodeData, elementName: string): boolean {
        const definition = elementDefinitions[node.element];
        const existingChildren = new Set(
            (node.children ?? []).map((child) => child.element),
        );
        const optionalChildren = new Set(definition?.optional ?? []);
        return (!optionalChildren.has(elementName) || !existingChildren.has(elementName))
            && !(definition?.choice ?? []).some(
                (group) => group.includes(elementName)
                    && group.some(
                        (choice) => choice !== elementName
                            && existingChildren.has(choice),
                    ),
            );
    }

    function resolveContextMenuItems(node: TreeNodeData): ResolvedMenuEntry[] {
        if (isNodeDisabled(node)) return [];
        const definition = elementDefinitions[node.element];
        const addItems: ResolvedMenuEntry[] = (definition?.children ?? [])
            .filter((elementName) => canAddChild(node, elementName))
            .map((elementName) => ({
                kind: "action",
                label: elementName,
                actionKey: `score-properties-add-${elementName}`,
                action: "insert",
                param: {
                    elementName,
                    elementId: treeNodeKey(node),
                    insertMode: "appendChild",
                },
            }));

        if (definition?.text && canAddChild(node, "text")) {
            addItems.push({
                kind: "action",
                label: "text",
                actionKey: "score-properties-add-text",
                action: "insert",
                param: {
                    elementName: "text",
                    elementId: treeNodeKey(node),
                    insertMode: "appendChild",
                },
            });
        }

        const items: ResolvedMenuEntry[] = [];
        if (addItems.length) {
            items.push({ kind: "submenu", label: "Add", items: addItems });
        }
        if (canDeleteNode(node)) {
            items.push({
                kind: "action",
                label: "Delete",
                actionKey: "score-properties-delete",
                action: "delete",
                param: { elementId: treeNodeKey(node) },
            });
        }
        return items;
    }

    function createChildNode(elementName: string): TreeNodeData {
        const definition = elementDefinitions[elementName];
        return {
            element: elementName,
            attributes: {},
            isLeaf: (definition?.children.length ?? 0) === 0,
            ...(elementName === "text" ? { text: "" } : {}),
        };
    }

    function handleTreeContextAction(action: TargetedContextAction) {
        const targetNode = findNodeByKey(value, action.targetId);
        if (!targetNode || isNodeDisabled(targetNode)) return;

        if (action.action === "delete") {
            if (!canDeleteNode(targetNode)) return;
            const targetKey = treeNodeKey(targetNode);
            const parent = findParentByChildKey(value, targetKey);
            if (!parent) return;
            value = removeNodeByKey(value, targetKey);
            selectedNodeId = isNodeDisabled(parent) ? null : treeNodeKey(parent);
            return;
        }

        if (action.action !== "insert" || action.param.insertMode !== "appendChild") {
            return;
        }
        const child = createChildNode(action.param.elementName);
        value = replaceNodeByKey(value, action.targetId, (node) => ({
            ...node,
            children: [...(node.children ?? []), child],
            isLeaf: false,
        }));
        selectedNodeId = treeNodeKey(child);
    }

    function handleTreeMove(
        sourceId: string,
        targetId: string,
        position: TreeDropPosition,
    ) {
        const source = findNodeByKey(value, sourceId);
        const target = findNodeByKey(value, targetId);
        if (!source || !target || sourceId === targetId || source === value) {
            return;
        }

        const sourceParent = findParentByChildKey(value, sourceId);
        if (!sourceParent) return;

        if (position !== "inside") {
            const targetParent = findParentByChildKey(value, targetId);
            if (
                !reorderableElements.includes(source.element)
                || !reorderableElements.includes(target.element)
                || !targetParent
                || !moveTargets[source.element]?.includes(targetParent.element)
                || findNodeByKey(source, targetId)
            ) {
                return;
            }
            const withoutSource = removeNodeByKey(value, sourceId);
            const destinationKey = treeNodeKey(targetParent);
            const destination = findNodeByKey(withoutSource, destinationKey);
            if (
                !destination
                || isNodeDisabled(destination)
                || !canAddChild(destination, source.element)
            ) {
                return;
            }
            value = replaceNodeByKey(withoutSource, destinationKey, (parent) => {
                const children = (parent.children ?? []).filter(
                    (child) => treeNodeKey(child) !== sourceId,
                );
                const targetIndex = children.findIndex(
                    (child) => treeNodeKey(child) === targetId,
                );
                if (targetIndex < 0) return parent;
                children.splice(
                    targetIndex + (position === "after" ? 1 : 0),
                    0,
                    source,
                );
                return { ...parent, children };
            });
            return;
        }

        if (!moveTargets[source.element]?.includes(target.element)) return;
        if (isNodeDisabled(target)) return;
        if (findNodeByKey(source, targetId)) return;
        if (treeNodeKey(sourceParent) === targetId) return;
        if (!canAddChild(target, source.element)) return;

        const withoutSource = removeNodeByKey(value, sourceId);
        value = replaceNodeByKey(withoutSource, targetId, (node) => ({
            ...node,
            children: [...(node.children ?? []), source],
            isLeaf: false,
        }));
    }

    function updateSelectedAttribute(name: string, attributeValue: string) {
        if (name === "xml:id" || isNodeDisabled(selectedNode)) return;
        value = replaceNodeByKey(value, selectedNodeId, (node) => ({
            ...node,
            attributes: { ...(node.attributes ?? {}), [name]: attributeValue },
        }));
    }

    function updateSelectedText(text: string) {
        if (isNodeDisabled(selectedNode)) return;
        value = replaceNodeByKey(value, selectedNodeId, (node) => ({
            ...node,
            text,
        }));
    }

    function handleAttributeEdit(param: EditActionSetParam, _commit: boolean) {
        if (!selectedNode || param.elementId !== treeNodeKey(selectedNode)) return;
        updateSelectedAttribute(param.attribute, param.value);
    }

    $: selectedNode = findNodeByKey(value, selectedNodeId) ?? value;
    $: selectedNodeDisabled = isNodeDisabled(selectedNode);
    $: selectedText = selectedNode?.text == null ? "" : String(selectedNode.text);
    $: if (!value) {
        selectedNodeId = null;
    } else if (!findNodeByKey(value, selectedNodeId)) {
        selectedNodeId = treeNodeKey(value);
    }
</script>

<div class="vrv-dialog-score-properties-columns">
    <div class="vrv-dialog-score-properties-column">
        <div class="vrv-dialog-score-properties-title">Score structure</div>
        <div class="vrv-dialog-score-properties-panel">
            {#if value}
                <Tree
                    {ancestors}
                    context={value}
                    showRootNode
                    showBreadcrumbs={false}
                    selectOnContextMenu
                    {disabledElements}
                    draggableElements={Object.keys(moveTargets)}
                    dropTargetElements={[
                        ...new Set(Object.values(moveTargets).flat()),
                    ]}
                    {reorderableElements}
                    selectedId={selectedNodeId}
                    onSelectElement={handleTreeSelect}
                    onContextAction={handleTreeContextAction}
                    onMoveNode={handleTreeMove}
                    resolveContextMenuItems={resolveContextMenuItems}
                />
            {:else}
                <div>No score element selected.</div>
            {/if}
        </div>
    </div>
    <div class="vrv-dialog-score-properties-column">
        <div class="vrv-dialog-score-properties-title">Attributes</div>
        <div class="vrv-dialog-score-properties-panel">
            {#if selectedNode}
                {#if selectedNode.text != null}
                    <input
                        class="vrv-dialog-score-properties-panel-text"
                        value={selectedText}
                        disabled={selectedNodeDisabled}
                        on:input={(event) =>
                            updateSelectedText((event.target as HTMLInputElement).value)}
                    />
                {:else}
                    <ScorePropertiesAttributeList
                        node={selectedNode}
                        readOnly={selectedNodeDisabled}
                        onEditSet={handleAttributeEdit}
                    />
                {/if}
            {:else}
                <div>Select a score node to view attributes.</div>
            {/if}
        </div>
    </div>
</div>
