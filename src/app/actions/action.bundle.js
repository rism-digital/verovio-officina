export const actionCatalog = {
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
};

export const contextTools = {
    measure: [[
        {
            name: "Insert one measure before",
            action: "add-measure-before",
        },
        {
            name: "Insert one measure after",
            action: "add-measure-after",
        }
    ],
    [
        {
            name: "Insert score definition before",
            action: "add-score-definition-before",
        },
        {
            name: "Insert score definition after",
            action: "add-score-definition-after",
        },
    ]],
    scoreDef: [[
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
    ]],
    staff: [
        [
            {
                name: "Edit staff definition",
                action: "edit-staff-definition",
                appAction: "open-staff-def",
            },
        ],
        [
            [
                {
                    name: "Add staff above",
                    action: "add-staff-above",
                },
                {
                    name: "Add staff below",
                    action: "add-staff-below",
                },
            ],
            [
                {
                    name: "Move staff up",
                    action: "move-staff-up",
                },
                {
                    name: "Move staff down",
                    action: "move-staff-down",
                }
            ]
        ],
        [
            {
                name: "Delete staff",
                action: "delete-staff",
            },
        ]
    ],
};

const insertArticulations = [
    { name: "Accent", action: "add-articulation-acc", icon: "icons/editor/artic-E4A0.png" },
    { name: "Staccato", action: "add-articulation-stacc", icon: "icons/editor/artic-E4A2.png" },
    { name: "Tenuto", action: "add-articulation-ten", icon: "icons/editor/artic-E4A4.png" },
    { name: "Staccatissimo", action: "add-articulation-stacciss", icon: "icons/editor/artic-E4A8.png" },
    { name: "Marcato", action: "add-articulation-marc", icon: "icons/editor/artic-E4AC.png" },
    { name: "Spiccato", action: "add-articulation-spicc", icon: "icons/editor/artic-E4A6.png" },
    { name: "Down bow", action: "add-articulation-dnbow", icon: "icons/editor/artic-E610.png" },
]

const setArticulations = [
    { name: "Accent", action: "set-articulation-acc", icon: "icons/editor/artic-E4A0.png" },
    { name: "Soft accent", action: "set-articulation-acc-soft", icon: "icons/editor/artic-ED40.png" },
    { name: "Staccato", action: "set-articulation-stacc", icon: "icons/editor/artic-E4A2.png" },
    { name: "Tenuto", action: "set-articulation-ten", icon: "icons/editor/artic-E4A4.png" },
    { name: "Staccatissimo", action: "set-articulation-stacciss", icon: "icons/editor/artic-E4A8.png" },
    { name: "Marcato", action: "set-articulation-marc", icon: "icons/editor/artic-E4AC.png" },
    { name: "Spiccato", action: "set-articulation-spicc", icon: "icons/editor/artic-E4A6.png" },
    { name: "Down bow", action: "set-articulation-dnbow", icon: "icons/editor/artic-E610.png" },
    { name: "Up bow", action: "set-articulation-upbow", icon: "icons/editor/artic-E612.png" },
    { name: "Harmonic", action: "set-articulation-harm", icon: "icons/editor/artic-E614.png" },
    { name: "Snap pizzicato", action: "set-articulation-snap", icon: "icons/editor/artic-E631.png" },
    { name: "Fingernail", action: "set-articulation-fingernail", icon: "icons/editor/artic-E636.png" },
    { name: "Damp", action: "set-articulation-damp", icon: "icons/editor/artic-E638.png" },
    { name: "Damp all", action: "set-articulation-dampall", icon: "icons/editor/artic-E639.png" },
    { name: "Open", action: "set-articulation-open", icon: "icons/editor/artic-E5E7.png" },
    { name: "Stopped", action: "set-articulation-stop", icon: "icons/editor/artic-E5E5.png" },
    { name: "Left-hand pizzicato", action: "set-articulation-lhpizz", icon: "icons/editor/artic-E633.png" },
    { name: "Stroke", action: "set-articulation-stroke", icon: "icons/editor/artic-E4AA.png" },
]

const setMordentGlyphs = [
    { name: "Slide", action: "set-glyph-E5B0", icon: "icons/editor/mordent-E5B0.png" },
    { name: "Descending slide", action: "set-glyph-E5B1", icon: "icons/editor/mordent-E5B1.png" },
    { name: "Appoggiatura trill", action: "set-glyph-E5B2", icon: "icons/editor/mordent-E5B2.png" },
    { name: "Appoggiatura trill suffix", action: "set-glyph-E5B3", icon: "icons/editor/mordent-E5B3.png" },
    { name: "Turn trill (D'Anglebert)", action: "set-glyph-E5B4", icon: "icons/editor/mordent-E5B4.png" },
    { name: "Slide trill (D'Anglebert)", action: "set-glyph-E5B5", icon: "icons/editor/mordent-E5B5.png" },
    { name: "Slide trill (Marpurg)", action: "set-glyph-E5B6", icon: "icons/editor/mordent-E5B6.png" },
    { name: "Turn trill (Bach)", action: "set-glyph-E5B7", icon: "icons/editor/mordent-E5B7.png" },
    { name: "Slide trill (Bach)", action: "set-glyph-E5B8", icon: "icons/editor/mordent-E5B8.png" },
    { name: "Slide trill (Muffat)", action: "set-glyph-E5B9", icon: "icons/editor/mordent-E5B9.png" },
    { name: "Slide trill suffix (Muffat)", action: "set-glyph-E5BA", icon: "icons/editor/mordent-E5BA.png" },
    { name: "Trill suffix (Dandrieu)", action: "set-glyph-E5BB", icon: "icons/editor/mordent-E5BB.png" },
    { name: "Port de voix mordent", action: "set-glyph-E5BC", icon: "icons/editor/mordent-E5BC.png" },
    { name: "Trill with mordent", action: "set-glyph-E5BD", icon: "icons/editor/mordent-E5BD.png" },
    { name: "Cadence", action: "set-glyph-E5BE", icon: "icons/editor/mordent-E5BE.png" },
    { name: "Cadence with turn", action: "set-glyph-E5BF", icon: "icons/editor/mordent-E5BF.png" },
    { name: "Double cadence lower prefix", action: "set-glyph-E5C0", icon: "icons/editor/mordent-E5C0.png" },
    { name: "Cadence upper prefix", action: "set-glyph-E5C1", icon: "icons/editor/mordent-E5C1.png" },
    { name: "Cadence upper prefix turn", action: "set-glyph-E5C2", icon: "icons/editor/mordent-E5C2.png" },
    { name: "Double cadence upper prefix", action: "set-glyph-E5C3", icon: "icons/editor/mordent-E5C3.png" },
    { name: "Double cadence upper prefix turn", action: "set-glyph-E5C4", icon: "icons/editor/mordent-E5C4.png" },
    { name: "Mordent release", action: "set-glyph-E5C5", icon: "icons/editor/mordent-E5C5.png" },
    { name: "Mordent upper prefix", action: "set-glyph-E5C6", icon: "icons/editor/mordent-E5C6.png" },
    { name: "Inverted mordent upper prefix", action: "set-glyph-E5C7", icon: "icons/editor/mordent-E5C7.png" },
    { name: "Trill lower suffix", action: "set-glyph-E5C8", icon: "icons/editor/mordent-E5C8.png" },
]

const measureBarLines = [
    { name: "Dashed", value: "dashed", icon: "icons/editor/barline-E036.png" },
    { name: "Dotted", value: "dotted", icon: "icons/editor/barline-E037.png" },
    { name: "Double", value: "dbl", icon: "icons/editor/barline-E031.png" },
    { name: "Double dashed", value: "dbldashed", icon: "icons/editor/barline-dbldashed.png" },
    { name: "Double dotted", value: "dbldotted", icon: "icons/editor/barline-dbldotted.png" },
    { name: "Double heavy", value: "dblheavy", icon: "icons/editor/barline-E035.png" },
    { name: "Double segno", value: "dblsegno", icon: "icons/editor/barline-E04B.png" },
    { name: "End", value: "end", icon: "icons/editor/barline-E032.png" },
    { name: "Heavy", value: "heavy", icon: "icons/editor/barline-E034.png" },
    { name: "Invisible", value: "invis", icon: "icons/editor/barline-invis.png" },
    { name: "Repeat start", value: "rptstart", icon: "icons/editor/barline-E040.png" },
    { name: "Repeat both", value: "rptboth", icon: "icons/editor/barline-E042.png" },
    { name: "Repeat end", value: "rptend", icon: "icons/editor/barline-E041.png" },
    { name: "Single", value: "single", icon: "icons/editor/barline-E030.png" },
]

const createMeasureBarLineButtons = (attribute) => measureBarLines.map(
    ({ name, value, icon }) => ({
        name,
        action: `set-measure-${attribute}-${value}`,
        icon,
    }),
);

const setMeasureRightBarLines = createMeasureBarLineButtons("right");
const setMeasureLeftBarLines = createMeasureBarLineButtons("left");

const controlEventPlace = [
    { name: "Place above", action: "set-place-above", icon: "icons/editor/place-above.png" },
    { name: "Place auto", action: "set-place-auto", icon: "icons/editor/place-auto.png" },
    { name: "Place below", action: "set-place-below", icon: "icons/editor/place-below.png" },
]

const insertControlEvent = [
    { name: "Add hairpin", action: "add-hairpin", icon: "icons/mei/hairpin.png", secondary: true },
    { name: "Add slur", action: "add-slur", icon: "icons/mei/slur.png", secondary: true },
]

const insertDynamics = [
    { name: "p", action: "add-dynam-p", icon: "icons/editor/dynam-E520.png" },
    { name: "f", action: "add-dynam-f", icon: "icons/editor/dynam-E522.png" },
    { name: "mp", action: "add-dynam-mp", icon: "icons/editor/dynam-E52C.png" },
    { name: "mf", action: "add-dynam-mf", icon: "icons/editor/dynam-E52D.png" },
    { name: "pp", action: "add-dynam-pp", icon: "icons/editor/dynam-E52B.png" },
    { name: "ff", action: "add-dynam-ff", icon: "icons/editor/dynam-E52F.png" },
    { name: "sfz", action: "add-dynam-sfz", icon: "icons/editor/dynam-E539.png" }
]

const setDynamics = [
    { name: "p", action: "set-dynam-p", icon: "icons/editor/dynam-E520.png" },
    { name: "f", action: "set-dynam-f", icon: "icons/editor/dynam-E522.png" },
    { name: "mp", action: "set-dynam-mp", icon: "icons/editor/dynam-E52C.png" },
    { name: "mf", action: "set-dynam-mf", icon: "icons/editor/dynam-E52D.png" },
    { name: "pp", action: "set-dynam-pp", icon: "icons/editor/dynam-E52B.png" },
    { name: "ppp", action: "set-dynam-ppp", icon: "icons/editor/dynam-E52A.png" },
    { name: "pppp", action: "set-dynam-pppp", icon: "icons/editor/dynam-E529.png" },
    { name: "ppppp", action: "set-dynam-ppppp", icon: "icons/editor/dynam-E528.png" },
    { name: "pppppp", action: "set-dynam-pppppp", icon: "icons/editor/dynam-E527.png" },
    { name: "ff", action: "set-dynam-ff", icon: "icons/editor/dynam-E52F.png" },
    { name: "fff", action: "set-dynam-fff", icon: "icons/editor/dynam-E530.png" },
    { name: "ffff", action: "set-dynam-ffff", icon: "icons/editor/dynam-E531.png" },
    { name: "fffff", action: "set-dynam-fffff", icon: "icons/editor/dynam-E532.png" },
    { name: "ffffff", action: "set-dynam-ffffff", icon: "icons/editor/dynam-E533.png" },
    { name: "pf", action: "set-dynam-pf", icon: "icons/editor/dynam-E52E.png" },
    { name: "fp", action: "set-dynam-fp", icon: "icons/editor/dynam-E534.png" },
    { name: "fz", action: "set-dynam-fz", icon: "icons/editor/dynam-E535.png" },
    { name: "sf", action: "set-dynam-sf", icon: "icons/editor/dynam-E536.png" },
    { name: "sfp", action: "set-dynam-sfp", icon: "icons/editor/dynam-E537.png" },
    { name: "sfz", action: "set-dynam-sfz", icon: "icons/editor/dynam-E539.png" },
    { name: "sffz", action: "set-dynam-sffz", icon: "icons/editor/dynam-E53B.png" },
    { name: "rf", action: "set-dynam-rf", icon: "icons/editor/dynam-E53C.png" },
    { name: "rfz", action: "set-dynam-rfz", icon: "icons/editor/dynam-E53D.png" },
]

const stemPosition = [
    { name: "Stem auto", action: "set-stem-auto", icon: "icons/editor/stem-dir-auto.png" },
    { name: "Stem down", action: "set-stem-down", icon: "icons/editor/stem-dir-down.png" },
    { name: "Stem up", action: "set-stem-up", icon: "icons/editor/stem-dir-up.png" },
]

export const contextButtonBars = {
    measure: [
        { label: "Right bar line", actions: setMeasureRightBarLines },
        { label: "Left bar line", actions: setMeasureLeftBarLines },
    ],
    chord: [
        {
            label: "Stem",
            actions: stemPosition,
        },
        {
            label: "Articulations",
            actions: insertArticulations,
        },
    ],
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
            label: "Stem",
            actions: stemPosition,
        },
        {
            label: "Articulations",
            actions: insertArticulations,
        },
        {
            label: "Ornaments",
            actions: [
                { name: "Add trill", action: "add-trill", icon: "icons/mei/trill.png" },
                { name: "Add mordent", action: "add-mordent", icon: "icons/editor/mordent.png" },
                { name: "Add turn", action: "add-turn", icon: "icons/editor/turn-E567.png" },
                { name: "Add inverted turn", action: "add-turn-inverted", icon: "icons/editor/turn-E568.png" },
            ],
        },
        { label: "Dynamics", actions: insertDynamics },
        {
            label: "Punctual events",
            actions: [
                { name: "Add fing", action: "add-fing", icon: "icons/mei/fing.png", dialog: "enter-value" },
                { name: "Add dir", action: "add-dir", icon: "icons/mei/dir.png", dialog: "enter-value" },
                { name: "Add tempo", action: "add-tempo", icon: "icons/mei/tempo.png", dialog: "enter-value" },
            ],
        },
        { label: "Spanning events", actions: insertControlEvent },
    ],
    dir: [
        { label: "Placement", actions: controlEventPlace },
    ],
    artic: [
        { label: "Placement", actions: controlEventPlace },
        { label: "Articulations", actions: setArticulations },
    ],
    dynam: [
        { label: "Placement", actions: controlEventPlace },
        { label: "Dynamics", actions: setDynamics },
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
        { label: "Glyph", actions: setMordentGlyphs },
    ],
    rest: [
        { label: "Dynamics", actions: insertDynamics },
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

const createSetArticulationAction = (value) => ({
    action: "chain",
    param: [
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute: "artic",
                value,
            },
        },
        {
            action: "commit",
        },
    ],
});

const createSetGlyphAction = (glyphName) => ({
    action: "chain",
    param: [
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute: "glyph.name",
                value: glyphName,
            },
        },
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute: "glyph.auth",
                value: "smufl",
            },
        },
        {
            action: "commit",
        },
    ],
});

const createSetMeasureBarLineAction = (attribute, value) => ({
    action: "chain",
    param: [
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute,
                value,
            },
        },
        {
            action: "commit",
        },
    ],
});

const measureBarLineDefinitions = Object.fromEntries(
    ["right", "left"].flatMap((attribute) => measureBarLines.map(({ value }) => [
        `set-measure-${attribute}-${value}`,
        createSetMeasureBarLineAction(attribute, value),
    ])),
);

const createAddDynamicAction = (value) => ({
    action: "chain",
    param: [
        {
            action: "insertControl",
            param: {
                elementName: "dynam",
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
                value,
            },
        },
        {
            action: "commit",
        },
    ],
});

const createSetDynamicAction = (value) => ({
    action: "chain",
    param: [
        {
            action: "insert",
            param: {
                elementName: "text",
                elementId: "[selection-id]",
                insertMode: "appendChildNoDuplicate",
            },
        },
        {
            action: "set",
            param: {
                elementId: "[chained-id]",
                attribute: "text",
                value,
            },
        },
        {
            action: "commit",
        },
    ],
});

const setDynamicDefinitions = Object.fromEntries(
    setDynamics.map(({ name, action }) => [action, createSetDynamicAction(name)]),
);

const createAddTurnAction = (form) => ({
    action: "chain",
    param: [
        {
            action: "insertControl",
            param: {
                elementName: "turn",
                startId: "[selection-id]",
            },
        },
        {
            action: "set",
            param: {
                elementId: "[chained-id]",
                attribute: "form",
                value: form,
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
    "add-articulation-acc-soft": createAddArticulationAction("acc-soft"),
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
    "set-articulation-acc": createSetArticulationAction("acc"),
    "set-articulation-acc-soft": createSetArticulationAction("acc-soft"),
    "set-articulation-stacc": createSetArticulationAction("stacc"),
    "set-articulation-ten": createSetArticulationAction("ten"),
    "set-articulation-stacciss": createSetArticulationAction("stacciss"),
    "set-articulation-marc": createSetArticulationAction("marc"),
    "set-articulation-spicc": createSetArticulationAction("spicc"),
    "set-articulation-dnbow": createSetArticulationAction("dnbow"),
    "set-articulation-upbow": createSetArticulationAction("upbow"),
    "set-articulation-harm": createSetArticulationAction("harm"),
    "set-articulation-snap": createSetArticulationAction("snap"),
    "set-articulation-fingernail": createSetArticulationAction("fingernail"),
    "set-articulation-damp": createSetArticulationAction("damp"),
    "set-articulation-dampall": createSetArticulationAction("dampall"),
    "set-articulation-open": createSetArticulationAction("open"),
    "set-articulation-stop": createSetArticulationAction("stop"),
    "set-articulation-lhpizz": createSetArticulationAction("lhpizz"),
    "set-articulation-stroke": createSetArticulationAction("stroke"),
    "set-glyph-E5B0": createSetGlyphAction("ornamentPrecompSlide"),
    "set-glyph-E5B1": createSetGlyphAction("ornamentPrecompDescendingSlide"),
    "set-glyph-E5B2": createSetGlyphAction("ornamentPrecompAppoggTrill"),
    "set-glyph-E5B3": createSetGlyphAction("ornamentPrecompAppoggTrillSuffix"),
    "set-glyph-E5B4": createSetGlyphAction("ornamentPrecompTurnTrillDAnglebert"),
    "set-glyph-E5B5": createSetGlyphAction("ornamentPrecompSlideTrillDAnglebert"),
    "set-glyph-E5B6": createSetGlyphAction("ornamentPrecompSlideTrillMarpurg"),
    "set-glyph-E5B7": createSetGlyphAction("ornamentPrecompTurnTrillBach"),
    "set-glyph-E5B8": createSetGlyphAction("ornamentPrecompSlideTrillBach"),
    "set-glyph-E5B9": createSetGlyphAction("ornamentPrecompSlideTrillMuffat"),
    "set-glyph-E5BA": createSetGlyphAction("ornamentPrecompSlideTrillSuffixMuffat"),
    "set-glyph-E5BB": createSetGlyphAction("ornamentPrecompTrillSuffixDandrieu"),
    "set-glyph-E5BC": createSetGlyphAction("ornamentPrecompPortDeVoixMordent"),
    "set-glyph-E5BD": createSetGlyphAction("ornamentPrecompTrillWithMordent"),
    "set-glyph-E5BE": createSetGlyphAction("ornamentPrecompCadence"),
    "set-glyph-E5BF": createSetGlyphAction("ornamentPrecompCadenceWithTurn"),
    "set-glyph-E5C0": createSetGlyphAction("ornamentPrecompDoubleCadenceLowerPrefix"),
    "set-glyph-E5C1": createSetGlyphAction("ornamentPrecompCadenceUpperPrefix"),
    "set-glyph-E5C2": createSetGlyphAction("ornamentPrecompCadenceUpperPrefixTurn"),
    "set-glyph-E5C3": createSetGlyphAction("ornamentPrecompDoubleCadenceUpperPrefix"),
    "set-glyph-E5C4": createSetGlyphAction("ornamentPrecompDoubleCadenceUpperPrefixTurn"),
    "set-glyph-E5C5": createSetGlyphAction("ornamentPrecompMordentRelease"),
    "set-glyph-E5C6": createSetGlyphAction("ornamentPrecompMordentUpperPrefix"),
    "set-glyph-E5C7": createSetGlyphAction("ornamentPrecompInvertedMordentUpperPrefix"),
    "set-glyph-E5C8": createSetGlyphAction("ornamentPrecompTrillLowerSuffix"),
    ...measureBarLineDefinitions,
    "add-dynam-p": createAddDynamicAction("p"),
    "add-dynam-m": createAddDynamicAction("m"),
    "add-dynam-f": createAddDynamicAction("f"),
    "add-dynam-r": createAddDynamicAction("r"),
    "add-dynam-s": createAddDynamicAction("s"),
    "add-dynam-z": createAddDynamicAction("z"),
    "add-dynam-n": createAddDynamicAction("n"),
    "add-dynam-pppppp": createAddDynamicAction("pppppp"),
    "add-dynam-ppppp": createAddDynamicAction("ppppp"),
    "add-dynam-pppp": createAddDynamicAction("pppp"),
    "add-dynam-ppp": createAddDynamicAction("ppp"),
    "add-dynam-pp": createAddDynamicAction("pp"),
    "add-dynam-mp": createAddDynamicAction("mp"),
    "add-dynam-mf": createAddDynamicAction("mf"),
    "add-dynam-pf": createAddDynamicAction("pf"),
    "add-dynam-ff": createAddDynamicAction("ff"),
    "add-dynam-fff": createAddDynamicAction("fff"),
    "add-dynam-ffff": createAddDynamicAction("ffff"),
    "add-dynam-fffff": createAddDynamicAction("fffff"),
    "add-dynam-ffffff": createAddDynamicAction("ffffff"),
    "add-dynam-fp": createAddDynamicAction("fp"),
    "add-dynam-fz": createAddDynamicAction("fz"),
    "add-dynam-sf": createAddDynamicAction("sf"),
    "add-dynam-sfp": createAddDynamicAction("sfp"),
    "add-dynam-sfpp": createAddDynamicAction("sfpp"),
    "add-dynam-sfz": createAddDynamicAction("sfz"),
    "add-dynam-sfzp": createAddDynamicAction("sfzp"),
    "add-dynam-sffz": createAddDynamicAction("sffz"),
    "add-dynam-rf": createAddDynamicAction("rf"),
    "add-dynam-rfz": createAddDynamicAction("rfz"),
    ...setDynamicDefinitions,
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
    "add-turn": createAddTurnAction("upper"),
    "add-turn-inverted": createAddTurnAction("lower"),
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
