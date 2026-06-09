import type { Action, EditActionName, EditActionParam } from "./types";

export type ToolbarDispatchAction = Action;

export type EnterValueDialogState = {
    action: EditActionName;
    actionLabel: string;
    param?: EditActionParam;
    actionKey?: string;
    title: string;
    fieldLabel: string;
    defaultValue: string;
};

export const DEFAULT_ENTER_VALUE_DIALOG = {
    title: "Enter value",
    fieldLabel: "Value",
    defaultValue: "1",
} as const;

const ENTER_VALUE_DEFAULT_BY_ACTION_KEY: Record<string, string> = {
    "add-fing": "1",
    "add-tempo": "Allegro",
    "add-dir": "dolce",
};

function resolveDefaultValue(actionKey?: string): string {
    if (!actionKey) return DEFAULT_ENTER_VALUE_DIALOG.defaultValue;
    return ENTER_VALUE_DEFAULT_BY_ACTION_KEY[actionKey] ?? DEFAULT_ENTER_VALUE_DIALOG.defaultValue;
}

type BeginToolbarActionResult =
    | { kind: "dispatch"; action: ToolbarDispatchAction }
    | { kind: "prompt"; dialogState: EnterValueDialogState };

export function beginToolbarAction(input: {
    action: EditActionName;
    label: string;
    param?: EditActionParam;
    actionKey?: string;
    dialog?: string;
}): BeginToolbarActionResult {
    if (input.dialog === "enter-value") {
        return {
            kind: "prompt",
            dialogState: {
                action: input.action,
                actionLabel: input.label,
                param: input.param,
                actionKey: input.actionKey,
                title: DEFAULT_ENTER_VALUE_DIALOG.title,
                fieldLabel: DEFAULT_ENTER_VALUE_DIALOG.fieldLabel,
                defaultValue: resolveDefaultValue(input.actionKey),
            },
        };
    }
    return {
        kind: "dispatch",
        action: {
            action: input.action,
            label: input.label,
            param: input.param,
            actionKey: input.actionKey,
        },
    };
}

export function resolveEnterValueDialog(
    dialogState: EnterValueDialogState,
    enteredValue: string,
): ToolbarDispatchAction {
    const resolvedValue = enteredValue.trim() || dialogState.defaultValue;
    return {
        action: dialogState.action,
        label: dialogState.actionLabel,
        param: dialogState.param,
        actionKey: dialogState.actionKey,
        dialogValue: resolvedValue,
    };
}
