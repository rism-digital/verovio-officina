<script lang="ts">
    import instrumentPresetsJson from "../../app/presets/instruments.json";
    import {
        cloneTreeNode,
        instantiateTreePreset,
        mergeTreePreset,
        serializeTreeNode,
        type InstrumentPresetCategory,
        type ScorePropertyPreset,
    } from "../../app/score-property-presets";
    import type { ScoreDefinitionUpdate, TreeNodeData } from "../../app/types";
    import ScorePropertiesTreeEditor from "../ScorePropertiesTreeEditor.svelte";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let subTree: TreeNodeData | null = null;
    export let onConfirm: ((
        scoreDef: TreeNodeData | null,
        edited: boolean,
        update: ScoreDefinitionUpdate,
    ) => void) | null = null;
    export let onCancel: (() => void) | null = null;

    type Tab = "instruments" | "custom";
    const categories = instrumentPresetsJson as InstrumentPresetCategory[];
    let activeTab: Tab = "instruments";
    let selectedCategory = "";
    let localStaffDef: TreeNodeData | null = null;
    let initialSerializedStaffDef = "";

    $: instruments = categories.find(
        (category) => category.name === selectedCategory,
    )?.instruments ?? [];

    function withoutInstrumentAttributes(staffDef: TreeNodeData): TreeNodeData {
        const attributes = { ...(staffDef.attributes ?? {}) };
        delete attributes["lines"];
        delete attributes["trans.diat"];
        delete attributes["trans.semi"];
        return { ...staffDef, attributes };
    }

    function applyInstrument(entry: ScorePropertyPreset) {
        localStaffDef = localStaffDef
            ? mergeTreePreset(
                withoutInstrumentAttributes(localStaffDef),
                entry.preset,
            )
            : instantiateTreePreset(entry.preset);
    }

    $: isEdited = serializeTreeNode(localStaffDef) !== initialSerializedStaffDef;
    $: if (!open) {
        activeTab = "instruments";
        selectedCategory = "";
        localStaffDef = null;
        initialSerializedStaffDef = "";
    } else if (!localStaffDef && subTree) {
        localStaffDef = cloneTreeNode(subTree);
        initialSerializedStaffDef = serializeTreeNode(localStaffDef);
    }
</script>

<Dialog
    {open}
    title="Staff definition"
    icon="info"
    type="okcancel"
    boxClass="vrv-dialog-score-properties"
    onOk={() => onConfirm?.(localStaffDef, isEdited, "staffDef")}
    onCancel={() => onCancel?.()}
>
    <div class="vrv-tab-group vrv-dialog-score-properties-tabs">
        <div class="vrv-tab-selectors" role="tablist" aria-label="Staff definition">
            <button
                class="vrv-tab-selector"
                class:selected={activeTab === "instruments"}
                type="button"
                role="tab"
                aria-selected={activeTab === "instruments"}
                on:click={() => activeTab = "instruments"}
            >Instruments</button>
            <button
                class="vrv-tab-selector"
                class:selected={activeTab === "custom"}
                type="button"
                role="tab"
                aria-selected={activeTab === "custom"}
                on:click={() => activeTab = "custom"}
            >Tree editor</button>
        </div>
        <div class="vrv-tab-content">
            <div class="vrv-tab-content-panel" role="tabpanel">
                {#if activeTab === "instruments"}
                    <div class="vrv-instrument-presets">
                        <div class="vrv-instrument-preset-column">
                            {#each categories as category}
                                <button
                                    class="vrv-context-action-button"
                                    class:selected={category.name === selectedCategory}
                                    type="button"
                                    on:click={() => selectedCategory = category.name}
                                >{category.name}</button>
                            {/each}
                        </div>
                        <div class="vrv-instrument-preset-column">
                            {#each instruments as instrument}
                                <button
                                    class="vrv-context-action-button"
                                    type="button"
                                    on:click={() => applyInstrument(instrument)}
                                >{instrument.name}</button>
                            {/each}
                        </div>
                    </div>
                {:else}
                    <ScorePropertiesTreeEditor bind:value={localStaffDef} />
                {/if}
            </div>
        </div>
    </div>
</Dialog>
