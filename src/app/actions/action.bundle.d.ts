import type { EditAction } from "../types";

export type ActionCatalogActionEntry = {
    name: string;
    action: string;
    dialog?: string;
};

export type ActionCatalogSubmenuEntry = {
    name: string;
    submenu: ActionCatalogEntry[];
};

export type ActionCatalogEntry = ActionCatalogActionEntry | ActionCatalogSubmenuEntry;

export type ContextButtonEntry = {
    name: string;
    action: string;
    icon: string;
    dialog?: string;
    secondary?: boolean;
};

export type MenuActionEntry = {
    name: string;
    action: string;
    dialog?: string;
};

export const actionCatalog: Record<string, ActionCatalogEntry[]>;
export const contextButtonBars: Record<string, ContextButtonEntry[][]>;
export const menuActions: MenuActionEntry[];
export const actionDefinitions: Record<string, EditAction>;
