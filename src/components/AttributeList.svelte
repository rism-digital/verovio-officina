<script lang="ts">
    import AttributeRow from "./AttributeRow.svelte";
    import type { EditInfoContent } from "../app/types";
    import type { ElementDef, RNGLoader } from "../app/rng-loader";

    export let editInfoContent: EditInfoContent | null = null;
    export let rngMEIAll: RNGLoader | null = null;
    export let rngMEIBasic: RNGLoader | null = null;

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

    function isReadOnly(attrName: string) {
        const input = `${elementName}@${attrName}`;
        return readOnlyPatterns.some((pattern) => pattern.test(input));
    }

    let showBasic = false;
    let showAll = false;

    function toggleBasic() {
        showBasic = !showBasic;
        if (!showBasic) showAll = false;
    }

    function toggleAll() {
        showAll = !showAll;
        if (showAll) showBasic = true;
    }
</script>

<div class="vrv-attribute-list-wrapper">
    <div class="vrv-attribute-filter"></div>
    <table class="vrv-attribute-table">
        <tbody>
            {#each Object.entries(attributes) as [name, value]}
                <AttributeRow
                    {name}
                    value={String(value)}
                    optionsAll={allAttrs?.[name] ?? null}
                    optionsBasic={basicAttrs?.[name] ?? null}
                    readOnly={isReadOnly(name)}
                />
            {/each}
            <tr>
                <td colspan="2" class="vrv-show-more">
                    <span
                        class={showBasic ? "more" : "close more"}
                        on:click={toggleBasic}
                    ></span>
                </td>
            </tr>
        </tbody>
        {#if basicNames.length > 0}
            <tbody style="display: {showBasic ? 'table-row-group' : 'none'};">
                {#each basicNames as name}
                    <AttributeRow
                        {name}
                        value=""
                        optionsAll={allAttrs?.[name] ?? null}
                        optionsBasic={basicAttrs?.[name] ?? null}
                        readOnly={isReadOnly(name)}
                    />
                {/each}
                <tr>
                    <td colspan="2" class="vrv-show-more">
                        <span
                            class={showAll ? "all" : "close all"}
                            on:click={toggleAll}
                        ></span>
                    </td>
                </tr>
            </tbody>
        {/if}
        {#if allNames.length > 0}
            <tbody style="display: {showAll ? 'table-row-group' : 'none'};">
                {#each allNames as name}
                    <AttributeRow
                        {name}
                        value=""
                        optionsAll={allAttrs?.[name] ?? null}
                        optionsBasic={basicAttrs?.[name] ?? null}
                        readOnly={isReadOnly(name)}
                    />
                {/each}
            </tbody>
        {/if}
    </table>
</div>
