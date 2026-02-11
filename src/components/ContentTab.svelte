<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import TreeNode from "./TreeNode.svelte";
    import type { EditInfoContent } from "../app/types";

    export let editInfoContent: EditInfoContent | null = null;

    const dispatch = createEventDispatcher<{ selectElement: string; hoverElement: string | null }>();

    function handleSelect(event: CustomEvent<string>) {
        dispatch("selectElement", event.detail);
    }

    function handleHover(event: CustomEvent<string | null>) {
        dispatch("hoverElement", event.detail);
    }
</script>

<div class="vrv-legend">
    Score structure<span class="icon">▼</span>
</div>
<div class="vrv-field-set" style="flex-grow: 3;">
    <div class="vrv-field-set-panel" style="display: flex;">
        <div class="vrv-tree-breadcrumbs-wrapper" style="display: block;">
            <div class="vrv-tree-breadcrumbs">
                <div class="vrv-tree-breadcrumb"></div>
            </div>
        </div>
        {#if editInfoContent && editInfoContent.context}
            <TreeNode node={editInfoContent.context} isRoot on:select={handleSelect} on:hover={handleHover} />
        {:else}
            <div class="vrv-tree-root"></div>
        {/if}
    </div>
</div>

<div class="vrv-legend">
    Attributes or text<span class="icon">▼</span>
</div>
<div class="vrv-field-set" style="flex-grow: 3;">
    <div class="vrv-field-set-panel" style="display: flex;">
        <div class="vrv-attribute-list-wrapper">
            <div class="vrv-attribute-filter"></div>
        </div>
    </div>
</div>
<div class="vrv-legend">
    Referencing elements<span class="icon">▼</span>
</div>
<div class="vrv-field-set">
    <div class="vrv-field-set-panel" style="display: flex;">
        <div class="vrv-reference-list-wrapper"></div>
    </div>
</div>
<div class="vrv-legend">
    Referenced elements<span class="icon">▼</span>
</div>
<div class="vrv-field-set">
    <div class="vrv-field-set-panel">
        <div class="vrv-reference-list-wrapper"></div>
    </div>
</div>
