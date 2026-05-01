<script lang="ts">
    import { withBaseUrl } from "../app/asset-url";
    import { actionDefinitions, contextButtonBars } from "../app/actions/action.bundle";
    import type { EditActionName, EditActionParam, Mode } from "../app/types";

    export let mode: Mode;
    export let onToggleMode: () => void;
    export let xmlMode = false;
    export let workerBusy = false;
    export let onValidateXml: (() => void) | null = null;
    export let selectedElementName: string | null = null;
    export let onContextAction:
        | ((action: EditActionName, label: string, param?: EditActionParam, actionKey?: string, dialog?: string) => void)
        | null = null;

    const undoIconUrl = withBaseUrl("icons/editor/undo.png");
    const redoIconUrl = withBaseUrl("icons/editor/redo.png");

    type ContextButtonEntry = {
        name: string;
        action: string;
        icon: string;
        dialog?: string;
    };
    type ResolvedContextButton = {
        actionKey: string;
        label: string;
        action: EditActionName;
        param?: EditActionParam;
        dialog?: string;
        iconUrl: string;
    };
    let contextBars: ResolvedContextButton[][] = [];

    function buttonBarsFor(name: string | null): ResolvedContextButton[][] {
        if (!name) return [];
        const bars = contextButtonBars[name] ?? [];
        const resolvedBars: ResolvedContextButton[][] = [];
        for (const bar of bars as ContextButtonEntry[][]) {
            const resolvedBar: ResolvedContextButton[] = [];
            for (const button of bar) {
                const definition = actionDefinitions[button.action];
                if (!definition) continue;
                resolvedBar.push({
                    actionKey: button.action,
                    label: button.name,
                    action: definition.action,
                    param: definition.param,
                    dialog: button.dialog,
                    iconUrl: withBaseUrl(button.icon),
                });
            }
            if (resolvedBar.length > 0) resolvedBars.push(resolvedBar);
        }
        return resolvedBars;
    }

    $: contextBars = buttonBarsFor(selectedElementName);
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
                            on:click={() => onContextAction?.(button.action, button.label, button.param, button.actionKey, button.dialog)}
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
