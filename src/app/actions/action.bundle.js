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
    ]
};

const controlEventPlace = [
    { name: "Place above", action: "set-place-above", icon: "icons/editor/place-above.png" },
    { name: "Place auto", action: "set-place-auto", icon: "icons/editor/place-auto.png" },
    { name: "Place below", action: "set-place-below", icon: "icons/editor/place-below.png" },
]

const insertControlEvent = [
    { name: "Add hairpin", action: "add-hairpin", icon: "icons/mei/hairpin.png", secondary: true},
    { name: "Add slur", action: "add-slur", icon: "icons/mei/slur.png", secondary: true },
]

export const contextButtonBars = {
    note: [
        [
            { name: "Add flat", action: "add-accidental-flat", icon: "icons/editor/accid-flat.png" },
            { name: "Add natural", action: "add-accidental-natural", icon: "icons/editor/accid-natural.png" },
            { name: "Add shart", action: "add-accidental-sharp", icon: "icons/editor/accid-sharp.png" },
        ],
        [
            { name: "Add trill", action: "add-trill", icon: "icons/mei/trill.png" },
            { name: "Add mordent", action: "add-mordent", icon: "icons/mei/mordent.png" },
        ],
        [
            { name: "Add fing", action: "add-fing", icon: "icons/mei/fing.png", dialog: "enter-value" },
            { name: "Add dir", action: "add-dir", icon: "icons/mei/dir.png", dialog: "enter-value" },
            { name: "Add tempo", action: "add-tempo", icon: "icons/mei/tempo.png", dialog: "enter-value" },
        ],
        [
            { name: "Stem auto", action: "set-stem-auto", icon: "icons/editor/stem-dir-auto.png" },
            { name: "Stem down", action: "set-stem-down", icon: "icons/editor/stem-dir-down.png" },
            { name: "Stem up", action: "set-stem-up", icon: "icons/editor/stem-dir-up.png" },
        ],
        insertControlEvent,
    ],
    dir: [
        controlEventPlace,
    ],
    dynam: [
        controlEventPlace,
    ],
    fing: [
        controlEventPlace,
    ],
    tempo: [
        controlEventPlace,
    ],
    hairpin: [
        controlEventPlace,
    ],
    mordent: [
        controlEventPlace,
    ],
    rest: [
        [
            { name: "Add dir", action: "add-dir", icon: "icons/mei/dir.png", dialog: "enter-value" },
            { name: "Add tempo", action: "add-tempo", icon: "icons/mei/tempo.png", dialog: "enter-value" },
        ],
    ],
    trill: [
        controlEventPlace,
    ]
};

export const actionDefinitions = {
    "add-accidental-flat": {
        action: "chain",
        param: [
            {
                action: "insert",
                param: {
                    elementName: "accid",
                    elementId: "{{targetId}}",
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
                    elementId: "{{targetId}}",
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
                    elementId: "{{targetId}}",
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
    "add-articulation": {
        action: "chain",
        param: [
            {
                action: "insert",
                param: {
                    elementName: "artic",
                    elementId: "{{targetId}}",
                    insertMode: "appendChild",
                },
            },
            {
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "artic",
                    value: "acc",
                },
            },
            {
                action: "commit",
            },
        ],
    },
    "add-hairpin": {
        action: "chain",
        param: [
            {
                action: "insertControl",
                param: {
                    elementName: "hairpin",
                    startId: "{{targetId}}",
                    endId: "{{secondaryId}}",
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
                    startId: "{{targetId}}",
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
                    startId: "{{targetId}}",
                    endId: "{{secondaryId}}",
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
                    startId: "{{targetId}}",
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
                    startId: "{{targetId}}",
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
                    startId: "{{targetId}}",
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
                    startId: "{{targetId}}",
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
                    startId: "{{targetId}}",
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
    "set-stem-auto": {
        action: "chain",
        param: [
            {
                action: "set",
                param: {
                    elementId: "{{targetId}}",
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
                    elementId: "{{targetId}}",
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
                    elementId: "{{targetId}}",
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
                    elementId: "{{targetId}}",
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
                    elementId: "{{targetId}}",
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
                    elementId: "{{targetId}}",
                    attribute: "place",
                    value: "below",
                },
            },
            {
                action: "commit",
            },
        ],
    },
};
