<script lang="ts">
    import AttributeList from "./AttributeList.svelte";
    import type {
        EditActionSetHandler,
        EditResponseContent,
    } from "../app/types";
    import type { RNGLoader } from "../app/rng-loader";

    export let editResponseContent: EditResponseContent | null = null;
    export let rngMEIAll: RNGLoader | null = null;
    export let rngMEIBasic: RNGLoader | null = null;
    export let onEditAttribute: EditActionSetHandler | null = null;
</script>

<AttributeList
    {editResponseContent}
    {rngMEIAll}
    {rngMEIBasic}
    onEditSet={onEditAttribute}
/>
