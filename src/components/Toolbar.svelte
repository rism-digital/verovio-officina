<script lang="ts">
    import { withBaseUrl } from "../app/asset-url";
    import { enableInsertMode } from "../app/editor-rules";
    import type { InputMode } from "../app/state";

    export let insertMode = false;
    export let onToggleMode: () => void;
    export let pianoKeyboardEnabled = false;
    export let onTogglePianoKeyboard: () => void;
    export let sidePanelVisible = true;
    export let contextPanelVisible = true;
    export let onToggleSidePanel: (() => void) | null = null;
    export let onToggleContextPanel: (() => void) | null = null;
    export let onSelectMainScoreDef: (() => void) | null = null;
    export let inputMode: InputMode = "durationFirst";
    export let onInputModeChange: (inputMode: InputMode) => void;
    export let xmlMode = false;
    export let onValidateXml: (() => void) | null = null;
    export let selectedElementName: string | null = null;
    export let canUndo = false;
    export let canRedo = false;
    export let canRefreshLayout = false;
    export let showHidden = false;
    export let canToggleShowHidden = false;
    export let autoBeam = true;
    export let canToggleAutoBeam = false;
    export let onUndo: (() => void) | null = null;
    export let onRedo: (() => void) | null = null;
    export let onRefreshLayout: (() => void) | null = null;
    export let onToggleShowHidden: (() => void) | null = null;
    export let onToggleAutoBeam: (() => void) | null = null;

    const undoIconUrl = withBaseUrl("icons/editor/undo.png");
    const redoIconUrl = withBaseUrl("icons/editor/redo.png");
    const refreshLayoutIconUrl = withBaseUrl("icons/editor/update.png");
    const showHiddenIconUrl = withBaseUrl("icons/toolbar/show-hidden.png");
    const autoBeamIconUrl = withBaseUrl("icons/editor/auto-beam.png");
    const leftPanelIconUrl = withBaseUrl("icons/toolbar/left-panel.png");
    const rightPanelIconUrl = withBaseUrl("icons/toolbar/right-panel.png");
    const scoreDefIconUrl = withBaseUrl("icons/mei/scoreDef.png");

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

    function handleToggleShowHidden() {
        if (!canToggleShowHidden) return;
        onToggleShowHidden?.();
    }

    function handleToggleAutoBeam() {
        if (!canToggleAutoBeam) return;
        onToggleAutoBeam?.();
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
            class="vrv-btn-icon-large vrv-toggleable {sidePanelVisible ? 'toggled' : ''}"
            style={`background-image: url('${leftPanelIconUrl}');`}
            role="button"
            tabindex="0"
            aria-label="Show or hide left panel"
            aria-pressed={sidePanelVisible}
            on:click={() => onToggleSidePanel?.()}
            on:keydown={(event) => handleButtonKeydown(event, () => onToggleSidePanel?.())}
        >
            <span class="vrv-tooltip">Show or hide navigation panel</span>
        </div>
        <div
            class="vrv-btn-icon-large vrv-toggleable {contextPanelVisible ? 'toggled' : ''}"
            style={`background-image: url('${rightPanelIconUrl}');`}
            role="button"
            tabindex="0"
            aria-label="Show or hide right panel"
            aria-pressed={contextPanelVisible}
            on:click={() => onToggleContextPanel?.()}
            on:keydown={(event) => handleButtonKeydown(event, () => onToggleContextPanel?.())}
        >
            <span class="vrv-tooltip">Show or hide tool panel</span>
        </div>
        <div
            class="vrv-btn-icon-large"
            style={`background-image: url('${scoreDefIconUrl}');`}
            role="button"
            tabindex="0"
            aria-label="Select main score definition"
            on:click={() => onSelectMainScoreDef?.()}
            on:keydown={(event) =>
                handleButtonKeydown(event, () => onSelectMainScoreDef?.())}
        >
            <span class="vrv-tooltip">Main score definition</span>
        </div>
        <div class="vrv-h-separator"></div>
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
            <div
                class="vrv-btn-icon-large vrv-toggleable {inputMode === 'combined' ? 'toggled' : ''} {insertMode ? 'disabled' : ''}"
                style={`background-image: url("/icons/toolbar/input-combined.png");`}
                role="button"
                tabindex="0"
                aria-pressed={inputMode === "combined"}
                aria-disabled={insertMode}
                on:click={() => onInputModeChange("combined")}
                on:keydown={(event) => handleButtonKeydown(event, () => onInputModeChange("combined"))}
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
        <div
            class="vrv-btn-icon-large vrv-toggleable {showHidden ? 'toggled' : ''} {canToggleShowHidden ? '' : 'disabled'}"
            style={`background-image: url('${showHiddenIconUrl}');`}
            on:click={handleToggleShowHidden}
            on:keydown={(event) => handleButtonKeydown(event, handleToggleShowHidden)}
        >
            <span class="vrv-tooltip">Show hidden elements</span>
        </div>
        <div
            class="vrv-btn-icon-large vrv-toggleable {autoBeam ? 'toggled' : ''} {canToggleAutoBeam ? '' : 'disabled'}"
            style={`background-image: url('${autoBeamIconUrl}');`}
            on:click={handleToggleAutoBeam}
            on:keydown={(event) => handleButtonKeydown(event, handleToggleAutoBeam)}
        >
            <span class="vrv-tooltip">Automatically beam inserted notes</span>
        </div>
    {/if}
</section>
