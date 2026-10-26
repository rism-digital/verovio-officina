<script lang="ts">
    import type { ContextToolsApi, TreeNodeData } from "../app/types";

    export let elementId: string | null = null;
    export let contextToolsApi: ContextToolsApi | null = null;
    export let onEditStaffDef:
        | ((staffDef: TreeNodeData) => void | Promise<void>)
        | null = null;

    let staffDefs: TreeNodeData[] = [];
    let loading = false;
    let requestId = 0;

    function collectStaffDefs(node: TreeNodeData): TreeNodeData[] {
        const matches = node.element === "staffDef" ? [node] : [];
        for (const child of node.children ?? []) {
            matches.push(...collectStaffDefs(child));
        }
        return matches;
    }

    function buttonLabel(staffDef: TreeNodeData, index: number): string {
        const number = staffDef.attributes?.["n"];
        return number === undefined
            ? `Staff ${index + 1}`
            : `Staff ${String(number)}`;
    }

    async function refresh(
        currentElementId: string | null,
        api: ContextToolsApi | null,
    ) {
        const currentRequestId = ++requestId;
        staffDefs = [];
        loading = false;
        if (!currentElementId || !api) return;

        loading = true;
        const scoreDef = await api.loadSubTree("scoreDef", currentElementId);
        if (currentRequestId !== requestId) return;

        staffDefs = scoreDef ? collectStaffDefs(scoreDef) : [];
        loading = false;
    }

    $: void refresh(elementId, contextToolsApi);
</script>

{#if loading}
    <div class="vrv-context-actions">Loading staff definitions…</div>
{:else if staffDefs.length > 0}
    <div class="vrv-context-actions" aria-label="Staff definitions">
        <div class="vrv-context-action-group">
            {#each staffDefs as staffDef, index (staffDef.id)}
                <button
                    class="vrv-context-action-button"
                    type="button"
                    data-id={staffDef.id}
                    title={`Edit ${buttonLabel(staffDef, index)}`}
                    on:click={() => onEditStaffDef?.(staffDef)}
                >{buttonLabel(staffDef, index)}</button>
            {/each}
        </div>
    </div>
{/if}
