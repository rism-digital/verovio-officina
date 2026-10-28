<script lang="ts">
    import { withBaseUrl } from "../../app/asset-url";
    import {
        cloneTreeNode,
        instantiateTreePreset,
        serializeTreeNode,
        type ScorePropertyPreset,
    } from "../../app/score-property-presets";
    import type {
        ScoreDefinitionUpdate,
        TreeNodeData,
    } from "../../app/types";
    import ScorePropertiesTreeEditor from "../ScorePropertiesTreeEditor.svelte";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title: string;
    export let presetTabLabel = "Common";
    export let presets: ScorePropertyPreset[] = [];
    export let subTree: TreeNodeData | null = null;
    export let update: ScoreDefinitionUpdate;
    export let onConfirm: ((
        scoreDef: TreeNodeData | null,
        edited: boolean,
        update: ScoreDefinitionUpdate,
    ) => void) | null = null;
    export let onCancel: (() => void) | null = null;

    type Tab = "presets" | "custom";
    let activeTab: Tab = "presets";
    let localScoreDef: TreeNodeData | null = null;
    let initialSerializedScoreDef = "";

    function applyPreset(entry: ScorePropertyPreset) {
        localScoreDef = instantiateTreePreset(entry.preset, {
            rootId: localScoreDef?.id,
        });
    }

    function iconUrl(icon: string | undefined): string | undefined {
        return icon ? withBaseUrl(`icons/editor/${icon}.png`) : undefined;
    }

    $: isEdited = serializeTreeNode(localScoreDef) !== initialSerializedScoreDef;
    $: if (!open) {
        activeTab = "presets";
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
    <div class="vrv-tab-group vrv-dialog-score-properties-tabs">
        <div class="vrv-tab-selectors" role="tablist" aria-label={title}>
            <button
                class="vrv-tab-selector"
                class:selected={activeTab === "presets"}
                type="button"
                role="tab"
                aria-selected={activeTab === "presets"}
                on:click={() => activeTab = "presets"}
            >{presetTabLabel}</button>
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
                {#if activeTab === "presets"}
                    <div
                        class="vrv-field-set vrv-context-toolbar-section"
                    >
                        <div
                            class="vrv-field-set-panel vrv-context-toolbar vrv-score-preset-toolbar"
                            role="toolbar"
                            aria-label={`${presetTabLabel} toolbar`}
                        >
                            {#each presets as entry}
                                <button
                                    class="vrv-context-tool-button"
                                    type="button"
                                    title={entry.name}
                                    aria-label={entry.name}
                                    style:background-image={iconUrl(entry.icon) ? `url("${iconUrl(entry.icon)}")` : undefined}
                                    on:click={() => applyPreset(entry)}
                                ></button>
                            {/each}
                        </div>
                    </div>
                {:else}
                    <ScorePropertiesTreeEditor bind:value={localScoreDef} />
                {/if}
            </div>
        </div>
    </div>
</Dialog>
