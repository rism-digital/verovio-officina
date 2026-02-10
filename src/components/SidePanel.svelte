<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Tab } from "../app/types";

    import ScoreTab from "./ScoreTab.svelte";
    import ContentTab from "./ContentTab.svelte";

    export const items: Tab[] = [
        { label: "Score", value: 1, component: ScoreTab },
        { label: "Content", value: 2, component: ContentTab },
    ];

    export let activeTabValue = 2;

    const dispatch = createEventDispatcher<{ selectElement: string }>();
    function forwardSelect(event: CustomEvent<string>) {
        dispatch("selectElement", event.detail);
    }

    const handleClick = (tabValue: number) => () => {
        activeTabValue = tabValue;
    };
</script>

<div class="vrv-editor-tool-panel">
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
                            on:selectElement={forwardSelect}
                        />
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>
