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
    primaryKey?: boolean;
    shiftKey?: boolean;
    requiresSelection?: boolean;
    run: KeyShortcutHandler;
};

function isMacPlatform(): boolean {
    return typeof navigator !== "undefined"
        && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

function shortcutModifierState(shortcut: Pick<
    KeyShortcut,
    "altKey" | "ctrlKey" | "metaKey" | "primaryKey" | "shiftKey"
>): {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
} {
    const primaryKey = shortcut.primaryKey === true;
    const isMac = isMacPlatform();
    return {
        altKey: shortcut.altKey === true,
        ctrlKey: shortcut.ctrlKey === true || (primaryKey && !isMac),
        metaKey: shortcut.metaKey === true || (primaryKey && isMac),
        shiftKey: shortcut.shiftKey === true,
    };
}

export function createKeyShortcuts(controller: EditorController): KeyShortcut[] {
    return [
        {
            key: "ArrowLeft",
            requiresSelection: true,
            run: async () => controller.handleArrow(37),
        }, 
        {
            key: "ArrowUp",
            requiresSelection: true,
            run: async () => controller.handleArrow(38),
        },
        {
            key: "ArrowRight",
            requiresSelection: true,
            run: async () => controller.handleArrow(39),
        },
        {
            key: "ArrowDown",
            requiresSelection: true,
            run: async () => controller.handleArrow(40),
        },
        {
            key: "ArrowLeft",
            primaryKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(38, { ctrlKey: true }),
        },
        {
            key: "ArrowUp",
            primaryKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(38, { ctrlKey: true }),
        },
        {
            key: "ArrowRight",
            primaryKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(39, { ctrlKey: true }),
        },
        {
            key: "ArrowDown",
            primaryKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(40, { ctrlKey: true }),
        },
        {
            key: "Backspace",
            requiresSelection: true,
            run: async () => controller.deleteSelectedElement(true),
        },
        {
            key: "Delete",
            requiresSelection: true,
            run: async () => controller.deleteSelectedElement(false),
        },
        {
            key: "Escape",
            requiresSelection: true,
            run: async () => controller.handleMode(27),
        },
        {
            key: "Enter",
            requiresSelection: true,
            run: async () => controller.handleMode(13),
        },
        {
            key: "Digit1",
            requiresSelection: true,
            run: async () => controller.handleDuration(49),
        },
        {
            key: "Digit2",
            requiresSelection: true,
            run: async () => controller.handleDuration(50),
        },
        {
            key: "Digit3",
            requiresSelection: true,
            run: async () => controller.handleDuration(51),
        },
        {
            key: "Digit4",
            requiresSelection: true,
            run: async () => controller.handleDuration(52),
        },
        {
            key: "Digit5",
            requiresSelection: true,
            run: async () => controller.handleDuration(53),
        },
        {
            key: "Digit6",
            requiresSelection: true,
            run: async () => controller.handleDuration(54),
        },
        {
            key: "Digit7",
            requiresSelection: true,
            run: async () => controller.handleDuration(55),
        },
    ];
}

export function keyShortcutMap({
    key,
    ...shortcut
}: Pick<KeyShortcut, "key" | "altKey" | "ctrlKey" | "metaKey" | "primaryKey" | "shiftKey">): string {
    const { altKey, ctrlKey, metaKey, shiftKey } = shortcutModifierState(shortcut);
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
        key: event.code,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
    });
}
