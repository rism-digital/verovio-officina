<script lang="ts">
    import AttributeList from "./AttributeList.svelte";
    import ElementReference from "./ElementReference.svelte";
    import Tree from "./Tree.svelte";
    import { editStatus } from "../app/state";
    import type {
        EditActionSetHandler,
        EditResponseContent,
        HoverElementHandler,
        SelectElementHandler,
        TargetedContextActionHandler,
    } from "../app/types";
    import type { RNGLoader } from "../app/rng-loader";

    export let editResponseContent: EditResponseContent | null = null;
    export let rngMEIAll: RNGLoader | null = null;
    export let rngMEIBasic: RNGLoader | null = null;
    export let onSelectElement: SelectElementHandler | null = null;
    export let onHoverElement: HoverElementHandler | null = null;
    export let onEditAttribute: EditActionSetHandler | null = null;
    export let onTargetedContextAction: TargetedContextActionHandler | null = null;

    let closedSections = {
        structure: false,
        attributes: false,
        referencing: false,
        referenced: false,
    };

    function toggleSection(key: keyof typeof closedSections) {
        closedSections = { ...closedSections, [key]: !closedSections[key] };
    }
</script>

<div class="vrv-legend vrv-collapsible" class:close={closedSections.structure}>
    Score structure<span
        class="icon"
        on:click={() => toggleSection("structure")}>▼</span
    >
</div>
<div
    class="vrv-field-set vrv-collapsible"
    class:close={closedSections.structure}
    style="flex-grow: 3;"
>
    <div class="vrv-field-set-panel" style="display: flex;">
        <Tree
            ancestors={editResponseContent?.ancestors ?? null}
            context={editResponseContent?.context ?? null}
            selectedId={$editStatus.selection?.id ?? null}
            {onSelectElement}
            {onHoverElement}
            onContextAction={onTargetedContextAction}
        />
    </div>
</div>

<div class="vrv-legend vrv-collapsible" class:close={closedSections.attributes}>
    Attributes or text<span
        class="icon"
        on:click={() => toggleSection("attributes")}>▼</span
    >
</div>
<div
    class="vrv-field-set vrv-collapsible"
    class:close={closedSections.attributes}
    style="flex-grow: 3;"
>
    <div class="vrv-field-set-panel" style="display: flex;">
        <AttributeList
            {editResponseContent}
            {rngMEIAll}
            {rngMEIBasic}
            onEditSet={onEditAttribute}
        />
    </div>
</div>

<div class="vrv-legend vrv-collapsible" class:close={closedSections.referencing}>
    Referencing elements<span
        class="icon"
        on:click={() => toggleSection("referencing")}>▼</span
    >
</div>

<div class="vrv-field-set vrv-collapsible" class:close={closedSections.referencing}>
    <div class="vrv-field-set-panel" style="display: flex;">
        <ElementReference
            references={editResponseContent?.referringElements ?? null}
            direction="to"
            {onSelectElement}
            {onHoverElement}
        />
    </div>
</div>

<div class="vrv-legend vrv-collapsible" class:close={closedSections.referenced}>
    Referenced elements<span
        class="icon"
        on:click={() => toggleSection("referenced")}>▼</span
    >
</div>

<div class="vrv-field-set vrv-collapsible" class:close={closedSections.referenced}>
    <div class="vrv-field-set-panel">
        <ElementReference
            references={editResponseContent?.referencedElements ?? null}
            direction="from"
            {onSelectElement}
            {onHoverElement}
        />
    </div>
</div>
