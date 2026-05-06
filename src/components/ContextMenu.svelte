<script lang="ts">
    import type { ContextAction } from "../app/types";
    import { withBaseUrl } from "../app/asset-url";
    import { actionCatalog, actionDefinitions, contextButtonBars } from "../app/actions/action.bundle";

    export let x = 0;
    export let y = 0;
    export let elementName = "";
    export let onSelect: ((action: ContextAction) => void) | null = null;
    export let onClose: (() => void) | null = null;

    type ActionCatalogActionEntry = {
        name: string;
        action: string;
        dialog?: string;
    };
    type ActionCatalogSubmenuEntry = {
        name: string;
        submenu: ActionCatalogEntry[];
    };
    type ActionCatalogEntry = ActionCatalogActionEntry | ActionCatalogSubmenuEntry;

    type ResolvedMenuEntry =
        | (ContextAction & { kind: "action"; actionKey: string })
        | { kind: "submenu"; label: string; items: ResolvedMenuEntry[] };
    type ContextButtonEntry = {
        name: string;
        action: string;
        icon: string;
        dialog?: string;
    };
    type ResolvedContextButton = ContextAction & {
        actionKey: string;
        iconUrl: string;
    };

    let items: ResolvedMenuEntry[] = [];
    let buttonBars: ResolvedContextButton[][] = [];

    function isActionEntry(entry: ActionCatalogEntry): entry is ActionCatalogActionEntry {
        return "action" in entry;
    }

    function resolveEntries(entries: ActionCatalogEntry[]): ResolvedMenuEntry[] {
        const resolvedItems: ResolvedMenuEntry[] = [];
        for (const entry of entries) {
            if (isActionEntry(entry)) {
                if (entry.dialog) continue;
                const definition = actionDefinitions[entry.action];
                if (!definition) continue;
                resolvedItems.push({
                    kind: "action",
                    label: entry.name,
                    action: definition.action,
                    param: definition.param,
                    actionKey: entry.action,
                });
                continue;
            }
            const submenuItems = resolveEntries(entry.submenu);
            if (submenuItems.length === 0) continue;
            resolvedItems.push({
                kind: "submenu",
                label: entry.name,
                items: submenuItems,
            });
        }
        return resolvedItems;
    }

    function actionItemsFor(name: string): ResolvedMenuEntry[] {
        const entries = actionCatalog[name] ?? [];
        return resolveEntries(entries as ActionCatalogEntry[]);
    }

    function buttonBarsFor(name: string): ResolvedContextButton[][] {
        const bars = contextButtonBars[name] ?? [];
        const resolvedBars: ResolvedContextButton[][] = [];
        for (const bar of bars as ContextButtonEntry[][]) {
            const resolvedBar: ResolvedContextButton[] = [];
            for (const button of bar) {
                if (button.dialog) continue;
                const definition = actionDefinitions[button.action];
                if (!definition) continue;
                resolvedBar.push({
                    label: button.name,
                    action: definition.action,
                    param: definition.param,
                    actionKey: button.action,
                    iconUrl: withBaseUrl(button.icon),
                });
            }
            if (resolvedBar.length > 0) {
                resolvedBars.push(resolvedBar);
            }
        }
        return resolvedBars;
    }

    $: items = actionItemsFor(elementName);
    $: buttonBars = buttonBarsFor(elementName);
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
