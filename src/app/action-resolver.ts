import { withBaseUrl } from "./asset-url";
import { actionCatalog, actionDefinitions, contextButtonBars, menuActions } from "./actions/action.bundle";
import type { ActionCatalogEntry, ActionEntry, ContextButtonEntry } from "./actions/action.bundle";
import type { Action } from "./types";

type ResolvedAction = Action & { actionKey: string };

export type ResolvedContextButton = ResolvedAction & { iconUrl: string };

export type ResolvedMenuAction = ResolvedAction;

export type ResolvedMenuEntry =
    | (ResolvedAction & { kind: "action" })
    | { kind: "submenu"; label: string; items: ResolvedMenuEntry[] };

type ResolveContextButtonBarsOptions = {
    includeDialogs?: boolean;
    includeSecondary?: boolean;
};

function isActionEntry(entry: ActionCatalogEntry): entry is ActionEntry {
    return "action" in entry;
}

function resolveActionEntry(entry: ActionEntry): ResolvedAction | null {
    const definition = actionDefinitions[entry.action];
    if (!definition) return null;
    return {
        ...definition,
        label: entry.name,
        actionKey: entry.action,
        dialog: entry.dialog,
        valueType: entry.valueType,
        redoLayout: entry.redoLayout,
    };
}

export function resolveContextMenuItems(name: string): ResolvedMenuEntry[] {
    const entries = actionCatalog[name] ?? [];
    return resolveMenuEntries(entries);
}

export function resolveMenuActions(): ResolvedMenuAction[] {
    const resolvedActions: ResolvedMenuAction[] = [];
    for (const entry of menuActions) {
        const resolvedAction = resolveActionEntry(entry);
        if (resolvedAction) resolvedActions.push(resolvedAction);
    }
    return resolvedActions;
}

function resolveMenuEntries(entries: ActionCatalogEntry[]): ResolvedMenuEntry[] {
    const resolvedItems: ResolvedMenuEntry[] = [];
    for (const entry of entries) {
        if (isActionEntry(entry)) {
            if (entry.dialog) continue;
            const resolvedAction = resolveActionEntry(entry);
            if (!resolvedAction) continue;
            resolvedItems.push({
                ...resolvedAction,
                kind: "action",
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
    for (const bar of bars) {
        const resolvedBar: ResolvedContextButton[] = [];
        for (const button of bar) {
            if (!options.includeDialogs && button.dialog) continue;
            if (button.secondary && !options.includeSecondary) continue;
            const resolvedAction = resolveActionEntry(button);
            if (!resolvedAction) continue;
            resolvedBar.push({
                ...resolvedAction,
                iconUrl: withBaseUrl(button.icon),
            });
        }
        if (resolvedBar.length > 0) {
            resolvedBars.push(resolvedBar);
        }
    }
    return resolvedBars;
}
