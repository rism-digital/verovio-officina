<script lang="ts">
    import type { ContextToolsApi, TreeNodeData } from "../app/types";
    import { treeNodeKey } from "../app/tree-node-key";

    export let elementId: string | null = null;
    export let contextToolsApi: ContextToolsApi | null = null;

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

    function staffNumber(staffDef: TreeNodeData): number | null {
        const number = Number(staffDef.attributes?.["n"]);
        return Number.isInteger(number) && number > 0 ? number : null;
    }

    function editStaffDef(staffDef: TreeNodeData) {
        const staffN = staffNumber(staffDef);
        if (!elementId || !contextToolsApi || staffN === null) return;
        void contextToolsApi.openStaffDefProperties(elementId, staffN);
    }

    async function refresh(
        currentScoreDefId: string | null,
        api: ContextToolsApi | null,
    ) {
        const currentRequestId = ++requestId;
        staffDefs = [];
        loading = false;
        if (!currentScoreDefId || !api) return;

        loading = true;
        const scoreDef = await api.loadSubTree("scoreDef", currentScoreDefId);
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
            {#each staffDefs as staffDef, index (treeNodeKey(staffDef))}
                <button
                    class="vrv-context-action-button"
                    type="button"
                    data-id={treeNodeKey(staffDef)}
                    title={`Edit ${buttonLabel(staffDef, index)}`}
                    disabled={staffNumber(staffDef) === null}
                    on:click={() => editStaffDef(staffDef)}
                >{buttonLabel(staffDef, index)}</button>
            {/each}
        </div>
    </div>
{/if}
