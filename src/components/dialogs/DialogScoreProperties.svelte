<script lang="ts">
    import propertiesSchema from "../../app/properties.json";
    import type { ResolvedMenuEntry } from "../../app/action-resolver";
    import type { ElementDef } from "../../app/rng-loader";
    import ScorePropertiesAttributeList from "../ScorePropertiesAttributeList.svelte";
    import type {
        EditActionSetParam,
        TargetedContextAction,
        TreeNodeData,
    } from "../../app/types";
    import Tree from "../Tree.svelte";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "Score properties";
    export let scoreDef: TreeNodeData | null = null;
    export let disabledElements: string[] = [];
    export let preventDelete: string[] = ["staffGrp", "staffDef"];
    export let onConfirm: ((scoreDef: TreeNodeData | null, edited: boolean) => void) | null = null;
    export let onCancel: (() => void) | null = null;

    let selectedNodeId: string | null = null;
    let localScoreDef: TreeNodeData | null = null;
    let initialSerializedScoreDef = "";
    const elementDefinitions = propertiesSchema as Record<string, ElementDef>;

    function findNodeById(node: TreeNodeData | null, id: string | null): TreeNodeData | null {
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

    function handleTreeSelect(id: string) {
        if (isNodeDisabled(findNodeById(localScoreDef, id))) return;
        selectedNodeId = id;
    }

    function isNodeDisabled(node: TreeNodeData | null): boolean {
        return !!node && disabledElements.includes(node.element);
    }

    function resolveScorePropertiesContextMenuItems(
        node: TreeNodeData,
    ): ResolvedMenuEntry[] {
        if (isNodeDisabled(node)) return [];
        const definition = elementDefinitions[node.element];
        const existingChildren = new Set(
            (node.children ?? []).map((child) => child.element),
        );
        const optionalChildren = new Set(definition?.optional ?? []);
        const canAdd = (elementName: string) =>
            (!optionalChildren.has(elementName) || !existingChildren.has(elementName))
            && !(definition?.choice ?? []).some(
                (group) => group.includes(elementName)
                    && group.some(
                        (choice) => choice !== elementName
                            && existingChildren.has(choice),
                    ),
            );
        const addItems: ResolvedMenuEntry[] = (definition?.children ?? [])
            .filter(canAdd)
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

        if (definition?.text && canAdd("text")) {
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

        const menuItems: ResolvedMenuEntry[] = [];
        if (addItems.length > 0) {
            menuItems.push({
                kind: "submenu",
                label: "Add",
                items: addItems,
            });
        }

        if (
            node.id !== localScoreDef?.id
            && !preventDelete.includes(node.element)
        ) {
            menuItems.push({
                kind: "action",
                label: "Delete",
                actionKey: "score-properties-delete",
                action: "delete",
                param: { elementId: node.id },
            });
        }

        return menuItems;
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
        const targetNode = findNodeById(localScoreDef, action.targetId);
        if (!targetNode || isNodeDisabled(targetNode)) return;

        if (action.action === "delete") {
            if (preventDelete.includes(targetNode.element)) return;
            const parent = findParentByChildId(localScoreDef, targetNode.id);
            if (!parent) return;
            localScoreDef = removeNodeById(localScoreDef, targetNode.id);
            selectedNodeId = isNodeDisabled(parent) ? null : parent.id;
            return;
        }

        if (
            action.action !== "insert"
            || action.param.insertMode !== "appendChild"
        ) return;

        const child = createChildNode(action.param.elementName);
        localScoreDef = replaceNodeById(localScoreDef, action.targetId, (node) => ({
            ...node,
            children: [...(node.children ?? []), child],
            isLeaf: false,
        }));
        selectedNodeId = child.id;
    }

    function cloneScoreDef(node: TreeNodeData | null): TreeNodeData | null {
        if (!node) return null;
        return JSON.parse(JSON.stringify(node)) as TreeNodeData;
    }

    function serializeScoreDef(node: TreeNodeData | null): string {
        if (!node) return "";
        return JSON.stringify(node);
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

    function updateSelectedAttribute(name: string, value: string) {
        if (name === "xml:id" || isNodeDisabled(selectedNode)) return;
        localScoreDef = replaceNodeById(localScoreDef, selectedNodeId, (node) => ({
            ...node,
            attributes: {
                ...(node.attributes ?? {}),
                [name]: value,
            },
        }));
    }

    function updateSelectedText(value: string) {
        if (isNodeDisabled(selectedNode)) return;
        localScoreDef = replaceNodeById(localScoreDef, selectedNodeId, (node) => ({
            ...node,
            text: value,
        }));
    }

    function handleAttributeEdit(param: EditActionSetParam, _commit: boolean) {
        if (!selectedNode || param.elementId !== selectedNode.id) return;
        updateSelectedAttribute(param.attribute, param.value);
    }

    $: ancestors = [];
    $: selectedNode = findNodeById(localScoreDef, selectedNodeId) ?? localScoreDef;
    $: selectedNodeDisabled = isNodeDisabled(selectedNode);
    $: selectedText = selectedNode?.text == null ? "" : String(selectedNode.text);
    $: showTextInput = selectedNode?.text != null;
    $: isEdited = serializeScoreDef(localScoreDef) !== initialSerializedScoreDef;

    $: if (!open) {
        selectedNodeId = null;
        localScoreDef = null;
        initialSerializedScoreDef = "";
    } else if (!localScoreDef && scoreDef) {
        localScoreDef = cloneScoreDef(scoreDef);
        initialSerializedScoreDef = serializeScoreDef(localScoreDef);
        console.log(initialSerializedScoreDef)
        selectedNodeId = localScoreDef?.id ?? null;
    } else if (localScoreDef && !findNodeById(localScoreDef, selectedNodeId)) {
        selectedNodeId = localScoreDef.id;
    }

    function handleOk() {
        onConfirm?.(localScoreDef, isEdited);
    }

    function handleCancel() {
        onCancel?.();
    }

</script>

<Dialog
    {open}
    {title}
    icon="info"
    type="okcancel"
    boxClass="vrv-dialog-score-properties"
    onOk={handleOk}
    onCancel={handleCancel}
>
    <div class="vrv-dialog-score-properties-columns">
        <div class="vrv-dialog-score-properties-column">
            <div class="vrv-dialog-score-properties-title">Score structure</div>
            <div class="vrv-dialog-score-properties-panel">
                {#if !localScoreDef}
                    <div>No score element selected.</div>
                {:else}
                    <Tree
                        {ancestors}
                        context={localScoreDef}
                        showRootNode
                        showBreadcrumbs={false}
                        selectOnContextMenu
                        {disabledElements}
                        selectedId={selectedNodeId}
                        onSelectElement={handleTreeSelect}
                        onContextAction={handleTreeContextAction}
                        resolveContextMenuItems={resolveScorePropertiesContextMenuItems}
                    />
                {/if}
            </div>
        </div>
        <div class="vrv-dialog-score-properties-column">
            <div class="vrv-dialog-score-properties-title">Attributes</div>
            <div class="vrv-dialog-score-properties-panel">
                {#if selectedNode}
                    {#if showTextInput}
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
</Dialog>
