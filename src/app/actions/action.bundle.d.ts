import type { ActionMetadata, EditAction } from "../types";

export type ActionEntry = ActionMetadata & {
    name: string;
    action: string;
};

export type ContextToolItem = ActionEntry | ActionEntry[];

export type ActionCatalogSubmenuEntry = {
    name: string;
    submenu: ActionCatalogEntry[];
};

export type ActionCatalogSeparatorEntry = {
    separator: true;
};

export type ActionCatalogEntry =
    | ActionEntry
    | ActionCatalogSubmenuEntry
    | ActionCatalogSeparatorEntry;

export type ContextButtonEntry = ActionEntry & {
    icon: string;
    secondary?: boolean;
};

export type ContextButtonBar = {
    label: string;
    actions: ContextButtonEntry[];
};

export const actionCatalog: Record<string, ActionCatalogEntry[]>;
export const contextTools: Record<string, ContextToolItem[][]>;
export const contextToolComponents: Record<string, string>;
export const contextButtonBars: Record<string, ContextButtonBar[]>;
export const menuActions: ActionEntry[];
export const actionDefinitions: Record<string, EditAction>;
