<script lang="ts">
    import ContentTab from "./ContentTab.svelte";
    import ScoreTab from "./ScoreTab.svelte";
    import type {
        EditActionSetHandler,
        EditResponseContent,
        HoverElementHandler,
        SelectElementHandler,
        Tab,
        TargetedContextActionHandler,
    } from "../app/types";
    import type { RNGLoader } from "../app/rng-loader";

    export const items: Tab[] = [
        { label: "Score", value: 1, component: ScoreTab },
        { label: "Content", value: 2, component: ContentTab },
    ];

    export let activeTabValue = 2;
    export let editResponseContent: EditResponseContent | null = null;
    export let rngMEIAll: RNGLoader | null = null;
    export let rngMEIBasic: RNGLoader | null = null;
    export let onSelectElement: SelectElementHandler | null = null;
    export let onHoverElement: HoverElementHandler | null = null;
    export let onEditAttribute: EditActionSetHandler | null = null;
    export let onTargetedContextAction: TargetedContextActionHandler | null = null;

    const handleClick = (tabValue: number) => () => {
        activeTabValue = tabValue;
    };
</script>

<div class="vrv-side-panel">
    <div class="vrv-tab-group">
        <div class="vrv-tab-selectors">
            {#each items as item}
                <div
                    class="vrv-tab-selector {activeTabValue === item.value
                        ? 'selected'
                        : ''}"
                    on:click={handleClick(item.value)}
                >
                    {item.label}
                </div>
            {/each}
        </div>
        <div class="vrv-tab-content">
            {#each items as item}
                {#if activeTabValue == item.value}
                    <div class="vrv-tab-content-panel" style="display: flex;">
                        <svelte:component
                            this={item.component}
                            {onSelectElement}
                            {onHoverElement}
                            {onEditAttribute}
                            {onTargetedContextAction}
                            {editResponseContent}
                            {rngMEIAll}
                            {rngMEIBasic}
                        />
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>
