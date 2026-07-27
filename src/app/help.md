Verovio Officina lets you edit a score directly from the notation view. For the shortcuts, note that `Primary` key is `Cmd` on Mac and `Ctrl` on Windows.

### Insert Modes

There are two insert modes. They use the same editing commands, but in a different order.

| Mode | How it works |
| --- | --- |
| Duration first | Choose the duration first, then enter a pitch or rest. This is useful when writing rhythmic patterns. |
| Pitch first | Choose the pitch first, then adjust the duration. This is useful when entering melodic lines from the keyboard. |

The insert mode is activated with `Enter`.

### Keyboard Options

You can enter pitches with letter names or with the on-screen piano keyboard. The piano keyboard can also be played from the computer keyboard.

| Option | How it works |
| --- | --- |
| Letter keyboard | Use pitch letters from `A` to `G`. |
| Piano keyboard | Toggle the piano keyboard and use the mapped computer keys (see command and keys below) |

When the piano keyboard is enabled, the computer keyboard maps to a chromatic keyboard.

| Shortcut | Action |
| --- | --- |
| `A W S E D F T G Y H U J K O L P ;` | Enter pitches across the selected piano keyboard range. |
| `+` | Use sharps for black key notes. |
| `-` | Use flats for black key notes. |
| `*` | Automatic flats or sharp for black key notes. |
| `Primary+K` | Show or hide the piano keyboard. |

### Duration-First Mode

In duration-first mode, choose the rhythmic value before entering the next note, chord, or rest. The cursor keeps the current duration until you change it.

| Shortcut | Action |
| --- | --- |
| `1` to `7` | Select the duration for the next insertion. |
| ArrowLeft or ArrowRight | Decrease of increase the current duration |
| ArrowUp or ArrowDown | Move the cursor octave up or down |
| `.` | Toggle the duration dot. |
| `+` | Use a sharp accidental for inserted notes. |
| `-` | Use a flat accidental for inserted notes. |
| `*` | Use a natural accidental for inserted notes. |
| `A` to `G` | Insert a note with the selected duration. |
| Piano keys | Insert a note with the selected duration when the piano keyboard is enabled. |
| `Space` | Insert a rest with the selected duration. |
| `=` | Copy the current note or chord and add a tie. |
| `Shift+=` | Copy the current note or chord without adding a tie. |

### Pitch-First Mode

In pitch-first mode, choose the pitch first, then use the duration keys to update or confirm the insertion. This is useful when entering notes from the letter keys or piano keyboard.

| Shortcut | Action |
| --- | --- |
| `A` to `G` | Select the pitch for the cursor. |
| ArrowUp or ArrowDown | Move the cursor pitch up or down |
| Primary+ArrowUp or ArrowDown | Move the cursor pitch octave up or down |
| Piano keys | Select the pitch for the cursor when the piano keyboard is enabled. |
| `Space` | Switch the cursor to rest insertion. |
| `N` | Switch the cursor from rest insertion to note insertion. |
| `.` | Toggle the duration dot. |
| `+` | Use a sharp accidental for the cursor pitch. |
| `-` | Use a flat accidental for the cursor pitch. |
| `*` | Use a natural accidental for the cursor pitch. |
| `=` | Set the cursor to tie mode. |
| `Shift+=` | Set the cursor to copy mode. |
| `1` to `7` | Insert a note with the selected pitch or a rest. |

### Chord Mode

Chord mode can be activated with `Enter` once in insert mode, or with `Shift-Enter` to edit an existing note or chord. Moving to the insertion of the next chord is done by pressing `ArrowRight` in pitch-first mode, and `Enter` in duration-first mode. In both insert modes, pressing `Esc` moves to the next insertion and leaves chord mode.

### Ties and Chord Copy

When on a chord in insert mode, pressing `=` will enter a tied chord with the current duration in duration-first insert mode, or change the cursor to tie in pitch-first. Pressing `Shift-=` does the same but without adding the ties to the chord copy.

### Common Shortcuts

| Shortcut | Action |
| --- | --- |
| `Enter` | Enter insert mode, chord mode or confirm the current insertion. |
| `Esc` | Leave insert mode or chord mode |
| `Backspace` | Delete the selected element and move backward. |
| `Delete` | Delete the selected element and move forward. |
| `Primary+Z` | Undo. |
| `Primary+Y` | Redo. |
| `Primary+Shift+Z` | Redo. |
| `Primary+Shift+L` | Refresh the layout. |
| `Primary+K` | Toggle the piano keyboard. |

### Navigation

| Shortcut | Action |
| --- | --- |
| `Arrow keys` | Move the selection (left and right only). |
