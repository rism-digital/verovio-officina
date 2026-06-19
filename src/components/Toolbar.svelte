<script lang="ts">
    import { withBaseUrl } from "../app/asset-url";
    import {
        resolveContextButtonBars,
        type ResolvedContextButton,
    } from "../app/action-resolver";
    import type { Action } from "../app/types";

    export let insertMode = false;
    export let onToggleMode: () => void;
    export let pianoKeyboardEnabled = false;
    export let onTogglePianoKeyboard: () => void;
    export let xmlMode = false;
    export let onValidateXml: (() => void) | null = null;
    export let selectedElementName: string | null = null;
    export let hasSecondarySelection = false;
    export let onContextAction: ((action: Action) => void) | null = null;

    const undoIconUrl = withBaseUrl("icons/editor/undo.png");
    const redoIconUrl = withBaseUrl("icons/editor/redo.png");

    let contextBars: ResolvedContextButton[][] = [];

    $: contextBars = resolveContextButtonBars(selectedElementName, {
        includeDialogs: true,
        includeSecondary: hasSecondarySelection,
    });

    function handleButtonKeydown(event: KeyboardEvent, handler: () => void) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handler();
    }

    function enableInsertMode(selectedElementName: string | null): boolean {
        return ["chord", "layer", "mRest", "mSpace", "note", "rest", "space", "staff"].includes(selectedElementName ?? "");
    }


</script>

<section class="vrv-editor-toolbar vrv-text-no-select">
    {#if xmlMode}
        <div class="vrv-btn-group">
            <div class="vrv-btn-text disabled" data-before="Validate" on:click={() => onValidateXml?.()}></div>
        </div>
    {:else}
        <div class="vrv-btn-group">
            <div
                class="vrv-btn-icon vrv-toggleable {insertMode ? 'toggled' : ''} {enableInsertMode(selectedElementName) ? '' : 'disabled'}"
                on:click={onToggleMode}
                on:keydown={(event) => handleButtonKeydown(event, onToggleMode)}
                style={`background-image: url("/icons/toolbar/write.png");`}
                data-before="{insertMode ? "Esc" : "Enter"}"
            >
            </div>
            <div
                class="vrv-btn-icon-large vrv-toggleable {pianoKeyboardEnabled ? 'toggled' : ''}"
                style={`background-image: url("/icons/keyboard/piano.png");`}
                on:click={onTogglePianoKeyboard}
                on:keydown={(event) => handleButtonKeydown(event, onTogglePianoKeyboard)}
            >
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
