<script lang="ts">
    import type { HoverElementHandler, SelectElementHandler, TreeNodeData } from "../app/types";
    import { iconFor } from "../app/icons";

    export let node: TreeNodeData;
    export let isRoot = false;
    export let parentElement: string | null = null;
    export let selectedId: string | null = null;
    export let onSelect: SelectElementHandler | null = null;
    export let onHover: HoverElementHandler | null = null;
    type ContextMenuEvent = MouseEvent | PointerEvent;

    export let onContextMenu:
        | ((node: TreeNodeData, parentElement: string | null, event: ContextMenuEvent) => void)
        | null = null;

    let htmlTreeNode: HTMLDivElement | null = null;

    function handleOpenClose() {
        if (!htmlTreeNode) return;
        if (htmlTreeNode.classList.contains("open")) {
            htmlTreeNode.classList.remove("open");
        } else {
            htmlTreeNode.classList.add("open");
            handleSelect();
        }
    }

    function handleSelect() {
        onSelect?.(node.id);
    }

    function handleMouseEnter() {
        onHover?.(node.id);
    }

    function handleMouseLeave() {
        onHover?.(null);
    }

    function handleContextMenu(event: ContextMenuEvent) {
        if (isRoot) return;
        event.preventDefault();
        if (node.id !== selectedId) return;
        event.stopPropagation();
        onContextMenu?.(node, parentElement, event);
    }
</script>

<div
    class={isRoot
        ? "vrv-tree-root open"
        : `vrv-tree-node${node.isLeaf ? " leaf" : ""} ${node.children?.length ? " open" : ""}`}
    data-id={node.id}
    data-element={node.element}
    on:click|stopPropagation={handleOpenClose}
    bind:this={htmlTreeNode}
>
    <div
        class="vrv-mei-element vrv-node-label {node.id === selectedId ? 'target checked' : ''}"
        data-id={node.id}
        data-element={node.element}
        style={`background-image: url("${iconFor(node.element)}");${isRoot ? " display: none;" : ""}`}
        on:click|stopPropagation={handleSelect}
        on:contextmenu={handleContextMenu}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
    >
        {node.element} {node.attributes?.["n"] ? `${node.attributes["n"]}` : ""}
     </div>
    <div class="vrv-node-children">
        {#if node.children?.length}
            {#each node.children as child}
                <svelte:self
                    node={child}
                    parentElement={node.element}
                    {selectedId}
                    {onSelect}
                    {onHover}
                    {onContextMenu}
                />
            {/each}
        {/if}
    </div>
</div>
