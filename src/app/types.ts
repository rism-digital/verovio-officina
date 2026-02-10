export type Mode = 'edit' | 'insert';

export type SelectionInfo = {
  type: 'none' | 'text' | 'block';
  label?: string;
  properties?: Record<string, string>;
};

export type ViewModel = {
  svg: string;
  selection: SelectionInfo;
};

export type EditorOp =
  | { type: 'setContent'; text: string }
  | { type: 'insertText'; text: string }
  | { type: 'deleteBackward' }
  | { type: 'setSelection'; selection: SelectionInfo };
