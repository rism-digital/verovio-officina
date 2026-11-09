<script lang="ts">
    import meterSignaturePresetsJson from "../../app/presets/meter-signatures.json";
    import type { ScorePropertyPreset } from "../../app/score-property-presets";
    import type { ScoreDefinitionUpdate, TreeNodeData } from "../../app/types";
    import type { RNGLoader } from "../../app/rng-loader";
    import DialogPresetScoreProperties from "./DialogPresetScoreProperties.svelte";

    export let open = false;
    export let subTree: TreeNodeData | null = null;
    export let rngMEIAll: RNGLoader | null = null;
    export let onConfirm: ((
        scoreDef: TreeNodeData | null,
        edited: boolean,
        update: ScoreDefinitionUpdate,
    ) => void) | null = null;
    export let onCancel: (() => void) | null = null;

    const presets = meterSignaturePresetsJson as ScorePropertyPreset[];
</script>

<DialogPresetScoreProperties
    {open}
    title="Meter or meter group signature"
    presetTabLabel="Common values"
    {presets}
    {subTree}
    {rngMEIAll}
    update="meterSig"
    {onConfirm}
    {onCancel}
/>
