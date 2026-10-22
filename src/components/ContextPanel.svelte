<script lang="ts">
    import ContextAttributesTab from "./ContextAttributesTab.svelte";
    import ContextToolsTab from "./ContextToolsTab.svelte";
    import type {
        Action,
        EditActionSetHandler,
        EditResponseContent,
    } from "../app/types";
    import type { RNGLoader } from "../app/rng-loader";

    export let selectedElementName: string | null = null;
    export let hasSecondarySelection = false;
    export let insertMode = false;
    export let onContextAction: ((action: Action) => void) | null = null;
    export let editResponseContent: EditResponseContent | null = null;
    export let rngMEIAll: RNGLoader | null = null;
    export let rngMEIBasic: RNGLoader | null = null;
    export let onEditAttribute: EditActionSetHandler | null = null;

    type ContextTab = "tools" | "attributes";
    let activeTab: ContextTab = "tools";
</script>

<aside class="vrv-context-panel" aria-label="Context panel">
    <div class="vrv-tab-group">
        <div class="vrv-tab-selectors" role="tablist" aria-label="Context panel">
            <button
                class="vrv-tab-selector"
                class:selected={activeTab === "tools"}
                type="button"
                role="tab"
                aria-selected={activeTab === "tools"}
                on:click={() => activeTab = "tools"}
            >Tools</button>
            <button
                class="vrv-tab-selector"
                class:selected={activeTab === "attributes"}
                type="button"
                role="tab"
                aria-selected={activeTab === "attributes"}
                on:click={() => activeTab = "attributes"}
            >Attributes</button>
        </div>
        <div class="vrv-tab-content">
            <div
                class="vrv-tab-content-panel"
                role="tabpanel"
                aria-label={activeTab === "tools" ? "Tools" : "Attributes"}
            >
                {#if activeTab === "tools"}
                    <ContextToolsTab
                        {selectedElementName}
                        {hasSecondarySelection}
                        {insertMode}
                        {onContextAction}
                    />
                {:else}
                    <ContextAttributesTab
                        {editResponseContent}
                        {rngMEIAll}
                        {rngMEIBasic}
                        {onEditAttribute}
                    />
                {/if}
            </div>
        </div>
    </div>
</aside>
