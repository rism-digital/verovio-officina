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

export type PianoKeyboardAccidentalMode = "flat" | "sharp";

export type PianoKeyboardNote = {
    oct: number;
    pname: string;
    accid: string;
};

export type PianoKeyboardPitch = {
    oct: number;
    pname: string;
    accid?: string | null;
};

export const PIANO_KEYBOARD_MIDI_OFFSET = 12;
const PIANO_KEYBOARD_SELECTED_KEY_COUNT = 17;

const pnamePitchClasses: Record<string, number> = {
    c: 0,
    d: 2,
    e: 4,
    f: 5,
    g: 7,
    a: 9,
    b: 11,
};

const accidOffsets: Record<string, number> = {
    "": 0,
    n: 0,
    f: -1,
    ff: -2,
    s: 1,
    ss: 2,
    x: 2,
};

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

const flatNoteNames: PianoKeyboardNote[] = [
    { pname: "c", accid: "", oct: 0 },
    { pname: "d", accid: "f", oct: 0 },
    { pname: "d", accid: "", oct: 0 },
    { pname: "e", accid: "f", oct: 0 },
    { pname: "e", accid: "", oct: 0 },
    { pname: "f", accid: "", oct: 0 },
    { pname: "g", accid: "f", oct: 0 },
    { pname: "g", accid: "", oct: 0 },
    { pname: "a", accid: "f", oct: 0 },
    { pname: "a", accid: "", oct: 0 },
    { pname: "b", accid: "f", oct: 0 },
    { pname: "b", accid: "", oct: 0 },
];

const sharpNoteNames: PianoKeyboardNote[] = [
    { pname: "c", accid: "", oct: 0 },
    { pname: "c", accid: "s", oct: 0 },
    { pname: "d", accid: "", oct: 0 },
    { pname: "d", accid: "s", oct: 0 },
    { pname: "e", accid: "", oct: 0 },
    { pname: "f", accid: "", oct: 0 },
    { pname: "f", accid: "s", oct: 0 },
    { pname: "g", accid: "", oct: 0 },
    { pname: "g", accid: "s", oct: 0 },
    { pname: "a", accid: "", oct: 0 },
    { pname: "a", accid: "s", oct: 0 },
    { pname: "b", accid: "", oct: 0 },
];

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

export function midiForNotePitch(note: PianoKeyboardPitch): number | null {
    const pitchClass = pnamePitchClasses[note.pname.toLowerCase()];
    if (pitchClass === undefined) return null;
    const accidOffset = accidOffsets[note.accid ?? ""] ?? 0;
    return (note.oct + 1) * 12 + pitchClass + accidOffset;
}

export function noteForKeyboardCode(
    octave: number,
    code: number,
    mode: PianoKeyboardAccidentalMode,
): PianoKeyboardNote | null {
    const midi = midiForKeyboardCode(octave, code);
    if (midi === null) return null;
    return noteForMidi(midi, mode);
}

export function noteForMidi(
    midi: number,
    mode: PianoKeyboardAccidentalMode,
): PianoKeyboardNote {
    const noteNames = mode === "flat" ? flatNoteNames : sharpNoteNames;
    const pitchClass = midi % 12;
    const note = noteNames[pitchClass];
    return {
        ...note,
        oct: Math.floor(midi / 12) - 1,
    };
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

export function keyboardOctaveForPitch(
    currentKeyboardOctave: number,
    note: PianoKeyboardPitch,
): number | null {
    const midi = midiForNotePitch(note);
    if (midi === null) return null;

    const currentStart = midiForKeyboardOffset(currentKeyboardOctave, 0);
    const currentEnd = currentStart + PIANO_KEYBOARD_SELECTED_KEY_COUNT - 1;
    if (midi >= currentStart && midi <= currentEnd) {
        return currentKeyboardOctave;
    }

    return Math.floor((midi - PIANO_KEYBOARD_MIDI_OFFSET) / 12);
}
