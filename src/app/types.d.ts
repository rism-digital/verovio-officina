export type Mode = 'edit' | 'insert';

export type SelectElementHandler = (id: string) => void | Promise<void>;
export type HoverElementHandler = (id: string | null) => void;
export type EditActionSetHandler = (param: EditActionSetParam, commit: boolean) => void;
export type ActionHandler = () => void;

export type ActionValueType = "text" | "number";

export type ActionMetadata = {
    dialog?: string;
    dialogValue?: string | number;
    valueType?: ActionValueType;
    redoLayout?: boolean;
};

export type Action = ActionMetadata & {
    action: EditActionName;
    label: string;
    param?: EditActionParam;
    actionKey?: string;
};

export type TargetedContextAction = Action & {
    targetId: string;
    targetElement: string;
};

export type TargetedContextActionHandler = (action: TargetedContextAction) => void;

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

export interface ViewModel {
    svg: string;
    svgId: number;
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

export interface EditStatus {
    chainedId: string;
    canUndo: boolean;
    canRedo: boolean;
    isMensuralMusicOnly: boolean;
    selection: {
        id: string;
        element: string;
        secondaryId?: string;
    } | null;
}

export interface ReferenceObject extends TreeNodeData {
    referenceAttribute: string;
}

export interface EditResponseContent {
    ancestors: TreeNodeData[];
    context: TreeNodeData;
    object: TreeNodeData;
    referencedElements: ReferenceObject[];
    referringElements: ReferenceObject[];
}

// Action names and params

export type EditAction = {
    action: EditActionName;
    param?: EditActionParam;
};

export type EditActionName =
    | "delete"
    | "insert"
    | "insertControl"
    | "insertMeasure"
    | "insertNote"    
    | "select"
    | "set"
    | "commit"
    | "chain"
    | "context"
    | "properties"
    | "navigate";

export type EditActionParam =
    | EditActionChainParam
    | EditActionContextParam
    | EditActionDeleteParam
    | EditActionInsertParam
    | EditActionInsertControlParam
    | EditActionInsertMeasureParam
    | EditActionInsertNoteParam
    | EditActionNavigationParam
    | EditActionPropertiesParam
    | EditActionSelectParam
    | EditActionSetParam;

// ActionParams

export type EditActionContextParam = {
    elementId: string;
};

export type EditActionDeleteParam = {
    elementId: string;   
    backspace?: boolean; 
}

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

export type EditActionInsertMeasureParam = {
    elementId?: string;
    number: number;
    insertMode?: string;
};

export type EditActionInsertNoteParam = {
    elementName: string;
    startId: string;
    endId?: string;
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

export type EditActionSelectParam = {
    elementId: string;
    secondary?: boolean;
};

export type EditActionSetParam = {
    elementId: string;
    attribute: string;
    value: string;
};

// Chained action

export type EditActionChainStep = {
    action: EditActionName;
    param?: EditActionParam;
};

export type EditActionChainParam = EditActionChainStep[];
