import type { EditActionName, EditActionParam } from "./types";

export type ToolbarDispatchAction = {
    action: EditActionName;
    label: string;
    param?: EditActionParam;
    dialogValue?: string;
};

export type EnterValueDialogState = {
    action: EditActionName;
    actionLabel: string;
    param?: EditActionParam;
    title: string;
    fieldLabel: string;
    defaultValue: string;
};

export const DEFAULT_ENTER_VALUE_DIALOG = {
    title: "Enter value",
    fieldLabel: "Value",
    defaultValue: "1",
} as const;

type BeginToolbarActionResult =
    | { kind: "dispatch"; action: ToolbarDispatchAction }
    | { kind: "prompt"; dialogState: EnterValueDialogState };

export function beginToolbarAction(input: {
    action: EditActionName;
    label: string;
    param?: EditActionParam;
    dialog?: string;
}): BeginToolbarActionResult {
    if (input.dialog === "enter-value") {
        return {
            kind: "prompt",
            dialogState: {
                action: input.action,
                actionLabel: input.label,
                param: input.param,
                title: DEFAULT_ENTER_VALUE_DIALOG.title,
                fieldLabel: DEFAULT_ENTER_VALUE_DIALOG.fieldLabel,
                defaultValue: DEFAULT_ENTER_VALUE_DIALOG.defaultValue,
            },
        };
    }
    return {
        kind: "dispatch",
        action: {
            action: input.action,
            label: input.label,
            param: input.param,
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
        dialogValue: resolvedValue,
    };
}
