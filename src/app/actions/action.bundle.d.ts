import type { EditActionParam } from "../types";

export type ActionCatalogEntry = {
    name: string;
    action: string;
};

export type ActionDefinition = {
    action: "insert" | "insertControl" | "set" | "commit" | "chain";
    param?: EditActionParam;
};

export const actionCatalog: Record<string, ActionCatalogEntry[]>;
export const actionDefinitions: Record<string, ActionDefinition>;
