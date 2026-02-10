import { writable } from 'svelte/store';
import type { Mode, SelectionInfo, ViewModel } from './types';

export const mode = writable<Mode>('insert');
export const selection = writable<SelectionInfo>({ type: 'none' });
export const viewModel = writable<ViewModel>({
  text: 'Loading…',
  svg: '',
  selection: { type: 'none' }
});
export const workerStatus = writable<'idle' | 'busy'>('idle');
export const dirty = writable(false);
export const statusLine = writable('Ready');
