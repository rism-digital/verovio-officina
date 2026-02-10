<script lang="ts">
    import { onMount } from "svelte";
    import TreeNode from "./TreeNode.svelte";
    import type { TreeNodeData } from "../app/types";

    let root: TreeNodeData | null = null;

    onMount(async () => {
        try {
            const response = await fetch("/test.json");
            if (!response.ok) {
                throw new Error(`Failed to load test.json: ${response.status}`);
            }
            const data = await response.json();
            root = data.context ?? null;
        } catch (error) {
            console.error("Failed to load tree data", error);
            root = null;
        }
    });
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
        {#if root}
            <TreeNode node={root} isRoot />
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
