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

export type Action = ActionMetadata & EditAction & {
    label: string;
    actionKey?: string;
};

export type TargetedContextAction = Action & {
    targetId: string;
    targetElement: string;
};

export type TargetedContextActionHandler = (action: TargetedContextAction) => void;

export type ContextMenuItem = EditAction & {
    label: string;
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

// Action param and action unions

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

export type EditAction =
    | EditActionChain
    | EditActionCommit
    | EditActionContext
    | EditActionDelete
    | EditActionInsert
    | EditActionInsertControl
    | EditActionInsertMeasure
    | EditActionInsertNote
    | EditActionNavigate
    | EditActionProperties
    | EditActionSelect
    | EditActionSet;

// Actions

export type EditActionChain = {
    action: "chain";
    param: EditActionChainParam;
};

export type EditActionCommit = {
    action: "commit";
};

export type EditActionContext = {
    action: "context";
    param: EditActionContextParam;
};

export type EditActionDelete = {
    action: "delete";
    param: EditActionDeleteParam;
};

export type EditActionInsert = {
    action: "insert";
    param: EditActionInsertParam;
};

export type EditActionInsertControl = {
    action: "insertControl";
    param: EditActionInsertControlParam;
};

export type EditActionInsertMeasure = {
    action: "insertMeasure";
    param: EditActionInsertMeasureParam;
};

export type EditActionInsertNote = {
    action: "insertNote";
    param: EditActionInsertNoteParam;
};

export type EditActionNavigate = {
    action: "navigate";
    param: EditActionNavigationParam;
};

export type EditActionProperties = {
    action: "properties";
    param: EditActionPropertiesParam;
};

export type EditActionSelect = {
    action: "select";
    param: EditActionSelectParam;
};

export type EditActionSet = {
    action: "set";
    param: EditActionSetParam;
};

// ActionParams

export type EditActionChainParam = EditAction[];

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
    insertMode:
        | "insertAfter"
        | "insertBefore"
        | "inserBefore"
        | "appendChild"
        | "appendChildNoDuplicate"
        | "appenchChildNoDuplicate";
};

export type EditActionInsertControlParam = {
    elementName: string;
    startId: string;
    endId?: string;
};

export type EditActionInsertMeasureParam = {
    elementId?: string;
    number: number;
    insertBefore?: boolean;
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
