import type { EditActionName, EditActionParam } from "../types";

export type ActionCatalogActionEntry = {
    name: string;
    action: string;
};

export type ActionCatalogSubmenuEntry = {
    name: string;
    submenu: ActionCatalogEntry[];
};

export type ActionCatalogEntry = ActionCatalogActionEntry | ActionCatalogSubmenuEntry;

export type ActionDefinition = {
    action: EditActionName;
    param?: EditActionParam;
};

export type ContextButtonEntry = {
    name: string;
    action: string;
    icon: string;
    dialog?: string;
};

export const actionCatalog: Record<string, ActionCatalogEntry[]>;
export const contextButtonBars: Record<string, ContextButtonEntry[][]>;
export const actionDefinitions: Record<string, ActionDefinition>;
