<script lang="ts">
    import type {
        HoverElementHandler,
        SelectElementHandler,
        TreeDropPosition,
        TreeNodeData,
        TreeNodeMoveHandler,
    } from "../app/types";
    import { iconFor } from "../app/icons";
    import { treeNodeKey } from "../app/tree-node-key";

    export let node: TreeNodeData;
    export let isRoot = false;
    export let showRootNode = false;
    export let selectOnContextMenu = false;
    export let disabledElements: string[] = [];
    export let hideChildrenOfElements: string[] = [];
    export let draggableElements: string[] = [];
    export let dropTargetElements: string[] = [];
    export let reorderableElements: string[] = [];
    export let selectedId: string | null = null;
    export let onSelect: SelectElementHandler | null = null;
    export let onHover: HoverElementHandler | null = null;
    type ContextMenuEvent = MouseEvent | PointerEvent;

    export let onContextMenu:
        | ((node: TreeNodeData, event: ContextMenuEvent) => void)
        | null = null;
    export let onMoveNode: TreeNodeMoveHandler | null = null;

    let htmlTreeNode: HTMLDivElement | null = null;
    let dragging = false;
    let dropPosition: TreeDropPosition | null = null;
    $: nodeKey = treeNodeKey(node);
    $: disabled = disabledElements.includes(node.element);
    $: childrenHidden = hideChildrenOfElements.includes(node.element);
    $: draggable = !isRoot && draggableElements.includes(node.element);
    $: acceptsChildDrop = dropTargetElements.includes(node.element);
    $: acceptsReorderDrop = !isRoot
        && reorderableElements.includes(node.element);
    $: acceptsDrop = acceptsChildDrop || acceptsReorderDrop;

    function handleOpenClose() {
        if (disabled || childrenHidden || !htmlTreeNode) return;
        if (htmlTreeNode.classList.contains("open")) {
            htmlTreeNode.classList.remove("open");
        } else {
            htmlTreeNode.classList.add("open");
            handleSelect();
        }
    }

    function handleSelect() {
        if (disabled) return;
        onSelect?.(nodeKey);
    }

    function handleMouseEnter() {
        onHover?.(nodeKey);
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
        if (nodeKey !== selectedId) {
            if (!selectOnContextMenu) return;
            handleSelect();
        }
        event.stopPropagation();
        onContextMenu?.(node, event);
    }

    function handleDragStart(event: DragEvent) {
        if (!draggable || !event.dataTransfer) {
            event.preventDefault();
            return;
        }
        dragging = true;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", nodeKey);
        event.stopPropagation();
    }

    function handleDragEnd() {
        dragging = false;
        dropPosition = null;
    }

    function resolveDropPosition(event: DragEvent): TreeDropPosition {
        if (!acceptsReorderDrop) return "inside";
        const target = event.currentTarget as HTMLElement;
        const bounds = target.getBoundingClientRect();
        const offset = (event.clientY - bounds.top) / bounds.height;
        if (acceptsChildDrop) {
            if (offset < 0.25) return "before";
            if (offset > 0.75) return "after";
            return "inside";
        }
        return offset < 0.5 ? "before" : "after";
    }

    function handleDragOver(event: DragEvent) {
        if (!acceptsDrop || !event.dataTransfer) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        dropPosition = resolveDropPosition(event);
        event.stopPropagation();
    }

    function handleDragLeave() {
        dropPosition = null;
    }

    function handleDrop(event: DragEvent) {
        if (!acceptsDrop || !event.dataTransfer) return;
        event.preventDefault();
        event.stopPropagation();
        const sourceId = event.dataTransfer.getData("text/plain");
        const position = dropPosition ?? resolveDropPosition(event);
        dropPosition = null;
        if (sourceId) onMoveNode?.(sourceId, nodeKey, position);
    }
</script>

<div
    class={isRoot
        ? `vrv-tree-root${disabled ? " node-disabled" : " open"}`
        : `vrv-tree-node${node.isLeaf || childrenHidden ? " leaf" : ""}${disabled ? " node-disabled" : ""}${!disabled && !childrenHidden && node.children?.length ? " open" : ""}`}
    data-id={nodeKey}
    data-element={node.element}
    on:click|stopPropagation={handleOpenClose}
    bind:this={htmlTreeNode}
>
    <div
        class="vrv-mei-element vrv-node-label {disabled ? 'node-disabled' : ''} {draggable ? 'node-draggable' : ''} {dragging ? 'node-dragging' : ''} {dropPosition === 'inside' ? 'node-drop-target' : ''} {dropPosition === 'before' ? 'node-drop-before' : ''} {dropPosition === 'after' ? 'node-drop-after' : ''} {nodeKey === selectedId ? 'target checked' : ''}"
        data-id={nodeKey}
        data-element={node.element}
        draggable={draggable}
        style={`background-image: url("${iconFor(node.element)}");${isRoot && !showRootNode ? " display: none;" : ""}`}
        on:click|stopPropagation={handleSelect}
        on:contextmenu={handleContextMenu}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
        on:dragstart={handleDragStart}
        on:dragend={handleDragEnd}
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:drop={handleDrop}
    >
        {node.element} {node.attributes?.["n"] ? `${node.attributes["n"]}` : ""}
     </div>
    <div class="vrv-node-children">
        {#if !childrenHidden && node.children?.length}
            {#each node.children as child (treeNodeKey(child))}
                <svelte:self
                    node={child}
                    {selectOnContextMenu}
                    {disabledElements}
                    {hideChildrenOfElements}
                    {draggableElements}
                    {dropTargetElements}
                    {reorderableElements}
                    {selectedId}
                    {onSelect}
                    {onHover}
                    {onContextMenu}
                    {onMoveNode}
                />
            {/each}
        {/if}
    </div>
</div>
