export type Mode = 'edit' | 'insert';

export type SelectElementHandler = (id: string) => void;
export type HoverElementHandler = (id: string | null) => void;
export type EditActionSetHandler = (param: EditActionSetParam, commit: boolean) => void;
export type ActionHandler = () => void;

export type TreeContextAction = {
    action: string;
    param?: EditActionParam;
    label: string;
    targetId: string;
    targetElement: string;
    parentElement: string | null;
};

export type TreeContextActionHandler = (action: TreeContextAction) => void;

export type ContextMenuItem<TAction extends string = string> = {
    label: string;
    action: TAction;
    param?: EditActionParam;
};

export type MEIExportOptions = {
    basic: boolean;
    removeIds: boolean;
    ignoreHeader: boolean;
};

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
    chainedId: string;
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

export type EditActionInsertParam = {
    elementName: string;
    elementId: string;
    insertMode: "insertAfter" | "appendChild";
};

export type EditActionInsertControlParam = {
    elementName: string;
    startId: string;
    endId?: string;
};

export type EditActionCommitParam = Record<string, never>;
export type EditActionContextParam = {
    elementId: string;
};
export type EditActionPropertiesParam =
    | Record<string, never>
    | {
        scoreDef: string;
    };

export type EditActionChainStep = {
    action: "insert" | "set" | "commit";
    param?: EditActionSetParam | EditActionInsertParam | EditActionInsertControlParam| EditActionCommitParam;
};

export type EditActionChainParam = EditActionChainStep[];
export type EditActionParam =
    | EditActionSetParam
    | EditActionInsertParam
    | EditActionInsertControlParam
    | EditActionChainParam
    | EditActionCommitParam
    | EditActionContextParam
    | EditActionPropertiesParam;

export type EditAction = {
    action: string;
    param?: EditActionParam;
};
