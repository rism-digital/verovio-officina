export type PianoKeyboardLetter =
    | "A"
    | "W"
    | "S"
    | "E"
    | "D"
    | "F"
    | "T"
    | "G"
    | "Y"
    | "H"
    | "U"
    | "J"
    | "K"
    | "O"
    | "L"
    | "P"
    | ";";

export type PianoKeyboardShortcut = {
    letter: PianoKeyboardLetter;
    key: string;
    code: number;
};

export const PIANO_KEYBOARD_MIDI_OFFSET = 12;

export const pianoKeyboardShortcuts: PianoKeyboardShortcut[] = [
    { letter: "A", key: "KeyA", code: 97 },
    { letter: "W", key: "KeyW", code: 119 },
    { letter: "S", key: "KeyS", code: 115 },
    { letter: "E", key: "KeyE", code: 101 },
    { letter: "D", key: "KeyD", code: 100 },
    { letter: "F", key: "KeyF", code: 102 },
    { letter: "T", key: "KeyT", code: 116 },
    { letter: "G", key: "KeyG", code: 103 },
    { letter: "Y", key: "KeyY", code: 121 },
    { letter: "H", key: "KeyH", code: 104 },
    { letter: "U", key: "KeyU", code: 117 },
    { letter: "J", key: "KeyJ", code: 106 },
    { letter: "K", key: "KeyK", code: 107 },
    { letter: "O", key: "KeyO", code: 111 },
    { letter: "L", key: "KeyL", code: 108 },
    { letter: "P", key: "KeyP", code: 112 },
    { letter: ";", key: "Semicolon", code: 59 },
];

export const pianoKeyboardLetters = pianoKeyboardShortcuts.map(
    ({ letter }) => letter,
);

export function midiForKeyboardOffset(octave: number, offset: number): number {
    return PIANO_KEYBOARD_MIDI_OFFSET + octave * 12 + offset;
}

export function midiForKeyboardLetter(
    octave: number,
    letter: string,
): number | null {
    const offset = pianoKeyboardLetters.indexOf(letter as PianoKeyboardLetter);
    if (offset === -1) return null;
    return midiForKeyboardOffset(octave, offset);
}

export function midiForKeyboardCode(
    octave: number,
    code: number,
): number | null {
    const offset = pianoKeyboardShortcuts.findIndex(
        (shortcut) => shortcut.code === code,
    );
    if (offset === -1) return null;
    return midiForKeyboardOffset(octave, offset);
}
