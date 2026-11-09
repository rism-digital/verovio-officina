import defaultAttributes from "./schema-settings/default.json";
import excludedElements from "./schema-settings/element-excludes.json";
import excludedAttributes from "./schema-settings/excludes.json";

export type PreferredAttributes = Record<string, string[]>;

function normalizeAttributes(value: unknown): PreferredAttributes {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};

    const normalized: PreferredAttributes = {};
    for (const [element, attributes] of Object.entries(value)) {
        if (!Array.isArray(attributes)) continue;
        normalized[element] = Array.from(new Set(
            attributes.filter(
                (attribute: unknown): attribute is string =>
                    typeof attribute === "string",
            ),
        )).sort();
    }
    return normalized;
}

export const DEFAULT_PREFERRED_ATTRIBUTES = normalizeAttributes(
    defaultAttributes,
);

export const EXCLUDED_ATTRIBUTES = normalizeAttributes(excludedAttributes);

export const EXCLUDED_PREFERENCE_ELEMENTS = new Set(
    excludedElements.filter(
        (element): element is string => typeof element === "string",
    ),
);

export function clonePreferredAttributes(
    attributes: PreferredAttributes,
): PreferredAttributes {
    return Object.fromEntries(
        Object.entries(attributes).map(([element, names]) => [
            element,
            [...names],
        ]),
    );
}

export function loadPreferredAttributes(value: unknown): PreferredAttributes {
    return {
        ...clonePreferredAttributes(DEFAULT_PREFERRED_ATTRIBUTES),
        ...normalizeAttributes(value),
    };
}
