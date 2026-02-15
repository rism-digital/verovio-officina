export type Mode = 'edit' | 'insert';

export type SelectElementHandler = (id: string) => void;
export type HoverElementHandler = (id: string | null) => void;
export type EditActionSetHandler = (param: EditActionSetParam, commit: boolean) => void;
export type ActionHandler = () => void;

export interface SelectionInfo {
    type: 'none' | 'element';
    label?: string;
    id?: string;
};

export interface ViewModel {
    svg: string;
    svgId: number;
    selection: SelectionInfo;
};

export interface TreeNodeData {
    id: string;
    element: string;
    children?: TreeNodeData[];
    isLeaf?: boolean;
    text?: string;
    attributes?: Record<string, unknown>;
};

export interface Tab {
    label: string;
    value: number;
    component: any;
}

export interface EditInfo {
    chainedId: string;
    canUndo: boolean;
    canRedo: boolean;
    isMensuralMusicOnly: boolean;
}

export interface ReferenceObject extends TreeNodeData {
    referenceAttribute: string;
}

export interface EditInfoContent {
    ancestors: TreeNodeData[];
    context: TreeNodeData;
    object: TreeNodeData;
    referencedElements: ReferenceObject[];
    referringElements: ReferenceObject[];
}

export type EditActionSetParam = {
    elementId: string;
    attribute: string;
    value: string;
};

export type EditAction = {
    action: "commit" | "context" | "set";
    param?: EditActionSetParam | {};
};
