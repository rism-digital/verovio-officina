import type { Action } from "./types";

export type EnterValueDialogState = Action & {
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
    | { kind: "dispatch"; action: Action }
    | { kind: "prompt"; dialogState: EnterValueDialogState };

export function beginToolbarAction(input: Action): BeginToolbarActionResult {
    if (input.dialog === "enter-value") {
        return {
            kind: "prompt",
            dialogState: {
                ...input,
                title: DEFAULT_ENTER_VALUE_DIALOG.title,
                fieldLabel: DEFAULT_ENTER_VALUE_DIALOG.fieldLabel,
                defaultValue: resolveDefaultValue(input.actionKey),
            },
        };
    }
    return {
        kind: "dispatch",
        action: input,
    };
}

export function resolveEnterValueDialog(
    dialogState: EnterValueDialogState,
    enteredValue: string | number,
): Action {
    const resolvedValue = typeof enteredValue === "number"
        ? enteredValue
        : enteredValue.trim() || dialogState.defaultValue;
    const dialogValue = dialogState.valueType === "number"
        ? Number.isFinite(Number(resolvedValue))
            ? Number(resolvedValue)
            : Number(dialogState.defaultValue)
        : resolvedValue;
    return {
        ...dialogState,
        dialogValue,
    };
}
