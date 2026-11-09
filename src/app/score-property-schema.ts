import { EXCLUDED_ATTRIBUTES, EXCLUDED_ELEMENTS } from "./attribute-preferences";
import propertyRulesJson from "./schema-settings/properties.json";
import type { ElementDef, RNGLoader } from "./rng-loader";

type ScorePropertyRule = Pick<ElementDef, "children"> &
    Partial<Pick<ElementDef, "choice" | "optional">>;

const propertyRules = propertyRulesJson as Record<string, ScorePropertyRule>;

function isElementDef(value: unknown): value is ElementDef {
    return Boolean(value)
        && typeof value === "object"
        && "attrs" in (value as ElementDef);
}

function filterNames(names: string[] | undefined): string[] | undefined {
    if (!names) return undefined;
    return names.filter((name) => !EXCLUDED_ELEMENTS.has(name));
}

export function resolveScorePropertyDefinitions(
    rngMEIAll: RNGLoader | null,
): Record<string, ElementDef> {
    const tags = rngMEIAll?.getTags() ?? {};
    const elementNames = new Set([
        ...Object.keys(propertyRules),
        ...Object.entries(tags)
            .filter((entry): entry is [string, ElementDef] =>
                isElementDef(entry[1]))
            .map(([elementName]) => elementName),
    ]);

    return Object.fromEntries(
        [...elementNames]
            .filter((elementName) => !EXCLUDED_ELEMENTS.has(elementName))
            .map((elementName) => {
                const rule = propertyRules[elementName];
                const schemaDefinition = tags[elementName];
                const definition = isElementDef(schemaDefinition)
                    ? schemaDefinition
                    : { attrs: {}, children: [], types: {} };
                const excludedAttributes = new Set(
                    EXCLUDED_ATTRIBUTES[elementName] ?? [],
                );
                const attrs = Object.fromEntries(
                    Object.entries(definition.attrs).filter(
                        ([name]) => !excludedAttributes.has(name),
                    ),
                );
                const types = Object.fromEntries(
                    Object.entries(definition.types).filter(
                        ([name]) => name in attrs,
                    ),
                );
                const children = filterNames(rule?.children) ?? [];
                const choice = rule?.choice
                    ?.map((group) => filterNames(group) ?? [])
                    .filter((group) => group.length > 1);
                const optional = filterNames(rule?.optional);

                return [
                    elementName,
                    {
                        ...definition,
                        attrs,
                        types,
                        children,
                        ...(choice?.length ? { choice } : {}),
                        ...(optional?.length ? { optional } : {}),
                    },
                ];
            }),
    );
}
