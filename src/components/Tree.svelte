<script lang="ts">
    import { tick } from "svelte";
    import ContextMenu from "./ContextMenu.svelte";
    import TreeCrumb from "./TreeCrumb.svelte";
    import TreeNode from "./TreeNode.svelte";
    import type {
        EditActionParam,
        HoverElementHandler,
        SelectElementHandler,
        TreeContextActionHandler,
        TreeNodeData,
    } from "../app/types";

    export let ancestors: TreeNodeData[] | null = null;
    export let context: TreeNodeData | null = null;
    export let selectedId: string | null = null;
    export let onSelectElement: SelectElementHandler | null = null;
    export let onHoverElement: HoverElementHandler | null = null;
    export let onContextAction: TreeContextActionHandler | null = null;

    let breadcrumbsWrapper: HTMLDivElement | null = null;
    let treeRoot: HTMLDivElement | null = null;
    let contextMenu: {
        x: number;
        y: number;
        node: TreeNodeData;
        parentElement: string | null;
    } | null = null;

    async function scrollBreadcrumbsToEnd() {
        await tick();
        if (breadcrumbsWrapper) {
            breadcrumbsWrapper.scrollLeft = breadcrumbsWrapper.scrollWidth;
        }
    }

    $: if (ancestors) {
        scrollBreadcrumbsToEnd();
    }

    async function scrollToSelectedNode(id: string) {
        await tick();
        if (!treeRoot) return;
        const target = treeRoot.querySelector(
            `[data-id="${id}"]`,
        ) as HTMLElement | null;
        if (!target) return;
        const parentRect = treeRoot.getBoundingClientRect();
        const childRect = target.getBoundingClientRect();
        const offsetTop = childRect.top - parentRect.top + treeRoot.scrollTop;
        treeRoot.scrollTo({ top: Math.max(offsetTop - 50, 0) });
    }

    $: if (selectedId) {
        scrollToSelectedNode(selectedId);
    }

    function openContextMenu(
        node: TreeNodeData,
        parentElement: string | null,
        event: MouseEvent | PointerEvent,
    ) {
        contextMenu = {
            x: event.clientX,
            y: event.clientY,
            node,
            parentElement,
        };
    }

    function closeContextMenu() {
        contextMenu = null;
    }

    function handleContextAction(action: string, label: string, param?: EditActionParam) {
        const currentContextMenu = contextMenu;
        if (!currentContextMenu) return;
        onContextAction?.({
            action,
            param,
            label,
            targetId: currentContextMenu.node.id,
            targetElement: currentContextMenu.node.element,
            parentElement: currentContextMenu.parentElement,
        });
        closeContextMenu();
    }
</script>

<div class="vrv-tree-breadcrumbs-wrapper" bind:this={breadcrumbsWrapper}>
    <div class="vrv-tree-breadcrumbs">
        <div class="vrv-tree-breadcrumb"></div>
        {#if ancestors}
            {#each [...ancestors].reverse() as ancestor}
                <TreeCrumb
                    id={ancestor.id}
                    label={ancestor.element}
                    onSelect={onSelectElement}
                    onHover={onHoverElement}
                />
            {/each}
        {/if}
    </div>
</div>
<div class="vrv-tree-root" bind:this={treeRoot}>
    {#if context}
        <TreeNode
            node={context}
            isRoot
            {selectedId}
            onSelect={onSelectElement}
            onHover={onHoverElement}
            onContextMenu={openContextMenu}
        />
    {/if}
</div>

{#if contextMenu}
    <ContextMenu
        x={contextMenu?.x ?? 0}
        y={contextMenu?.y ?? 0}
        elementName={contextMenu?.node?.element ?? ""}
        onSelect={handleContextAction}
        onClose={closeContextMenu}
    />
{/if}
