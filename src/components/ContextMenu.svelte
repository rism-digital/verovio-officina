<script lang="ts">
    import type { ContextAction } from "../app/types";
    import {
        resolveContextButtonBars,
        resolveContextMenuItems,
        type ResolvedContextButton,
        type ResolvedMenuEntry,
    } from "../app/action-resolver";

    export let x = 0;
    export let y = 0;
    export let elementName = "";
    export let onSelect: ((action: ContextAction) => void) | null = null;
    export let onClose: (() => void) | null = null;

    let items: ResolvedMenuEntry[] = [];
    let buttonBars: ResolvedContextButton[][] = [];

    $: items = resolveContextMenuItems(elementName);
    $: buttonBars = resolveContextButtonBars(elementName);
    $: if (elementName && items.length === 0 && buttonBars.length === 0) close();

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

    function handleAction(action: ContextAction) {
        onSelect?.(action);
    }

    function handleActionKeydown(
        event: KeyboardEvent,
        action: ContextAction,
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
    {#if buttonBars.length > 0}
        <div class="vrv-context-button-bars">
            {#each buttonBars as bar}
                <div class="vrv-context-button-bar">
                    {#each bar as button}
                        <button
                            class="vrv-context-icon-btn"
                            type="button"
                            title={button.label}
                            aria-label={button.label}
                            style={`background-image: url("${button.iconUrl}");`}
                            on:click={() => handleAction(button)}
                        ></button>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
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
            {:else}
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
            {/if}
        {/each}
    </div>
</div>
