import { writable } from 'svelte/store';
import type { EditResponseContent, EditStatus, ViewModel } from './types';

export type InputMode = 'pitchFirst' | 'durationFirst';
export type PianoKeyboardMode = 'flat' | 'auto' | 'sharp';

export type UserPreferences = {
    pianoKeyboardEnabled: boolean;
    inputMode: InputMode;
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
    pianoKeyboardEnabled: false,
    inputMode: 'durationFirst',
};

export const editStatus = writable<EditStatus>({
  chainedId: '',
  canUndo: false,
  canRedo: false,
  isMensuralMusicOnly: false,
  insertMode: false,
  selection: null,
  insertion: null,
  invalidLayout: null
});
export const viewModel = writable<ViewModel>({
  svg: '',
  svgId: 0
});
export const editResponseContent = writable<EditResponseContent | null>(null);
export const verovioState = writable({
    zoom: 100,
    pageCount: 0,
    currentPage: 1
});
export const workerBusy = writable(false);
export const dirty = writable(false);
export const documentRevision = writable(0);
export const userPreferences = writable<UserPreferences>(DEFAULT_USER_PREFERENCES);
export const pianoKeyboardMode = writable<PianoKeyboardMode>('auto');
export const pianoKeyboardOctave = writable(4);
export const statusLine = writable('Ready');
