<script lang="ts">
    import AttributeList from "./AttributeList.svelte";
    import {
        resolveContextButtonBars,
        resolveContextTools,
        type ResolvedContextButtonBar,
        type ResolvedContextToolGroup,
    } from "../app/action-resolver";
    import type {
        Action,
        EditActionSetHandler,
        EditResponseContent,
    } from "../app/types";

    export let selectedElementName: string | null = null;
    export let hasSecondarySelection = false;
    export let insertMode = false;
    export let onContextAction: ((action: Action) => void) | null = null;
    export let editResponseContent: EditResponseContent | null = null;
    export let onEditAttribute: EditActionSetHandler | null = null;

    let contextBars: ResolvedContextButtonBar[] = [];
    let contextToolGroups: ResolvedContextToolGroup[] = [];
    let closedSections: Record<string, boolean> = {};

    $: contextToolGroups = resolveContextTools(selectedElementName);

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

{#if editResponseContent?.object?.element === "text"}
    <AttributeList
        {editResponseContent}
        onEditSet={onEditAttribute}
    />
{/if}

{#if contextToolGroups.length > 0}
    <div class="vrv-context-actions" aria-label="Context actions">
        {#each contextToolGroups as group}
            <div class="vrv-context-action-group">
                {#each group as row}
                    <div class="vrv-context-action-row">
                        {#each row as action}
                            <button
                                class="vrv-context-action-button"
                                type="button"
                                title={action.label}
                                disabled={insertMode}
                                on:click={() => handleContextAction(action)}
                            >{action.label}</button>
                        {/each}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
{/if}

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
