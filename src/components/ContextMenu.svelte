<script lang="ts">
    import type { ContextMenuItem, EditActionParam } from "../app/types";
    import { withBaseUrl } from "../app/asset-url";
    import { actionCatalog, actionDefinitions, contextButtonBars } from "../app/actions/action.bundle";

    export let x = 0;
    export let y = 0;
    export let elementName = "";
    export let onSelect: ((action: string, label: string, param?: EditActionParam) => void) | null = null;
    export let onClose: (() => void) | null = null;

    type ActionCatalogActionEntry = {
        name: string;
        action: string;
    };
    type ActionCatalogSubmenuEntry = {
        name: string;
        submenu: ActionCatalogEntry[];
    };
    type ActionCatalogEntry = ActionCatalogActionEntry | ActionCatalogSubmenuEntry;

    type ActionDefinition = {
        action: string;
        param?: EditActionParam;
    };

    type ResolvedMenuEntry =
        | { kind: "action"; label: string; action: string; param?: EditActionParam }
        | { kind: "submenu"; label: string; items: ResolvedMenuEntry[] };
    type ContextButtonEntry = {
        name: string;
        action: string;
        icon: string;
    };
    type ResolvedContextButton = {
        label: string;
        action: ActionDefinition["action"];
        param?: EditActionParam;
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
                const definition = actionDefinitions[entry.action];
                if (!definition) continue;
                resolvedItems.push({
                    kind: "action",
                    label: entry.name,
                    action: definition.action,
                    param: definition.param,
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
                const definition = actionDefinitions[button.action];
                if (!definition) continue;
                resolvedBar.push({
                    label: button.name,
                    action: definition.action,
                    param: definition.param,
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

    function handleAction(action: string, label: string, param?: EditActionParam) {
        onSelect?.(action, label, param);
    }

    function handleActionKeydown(
        event: KeyboardEvent,
        action: string,
        label: string,
        param?: EditActionParam,
    ) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleAction(action, label, param);
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
                            on:click={() => handleAction(button.action, button.label, button.param)}
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
                    on:click={() => handleAction(item.action, item.label, item.param)}
                    on:keydown={(event) =>
                        handleActionKeydown(
                            event,
                            item.action,
                            item.label,
                            item.param,
                        )}
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
                                    on:click={() =>
                                        handleAction(subItem.action, subItem.label, subItem.param)}
                                    on:keydown={(event) =>
                                        handleActionKeydown(
                                            event,
                                            subItem.action,
                                            subItem.label,
                                            subItem.param,
                                        )}
                                ></div>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>
