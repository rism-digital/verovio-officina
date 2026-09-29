<script lang="ts">
    import type { HoverElementHandler, SelectElementHandler, TreeNodeData } from "../app/types";
    import { iconFor } from "../app/icons";

    export let node: TreeNodeData;
    export let isRoot = false;
    export let showRootNode = false;
    export let selectOnContextMenu = false;
    export let disabledElements: string[] = [];
    export let selectedId: string | null = null;
    export let onSelect: SelectElementHandler | null = null;
    export let onHover: HoverElementHandler | null = null;
    type ContextMenuEvent = MouseEvent | PointerEvent;

    export let onContextMenu:
        | ((node: TreeNodeData, event: ContextMenuEvent) => void)
        | null = null;

    let htmlTreeNode: HTMLDivElement | null = null;
    $: disabled = disabledElements.includes(node.element);

    function handleOpenClose() {
        if (disabled || !htmlTreeNode) return;
        if (htmlTreeNode.classList.contains("open")) {
            htmlTreeNode.classList.remove("open");
        } else {
            htmlTreeNode.classList.add("open");
            handleSelect();
        }
    }

    function handleSelect() {
        if (disabled) return;
        onSelect?.(node.id);
    }

    function handleMouseEnter() {
        onHover?.(node.id);
    }

    function handleMouseLeave() {
        onHover?.(null);
    }

    function handleContextMenu(event: ContextMenuEvent) {
        if (disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        event.preventDefault();
        if (node.id !== selectedId) {
            if (!selectOnContextMenu) return;
            handleSelect();
        }
        event.stopPropagation();
        onContextMenu?.(node, event);
    }
</script>

<div
    class={isRoot
        ? `vrv-tree-root${disabled ? " node-disabled" : " open"}`
        : `vrv-tree-node${node.isLeaf ? " leaf" : ""}${disabled ? " node-disabled" : ""}${!disabled && node.children?.length ? " open" : ""}`}
    data-id={node.id}
    data-element={node.element}
    on:click|stopPropagation={handleOpenClose}
    bind:this={htmlTreeNode}
>
    <div
        class="vrv-mei-element vrv-node-label {disabled ? 'node-disabled' : ''} {node.id === selectedId ? 'target checked' : ''}"
        data-id={node.id}
        data-element={node.element}
        style={`background-image: url("${iconFor(node.element)}");${isRoot && !showRootNode ? " display: none;" : ""}`}
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
                    {selectOnContextMenu}
                    {disabledElements}
                    {selectedId}
                    {onSelect}
                    {onHover}
                    {onContextMenu}
                />
            {/each}
        {/if}
    </div>
</div>
