<script lang="ts">
    import propertiesSchema from "../app/properties.json";
    import type { ResolvedMenuEntry } from "../app/action-resolver";
    import type { ElementDef } from "../app/rng-loader";
    import type {
        EditActionSetParam,
        TargetedContextAction,
        TreeNodeData,
    } from "../app/types";
    import ScorePropertiesAttributeList from "./ScorePropertiesAttributeList.svelte";
    import Tree from "./Tree.svelte";

    export let value: TreeNodeData | null = null;
    export let disabledElements: string[] = [];
    export let preventDelete: string[] = ["staffGrp", "staffDef"];

    let selectedNodeId: string | null = null;
    const ancestors: TreeNodeData[] = [];
    const elementDefinitions = propertiesSchema as Record<string, ElementDef>;

    function findNodeById(
        node: TreeNodeData | null,
        id: string | null,
    ): TreeNodeData | null {
        if (!node || !id) return null;
        if (node.id === id) return node;
        for (const child of node.children ?? []) {
            const found = findNodeById(child, id);
            if (found) return found;
        }
        return null;
    }

    function findParentByChildId(
        node: TreeNodeData | null,
        childId: string,
    ): TreeNodeData | null {
        if (!node?.children?.length) return null;
        if (node.children.some((child) => child.id === childId)) return node;
        for (const child of node.children) {
            const parent = findParentByChildId(child, childId);
            if (parent) return parent;
        }
        return null;
    }

    function removeNodeById(
        node: TreeNodeData | null,
        id: string,
    ): TreeNodeData | null {
        if (!node || node.id === id) return null;
        if (!node.children?.length) return node;
        return {
            ...node,
            children: node.children
                .map((child) => removeNodeById(child, id))
                .filter((child): child is TreeNodeData => child !== null),
        };
    }

    function replaceNodeById(
        node: TreeNodeData | null,
        id: string | null,
        updater: (node: TreeNodeData) => TreeNodeData,
    ): TreeNodeData | null {
        if (!node || !id) return node;
        if (node.id === id) return updater(node);
        if (!node.children?.length) return node;
        return {
            ...node,
            children: node.children.map((child) =>
                replaceNodeById(child, id, updater) as TreeNodeData,
            ),
        };
    }

    function isNodeDisabled(node: TreeNodeData | null): boolean {
        return Boolean(node && disabledElements.includes(node.element));
    }

    function handleTreeSelect(id: string) {
        if (!isNodeDisabled(findNodeById(value, id))) selectedNodeId = id;
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
                    elementId: node.id,
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
                    elementId: node.id,
                    insertMode: "appendChild",
                },
            });
        }

        const items: ResolvedMenuEntry[] = [];
        if (addItems.length) {
            items.push({ kind: "submenu", label: "Add", items: addItems });
        }
        if (node.id !== value?.id && !preventDelete.includes(node.element)) {
            items.push({
                kind: "action",
                label: "Delete",
                actionKey: "score-properties-delete",
                action: "delete",
                param: { elementId: node.id },
            });
        }
        return items;
    }

    function createChildNode(elementName: string): TreeNodeData {
        const definition = elementDefinitions[elementName];
        return {
            id: `score-properties-${crypto.randomUUID()}`,
            element: elementName,
            attributes: {},
            isLeaf: (definition?.children.length ?? 0) === 0,
            ...(elementName === "text" ? { text: "" } : {}),
        };
    }

    function handleTreeContextAction(action: TargetedContextAction) {
        const targetNode = findNodeById(value, action.targetId);
        if (!targetNode || isNodeDisabled(targetNode)) return;

        if (action.action === "delete") {
            if (preventDelete.includes(targetNode.element)) return;
            const parent = findParentByChildId(value, targetNode.id);
            if (!parent) return;
            value = removeNodeById(value, targetNode.id);
            selectedNodeId = isNodeDisabled(parent) ? null : parent.id;
            return;
        }

        if (action.action !== "insert" || action.param.insertMode !== "appendChild") {
            return;
        }
        const child = createChildNode(action.param.elementName);
        value = replaceNodeById(value, action.targetId, (node) => ({
            ...node,
            children: [...(node.children ?? []), child],
            isLeaf: false,
        }));
        selectedNodeId = child.id;
    }

    function updateSelectedAttribute(name: string, attributeValue: string) {
        if (name === "xml:id" || isNodeDisabled(selectedNode)) return;
        value = replaceNodeById(value, selectedNodeId, (node) => ({
            ...node,
            attributes: { ...(node.attributes ?? {}), [name]: attributeValue },
        }));
    }

    function updateSelectedText(text: string) {
        if (isNodeDisabled(selectedNode)) return;
        value = replaceNodeById(value, selectedNodeId, (node) => ({
            ...node,
            text,
        }));
    }

    function handleAttributeEdit(param: EditActionSetParam, _commit: boolean) {
        if (!selectedNode || param.elementId !== selectedNode.id) return;
        updateSelectedAttribute(param.attribute, param.value);
    }

    $: selectedNode = findNodeById(value, selectedNodeId) ?? value;
    $: selectedNodeDisabled = isNodeDisabled(selectedNode);
    $: selectedText = selectedNode?.text == null ? "" : String(selectedNode.text);
    $: if (!value) {
        selectedNodeId = null;
    } else if (!findNodeById(value, selectedNodeId)) {
        selectedNodeId = value.id;
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
                    selectedId={selectedNodeId}
                    onSelectElement={handleTreeSelect}
                    onContextAction={handleTreeContextAction}
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
