import type { ActionMetadata, EditAction } from "../types";

export type ActionEntry = ActionMetadata & {
    name: string;
    action: string;
};

export type ActionCatalogSubmenuEntry = {
    name: string;
    submenu: ActionCatalogEntry[];
};

export type ActionCatalogEntry = ActionEntry | ActionCatalogSubmenuEntry;

export type ContextButtonEntry = ActionEntry & {
    icon: string;
    secondary?: boolean;
};

export const actionCatalog: Record<string, ActionCatalogEntry[]>;
export const contextButtonBars: Record<string, ContextButtonEntry[][]>;
export const menuActions: ActionEntry[];
export const actionDefinitions: Record<string, EditAction>;
