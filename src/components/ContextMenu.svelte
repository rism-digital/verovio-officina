<script lang="ts">
    import type { Action } from "../app/types";
    import {
        resolveContextMenuItems,
        type ResolvedMenuEntry,
    } from "../app/action-resolver";

    export let x = 0;
    export let y = 0;
    export let elementName = "";
    export let customItems: ResolvedMenuEntry[] | null = null;
    export let onSelect: ((action: Action) => void) | null = null;
    export let onClose: (() => void) | null = null;

    let items: ResolvedMenuEntry[] = [];

    $: items = customItems ?? resolveContextMenuItems(elementName);
    $: if (elementName && items.length === 0) close();

    function close() {
        onClose?.();
    }

    function handleWindowContextMenu(event: MouseEvent) {
        event.preventDefault();
        close();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            close();
        }
    }

    function handleAction(action: Action) {
        onSelect?.(action);
    }

    function handleActionKeydown(
        event: KeyboardEvent,
        action: Action,
    ) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleAction(action);
    }
</script>

<svelte:window
    on:click={close}
    on:contextmenu={handleWindowContextMenu}
    on:keydown={handleKeydown}
    on:resize={close}
/>

<div
    class="vrv-context-menu open vrv-text-no-select"
    style={`left: ${x}px; top: ${y}px; display: flex;`}
    role="menu"
    tabindex="-1"
    on:click|stopPropagation
    on:contextmenu|preventDefault|stopPropagation
    on:keydown={handleKeydown}
>
    <div class="vrv-menu-content vrv-context-menu-content">
        {#each items as item}
            {#if item.kind === "action"}
                <div
                    class="vrv-menu-text"
                    data-before={item.label}
                    role="menuitem"
                    tabindex="0"
                    on:click={() => handleAction(item)}
                    on:keydown={(event) => handleActionKeydown(event, item)}
                ></div>
            {:else if item.kind === "submenu"}
                <div class="vrv-submenu">
                    <div
                        class="vrv-submenu-text"
                        data-before={item.label}
                        role="menuitem"
                        tabindex="0"
                    ></div>
                    <div class="vrv-submenu-content">
                        {#each item.items as subItem}
                            {#if subItem.kind === "action"}
                                <div
                                    class="vrv-menu-text"
                                    data-before={subItem.label}
                                    role="menuitem"
                                    tabindex="0"
                                    on:click={() => handleAction(subItem)}
                                    on:keydown={(event) =>
                                        handleActionKeydown(event, subItem)}
                                ></div>
                            {/if}
                        {/each}
                    </div>
                </div>
            {:else}
                <div class="vrv-v-separator" role="separator"></div>
            {/if}
        {/each}
    </div>
</div>
