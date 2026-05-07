import { withBaseUrl } from "./asset-url";
import { actionCatalog, actionDefinitions, contextButtonBars } from "./actions/action.bundle";
import type { ActionCatalogEntry, ContextButtonEntry } from "./actions/action.bundle";
import type { ContextAction } from "./types";

export type ResolvedContextButton = ContextAction & {
    actionKey: string;
    iconUrl: string;
};

export type ResolvedMenuEntry =
    | (ContextAction & { kind: "action"; actionKey: string })
    | { kind: "submenu"; label: string; items: ResolvedMenuEntry[] };

type ResolveContextButtonBarsOptions = {
    includeDialogs?: boolean;
    secondarySelection?: string | null;
};

function isActionEntry(entry: ActionCatalogEntry): entry is Extract<ActionCatalogEntry, { action: string }> {
    return "action" in entry;
}

export function resolveContextMenuItems(name: string): ResolvedMenuEntry[] {
    const entries = actionCatalog[name] ?? [];
    return resolveMenuEntries(entries as ActionCatalogEntry[]);
}

function resolveMenuEntries(entries: ActionCatalogEntry[]): ResolvedMenuEntry[] {
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
        const submenuItems = resolveMenuEntries(entry.submenu);
        if (submenuItems.length === 0) continue;
        resolvedItems.push({
            kind: "submenu",
            label: entry.name,
            items: submenuItems,
        });
    }
    return resolvedItems;
}

export function resolveContextButtonBars(
    name: string | null,
    options: ResolveContextButtonBarsOptions = {},
): ResolvedContextButton[][] {
    if (!name) return [];
    const bars = contextButtonBars[name] ?? [];
    const resolvedBars: ResolvedContextButton[][] = [];
    for (const bar of bars as ContextButtonEntry[][]) {
        const resolvedBar: ResolvedContextButton[] = [];
        for (const button of bar) {
            if (!options.includeDialogs && button.dialog) continue;
            if (button.secondary && !options.secondarySelection) continue;
            const definition = actionDefinitions[button.action];
            if (!definition) continue;
            resolvedBar.push({
                label: button.name,
                action: definition.action,
                param: definition.param,
                actionKey: button.action,
                dialog: button.dialog,
                iconUrl: withBaseUrl(button.icon),
            });
        }
        if (resolvedBar.length > 0) {
            resolvedBars.push(resolvedBar);
        }
    }
    return resolvedBars;
}
