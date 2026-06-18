import { writable } from 'svelte/store';
import type { EditResponseContent, EditStatus, ViewModel } from './types';

export const editStatus = writable<EditStatus>({
  chainedId: '',
  canUndo: false,
  canRedo: false,
  isMensuralMusicOnly: false,
  insertMode: false,
  selection: null,
  insertion: null
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
export const pianoKeyboardEnabled = writable(false);
export const pianoKeyboardOctave = writable(4);
export const statusLine = writable('Ready');
