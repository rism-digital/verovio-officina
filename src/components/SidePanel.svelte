<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import ContentTab from "./ContentTab.svelte";
    import ScoreTab from "./ScoreTab.svelte";
    import type { EditInfoContent, Tab } from "../app/types";

    export const items: Tab[] = [
        { label: "Score", value: 1, component: ScoreTab },
        { label: "Content", value: 2, component: ContentTab },
    ];

    export let activeTabValue = 2;
    export let editInfoContent: EditInfoContent | null = null;

    const dispatch = createEventDispatcher<{
        selectElement: string;
        hoverElement: string | null;
    }>();

    function forwardSelect(event: CustomEvent<string>) {
        dispatch("selectElement", event.detail);
    }
    
    function forwardHover(event: CustomEvent<string | null>) {
        dispatch("hoverElement", event.detail);
    }

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
                            on:selectElement={forwardSelect}
                            on:hoverElement={forwardHover}
                            editInfoContent={editInfoContent}
                        />
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>
