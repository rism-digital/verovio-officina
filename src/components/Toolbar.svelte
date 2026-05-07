<script lang="ts">
    import { withBaseUrl } from "../app/asset-url";
    import {
        resolveContextButtonBars,
        type ResolvedContextButton,
    } from "../app/action-resolver";
    import type { ContextAction, Mode } from "../app/types";

    export let mode: Mode;
    export let onToggleMode: () => void;
    export let xmlMode = false;
    export let workerBusy = false;
    export let onValidateXml: (() => void) | null = null;
    export let selectedElementName: string | null = null;
    export let secondarySelection: string | null = null;
    export let onContextAction: ((action: ContextAction) => void) | null = null;

    const undoIconUrl = withBaseUrl("icons/editor/undo.png");
    const redoIconUrl = withBaseUrl("icons/editor/redo.png");

    let contextBars: ResolvedContextButton[][] = [];

    $: contextBars = resolveContextButtonBars(selectedElementName, {
        includeDialogs: true,
        secondarySelection,
    });
</script>

<section class="vrv-editor-toolbar vrv-text-no-select">
    {#if xmlMode}
        <div class="vrv-btn-group">
            <div class="vrv-btn-text" data-before="Validate" class:disabled={workerBusy} on:click={() => onValidateXml?.()}></div>
        </div>
    {:else}
        <div class="vrv-btn-group">
            <div class="vrv-btn vrv-toggleable {mode === 'insert' ? 'toggled' : ''}" on:click={onToggleMode}>
                {mode === "insert" ? "Insert" : "Edit"}
            </div>
        </div>
        <div class="vrv-h-separator"></div>
        <div class="vrv-btn-icon-large disabled" style={`background-image: url('${undoIconUrl}');`}>
            <span class="vrv-tooltip">Undo ('Shift-Ctrl-V')</span>
        </div>
        <div class="vrv-btn-icon-large disabled" style={`background-image: url('${redoIconUrl}');`}>
            <span class="vrv-tooltip">Redo ('Shift-Ctrl-V')</span>
        </div>
        {#if contextBars.length > 0}
            <div class="vrv-h-separator"></div>
            {#each contextBars as bar, barIndex}
                <div class="vrv-btn-group">
                    {#each bar as button}
                        <div
                            class="vrv-btn-icon-large"
                            style={`background-image: url("${button.iconUrl}");`}
                            on:click={() => onContextAction?.(button)}
                        ></div>
                    {/each}
                </div>
                {#if barIndex < contextBars.length - 1}
                    <div class="vrv-h-separator"></div>
                {/if}
            {/each}
        {/if}
    {/if}
</section>
