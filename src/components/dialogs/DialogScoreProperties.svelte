<script lang="ts">
    import type { TreeNodeData } from "../../app/types";
    import Tree from "../Tree.svelte";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "Score properties";
    export let scoreDef: TreeNodeData | null = null;
    export let onConfirm: ((scoreDef: TreeNodeData | null, edited: boolean) => void) | null = null;
    export let onOk: (() => void) | null = null;
    export let onCancel: (() => void) | null = null;
    export let onClose: (() => void) | null = null;

    let selectedNodeId: string | null = null;
    let localScoreDef: TreeNodeData | null = null;
    let initialSerializedScoreDef = "";

    function findNodeById(node: TreeNodeData | null, id: string | null): TreeNodeData | null {
        if (!node || !id) return null;
        if (node.id === id) return node;
        for (const child of node.children ?? []) {
            const found = findNodeById(child, id);
            if (found) return found;
        }
        return null;
    }

    function handleTreeSelect(id: string) {
        selectedNodeId = id;
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
        localScoreDef = replaceNodeById(localScoreDef, selectedNodeId, (node) => ({
            ...node,
            attributes: {
                ...(node.attributes ?? {}),
                [name]: value,
            },
        }));
    }

    function updateSelectedText(value: string) {
        localScoreDef = replaceNodeById(localScoreDef, selectedNodeId, (node) => ({
            ...node,
            text: value,
        }));
    }

    function normalizeAttributes(node: TreeNodeData | null): Record<string, string> {
        if (!node?.attributes) return {};
        return Object.fromEntries(
            Object.entries(node.attributes).map(([key, value]) => [
                key,
                value == null ? "" : String(value),
            ]),
        );
    }

    $: ancestors = [];
    $: selectedNode = findNodeById(localScoreDef, selectedNodeId) ?? localScoreDef;
    $: selectedAttributes = normalizeAttributes(selectedNode);
    $: selectedText =
        selectedNode?.text == null || selectedNode.text === ""
            ? ""
            : String(selectedNode.text);
    $: isEdited = serializeScoreDef(localScoreDef) !== initialSerializedScoreDef;

    $: if (!open) {
        selectedNodeId = null;
        localScoreDef = null;
        initialSerializedScoreDef = "";
    } else if (!localScoreDef && scoreDef) {
        localScoreDef = cloneScoreDef(scoreDef);
        initialSerializedScoreDef = serializeScoreDef(localScoreDef);
        selectedNodeId = localScoreDef?.id ?? null;
    } else if (localScoreDef && !findNodeById(localScoreDef, selectedNodeId)) {
        selectedNodeId = localScoreDef.id;
    }

    function handleOk() {
        onConfirm?.(localScoreDef, isEdited);
        onOk?.();
        onClose?.();
    }

    function handleCancel() {
        onCancel?.();
        onClose?.();
    }

</script>

<Dialog
    {open}
    {title}
    icon="info"
    type="okcancel"
    boxClass="vrv-dialog-score-properties vrv-dialog-score-props"
    onOk={handleOk}
    onCancel={handleCancel}
>
    <div class="vrv-dialog-score-props-columns">
        <div class="vrv-dialog-score-props-column">
            <div class="vrv-dialog-score-props-title">Score structure</div>
            <div class="vrv-dialog-score-props-panel">
                {#if !localScoreDef}
                    <div>No score element selected.</div>
                {:else}
                    <Tree
                        {ancestors}
                        context={localScoreDef}
                        selectedId={selectedNodeId}
                        onSelectElement={handleTreeSelect}
                    />
                {/if}
            </div>
        </div>
        <div class="vrv-dialog-score-props-column">
            <div class="vrv-dialog-score-props-title">Attributes</div>
            <div class="vrv-dialog-score-props-panel">
                {#if selectedNode}
                    <div class="vrv-dialog-form">
                        <div class="vrv-dialog-label">Element</div>
                        <input
                            class="vrv-dialog-input"
                            value={selectedNode.element}
                            disabled
                        />

                        {#if selectedText}
                            <div class="vrv-dialog-label">Text</div>
                            <input
                                class="vrv-dialog-input"
                                value={selectedText}
                                on:input={(event) =>
                                    updateSelectedText((event.target as HTMLInputElement).value)}
                            />
                        {/if}

                        {#each Object.entries(selectedAttributes) as [name, value]}
                            <div class="vrv-dialog-label">{name}</div>
                            <input
                                class="vrv-dialog-input"
                                value={value}
                                on:input={(event) =>
                                    updateSelectedAttribute(
                                        name,
                                        (event.target as HTMLInputElement).value,
                                    )}
                            />
                        {/each}
                    </div>
                {:else}
                    <div>Select a score node to view attributes.</div>
                {/if}
            </div>
        </div>
    </div>
</Dialog>
