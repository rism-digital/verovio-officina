export type Mode = 'edit' | 'insert';

export type SelectElementOptions = {
    additive?: boolean;
};
export type SelectElementHandler = (id: string, options?: SelectElementOptions) => void;
export type HoverElementHandler = (id: string | null) => void;
export type EditActionSetHandler = (param: EditActionSetParam, commit: boolean) => void;
export type ActionHandler = () => void;

export type EditActionName =
    | "delete"
    | "insert"
    | "insertControl"
    | "set"
    | "commit"
    | "chain"
    | "context"
    | "properties"
    | "navigate";

export type ContextAction = {
    action: EditActionName;
    label: string;
    param?: EditActionParam;
    actionKey?: string;
    dialog?: string;
    dialogValue?: string;
};

export type TargetedContextAction = ContextAction & {
    targetId: string;
    targetElement: string;
};

export type TargetedContextActionHandler = (action: TargetedContextAction) => void;

export type EditActionInput = {
    targetId: string;
    targetElement: string;
    secondaryId?: string;
    dialogValue?: string;
};

export type ContextMenuItem<TAction extends EditActionName = EditActionName> = {
    label: string;
    action: TAction;
    param?: EditActionParam;
};

export type MEIExportOptions = {
    basic: boolean;
    removeIds: boolean;
    ignoreHeader: boolean;
};

export type SelectionInfo =
    | { type: "none" }
    | {
        type: "element";
        id: string;
        additionalIds: string[];
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

export type EditActionDeleteParam = {
    elementId: string;   
    backspace?: boolean; 
}

export type EditActionSetParam = {
    elementId: string;
    attribute: string;
    value: string;
};

export type EditActionInsertParam = {
    elementName: string;
    elementId: string;
    insertMode: "insertAfter" | "inserBefore" | "appendChild" | "appenchChildNoDuplicate";
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
export type EditActionNavigationParam = {
    elementId: string;
    direction: number;
};
export type EditActionPropertiesParam =
    | Record<string, never>
    | {
        scoreDef: string;
    };

export type EditActionChainStep = {
    action: "delete" | "insert" | "insertControl" | "set" | "commit";
    param?: EditActionDeleteParam | EditActionSetParam | EditActionInsertParam | EditActionInsertControlParam| EditActionCommitParam;
};

export type EditActionChainParam = EditActionChainStep[];
export type EditActionParam =
    | EditActionDeleteParam
    | EditActionSetParam
    | EditActionInsertParam
    | EditActionInsertControlParam
    | EditActionChainParam
    | EditActionCommitParam
    | EditActionContextParam
    | EditActionNavigationParam
    | EditActionPropertiesParam;

export type EditAction = {
    action: EditActionName;
    param?: EditActionParam;
};
