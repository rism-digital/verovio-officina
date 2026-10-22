import { withBaseUrl } from "./asset-url";
import {
    actionCatalog,
    actionDefinitions,
    contextButtonBars,
    contextTools,
    menuActions,
} from "./actions/action.bundle";
import type { ActionCatalogEntry, ActionEntry, ContextButtonEntry } from "./actions/action.bundle";
import type { Action } from "./types";

export type ResolvedAction = Action & { actionKey: string };

export type ResolvedContextToolGroup = ResolvedAction[];

export type ResolvedContextButton = ResolvedAction & { iconUrl: string };

export type ResolvedContextButtonBar = {
    label: string;
    actions: ResolvedContextButton[];
};

export type ResolvedMenuAction = ResolvedAction;

export type ResolvedMenuEntry =
    | (ResolvedAction & { kind: "action" })
    | { kind: "submenu"; label: string; items: ResolvedMenuEntry[] }
    | { kind: "separator" };

type ResolveContextButtonBarsOptions = {
    includeDialogs?: boolean;
    includeSecondary?: boolean;
};

function isActionEntry(entry: ActionCatalogEntry): entry is ActionEntry {
    return "action" in entry;
}

function isSeparatorEntry(
    entry: ActionCatalogEntry,
): entry is Extract<ActionCatalogEntry, { separator: true }> {
    return "separator" in entry;
}

function resolveActionEntry(entry: ActionEntry): ResolvedAction | null {
    const definition = actionDefinitions[entry.action];
    if (!definition) return null;
    return {
        ...definition,
        label: entry.name,
        actionKey: entry.action,
        appAction: entry.appAction,
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

export function resolveContextTools(
    name: string | null,
): ResolvedContextToolGroup[] {
    if (!name) return [];
    const groups = contextTools[name] ?? [];
    return groups
        .map((group) => group
            .map((entry) => resolveActionEntry(entry))
            .filter((action): action is ResolvedAction => Boolean(action)))
        .filter((group) => group.length > 0);
}

function resolveMenuEntries(entries: ActionCatalogEntry[]): ResolvedMenuEntry[] {
    const resolvedItems: ResolvedMenuEntry[] = [];
    for (const entry of entries) {
        if (isSeparatorEntry(entry)) {
            if (
                resolvedItems.length > 0
                && resolvedItems[resolvedItems.length - 1]?.kind !== "separator"
            ) {
                resolvedItems.push({ kind: "separator" });
            }
            continue;
        }
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
    if (resolvedItems[resolvedItems.length - 1]?.kind === "separator") {
        resolvedItems.pop();
    }
    return resolvedItems;
}

export function resolveContextButtonBars(
    name: string | null,
    options: ResolveContextButtonBarsOptions = {},
): ResolvedContextButtonBar[] {
    if (!name) return [];
    const bars = contextButtonBars[name] ?? [];
    const resolvedBars: ResolvedContextButtonBar[] = [];
    for (const bar of bars) {
        const resolvedActions: ResolvedContextButton[] = [];
        for (const button of bar.actions) {
            if (!options.includeDialogs && button.dialog) continue;
            if (button.secondary && !options.includeSecondary) continue;
            const resolvedAction = resolveActionEntry(button);
            if (!resolvedAction) continue;
            resolvedActions.push({
                ...resolvedAction,
                iconUrl: withBaseUrl(button.icon),
            });
        }
        if (resolvedActions.length > 0) {
            resolvedBars.push({
                label: bar.label,
                actions: resolvedActions,
            });
        }
    }
    return resolvedBars;
}
