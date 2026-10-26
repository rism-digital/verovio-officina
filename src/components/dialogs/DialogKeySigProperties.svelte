<script lang="ts">
    import keySignaturePresetsJson from "../../app/presets/key-signatures.json";
    import type { ScorePropertyPreset } from "../../app/score-property-presets";
    import type { ScoreDefinitionUpdate, TreeNodeData } from "../../app/types";
    import DialogPresetScoreProperties from "./DialogPresetScoreProperties.svelte";

    export let open = false;
    export let subTree: TreeNodeData | null = null;
    export let onConfirm: ((
        scoreDef: TreeNodeData | null,
        edited: boolean,
        update: ScoreDefinitionUpdate,
    ) => void) | null = null;
    export let onCancel: (() => void) | null = null;

    const presets = keySignaturePresetsJson as ScorePropertyPreset[];
</script>

<DialogPresetScoreProperties
    {open}
    title="Key signature"
    presetTabLabel="Common values"
    {presets}
    {subTree}
    update="keySig"
    {onConfirm}
    {onCancel}
/>
