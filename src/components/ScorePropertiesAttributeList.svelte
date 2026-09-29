<script lang="ts">
    import AttributeRow from "./AttributeRow.svelte";
    import propertiesSchema from "../app/properties.json";
    import type { TreeNodeData, EditActionSetHandler } from "../app/types";
    import type { ElementDef } from "../app/rng-loader";

    export let node: TreeNodeData | null = null;
    export let readOnly = false;
    export let onEditSet: EditActionSetHandler | null = null;

    const readOnlyPatterns: RegExp[] = [
        /.*@xml:id/,
        /.*@startid/,
        /.*@endid/,
        /.*@plist/,
        /.*@copyof/,
        /(staff|layer)@n$/,
    ];

    const customAllPname = ["c", "d", "e", "f", "g", "a", "b"];

    function customOptionsFor(elementName: string, attrName: string) {
        const input = `${elementName}@${attrName}`;
        if (/^.*@pname$/.test(input)) {
            return customAllPname;
        }
        return null;
    }

    function isReadOnly(elementName: string, attrName: string) {
        const input = `${elementName}@${attrName}`;
        return readOnlyPatterns.some((pattern) => pattern.test(input));
    }

    function normalizeAttributes(nodeValue: TreeNodeData | null): Record<string, string> {
        if (!nodeValue) return {};

        return {
            ...(nodeValue.attributes
                ? Object.fromEntries(
                      Object.entries(nodeValue.attributes).map(([key, value]) => [
                          key,
                          value == null ? "" : String(value),
                      ]),
                  )
                : {}),
            ...(nodeValue.id ? { "xml:id": nodeValue.id } : {}),
        };
    }

    $: elementName = node?.element ?? "";
    $: attributes = normalizeAttributes(node);
    $: elementSchema = (propertiesSchema as Record<string, ElementDef>)[elementName] ?? null;
    $: schemaAttrs = elementSchema?.attrs ?? {};
    $: schemaTypes = elementSchema?.types ?? {};
    $: schemaNames = Object.keys(schemaAttrs);
    $: extraNames = Object.keys(attributes).filter((name) => !schemaNames.includes(name));
    $: attributeNames = [...schemaNames, ...extraNames];
</script>

<div class="vrv-attribute-list-wrapper vrv-score-props-attribute-list">
    {#if attributeNames.length > 0}
        <table class="vrv-attribute-table">
            <tbody>
                {#each attributeNames as name}
                    <AttributeRow
                        elementId={node?.id ?? null}
                        {name}
                        value={attributes[name] ?? ""}
                        optionsAll={schemaAttrs[name] ?? null}
                        optionsBasic={null}
                        attributeType={schemaTypes[name] ?? null}
                        readOnly={readOnly || isReadOnly(elementName, name)}
                        customOptions={customOptionsFor(elementName, name)}
                        onEditAttribute={onEditSet}
                    />
                {/each}
            </tbody>
        </table>
    {:else}
        <div class="vrv-score-props-empty-note">
            No schema-defined attributes for <code>{elementName}</code>.
        </div>
    {/if}
</div>
