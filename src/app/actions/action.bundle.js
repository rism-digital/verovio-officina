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
            name: "Add directive",
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
    [
        {
            name: "Staff group properties",
            action: "open-staff-groups",
            appAction: "open-staff-groups",
            requiredSelectionId: "[main-scoredef]",
        }
    ],
    [
        {
            name: "Header / footer",
            action: "open-header-footer",
            appAction: "open-header-footer",
            requiredSelectionId: "[main-scoredef]",
        }
    ]],
    staff: [
        [
            {
                name: "Edit global staff definition",
                action: "edit-staff-definition",
                appAction: "open-staff-def",
            }
        ],
        [
            {
                name: "Insert layer",
                action: "insert-layer",
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
    layer: [[
        {
            name: "Delete layer",
            action: "delete-layer",
        },
    ]],
};

export const contextToolComponents = {
    scoreDef: "ScoreDefContextTools",
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
    { name: "Automatic", action: "reset-glyph", icon: "icons/editor/auto.png" },
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
    { name: "None", value: "", icon: "icons/editor/auto.png" },
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

const ornamentEnclosures = [
    { name: "Auto", action: "set-enclose-auto", value: "", icon: "icons/editor/auto.png" },
    { name: "Brackets", action: "set-enclose-brack", value: "brack", icon: "icons/editor/enclose-brack.png" },
    { name: "Parentheses", action: "set-enclose-paren", value: "paren", icon: "icons/editor/enclose-paren.png" },
]

const bracketEnclosures = ornamentEnclosures.filter(
    ({ value }) => value !== "paren",
);

const insertAccidentals = [
    { name: "Add flat", action: "add-accidental-flat", value: "f", icon: "icons/editor/accid-flat.png" },
    { name: "Add natural", action: "add-accidental-natural", value: "n", icon: "icons/editor/accid-natural.png" },
    { name: "Add sharp", action: "add-accidental-sharp", value: "s", icon: "icons/editor/accid-sharp.png" },
    { name: "Add double sharp", action: "add-accidental-double-sharp", value: "x", icon: "icons/editor/accid-E263.png" },
    { name: "Add double flat", action: "add-accidental-double-flat", value: "ff", icon: "icons/editor/accid-E264.png" },
]

const accidentalSpecs = [
    ["E260", "Flat", "f"],
    ["E269", "Sharp sharp", "ss"],
    ["E262", "Sharp", "s"],
    ["E263", "Double sharp", "x"],
    ["E264", "Double flat", "ff"],
    ["E265", "Triple sharp", "sx"],
    ["E266", "Triple flat", "tf"],
    ["E261", "Natural", "n"],
    ["E267", "Natural flat", "nf"],
    ["E268", "Natural sharp", "ns"],
    ["E274", "Three-quarter-tones sharp, arrow up", "su"],
    ["E275", "Quarter-tone sharp, arrow down", "sd"],
    ["E270", "Quarter-tone flat, arrow up", "fu"],
    ["E271", "Three-quarter-tones flat, arrow down", "fd"],
    ["E272", "Quarter-tone sharp natural, arrow up", "nu"],
    ["E273", "Quarter-tone flat natural, arrow down", "nd"],
    ["E280", "Quarter-tone flat (Stein)", "1qf"],
    ["E281", "Three-quarter-tones flat (Zimmermann)", "3qf"],
    ["E282", "Quarter-tone sharp (Stein)", "1qs"],
    ["E283", "Three-quarter-tones sharp (Stein)", "3qs"],
    ["E447", "Büyük mücenneb sharp", "bms"],
    ["E446", "Küçük mücenneb sharp", "kms"],
    ["E445", "Bakiye sharp", "bs"],
    ["E444", "Koma sharp", "ks"],
    ["E443", "Koma flat", "kf"],
    ["E442", "Bakiye flat", "bf"],
    ["E441", "Küçük mücenneb flat", "kmf"],
    ["E440", "Büyük mücenneb flat", "bmf"],
    ["E460", "Koron", "koron"],
    ["E461", "Sori", "sori"],
]

const setAccidentals = accidentalSpecs.map(([code, name, value]) => ({
    name,
    action: `set-accidental-${value}`,
    icon: `icons/editor/accid-${code}.png`,
}));

const noteHeadShapes = [
    { name: "Automatic", action: "set-note-head-auto", icon: "icons/editor/auto.png", attributes: {} },
    { name: "Plus", action: "set-note-head-plus", icon: "icons/editor/head-E0AF.png", attributes: { "head.shape": "+" } },
    { name: "Diamond", action: "set-note-head-diamond", icon: "icons/editor/head-E0DB.png", attributes: { "head.shape": "diamond" } },
    { name: "Void diamond", action: "set-note-head-diamond-void", icon: "icons/editor/head-E0D9.png", attributes: { "head.shape": "diamond", "head.fill": "void" } },
    { name: "Slash", action: "set-note-head-slash", icon: "icons/editor/head-E101.png", attributes: { "head.shape": "slash" } },
    { name: "X", action: "set-note-head-x", icon: "icons/editor/head-E0A9.png", attributes: { "head.shape": "x" } },
    { name: "Parentheses", action: "set-note-head-paren", icon: "icons/editor/head-E0CE.png", attributes: { "head.mod": "paren" } },
    { name: "Wide black diamond", action: "set-note-head-diamond-black-wide", icon: "icons/editor/head-E0DC.png", attributes: { "glyph.name": "noteheadDiamondBlackWide" } },
    { name: "Wide white diamond", action: "set-note-head-diamond-white-wide", icon: "icons/editor/head-E0DE.png", attributes: { "glyph.name": "noteheadDiamondWhiteWide" } },
    { name: "No notehead", action: "set-note-head-null", icon: "icons/editor/head-null.png", attributes: { "glyph.name": "noteheadNull" } },
    { name: "Circle X", action: "set-note-head-circle-x", icon: "icons/editor/head-E0B3.png", attributes: { "head.shape": "U+E0B3" } },
    { name: "Whole notehead with X", action: "set-note-head-whole-x", icon: "icons/editor/head-E0B5.png", attributes: { "head.shape": "U+E0B5" } },
]

const insertControlEvent = [
    { name: "Add hairpin", action: "add-hairpin", icon: "icons/editor/hairpin.png", secondary: true },
    { name: "Add slur", action: "add-slur", icon: "icons/editor/slur.png", secondary: true },
]

const insertArpegSpecs = [
    { name: "Add arpeggio", action: "insert-arpeg", icon: "icons/editor/arpeg.png" },
    { name: "Add upward arpeggio", action: "insert-arpeg-up", icon: "icons/editor/arpeg-up.png", order: "up" },
    { name: "Add downward arpeggio", action: "insert-arpeg-down", icon: "icons/editor/arpeg-down.png", order: "down" },
]

const insertArpegs = insertArpegSpecs.map(({ name, action, icon }) => ({
    name,
    action,
    icon,
}));

const setArpegSpecs = [
    { name: "Plain arpeggio", action: "set-arpeg-plain", icon: "icons/editor/arpeg.png", arrow: "", order: "" },
    { name: "Upward arpeggio", action: "set-arpeg-up", icon: "icons/editor/arpeg-up.png", arrow: "true", order: "up" },
    { name: "Downward arpeggio", action: "set-arpeg-down", icon: "icons/editor/arpeg-down.png", arrow: "true", order: "down" },
]

const setArpegs = setArpegSpecs.map(({ name, action, icon }) => ({
    name,
    action,
    icon,
}));

const insertPitchedPunctualEvents = [
    { name: "Add trill", action: "add-trill", icon: "icons/editor/trill.png" },
    { name: "Add fingering", action: "add-fing", icon: "icons/editor/fing.png", dialog: "enter-value" },
    { name: "Add turn", action: "add-turn", icon: "icons/editor/turn-E567.png" },
    { name: "Add mordent", action: "add-mordent", icon: "icons/editor/mordent.png" },
]

const insertRestPunctualEvents = [
    { name: "Add directive", action: "add-dir", icon: "icons/editor/dir.png", dialog: "enter-value" },
    { name: "Add tempo", action: "add-tempo", icon: "icons/editor/tempo.png", dialog: "enter-value" },
    { name: "Add fermata", action: "add-fermata", icon: "icons/editor/fermata.png" },
]

const insertPunctualEvents = [
    ...insertRestPunctualEvents,
    ...insertPitchedPunctualEvents,
]

const trillAccidentals = [
    { name: "None", action: "set-trill-accid-auto", attribute: "accidlower", value: "", icon: "icons/editor/auto.png" },
    { name: "Lower flat", action: "set-trill-accidlower-flat", attribute: "accidlower", value: "f", icon: "icons/editor/trill-accidlower-flat.png" },
    { name: "Lower natural", action: "set-trill-accidlower-natural", attribute: "accidlower", value: "n", icon: "icons/editor/trill-accidlower-natural.png" },
    { name: "Lower sharp", action: "set-trill-accidlower-sharp", attribute: "accidlower", value: "s", icon: "icons/editor/trill-accidlower-sharp.png" },
    { name: "Upper flat", action: "set-trill-accidupper-flat", attribute: "accidupper", value: "f", icon: "icons/editor/trill-accidupper-flat.png" },
    { name: "Upper natural", action: "set-trill-accidupper-natural", attribute: "accidupper", value: "n", icon: "icons/editor/trill-accidupper-natural.png" },
    { name: "Upper sharp", action: "set-trill-accidupper-sharp", attribute: "accidupper", value: "s", icon: "icons/editor/trill-accidupper-sharp.png" },
]

const turnAccidentals = [
    { name: "None", action: "set-turn-accid-auto", attribute: "accidlower", value: "", icon: "icons/editor/auto.png" },
    { name: "Lower flat", action: "set-turn-accidlower-flat", attribute: "accidlower", value: "f", icon: "icons/editor/turn-accidlower-flat.png" },
    { name: "Lower natural", action: "set-turn-accidlower-natural", attribute: "accidlower", value: "n", icon: "icons/editor/turn-accidlower-natural.png" },
    { name: "Lower sharp", action: "set-turn-accidlower-sharp", attribute: "accidlower", value: "s", icon: "icons/editor/turn-accidlower-sharp.png" },
    { name: "Upper flat", action: "set-turn-accidupper-flat", attribute: "accidupper", value: "f", icon: "icons/editor/turn-accidupper-flat.png" },
    { name: "Upper natural", action: "set-turn-accidupper-natural", attribute: "accidupper", value: "n", icon: "icons/editor/turn-accidupper-natural.png" },
    { name: "Upper sharp", action: "set-turn-accidupper-sharp", attribute: "accidupper", value: "s", icon: "icons/editor/turn-accidupper-sharp.png" },
]

const turnForms = [
    { name: "Upper", action: "set-turn-form-upper", value: "upper", icon: "icons/editor/turn-E567.png" },
    { name: "Lower", action: "set-turn-form-lower", value: "lower", icon: "icons/editor/turn-E568.png" },
]

const hairpinForms = [
    { name: "Crescendo", action: "set-hairpin-form-cres", value: "cres", icon: "icons/editor/hairpin.png" },
    { name: "Diminuendo", action: "set-hairpin-form-dim", value: "dim", icon: "icons/editor/hairpin-dim.png" },
]

const fermataShapes = [
    { name: "Auto", action: "set-fermata-shape-auto", value: "", icon: "icons/editor/auto.png" },
    { name: "Angular", action: "set-fermata-shape-angular", value: "angular", icon: "icons/editor/fermata-E4C4.png" },
    { name: "Curved", action: "set-fermata-shape-curved", value: "curved", icon: "icons/editor/fermata-E4C0.png" },
    { name: "Square", action: "set-fermata-shape-square", value: "square", icon: "icons/editor/fermata-E4C6.png" },
]

const setFermataGlyphs = [
    { name: "Automatic", action: "reset-glyph", icon: "icons/editor/auto.png" },
    { name: "Fermata above", action: "set-glyph-E4C0", icon: "icons/editor/fermata-E4C0.png" },
    { name: "Fermata below", action: "set-glyph-E4C1", icon: "icons/editor/fermata-E4C1.png" },
    { name: "Very short above", action: "set-glyph-E4C2", icon: "icons/editor/fermata-E4C2.png" },
    { name: "Very short below", action: "set-glyph-E4C3", icon: "icons/editor/fermata-E4C3.png" },
    { name: "Short above", action: "set-glyph-E4C4", icon: "icons/editor/fermata-E4C4.png" },
    { name: "Short below", action: "set-glyph-E4C5", icon: "icons/editor/fermata-E4C5.png" },
    { name: "Long above", action: "set-glyph-E4C6", icon: "icons/editor/fermata-E4C6.png" },
    { name: "Long below", action: "set-glyph-E4C7", icon: "icons/editor/fermata-E4C7.png" },
    { name: "Very long above", action: "set-glyph-E4C8", icon: "icons/editor/fermata-E4C8.png" },
    { name: "Very long below", action: "set-glyph-E4C9", icon: "icons/editor/fermata-E4C9.png" },
    { name: "Long Henze above", action: "set-glyph-E4CA", icon: "icons/editor/fermata-E4CA.png" },
    { name: "Long Henze below", action: "set-glyph-E4CB", icon: "icons/editor/fermata-E4CB.png" },
    { name: "Short Henze above", action: "set-glyph-E4CC", icon: "icons/editor/fermata-E4CC.png" },
    { name: "Short Henze below", action: "set-glyph-E4CD", icon: "icons/editor/fermata-E4CD.png" },
]

const mordentAccidentals = [
    { name: "None", action: "set-mordent-accid-auto", attribute: "accidlower", value: "", icon: "icons/editor/auto.png" },
    { name: "Lower flat", action: "set-mordent-accidlower-flat", attribute: "accidlower", value: "f", icon: "icons/editor/mordent-accidlower-flat.png" },
    { name: "Lower natural", action: "set-mordent-accidlower-natural", attribute: "accidlower", value: "n", icon: "icons/editor/mordent-accidlower-natural.png" },
    { name: "Lower sharp", action: "set-mordent-accidlower-sharp", attribute: "accidlower", value: "s", icon: "icons/editor/mordent-accidlower-sharp.png" },
    { name: "Upper flat", action: "set-mordent-accidupper-flat", attribute: "accidupper", value: "f", icon: "icons/editor/mordent-accidupper-flat.png" },
    { name: "Upper natural", action: "set-mordent-accidupper-natural", attribute: "accidupper", value: "n", icon: "icons/editor/mordent-accidupper-natural.png" },
    { name: "Upper sharp", action: "set-mordent-accidupper-sharp", attribute: "accidupper", value: "s", icon: "icons/editor/mordent-accidupper-sharp.png" },
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

const insertClefSpecs = [
    { name: "Insert F4 clef before", action: "insert-clef-f4-before", icon: "icons/editor/clef-F4-before.png", shape: "F", line: "4", insertMode: "insertBefore" },
    { name: "Insert G2 clef before", action: "insert-clef-g2-before", icon: "icons/editor/clef-G2-before.png", shape: "G", line: "2", insertMode: "insertBefore" },
    { name: "Insert C3 clef before", action: "insert-clef-c3-before", icon: "icons/editor/clef-C3-before.png", shape: "C", line: "3", insertMode: "insertBefore" },
    { name: "Insert F4 clef after", action: "insert-clef-f4-after", icon: "icons/editor/clef-F4-after.png", shape: "F", line: "4", insertMode: "insertAfter" },
    { name: "Insert G2 clef after", action: "insert-clef-g2-after", icon: "icons/editor/clef-G2-after.png", shape: "G", line: "2", insertMode: "insertAfter" },
    { name: "Insert C3 clef after", action: "insert-clef-c3-after", icon: "icons/editor/clef-C3-after.png", shape: "C", line: "3", insertMode: "insertAfter" },
]

const insertClefs = insertClefSpecs.map(({ name, action, icon }) => ({
    name,
    action,
    icon,
}));

const clefAndPlacementSpecs = [
    { name: "G clef, line 2", action: "set-clef-g2", icon: "icons/editor/clef-G2.png", shape: "G", line: "2", disPlace: "", dis: "" },
    { name: "F clef, line 4", action: "set-clef-f4", icon: "icons/editor/clef-F4.png", shape: "F", line: "4", disPlace: "", dis: "" },
    { name: "C clef, line 1", action: "set-clef-c1", icon: "icons/editor/clef-C1.png", shape: "C", line: "1", disPlace: "", dis: "" },
    { name: "C clef, line 2", action: "set-clef-c2", icon: "icons/editor/clef-C2.png", shape: "C", line: "2", disPlace: "", dis: "" },
    { name: "C clef, line 3", action: "set-clef-c3", icon: "icons/editor/clef-C3.png", shape: "C", line: "3", disPlace: "", dis: "" },
    { name: "C clef, line 4", action: "set-clef-c4", icon: "icons/editor/clef-C4.png", shape: "C", line: "4", disPlace: "", dis: "" },
    { name: "G clef, octave above", action: "set-clef-g2-8-above", icon: "icons/editor/clef-G2-8-above.png", shape: "G", line: "2", disPlace: "above", dis: "8" },
    { name: "G clef, two octaves above", action: "set-clef-g2-15-above", icon: "icons/editor/clef-G2-15-above.png", shape: "G", line: "2", disPlace: "above", dis: "15" },
    { name: "G clef, octave below", action: "set-clef-g2-8-below", icon: "icons/editor/clef-G2-8-below.png", shape: "G", line: "2", disPlace: "below", dis: "8" },
    { name: "F clef, octave below", action: "set-clef-g2-8-below", icon: "icons/editor/clef-F4-8-below.png", shape: "F", line: "4", disPlace: "below", dis: "8" },
]

const clefAndPlacement = clefAndPlacementSpecs.map(({ name, action, icon }) => ({
    name,
    action,
    icon,
    buttonSize: "tall",
}));

export const contextButtonBars = {
    measure: [
        { label: "Right bar line", actions: setMeasureRightBarLines },
        { label: "Left bar line", actions: setMeasureLeftBarLines },
    ],
    accid: [
        { label: "Accidental", actions: setAccidentals },
        { label: "Enclose", actions: ornamentEnclosures },
    ],
    arpeg: [
        { label: "Arpeggio", actions: setArpegs },
        { label: "Enclose", actions: bracketEnclosures },
    ],
    chord: [
        { label: "Clef before or after", actions: insertClefs },
        { label: "Arpeggio", actions: insertArpegs },
        {
            label: "Stem",
            actions: stemPosition,
        },
        {
            label: "Articulations",
            actions: insertArticulations,
        },
        {
            label: "Punctual events",
            actions: insertPunctualEvents,
        },
    ],
    note: [
        { label: "Spanning events", actions: insertControlEvent },
        { label: "Clef before or after", actions: insertClefs },
        {
            label: "Accidentals",
            actions: insertAccidentals,
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
            label: "Punctual events",
            actions: insertPunctualEvents,
        },
        {
            label: "Dynamics",
            actions: insertDynamics
        },
        { label: "Head shape", actions: noteHeadShapes },
    ],
    clef: [
        { label: "Clef and octava", actions: clefAndPlacement },
        { label: "Enclose", actions: bracketEnclosures },
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
    fermata: [
        { label: "Placement", actions: controlEventPlace },
        { label: "Shape", actions: fermataShapes },
        { label: "Glyph", actions: setFermataGlyphs },
    ],
    fing: [
        { label: "Placement", actions: controlEventPlace },
    ],
    tempo: [
        { label: "Placement", actions: controlEventPlace },
    ],
    hairpin: [
        { label: "Placement", actions: controlEventPlace },
        { label: "Form", actions: hairpinForms },
    ],
    mordent: [
        { label: "Placement", actions: controlEventPlace },
        { label: "Accidental", actions: mordentAccidentals },
        { label: "Enclose", actions: ornamentEnclosures },
        { label: "Glyph", actions: setMordentGlyphs },
    ],
    rest: [
        { label: "Clef before or after", actions: insertClefs },
        { label: "Dynamics", actions: insertDynamics },
        {
            label: "Punctual events",
            actions: insertRestPunctualEvents,
        },
    ],
    trill: [
        { label: "Placement", actions: controlEventPlace },
        { label: "Accidental", actions: trillAccidentals },
        { label: "Enclose", actions: ornamentEnclosures },
    ],
    turn: [
        { label: "Placement", actions: controlEventPlace },
        { label: "Form", actions: turnForms },
        { label: "Accidental", actions: turnAccidentals },
        { label: "Enclose", actions: ornamentEnclosures },
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

const createAddAccidentalAction = (value) => ({
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
                value,
            },
        },
        {
            action: "commit",
        },
    ],
});

const createInsertArpegAction = (order) => ({
    action: "chain",
    param: [
        {
            action: "insertControl",
            param: {
                elementName: "arpeg",
                startId: "[selection-id]",
            },
        },
        ...(order ? [
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "arrow",
                    value: "true",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "order",
                    value: order,
                },
            },
        ] : []),
        {
            action: "commit",
        },
    ],
});

const createSetArpegAction = (arrow, order) => ({
    action: "chain",
    param: [
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute: "arrow",
                value: arrow,
            },
        },
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute: "order",
                value: order,
            },
        },
        {
            action: "commit",
        },
    ],
});

const createInsertClefAction = (shape, line, insertMode) => ({
    action: "chain",
    param: [
        {
            action: "insert",
            param: {
                elementName: "clef",
                elementId: "[selection-id]",
                insertMode,
            },
        },
        {
            action: "set",
            param: {
                elementId: "[chained-id]",
                attribute: "shape",
                value: shape,
            },
        },
        {
            action: "set",
            param: {
                elementId: "[chained-id]",
                attribute: "line",
                value: line,
            },
        },
        {
            action: "commit",
        },
    ],
});

const createSetClefAction = (shape, line, disPlace, dis) => ({
    action: "chain",
    param: [
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute: "shape",
                value: shape,
            },
        },
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute: "line",
                value: line,
            },
        },
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute: "dis.place",
                value: disPlace,
            },
        },
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute: "dis",
                value: dis,
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

const createSetAccidentalAction = (value) => ({
    action: "chain",
    param: [
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute: "accid",
                value,
            },
        },
        {
            action: "commit",
        },
    ],
});

const accidentalDefinitions = Object.fromEntries([
    ["set-accidental-auto", createSetAccidentalAction("")],
    ...accidentalSpecs.map(([, , value]) => [
        `set-accidental-${value}`,
        createSetAccidentalAction(value),
    ]),
]);

const noteHeadAttributeNames = [
    "head.shape",
    "head.fill",
    "head.mod",
    "glyph.name",
    "glyph.auth",
];

const createSetNoteHeadAction = (attributes) => ({
    action: "chain",
    param: [
        ...noteHeadAttributeNames.map((attribute) => ({
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute,
                value: attributes[attribute] ?? "",
            },
        })),
        {
            action: "commit",
        },
    ],
});

const noteHeadDefinitions = Object.fromEntries(
    noteHeadShapes.map(({ action, attributes }) => [
        action,
        createSetNoteHeadAction(attributes),
    ]),
);

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

const createSetOrnamentAccidentalAction = (attribute, value) => ({
    action: "chain",
    param: [
        {
            action: "set",
            param: {
                elementId: "[selection-id]",
                attribute: attribute === "accidlower" ? "accidupper" : "accidlower",
                value: "",
            },
        },
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

const ornamentAccidentalDefinitions = Object.fromEntries(
    [trillAccidentals, turnAccidentals, mordentAccidentals].flat().map(({ action, attribute, value }) => [
        action,
        createSetOrnamentAccidentalAction(attribute, value),
    ]),
);

const formDefinitions = Object.fromEntries(
    [turnForms, hairpinForms].flat().map(({ action, value }) => [
        action,
        {
            action: "chain",
            param: [
                {
                    action: "set",
                    param: {
                        elementId: "[selection-id]",
                        attribute: "form",
                        value,
                    },
                },
                {
                    action: "commit",
                },
            ],
        },
    ]),
);

const fermataShapeDefinitions = Object.fromEntries(
    fermataShapes.map(({ action, value }) => [
        action,
        {
            action: "chain",
            param: [
                {
                    action: "set",
                    param: {
                        elementId: "[selection-id]",
                        attribute: "shape",
                        value,
                    },
                },
                {
                    action: "commit",
                },
            ],
        },
    ]),
);

const ornamentEnclosureDefinitions = Object.fromEntries(
    ornamentEnclosures.map(({ action, value }) => [
        action,
        {
            action: "chain",
            param: [
                {
                    action: "set",
                    param: {
                        elementId: "[selection-id]",
                        attribute: "enclose",
                        value,
                    },
                },
                {
                    action: "commit",
                },
            ],
        },
    ]),
);

const measureBarLineDefinitions = Object.fromEntries(
    ["right", "left"].flatMap((attribute) => measureBarLines.map(({ value }) => [
        `set-measure-${attribute}-${value}`,
        createSetMeasureBarLineAction(attribute, value),
    ])),
);

const insertClefDefinitions = Object.fromEntries(
    insertClefSpecs.map(({ action, shape, line, insertMode }) => [
        action,
        createInsertClefAction(shape, line, insertMode),
    ]),
);

const setClefDefinitions = Object.fromEntries(
    clefAndPlacementSpecs.map(({ action, shape, line, disPlace, dis }) => [
        action,
        createSetClefAction(shape, line, disPlace, dis),
    ]),
);

const insertAccidentalDefinitions = Object.fromEntries(
    insertAccidentals.map(({ action, value }) => [
        action,
        createAddAccidentalAction(value),
    ]),
);

const insertArpegDefinitions = Object.fromEntries(
    insertArpegSpecs.map(({ action, order }) => [
        action,
        createInsertArpegAction(order),
    ]),
);

const setArpegDefinitions = Object.fromEntries(
    setArpegSpecs.map(({ action, arrow, order }) => [
        action,
        createSetArpegAction(arrow, order),
    ]),
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
    ...insertClefDefinitions,
    ...setClefDefinitions,
    ...insertAccidentalDefinitions,
    ...insertArpegDefinitions,
    ...setArpegDefinitions,
    ...accidentalDefinitions,
    ...noteHeadDefinitions,
    "reset-glyph": {
        action: "chain",
        param: [
            {
                action: "set",
                param: {
                    elementId: "[selection-id]",
                    attribute: "glyph.name",
                    value: "",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[selection-id]",
                    attribute: "glyph.auth",
                    value: "",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "open-header-footer": {
        action: "getScoreDef",
        param: {
            scoreDefId: "[selection-id]",
        },
    },
    "open-staff-groups": {
        action: "getScoreDefStaffGrp",
        param: {
            scoreDefId: "[selection-id]",
        },
    },
    "open-key-signature": {
        action: "getScoreDefKeySig",
        param: {
            scoreDefId: "[selection-id]",
        },
    },
    "open-meter-signature": {
        action: "getScoreDefMeterSig",
        param: {
            scoreDefId: "[selection-id]",
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
    "insert-layer": {
        action: "chain",
        param: [
            {
                action: "updateScoreDef",
                param: {
                    update: "insertLayer",
                    elementId: "[selection-id]",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "delete-layer": {
        action: "chain",
        param: [
            {
                action: "updateScoreDef",
                param: {
                    update: "deleteLayer",
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
    "set-glyph-E4C0": createSetGlyphAction("fermataAbove"),
    "set-glyph-E4C1": createSetGlyphAction("fermataBelow"),
    "set-glyph-E4C2": createSetGlyphAction("fermataVeryShortAbove"),
    "set-glyph-E4C3": createSetGlyphAction("fermataVeryShortBelow"),
    "set-glyph-E4C4": createSetGlyphAction("fermataShortAbove"),
    "set-glyph-E4C5": createSetGlyphAction("fermataShortBelow"),
    "set-glyph-E4C6": createSetGlyphAction("fermataLongAbove"),
    "set-glyph-E4C7": createSetGlyphAction("fermataLongBelow"),
    "set-glyph-E4C8": createSetGlyphAction("fermataVeryLongAbove"),
    "set-glyph-E4C9": createSetGlyphAction("fermataVeryLongBelow"),
    "set-glyph-E4CA": createSetGlyphAction("fermataLongHenzeAbove"),
    "set-glyph-E4CB": createSetGlyphAction("fermataLongHenzeBelow"),
    "set-glyph-E4CC": createSetGlyphAction("fermataShortHenzeAbove"),
    "set-glyph-E4CD": createSetGlyphAction("fermataShortHenzeBelow"),
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
    ...ornamentAccidentalDefinitions,
    ...formDefinitions,
    ...fermataShapeDefinitions,
    ...ornamentEnclosureDefinitions,
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
                    value: "cres",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-fermata": {
        action: "chain",
        param: [
            {
                action: "insertControl",
                param: {
                    elementName: "fermata",
                    startId: "[selection-id]",
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
