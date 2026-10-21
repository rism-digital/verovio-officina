export const actionCatalog = {
    measure: [
        {
            name: "Insert one measure before",
            action: "add-measure-before",
        },
        {
            name: "Insert one measure after",
            action: "add-measure-after",
        },
        {
            name: "Insert score definition before",
            action: "add-score-definition-before",
        },
        {
            name: "Insert score definition after",
            action: "add-score-definition-after",
        },
    ],
    note: [
        {
            name: "Add accidental",
            action: "add-accidental",
        },
        {
            name: "Add articulation",
            action: "add-articulation",
        },
        {
            name: "Add dir",
            action: "add-dir",
            dialog: "enter-value",
        },
        {
            name: "Add tempo",
            action: "add-tempo",
            dialog: "enter-value",
        },
        {
            name: "Add ornament",
            submenu: [
                {
                    name: "Add ornam",
                    action: "add-ornam",
                },
                {
                    name: "Add trill",
                    action: "add-trill",
                },
            ],
        },
    ],
    rest: [
        {
            name: "Add dir",
            action: "add-dir",
            dialog: "enter-value",
        },
        {
            name: "Add tempo",
            action: "add-tempo",
            dialog: "enter-value",
        },
        {
            name: "Delete",
            action: "delete",
        },
    ],
    scoreDef: [
        {
            name: "Staff group properties",
            action: "open-staff-groups",
            appAction: "open-staff-groups",
        },
        {
            name: "Key signature",
            action: "open-key-signature",
            appAction: "open-key-signature",
        },
        {
            name: "Meter signature",
            action: "open-meter-signature",
            appAction: "open-meter-signature",
        },
    ],
    staff: [
        
        {
            name: "Add staff above",
            action: "add-staff-above",
        },
        {
            name: "Add staff below",
            action: "add-staff-below",
        },
        {
            name: "Delete staff",
            action: "delete-staff",
        },
        {
            separator: true,
        },
        {
            name: "Move staff up",
            action: "move-staff-up",
        },
        {
            name: "Move staff down",
            action: "move-staff-down",
        },
        {
            separator: true,
        },
        {
            name: "Add staff group",
            action: "add-staff-group-disabled",
        },
        {
            name: "Remove staff group",
            action: "remove-staff-group-diabled",
        },
        {
            name: "Edit staff definition",
            action: "edit-staff-definition",
            appAction: "open-staff-def",
        },
    ],
};

const controlEventPlace = [
    { name: "Place above", action: "set-place-above", icon: "icons/editor/place-above.png" },
    { name: "Place auto", action: "set-place-auto", icon: "icons/editor/place-auto.png" },
    { name: "Place below", action: "set-place-below", icon: "icons/editor/place-below.png" },
]

const insertControlEvent = [
    { name: "Add hairpin", action: "add-hairpin", icon: "icons/mei/hairpin.png", secondary: true },
    { name: "Add slur", action: "add-slur", icon: "icons/mei/slur.png", secondary: true },
]

export const contextButtonBars = {
    note: [
        {
            label: "Accidentals",
            actions: [
                { name: "Add flat", action: "add-accidental-flat", icon: "icons/editor/accid-flat.png" },
                { name: "Add natural", action: "add-accidental-natural", icon: "icons/editor/accid-natural.png" },
                { name: "Add sharp", action: "add-accidental-sharp", icon: "icons/editor/accid-sharp.png" },
            ],
        },
        {
            label: "Articulations",
            actions: [
                { name: "Accent", action: "add-articulation-acc", icon: "icons/editor/artic-E4A0.png" },
                { name: "Soft accent", action: "add-articulation-acc-soft", icon: "icons/editor/artic-ED40.png" },
                { name: "Staccato", action: "add-articulation-stacc", icon: "icons/editor/artic-E4A2.png" },
                { name: "Tenuto", action: "add-articulation-ten", icon: "icons/editor/artic-E4A4.png" },
                { name: "Staccatissimo", action: "add-articulation-stacciss", icon: "icons/editor/artic-E4A8.png" },
                { name: "Marcato", action: "add-articulation-marc", icon: "icons/editor/artic-E4AC.png" },
                { name: "Spiccato", action: "add-articulation-spicc", icon: "icons/editor/artic-E4A6.png" },
                { name: "Down bow", action: "add-articulation-dnbow", icon: "icons/editor/artic-E610.png" },
                { name: "Up bow", action: "add-articulation-upbow", icon: "icons/editor/artic-E612.png" },
                { name: "Harmonic", action: "add-articulation-harm", icon: "icons/editor/artic-E614.png" },
                { name: "Snap pizzicato", action: "add-articulation-snap", icon: "icons/editor/artic-E631.png" },
                { name: "Fingernail", action: "add-articulation-fingernail", icon: "icons/editor/artic-E636.png" },
                { name: "Damp", action: "add-articulation-damp", icon: "icons/editor/artic-E638.png" },
                { name: "Damp all", action: "add-articulation-dampall", icon: "icons/editor/artic-E639.png" },
                { name: "Open", action: "add-articulation-open", icon: "icons/editor/artic-E5E7.png" },
                { name: "Stopped", action: "add-articulation-stop", icon: "icons/editor/artic-E5E5.png" },
                { name: "Left-hand pizzicato", action: "add-articulation-lhpizz", icon: "icons/editor/artic-E633.png" },
                { name: "Dot", action: "add-articulation-dot", icon: "icons/editor/artic-E4A2.png" },
                { name: "Stroke", action: "add-articulation-stroke", icon: "icons/editor/artic-E4AA.png" },
            ],
        },
        {
            label: "Ornaments",
            actions: [
                { name: "Add trill", action: "add-trill", icon: "icons/mei/trill.png" },
                { name: "Add mordent", action: "add-mordent", icon: "icons/mei/mordent.png" },
            ],
        },
        {
            label: "Annotations",
            actions: [
                { name: "Add fing", action: "add-fing", icon: "icons/mei/fing.png", dialog: "enter-value" },
                { name: "Add dir", action: "add-dir", icon: "icons/mei/dir.png", dialog: "enter-value" },
                { name: "Add tempo", action: "add-tempo", icon: "icons/mei/tempo.png", dialog: "enter-value" },
            ],
        },
        {
            label: "Stem",
            actions: [
                { name: "Stem auto", action: "set-stem-auto", icon: "icons/editor/stem-dir-auto.png" },
                { name: "Stem down", action: "set-stem-down", icon: "icons/editor/stem-dir-down.png" },
                { name: "Stem up", action: "set-stem-up", icon: "icons/editor/stem-dir-up.png" },
            ],
        },
        { label: "Control events", actions: insertControlEvent },
    ],
    dir: [
        { label: "Placement", actions: controlEventPlace },
    ],
    dynam: [
        { label: "Placement", actions: controlEventPlace },
    ],
    fing: [
        { label: "Placement", actions: controlEventPlace },
    ],
    tempo: [
        { label: "Placement", actions: controlEventPlace },
    ],
    hairpin: [
        { label: "Placement", actions: controlEventPlace },
    ],
    mordent: [
        { label: "Placement", actions: controlEventPlace },
    ],
    rest: [
        {
            label: "Annotations",
            actions: [
                { name: "Add dir", action: "add-dir", icon: "icons/mei/dir.png", dialog: "enter-value" },
                { name: "Add tempo", action: "add-tempo", icon: "icons/mei/tempo.png", dialog: "enter-value" },
            ],
        },
    ],
    trill: [
        { label: "Placement", actions: controlEventPlace },
    ]
};

export const menuActions = [
    { name: "At the end of the score", action: "add-measures-end", dialog: "enter-value", valueType: "number", redoLayout: true },
]

const createAddArticulationAction = (value) => ({
    action: "chain",
    param: [
        {
            action: "insert",
            param: {
                elementName: "artic",
                elementId: "[selection-id]",
                insertMode: "appendChild",
            },
        },
        {
            action: "set",
            param: {
                elementId: "[chained-id]",
                attribute: "artic",
                value,
            },
        },
        {
            action: "commit",
        },
    ],
});

export const actionDefinitions = {
    "open-staff-groups": {
        action: "getScoreDefStaffGrp",
        param: {
            selected: true,
        },
    },
    "open-key-signature": {
        action: "getScoreDefKeySig",
        param: {
            selected: true,
        },
    },
    "open-meter-signature": {
        action: "getScoreDefMeterSig",
        param: {
            selected: true,
        },
    },
    "add-staff-above": {
        action: "chain",
        param: [
            {
                action: "updateScoreDef",
                param: {
                    update: "insertAbove",
                    elementId: "[selection-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-staff-below": {
        action: "chain",
        param: [
            {
                action: "updateScoreDef",
                param: {
                    update: "insertBelow",
                    elementId: "[selection-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "delete-staff": {
        action: "chain",
        param: [
            {
                action: "updateScoreDef",
                param: {
                    update: "deleteStaff",
                    elementId: "[selection-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "edit-staff-definition": {
        action: "getStaffDef",
    },
    "move-staff-up": {
        action: "chain",
        param: [
            {
                action: "updateScoreDef",
                param: {
                    update: "moveUp",
                    elementId: "[selection-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "move-staff-down": {
        action: "chain",
        param: [
            {
                action: "updateScoreDef",
                param: {
                    update: "moveDown",
                    elementId: "[selection-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-staff-group": {
        action: "chain",
        param: [
            {
                action: "updateScoreDef",
                param: {
                    update: "addStaffGroup",
                    top: "[selection-id]",
                    bottom: "[selection-secondary-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "remove-staff-group": {
        action: "chain",
        param: [
            {
                action: "updateScoreDef",
                param: {
                    update: "removeStaffGroup",
                    elementId: "[selection-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-accidental-flat": {
        action: "chain",
        param: [
            {
                action: "insert",
                param: {
                    elementName: "accid",
                    elementId: "[selection-id]",
                    insertMode: "appendChildNoDuplicate",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "accid",
                    value: "f",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-accidental-natural": {
        action: "chain",
        param: [
            {
                action: "insert",
                param: {
                    elementName: "accid",
                    elementId: "[selection-id]",
                    insertMode: "appendChildNoDuplicate",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "accid",
                    value: "n",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-accidental-sharp": {
        action: "chain",
        param: [
            {
                action: "insert",
                param: {
                    elementName: "accid",
                    elementId: "[selection-id]",
                    insertMode: "appendChildNoDuplicate",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "accid",
                    value: "s",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-articulation": createAddArticulationAction("acc"),
    "add-articulation-acc": createAddArticulationAction("acc"),
    "add-articulation-acc-soft": createAddArticulationAction("acc_soft"),
    "add-articulation-stacc": createAddArticulationAction("stacc"),
    "add-articulation-ten": createAddArticulationAction("ten"),
    "add-articulation-stacciss": createAddArticulationAction("stacciss"),
    "add-articulation-marc": createAddArticulationAction("marc"),
    "add-articulation-spicc": createAddArticulationAction("spicc"),
    "add-articulation-dnbow": createAddArticulationAction("dnbow"),
    "add-articulation-upbow": createAddArticulationAction("upbow"),
    "add-articulation-harm": createAddArticulationAction("harm"),
    "add-articulation-snap": createAddArticulationAction("snap"),
    "add-articulation-fingernail": createAddArticulationAction("fingernail"),
    "add-articulation-damp": createAddArticulationAction("damp"),
    "add-articulation-dampall": createAddArticulationAction("dampall"),
    "add-articulation-open": createAddArticulationAction("open"),
    "add-articulation-stop": createAddArticulationAction("stop"),
    "add-articulation-lhpizz": createAddArticulationAction("lhpizz"),
    "add-articulation-dot": createAddArticulationAction("dot"),
    "add-articulation-stroke": createAddArticulationAction("stroke"),
    "add-hairpin": {
        action: "chain",
        param: [
            {
                action: "insertControl",
                param: {
                    elementName: "hairpin",
                    startId: "[selection-id]",
                    endId: "[selection-secondary-id]",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "form",
                    value: "dim",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-ornam": {
        action: "chain",
        param: [
            {
                action: "insertControl",
                param: {
                    elementName: "mordent",
                    startId: "[selection-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-slur": {
        action: "chain",
        param: [
            {
                action: "insertControl",
                param: {
                    elementName: "slur",
                    startId: "[selection-id]",
                    endId: "[selection-secondary-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-trill": {
        action: "chain",
        param: [
            {
                action: "insertControl",
                param: {
                    elementName: "trill",
                    startId: "[selection-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-mordent": {
        action: "chain",
        param: [
            {
                action: "insertControl",
                param: {
                    elementName: "mordent",
                    startId: "[selection-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-fing": {
        action: "chain",
        param: [
            {
                action: "insertControl",
                param: {
                    elementName: "fing",
                    startId: "[selection-id]",
                },
            },
            {
                action: "insert",
                param: {
                    elementName: "text",
                    elementId: "[chained-id]",
                    insertMode: "appendChild",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "text",
                    value: "{{dialogValue}}",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-dir": {
        action: "chain",
        param: [
            {
                action: "insertControl",
                param: {
                    elementName: "dir",
                    startId: "[selection-id]",
                },
            },
            {
                action: "insert",
                param: {
                    elementName: "text",
                    elementId: "[chained-id]",
                    insertMode: "appendChild",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "text",
                    value: "{{dialogValue}}",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-tempo": {
        action: "chain",
        param: [
            {
                action: "insertControl",
                param: {
                    elementName: "tempo",
                    startId: "[selection-id]",
                },
            },
            {
                action: "insert",
                param: {
                    elementName: "text",
                    elementId: "[chained-id]",
                    insertMode: "appendChild",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "text",
                    value: "{{dialogValue}}",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "delete": {
        action: "chain",
        param: [
            {
                action: "delete",
                param: {
                    elementId: "[selection-id]"
                },
            },
            {
                action: "commit",
            },
        ], 
    },
    "delete-backspace": {
        action: "chain",
        param: [
            {
                action: "delete",
                param: {
                    elementId: "[selection-id]",
                    backspace: true,
                },
            },
            {
                action: "commit",
            },
        ], 
    },
    "set-stem-auto": {
        action: "chain",
        param: [
            {
                action: "set",
                param: {
                    elementId: "[selection-id]",
                    attribute: "stem.dir",
                    value: "",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "set-stem-down": {
        action: "chain",
        param: [
            {
                action: "set",
                param: {
                    elementId: "[selection-id]",
                    attribute: "stem.dir",
                    value: "down",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "set-stem-up": {
        action: "chain",
        param: [
            {
                action: "set",
                param: {
                    elementId: "[selection-id]",
                    attribute: "stem.dir",
                    value: "up",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "set-place-auto": {
        action: "chain",
        param: [
            {
                action: "set",
                param: {
                    elementId: "[selection-id]",
                    attribute: "place",
                    value: "",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "set-place-above": {
        action: "chain",
        param: [
            {
                action: "set",
                param: {
                    elementId: "[selection-id]",
                    attribute: "place",
                    value: "above",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "set-place-below": {
        action: "chain",
        param: [
            {
                action: "set",
                param: {
                    elementId: "[selection-id]",
                    attribute: "place",
                    value: "below",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-measures-end": {
        action: "chain",
        param: [
            {
                action: "insertMeasure",
                param: {
                    number: "{{dialogValue}}",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-measure-before": {
        action: "chain",
        param: [
            {
                action: "insertMeasure",
                param: {
                    elementId: "[selection-id]",
                    number: 1,
                    insertBefore: true,
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-measure-after": {
        action: "chain",
        param: [
            {
                action: "insertMeasure",
                param: {
                    elementId: "[selection-id]",
                    number: 1,
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-score-definition-before": {
        action: "chain",
        param: [
            {
                action: "insertScoreDef",
                param: {
                    elementId: "[selection-id]",
                    insertBefore: true,
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-score-definition-after": {
        action: "chain",
        param: [
            {
                action: "insertScoreDef",
                param: {
                    elementId: "[selection-id]",
                    number: 1,
                },
            },
            {
                action: "commit",
            },
        ],
    }
};
