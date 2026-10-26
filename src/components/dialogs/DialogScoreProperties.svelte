<script lang="ts">
    import {
        cloneTreeNode,
        serializeTreeNode,
    } from "../../app/score-property-presets";
    import type {
        ScoreDefinitionUpdate,
        TreeNodeData,
    } from "../../app/types";
    import ScorePropertiesTreeEditor from "../ScorePropertiesTreeEditor.svelte";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "Score properties";
    export let subTree: TreeNodeData | null = null;
    export let update: ScoreDefinitionUpdate = "scoreDef";
    export let disabledElements: string[] = [];
    export let preventDelete: string[] = ["staffGrp", "staffDef"];
    export let onConfirm: ((
        scoreDef: TreeNodeData | null,
        edited: boolean,
        update: ScoreDefinitionUpdate,
    ) => void) | null = null;
    export let onCancel: (() => void) | null = null;

    let localScoreDef: TreeNodeData | null = null;
    let initialSerializedScoreDef = "";

    $: isEdited = serializeTreeNode(localScoreDef) !== initialSerializedScoreDef;
    $: if (!open) {
        localScoreDef = null;
        initialSerializedScoreDef = "";
    } else if (!localScoreDef && subTree) {
        localScoreDef = cloneTreeNode(subTree);
        initialSerializedScoreDef = serializeTreeNode(localScoreDef);
    }
</script>

<Dialog
    {open}
    {title}
    icon="info"
    type="okcancel"
    boxClass="vrv-dialog-score-properties"
    onOk={() => onConfirm?.(localScoreDef, isEdited, update)}
    onCancel={() => onCancel?.()}
>
    <ScorePropertiesTreeEditor
        bind:value={localScoreDef}
        {disabledElements}
        {preventDelete}
    />
</Dialog>
