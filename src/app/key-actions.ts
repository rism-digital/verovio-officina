import type { EditorController } from "./editor-controller";

export type KeyShortcutContext = {
    event: KeyboardEvent;
    selectionId?: string;
};

export type KeyShortcutHandler = (context: KeyShortcutContext) => unknown | Promise<unknown>;

export type KeyShortcut = {
    key: string;
    altKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    requiresSelection?: boolean;
    run: KeyShortcutHandler;
};

export function createKeyShortcuts(controller: EditorController): KeyShortcut[] {
    return [
        {
            key: "ArrowRight",
            requiresSelection: true,
            run: async () => controller.navigateSelection(39),
        },
        {
            key: "ArrowLeft",
            requiresSelection: true,
            run: async () => controller.navigateSelection(37),
        },
        {
            key: "Delete",
            requiresSelection: true,
            run: async () => controller.deleteSelectedElement(false),
        },
        {
            key: "Backspace",
            requiresSelection: true,
            run: async () => controller.deleteSelectedElement(true),
        },
    ];
}

export function keyShortcutMap({
    key,
    altKey = false,
    ctrlKey = false,
    metaKey = false,
    shiftKey = false,
}: Pick<KeyShortcut, "key" | "altKey" | "ctrlKey" | "metaKey" | "shiftKey">): string {
    return [
        altKey ? "Alt" : "",
        ctrlKey ? "Ctrl" : "",
        metaKey ? "Meta" : "",
        shiftKey ? "Shift" : "",
        key,
    ].filter(Boolean).join("+");
}

export function keyShortcutMapFromEvent(event: KeyboardEvent): string {
    return keyShortcutMap({
        key: event.key,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
    });
}
