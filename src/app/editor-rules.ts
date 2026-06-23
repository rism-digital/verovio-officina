const INSERT_MODE_ELEMENTS = new Set([
    "chord",
    "layer",
    "mRest",
    "mSpace",
    "note",
    "rest",
    "space",
    "staff",
]);

export function enableInsertMode(elementName: string | null | undefined): boolean {
    return INSERT_MODE_ELEMENTS.has(elementName ?? "");
}
