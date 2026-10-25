export type SelectElementHandler = (id: string) => void | Promise<void>;
export type HoverElementHandler = (id: string | null) => void;
export type EditActionSetHandler = (param: EditActionSetParam, commit: boolean) => void;
export type EditActionDragHandler = (
    param: EditActionDragParam,
) => void | Promise<void>;
export type ActionHandler = () => void;

export type ActionValueType = "text" | "number";
export type AppActionKey =
    | "open-staff-def"
    | "open-staff-groups"
    | "open-key-signature"
    | "open-meter-signature"
    | "open-header-footer";
export type ScoreDefinitionUpdate = "scoreDef" | "staffGrp" | "staffDef" | "keySig" | "meterSig";

export type ActionMetadata = {
    appAction?: AppActionKey;
    dialog?: string;
    dialogValue?: string | number;
    valueType?: ActionValueType;
    redoLayout?: boolean;
    requiredSelectionId?: string;
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
        autoBeam: boolean;
    } | null;
    invalidLayout: boolean | null;
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
    | EditActionDragParam
    | EditActionInsertParam
    | EditActionInsertControlParam
    | EditActionInsertCursorByDurParam
    | EditActionInsertCursorByPitchParam
    | EditActionInsertCursorByTypeParam
    | EditActionInsertCursorContainerParam
    | EditActionInsertMeasureParam
    | EditActionInsertScoreDefParam
    | EditActionInsertNoteParam
    | EditActionInsertRestParam
    | EditActionKeyDownParam
    | EditActionNavigationParam
    | EditActionPropertiesParam
    | EditActionResetCursorParam
    | EditActionResetCursorContainerParam
    | EditActionGetScoreDefParam
    | EditActionSetScoreDefParam
    | EditActionGetScoreDefKeySigParam
    | EditActionSetScoreDefKeySigParam
    | EditActionGetScoreDefMeterSigParam
    | EditActionSetScoreDefMeterSigParam
    | EditActionGetScoreDefStaffGrpParam
    | EditActionSetScoreDefStaffGrpParam
    | EditActionGetScoreDefStaffDefParam
    | EditActionSetScoreDefStaffDefParam
    | EditActionSelectParam
    | EditActionSetParam
    | EditActionSetCursorParam
    | EditActionUpdateCursorParam
    | EditActionUpdatePitchParam
    | EditActionUpdateScoreDefParam;

export type EditAction =
    | EditActionChain
    | EditActionCommit
    | EditActionContext
    | EditActionDelete
    | EditActionDrag
    | EditActionInsert
    | EditActionInsertControl
    | EditActionInsertCursorByDur
    | EditActionInsertCursorByPitch
    | EditActionInsertCursorByType
    | EditActionInsertCursorContainer
    | EditActionInsertMeasure
    | EditActionInsertNote
    | EditActionInsertRest
    | EditActionKeyDown
    | EditActionNavigate
    | EditActionProperties   
    | EditActionRedo 
    | EditActionResetCursor
    | EditActionResetCursorContainer
    | EditActionGetScoreDef
    | EditActionSetScoreDef
    | EditActionGetScoreDefKeySig
    | EditActionSetScoreDefKeySig
    | EditActionGetScoreDefMeterSig
    | EditActionSetScoreDefMeterSig
    | EditActionGetScoreDefStaffGrp
    | EditActionSetScoreDefStaffGrp
    | EditActionGetScoreDefStaffDef
    | EditActionSetScoreDefStaffDef
    | EditActionSelect
    | EditActionSet
    | EditActionSetCursor
    | EditActionUndo
    | EditActionUpdateCursor
    | EditActionUpdatePitch
    | EditActionUpdateScoreDef;

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

export type EditActionDrag = {
    action: "drag";
    param: EditActionDragParam;
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

export type EditActionInsertCursorByType = {
    action: "insertCursorByType";
    param: EditActionInsertCursorByTypeParam;
};

export type EditActionInsertCursorContainer = {
    action: "insertCursorContainer";
    param: EditActionInsertCursorContainerParam;
};

export type EditActionInsertMeasure = {
    action: "insertMeasure";
    param: EditActionInsertMeasureParam;
};

export type EditActionInsertScoreDef = {
    action: "insertScoreDef";
    param: EditActionInsertScoreDefParam;
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

export type EditActionRedo = {
    action: "redo";
};

export type EditActionResetCursor = {
    action: "resetCursor";
    param: EditActionResetCursorParam;
};

export type EditActionResetCursorContainer = {
    action: "resetCursorContainer";
    param: EditActionResetCursorContainerParam;
};

export type EditActionGetScoreDef = {
    action: "getScoreDef";
    param: EditActionGetScoreDefParam;
};

export type EditActionSetScoreDef = {
    action: "setScoreDef";
    param: EditActionSetScoreDefParam;
};

export type EditActionGetScoreDefKeySig = {
    action: "getScoreDefKeySig";
    param: EditActionGetScoreDefKeySigParam;
};

export type EditActionSetScoreDefKeySig = {
    action: "setScoreDefKeySig";
    param: EditActionSetScoreDefKeySigParam;
};

export type EditActionGetScoreDefMeterSig = {
    action: "getScoreDefMeterSig";
    param: EditActionGetScoreDefMeterSigParam;
};

export type EditActionSetScoreDefMeterSig = {
    action: "setScoreDefMeterSig";
    param: EditActionSetScoreDefMeterSigParam;
};

export type EditActionGetScoreDefStaffGrp = {
    action: "getScoreDefStaffGrp";
    param: EditActionGetScoreDefStaffGrpParam;
};

export type EditActionSetScoreDefStaffGrp = {
    action: "setScoreDefStaffGrp";
    param: EditActionSetScoreDefStaffGrpParam;
};

export type EditActionGetScoreDefStaffDef = {
    action: "getScoreDefStaffDef";
    param: EditActionGetScoreDefStaffDefParam
};

export type EditActionSetScoreDefStaffDef = {
    action: "setScoreDefStaffDef";
    param: EditActionSetScoreDefStaffDefParam;
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

export type EditActionUpdateScoreDef = {
    action: "updateScoreDef";
    param: EditActionUpdateScoreDefParam;
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

export type EditActionDragParam =
    | { phase: "start" }
    | { phase: "move"; dx: number; dy: number }
    | { phase: "end" };

export type EditActionDragMoveParam = Extract<
    EditActionDragParam,
    { phase: "move" }
>;

export type EditActionInsertParam = {
    elementName: string;
    elementId: string;
    insertMode:
        | "insertAfter"
        | "insertBefore"
        | "inserBefore"
        | "appendChild"
        | "appendChildNoDuplicate";
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
    midi?: number;
};

export type EditActionInsertCursorByTypeParam = {
    type: "copy" | "tie" | "rest" | "note";
};

export type EditActionInsertCursorContainerParam = {
    container: "tuplet" | "beam" | "graceGrp";
};

export type EditActionInsertMeasureParam = {
    elementId?: string;
    number: number;
    insertBefore?: boolean;
};

export type EditActionInsertScoreDefParam = {
    elementId?: string;
    insertBefore?: boolean;
};

export type EditActionInsertNoteParam = {
    elementId: string;
    pname: string;
    oct: number;
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
        scoreDef: TreeNodeData;
    };

export type EditActionResetCursorParam = {
    maintainChordMode?: boolean;
};

export type EditActionResetCursorContainerParam = {
    container: "tuplet" | "beam" | "graceGrp";
};

export type EditActionGetScoreDefParam = {
    scoreDefId: string;
};

export type EditActionSetScoreDefParam = {
    subTree: TreeNodeData;
    scoreDefId: string;
};

export type EditActionGetScoreDefKeySigParam = {
    scoreDefId: string;
};

export type EditActionSetScoreDefKeySigParam = {
    subTree: TreeNodeData;
    scoreDefId: string;
};

export type EditActionGetScoreDefMeterSigParam = {
    scoreDefId: string;
};

export type EditActionSetScoreDefMeterSigParam = {
    subTree: TreeNodeData;
    scoreDefId: string;
};

export type EditActionGetScoreDefStaffGrpParam = {
    scoreDefId: string;
};

export type EditActionSetScoreDefStaffGrpParam = {
    subTree: TreeNodeData;
    scoreDefId: string;
};

export type EditActionGetScoreDefStaffDefParam = {
    staffId: string;
}

export type EditActionSetScoreDefStaffDefParam = {
    subTree: TreeNodeData;
    staffId: string;
};

export type EditActionSelectParam = {
    elementId: string;
    secondary?: boolean;
    custom?: "note" | "staff" | "textParent";
};

export type EditActionSetParam = {
    elementId: string;
    attribute: string;
    value: string;
};

export type EditActionSetCursorParam = {
    elementId?: string;
    inputMode: "pitchFirst" | "durationFirst" | "combined";
    chordMode: boolean;
    restMode?: boolean;
    autoBeam: boolean;
}

export type EditActionUndo = {
    action: "undo";
};

export type EditActionUpdateCursorParam = {
    restMode?: boolean;
    chordMode?: boolean;
    tieMode?: string;
    autoBeam?: boolean;
}

export type EditActionUpdatePitchParam = {
    elementId: string;
    pname?: string;
    oct?: number;
    accid?: string;
    midi?: number;
}

export type EditActionUpdateScoreDefParam = {
    elementId?: string;
    top?: string;
    bottom?: string;
    update:
        | "insertAbove"
        | "insertBelow"
        | "insertLayer"
        | "deleteStaff"
        | "moveUp"
        | "moveDown"
        | "addStaffGroup"
        | "removeStaffGroup"
        | "editStaffDefinition";
};
