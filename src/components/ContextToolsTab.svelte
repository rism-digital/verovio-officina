<script lang="ts">
    import {
        resolveContextButtonBars,
        type ResolvedContextButtonBar,
    } from "../app/action-resolver";
    import type { Action } from "../app/types";

    export let selectedElementName: string | null = null;
    export let hasSecondarySelection = false;
    export let insertMode = false;
    export let onContextAction: ((action: Action) => void) | null = null;

    let contextBars: ResolvedContextButtonBar[] = [];
    let closedSections: Record<string, boolean> = {};

    $: contextBars = resolveContextButtonBars(selectedElementName, {
        includeDialogs: true,
        includeSecondary: hasSecondarySelection,
    });

    function toggleSection(label: string) {
        closedSections = {
            ...closedSections,
            [label]: !closedSections[label],
        };
    }

    function handleContextAction(action: Action) {
        if (insertMode) return;
        onContextAction?.(action);
    }
</script>

{#each contextBars as bar}
    <div
        class="vrv-legend vrv-collapsible"
        class:close={closedSections[bar.label]}
    >
        {bar.label}
        <button
            class="icon"
            type="button"
            aria-label={`Toggle ${bar.label} toolbar`}
            aria-expanded={!closedSections[bar.label]}
            on:click={() => toggleSection(bar.label)}
        >▼</button>
    </div>
    <div
        class="vrv-field-set vrv-collapsible vrv-context-toolbar-section"
        class:close={closedSections[bar.label]}
    >
        <div
            class="vrv-field-set-panel vrv-context-toolbar"
            aria-label={`${bar.label} toolbar`}
        >
            {#each bar.actions as action}
                <button
                    class="vrv-context-tool-button"
                    type="button"
                    title={action.label}
                    aria-label={action.label}
                    style={`background-image: url("${action.iconUrl}");`}
                    disabled={insertMode}
                    on:click={() => handleContextAction(action)}
                ></button>
            {/each}
        </div>
    </div>
{/each}
