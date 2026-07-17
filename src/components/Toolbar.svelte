<script lang="ts">
    import { withBaseUrl } from "../app/asset-url";
    import {
        resolveContextButtonBars,
        type ResolvedContextButton,
    } from "../app/action-resolver";
    import { enableInsertMode } from "../app/editor-rules";
    import type { InputMode } from "../app/state";
    import type { Action } from "../app/types";

    export let insertMode = false;
    export let onToggleMode: () => void;
    export let pianoKeyboardEnabled = false;
    export let onTogglePianoKeyboard: () => void;
    export let inputMode: InputMode = "durationFirst";
    export let onInputModeChange: (inputMode: InputMode) => void;
    export let xmlMode = false;
    export let onValidateXml: (() => void) | null = null;
    export let selectedElementName: string | null = null;
    export let hasSecondarySelection = false;
    export let canUndo = false;
    export let canRedo = false;
    export let canRefreshLayout = false;
    export let onUndo: (() => void) | null = null;
    export let onRedo: (() => void) | null = null;
    export let onRefreshLayout: (() => void) | null = null;
    export let onContextAction: ((action: Action) => void) | null = null;

    const undoIconUrl = withBaseUrl("icons/editor/undo.png");
    const redoIconUrl = withBaseUrl("icons/editor/redo.png");
    const refreshLayoutIconUrl = withBaseUrl("icons/editor/update.png");

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

    function handleUndo() {
        if (!canUndo) return;
        onUndo?.();
    }

    function handleRedo() {
        if (!canRedo) return;
        onRedo?.();
    }

    function handleRefreshLayout() {
        if (!canRefreshLayout) return;
        onRefreshLayout?.();
    }

    function handleContextAction(action: Action) {
        if (insertMode) return;
        onContextAction?.(action);
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
            <div
                class="vrv-btn-icon-large vrv-toggleable {inputMode === 'durationFirst' ? 'toggled' : ''} {insertMode ? 'disabled' : ''}"
                style={`background-image: url("/icons/toolbar/duration-first.png");`}
                on:click={() => onInputModeChange("durationFirst")}
                on:keydown={(event) => handleButtonKeydown(event, () => onInputModeChange("durationFirst"))}
            ></div>
            <div
                class="vrv-btn-icon-large vrv-toggleable {inputMode === 'pitchFirst' ? 'toggled' : ''} {insertMode ? 'disabled' : ''}"                
                style={`background-image: url("/icons/toolbar/pitch-first.png");`}
                on:click={() => onInputModeChange("pitchFirst")}
                on:keydown={(event) => handleButtonKeydown(event, () => onInputModeChange("pitchFirst"))}
            ></div>
        </div>
        <div class="vrv-h-separator"></div>
        <div
            class="vrv-btn-icon-large {canUndo ? '' : 'disabled'}"
            style={`background-image: url('${undoIconUrl}');`}
            on:click={handleUndo}
            on:keydown={(event) => handleButtonKeydown(event, handleUndo)}
        >
            <span class="vrv-tooltip">Undo ('Shift-Ctrl-V')</span>
        </div>
        <div
            class="vrv-btn-icon-large {canRedo ? '' : 'disabled'}"
            style={`background-image: url('${redoIconUrl}');`}
            on:click={handleRedo}
            on:keydown={(event) => handleButtonKeydown(event, handleRedo)}
        >
            <span class="vrv-tooltip">Redo ('Shift-Ctrl-V')</span>
        </div>
        <div
            class="vrv-btn-icon-large {canRefreshLayout ? '' : 'disabled'}"
            style={`background-image: url('${refreshLayoutIconUrl}');`}
            on:click={handleRefreshLayout}
            on:keydown={(event) => handleButtonKeydown(event, handleRefreshLayout)}
        >
            <span class="vrv-tooltip">Refresh layout ('Primary-Shift-L')</span>
        </div>
        {#if contextBars.length > 0}
            <div class="vrv-h-separator"></div>
            {#each contextBars as bar, barIndex}
                <div class="vrv-btn-group">
                    {#each bar as button}
                        <div
                            class="vrv-btn-icon-large {insertMode ? 'disabled' : ''}"
                            style={`background-image: url("${button.iconUrl}");`}
                            on:click={() => handleContextAction(button)}
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
