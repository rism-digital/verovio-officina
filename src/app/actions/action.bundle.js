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

export const contextButtonBars = {
    note: [
        [
            { name: "Add trill", action: "add-trill", icon: "icons/mei/trill.png" },
            { name: "Add mordent", action: "add-mordent", icon: "icons/mei/mordent.png" },
            { name: "Add fing", action: "add-fing", icon: "icons/mei/fing.png" },
        ],
        [
            { name: "Stem auto", action: "set-stem-auto", icon: "icons/editor/stem-dir-auto.png" },
            { name: "Stem down", action: "set-stem-down", icon: "icons/editor/stem-dir-down.png" },
            { name: "Stem up", action: "set-stem-up", icon: "icons/editor/stem-dir-up.png" },
        ],
    ],
    hairpin: [
        [
            { name: "Place above", action: "set-place-above", icon: "icons/editor/place-above.png" },
            { name: "Place auto", action: "set-place-auto", icon: "icons/editor/place-auto.png" },
            { name: "Place below", action: "set-place-below", icon: "icons/editor/place-below.png" },
        ],
    ],
    dynam: [
        [
            { name: "Place above", action: "set-place-above", icon: "icons/editor/place-above.png" },
            { name: "Place auto", action: "set-place-auto", icon: "icons/editor/place-auto.png" },
            { name: "Place below", action: "set-place-below", icon: "icons/editor/place-below.png" },
        ],
    ],
    dir: [
        [
            { name: "Place above", action: "set-place-above", icon: "icons/editor/place-above.png" },
            { name: "Place auto", action: "set-place-auto", icon: "icons/editor/place-auto.png" },
            { name: "Place below", action: "set-place-below", icon: "icons/editor/place-below.png" },
        ],
    ],
};

export const actionDefinitions = {
    "add-accidental": {
        action: "chain",
        param: [
            {
                action: "insert",
                param: {
                    elementName: "accid",
                    elementId: "{{targetId}}",
                    insertMode: "appendChild",
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
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "color",
                    value: "blue",
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
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "color",
                    value: "blue",
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
                action: "set",
                param: {
                    elementId: "[chained-id]",
                    attribute: "color",
                    value: "red",
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
