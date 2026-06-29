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
    insertMode: boolean;
    selection: {
        id: string;
        element: string;
        secondaryId?: string;
    } | null;
    insertion: {
        chordMode: boolean;
        restMode: boolean;
        pname: string;
        oct: number;
        dots: number;
        accid: string;
        accidImplicit: boolean;
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
    | EditActionInsertCursorByDurParam
    | EditActionInsertCursorByPitchParam
    | EditActionInsertMeasureParam
    | EditActionInsertNoteParam
    | EditActionInsertRestParam
    | EditActionKeyDownParam
    | EditActionNavigationParam
    | EditActionPropertiesParam
    | EditActionResetCursorParam
    | EditActionSelectParam
    | EditActionSetParam
    | EditActionSetCursorParam
    | EditActionUpdateCursorParam
    | EditActionUpdatePitchParam;

export type EditAction =
    | EditActionChain
    | EditActionCommit
    | EditActionContext
    | EditActionDelete
    | EditActionInsert
    | EditActionInsertControl
    | EditActionInsertCursorByDur
    | EditActionInsertCursorByPitch
    | EditActionInsertMeasure
    | EditActionInsertNote
    | EditActionInsertRest
    | EditActionKeyDown
    | EditActionNavigate
    | EditActionProperties    
    | EditActionResetCursor
    | EditActionSelect
    | EditActionSet
    | EditActionSetCursor
    | EditActionUpdateCursor
    | EditActionUpdatePitch;

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

export type EditActionInsertCursorByDur = {
    action: "insertCursorByDur";
    param: EditActionInsertCursorByDurParam;
};

export type EditActionInsertCursorByPitch = {
    action: "insertCursorByPitch";
    param: EditActionInsertCursorByPitchParam;
};

export type EditActionInsertMeasure = {
    action: "insertMeasure";
    param: EditActionInsertMeasureParam;
};

export type EditActionInsertNote = {
    action: "insertNote";
    param: EditActionInsertNoteParam;
};

export type EditActionInsertRest = {
    action: "insertRest";
    param: EditActionInsertRestParam;
};

export type EditActionKeyDown = {
    action: "keyDown";
    param: EditActionKeyDownParam;
};

export type EditActionNavigate = {
    action: "navigate";
    param: EditActionNavigationParam;
};

export type EditActionProperties = {
    action: "properties";
    param: EditActionPropertiesParam;
};

export type EditActionResetCursor = {
    action: "resetCursor";
    param: EditActionResetCursorParam;
};

export type EditActionSelect = {
    action: "select";
    param: EditActionSelectParam;
};

export type EditActionSet = {
    action: "set";
    param: EditActionSetParam;
};

export type EditActionSetCursor = {
    action: "setCursor";
    param: EditActionSetCursorParam;
};

export type EditActionUpdateCursor = {
    action: "updateCursor";
    param: EditActionUpdateCursorParam;
};

export type EditActionUpdatePitch = {
    action: "updatePitch";
    param: EditActionUpdatePitchParam;
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

export type EditActionInsertCursorByDurParam = {
    dur: string;
    dots?: number;
};

export type EditActionInsertCursorByPitchParam = {
    pname?: string;
    oct?: number;
    accid?: string;
};

export type EditActionInsertMeasureParam = {
    elementId?: string;
    number: number;
    insertBefore?: boolean;
};

export type EditActionInsertNoteParam = {
    elementId: string;
    pname?: string;
    oct?: number;
    accid?: string;
    accidGes?: string;
    dur?: string
    dots?: number;
    chordMode?: boolean;
};

export type EditActionInsertRestParam = {
    elementId: string;
    dur: string;
    dots?: number;
};

export type EditActionKeyDownParam = {
    elementId: string;
    key: number;
    shiftKey?: boolean;
    ctrlKey?: boolean;
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

export type EditActionResetCursorParam = {
    maintainChordMode?: boolean;
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

export type EditActionSetCursorParam = {
    elementId?: string;
    inputMode: "pitchFirst" | "durationFirst";
    chordMode: boolean;
    restMode?: boolean;
}

export type EditActionUpdateCursorParam = {
    restMode?: boolean;
    chordMode?: boolean;
}

export type EditActionUpdatePitchParam = {
    elementId: string;
    pname?: string;
    oct?: number;
    accid?: string;
    midi?: number;
}
