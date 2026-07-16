import type { EditorController } from "./editor-controller";
import { pianoKeyboardShortcuts } from "./piano-keyboard";

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

export type KeyShortcutActions = {
    togglePianoKeyboard: () => void;
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

export function createKeyShortcuts(
    controller: EditorController,
    actions: KeyShortcutActions,
): KeyShortcut[] {
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
            run: async () => controller.handleArrow(37, { ctrlKey: true }),
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
            key: "ArrowLeft",
            shiftKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(37, { shiftKey: true }),
        },
        {
            key: "ArrowUp",
            shiftKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(38, { shiftKey: true }),
        },
        {
            key: "ArrowRight",
            shiftKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(39, { shiftKey: true }),
        },
        {
            key: "ArrowDown",
            shiftKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(40, { shiftKey: true }),
        },
                        {
            key: "ArrowLeft",
            primaryKey: true,
            shiftKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(37, { ctrlKey: true, shiftKey: true }),
        },
        {
            key: "ArrowUp",
            primaryKey: true,
            shiftKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(38, { ctrlKey: true, shiftKey: true }),
        },
        {
            key: "ArrowRight",
            primaryKey: true,
            shiftKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(39, { ctrlKey: true, shiftKey: true }),
        },
        {
            key: "ArrowDown",
            primaryKey: true,
            shiftKey: true,
            requiresSelection: true,
            run: async () => controller.handleArrow(40, { ctrlKey: true, shiftKey: true }),
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
            key: "KeyZ",
            primaryKey: true,
            run: async () => controller.handleUndo(),
        },
        {
            key: "KeyY",
            primaryKey: true,
            run: async () => controller.handleRedo(),
        },
        {
            key: "KeyZ",
            primaryKey: true,
            shiftKey: true,
            run: async () => controller.handleRedo(),
        },
        {
            key: "KeyL",
            primaryKey: true,
            shiftKey: true,
            run: async () => controller.handleRefreshLayout(),
        },
        {
            key: "Escape",
            requiresSelection: true,
            run: async () => controller.handleEscape(),
        },
        {
            key: "Enter",
            requiresSelection: true,
            run: async () => controller.handleEnter(),
        },
        {
            key: "Enter",
            shiftKey: true,
            requiresSelection: true,
            run: async () => controller.handleEnter(true),
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
        {
            key: "+",
            run: async () => controller.handlePitchAccidentalMode("s"),
        },
        {
            key: "-",
            run: async () => controller.handlePitchAccidentalMode("f"),
        },
        {
            key: "*",
            run: async () => controller.handlePitchAccidentalMode("n"),
        },
        {
            key: ".",
            requiresSelection: true,
            run: async () => controller.handleKeyDown(46),
        },
        {
            key: "Space",
            requiresSelection: true,
            run: async () => controller.handleSpace(),
        },
        {
            key: "KeyN",
            requiresSelection: true,
            run: async () => controller.handleRestMode(false),
        },
        {
            key: "KeyB",
            requiresSelection: true,
            run: async () => controller.handleLetter(98),
        },
        {
            key: "KeyC",
            requiresSelection: true,
            run: async () => controller.handleLetter(99),
        },
        ...pianoKeyboardShortcuts.map(({ key, code }) => ({
            key,
            requiresSelection: true,
            run: async () => controller.handleLetter(code),
        })),
        {
            key: "KeyK",
            primaryKey: true,
            run: actions.togglePianoKeyboard,
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
    const numpadOperators: Record<string, string> = {
        NumpadAdd: "+",
        NumpadSubtract: "-",
        NumpadMultiply: "*",
        NumpadDecimal: ".",
    };
    if (!event.altKey && !event.ctrlKey && !event.metaKey && event.code in numpadOperators) {

        return numpadOperators[event.code];
    }
    if (!event.altKey && !event.ctrlKey && !event.metaKey && ["+", "-", "*", "."].includes(event.key)) {
        return event.key;
    }
    return keyShortcutMap({
        key: event.code,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
    });
}
