<script lang="ts">
    import AttributeRow from "./AttributeRow.svelte";
    import type { EditActionSetParam, EditActionSetHandler as EditSetHandler, EditInfoContent } from "../app/types";
    import type { ElementDef, RNGLoader } from "../app/rng-loader";

    export let editInfoContent: EditInfoContent | null = null;
    export let rngMEIAll: RNGLoader | null = null;
    export let rngMEIBasic: RNGLoader | null = null;
    export let onEditSet: EditSetHandler | null = null;

    $: elementName = editInfoContent?.object?.element ?? "";
    $: attributes = {
        ...(editInfoContent?.object?.attributes ?? {}),
        ...(editInfoContent?.object?.id ? { "xml:id": editInfoContent.object.id } : {}),
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
    $: basicTags =
        elementName && rngMEIBasic ? rngMEIBasic.getTags()[elementName] : null;
    $: allAttrs = isElementDef(allTags) ? allTags.attrs : {};
    $: basicAttrs = isElementDef(basicTags) ? basicTags.attrs : {};
    $: allTypes = isElementDef(allTags) ? allTags.types : {};
    $: basicTypes = isElementDef(basicTags) ? basicTags.types : {};
    $: typeFor = (name: string) => basicTypes?.[name] ?? allTypes?.[name] ?? null;
    $: usedNames = new Set(Object.keys(attributes));
    $: basicNames = Object.keys(basicAttrs).filter(
        (name) => !usedNames.has(name),
    );
    $: allNames = Object.keys(allAttrs).filter(
        (name) => !usedNames.has(name) && !basicNames.includes(name),
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

    let showBasic = false;
    let showAll = false;

    $: hasBasicSection = basicNames.length > 0;
    $: hasAllSection = allNames.length > 0;
    $: hasExpandableSection = hasBasicSection || hasAllSection;
    $: primaryExpanded = hasBasicSection ? showBasic : showAll;

    $: if (!hasBasicSection) {
        showBasic = false;
    }
    $: if (!hasAllSection) {
        showAll = false;
    }

    function togglePrimary() {
        if (hasBasicSection) {
            showBasic = !showBasic;
            if (!showBasic) showAll = false;
            return;
        }
        showAll = !showAll;
    }

    function toggleAll() {
        showAll = !showAll;
        if (showAll && hasBasicSection) showBasic = true;
    }

    function emitTextEdit(attValue: string, commit: boolean) {
        const elementId = editInfoContent?.object?.id ?? null;
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
    {#if editInfoContent?.object && editInfoContent.object.element === "text"}
        <input
            class="vrv-form-input"
            data-att-name="text"
            value={editInfoContent.object.text}
            on:input={handleTextInput}
            on:blur={handleTextBlur}
        >
    {:else}
    <div class="vrv-attribute-filter"></div>
    <table class="vrv-attribute-table">
        <tbody>
            {#each Object.entries(attributes) as [name, value]}
                <AttributeRow
                    elementId={editInfoContent?.object?.id ?? null}
                    {name}
                    value={String(value)}
                    optionsAll={allAttrs?.[name] ?? null}
                    optionsBasic={basicAttrs?.[name] ?? null}
                    attributeType={typeFor(name)}
                    readOnly={isReadOnly(name)}
                    customOptions={customOptionsFor(name)}
                    onEditAttribute={onEditSet}
                />
            {/each}
            {#if hasExpandableSection}
                <tr>
                    <td colspan="2" class="vrv-show-more">
                        <span
                            class={primaryExpanded ? "more" : "close more"}
                            on:click={togglePrimary}
                        ></span>
                    </td>
                </tr>
            {/if}
        </tbody>
        {#if basicNames.length > 0}
            <tbody style="display: {showBasic ? 'table-row-group' : 'none'};">
                {#each basicNames as name}
                    <AttributeRow
                        elementId={editInfoContent?.object?.id ?? null}
                        {name}
                        value=""
                        optionsAll={allAttrs?.[name] ?? null}
                        optionsBasic={basicAttrs?.[name] ?? null}
                        attributeType={typeFor(name)}
                        readOnly={isReadOnly(name)}
                        customOptions={customOptionsFor(name)}
                        onEditAttribute={onEditSet}
                    />
                {/each}
                {#if allNames.length > 0}
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
        {/if}
        {#if allNames.length > 0}
            <tbody style="display: {showAll ? 'table-row-group' : 'none'};">
                {#each allNames as name}
                    <AttributeRow
                        elementId={editInfoContent?.object?.id ?? null}
                        {name}
                        value=""
                        optionsAll={allAttrs?.[name] ?? null}
                        optionsBasic={basicAttrs?.[name] ?? null}
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
