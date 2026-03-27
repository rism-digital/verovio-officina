<script lang="ts">
    import type { ActionHandler } from "../app/types";
    export let canZoom = false;
    export let canZoomIn = true;
    export let canZoomOut = true;
    export let canGoPrev = false;
    export let canGoNext = false;

    export let onOpen: ActionHandler | null = null;
    export let onSave: ActionHandler | null = null;
    export let onExport: ActionHandler | null = null;
    export let onZoomIn: ActionHandler | null = null;
    export let onZoomOut: ActionHandler | null = null;
    export let onPrevPage: ActionHandler | null = null;
    export let onNextPage: ActionHandler | null = null;
</script>

<nav class="vrv-toolbar vrv-text-no-select">
    <div class="vrv-menu">
        <div class="vrv-btn-text" data-before="File"></div>
        <div class="vrv-menu-content">
            <div class="vrv-v-separator"></div>
            <div class="vrv-menu-text" data-before="Import MEI file" on:click={() => onOpen?.()}></div>
            <div class="vrv-v-separator"></div>
            <div class="vrv-menu-text" data-before="Export MEI file" on:click={() => onSave?.()}></div>
            <div class="vrv-menu-text" data-before="Export as SVG" on:click={() => onExport?.()}></div>
        </div>
    </div>
    <div class="vrv-menu">
        <div class="vrv-btn-text" data-before="Edit"></div>
        <div class="vrv-menu-content">
            <div class="vrv-v-separator"></div>
            <div class="vrv-menu-text" data-before="Score properties"></div>
        </div>
    </div>
    <div class="vrv-btn-group">
        <div class="vrv-h-separator"></div>
        <div
            class:disabled={!canGoPrev}
            class="vrv-btn-icon-left"
            style="background-image: url('/icons/toolbar/arrow-left.png');"
            data-before="Previous"
            on:click={() => onPrevPage?.()}
        ></div>
        <div
            class:disabled={!canGoNext}
            class="vrv-btn-icon"
            style="background-image: url('/icons/toolbar/arrow-right.png');"
            data-before="Next"
            on:click={() => onNextPage?.()}
        ></div>
    </div>
    <div class="vrv-btn-group">
        <div class="vrv-h-separator"></div>
        <div
            class:disabled={!canZoom || !canZoomOut}
            class="vrv-btn-icon-left"
            style="background-image: url('/icons/toolbar/zoom-out.png');"
            data-before="Zoom out"
            on:click={() => onZoomOut?.()}
        ></div>
        <div
            class:disabled={!canZoom || !canZoomIn}
            class="vrv-btn-icon"
            style="background-image: url('/icons/toolbar/zoom-in.png');"
            data-before="Zoom in"
            on:click={() => onZoomIn?.()}
        ></div>
    </div>
</nav>
