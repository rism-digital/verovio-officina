<script lang="ts">
    import AttributeRow from "./AttributeRow.svelte";
    import type { EditActionSetParam, EditActionSetHandler as EditSetHandler, EditResponseContent } from "../app/types";
    import type { ElementDef, RNGLoader } from "../app/rng-loader";
    import { EXCLUDED_ATTRIBUTES } from "../app/attribute-preferences";
    import { userPreferences } from "../app/state";

    export let editResponseContent: EditResponseContent | null = null;
    export let rngMEIAll: RNGLoader | null = null;
    export let onEditSet: EditSetHandler | null = null;

    $: elementName = editResponseContent?.object?.element ?? "";
    $: attributes = {
        ...(editResponseContent?.object?.attributes ?? {}),
        ...(editResponseContent?.object?.id ? { "xml:id": editResponseContent.object.id } : {}),
    } as Record<string, string>;

    function isElementDef(value: unknown): value is ElementDef {
        return (
            Boolean(value) &&
            typeof value === "object" &&
            "attrs" in (value as ElementDef)
        );
    }

    $: allTags =
        elementName && rngMEIAll ? rngMEIAll.getTags()[elementName] : null;
    $: allAttrs = isElementDef(allTags) ? allTags.attrs : {};
    $: allTypes = isElementDef(allTags) ? allTags.types : {};
    $: typeFor = (name: string) => allTypes?.[name] ?? null;
    $: usedNames = new Set(Object.keys(attributes));
    $: excludedNames = new Set(EXCLUDED_ATTRIBUTES[elementName] ?? []);
    $: preferredNames = ($userPreferences.preferredAttributes[elementName] ?? []).filter(
        (name) => name in allAttrs
            && !excludedNames.has(name)
            && !usedNames.has(name),
    );
    $: allNames = Object.keys(allAttrs).filter(
        (name) => !excludedNames.has(name)
            && !usedNames.has(name)
            && !preferredNames.includes(name),
    );

    const readOnlyPatterns: RegExp[] = [
        /.*@xml:id/,
        /.*@startid/,
        /.*@endid/,
        /.*@plist/,
        /.*@copyof/,
        /(staff|layer)@n$/,
    ];

    const customAllPname = ["c", "d", "e", "f", "g", "a", "b"];

    function customOptionsFor(attrName: string) {
        const input = `${elementName}@${attrName}`;
        if (/^.*@pname$/.test(input)) {
            return customAllPname;
        }
        return null;
    }

    function isReadOnly(attrName: string) {
        const input = `${elementName}@${attrName}`;
        return readOnlyPatterns.some((pattern) => pattern.test(input));
    }

    let showAll = false;

    $: hasAllSection = allNames.length > 0;
    $: if (!hasAllSection) {
        showAll = false;
    }

    function toggleAll() {
        showAll = !showAll;
    }

    function emitTextEdit(attValue: string, commit: boolean) {
        const elementId = editResponseContent?.object?.id ?? null;
        if (!elementId) return;
        const param: EditActionSetParam = {
            elementId,
            attribute: "text",
            value: attValue,
        };
        onEditSet?.(param, commit);
    }

    function handleTextInput(event: Event) {
        const target = event.target as HTMLInputElement | null;
        if (!target) return;
        emitTextEdit(target.value, false);
    }

    function handleTextBlur(event: Event) {
        const target = event.target as HTMLInputElement | null;
        if (!target) return;
        emitTextEdit(target.value, true);
    }
</script>

<div class="vrv-attribute-list-wrapper">
    {#if editResponseContent?.object && editResponseContent.object.element === "text"}
        <input
            class="vrv-form-input"
            data-att-name="text"
            value={editResponseContent.object.text}
            on:input={handleTextInput}
            on:blur={handleTextBlur}
        >
    {:else}
    <div class="vrv-attribute-filter"></div>
    <table class="vrv-attribute-table">
        <tbody>
            {#each Object.entries(attributes) as [name, value]}
                <AttributeRow
                    elementId={editResponseContent?.object?.id ?? null}
                    {name}
                    value={String(value)}
                    optionsAll={allAttrs?.[name] ?? null}
                    attributeType={typeFor(name)}
                    readOnly={isReadOnly(name)}
                    customOptions={customOptionsFor(name)}
                    onEditAttribute={onEditSet}
                />
            {/each}
            {#each preferredNames as name}
                <AttributeRow
                    elementId={editResponseContent?.object?.id ?? null}
                    {name}
                    value=""
                    optionsAll={allAttrs?.[name] ?? null}
                    attributeType={typeFor(name)}
                    readOnly={isReadOnly(name)}
                    customOptions={customOptionsFor(name)}
                    onEditAttribute={onEditSet}
                />
            {/each}
            {#if hasAllSection}
                <tr>
                    <td colspan="2" class="vrv-show-more">
                        <span
                            class={showAll ? "all" : "close all"}
                            on:click={toggleAll}
                        ></span>
                    </td>
                </tr>
            {/if}
        </tbody>
        {#if allNames.length > 0}
            <tbody style="display: {showAll ? 'table-row-group' : 'none'};">
                {#each allNames as name}
                    <AttributeRow
                        elementId={editResponseContent?.object?.id ?? null}
                        {name}
                        value=""
                        optionsAll={allAttrs?.[name] ?? null}
                        attributeType={typeFor(name)}
                        readOnly={isReadOnly(name)}
                        customOptions={customOptionsFor(name)}
                        onEditAttribute={onEditSet}
                    />
                {/each}
            </tbody>
        {/if}
    </table>
    {/if}
</div>
