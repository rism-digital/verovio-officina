<script lang="ts">
    import {
        resolveMenuActions,
        type ResolvedMenuAction,
    } from "../app/action-resolver";
    import { withBaseUrl } from "../app/asset-url";
    import type { ActionHandler, Action } from "../app/types";
    export let canZoom = false;
    export let canZoomIn = true;
    export let canZoomOut = true;
    export let canGoPrev = false;
    export let canGoNext = false;
    export let xmlMode = false;

    export let onOpen: ActionHandler | null = null;
    export let onSave: ActionHandler | null = null;
    export let onExport: ActionHandler | null = null;
    export let onZoomIn: ActionHandler | null = null;
    export let onZoomOut: ActionHandler | null = null;
    export let onPrevPage: ActionHandler | null = null;
    export let onNextPage: ActionHandler | null = null;
    export let onToggleXml: ActionHandler | null = null;
    export let onScoreProperties: ActionHandler | null = null;
    export let onContextAction: ((action: Action) => void) | null = null;
    export let onAbout: ActionHandler | null = null;

    const prevIconUrl = withBaseUrl("icons/toolbar/arrow-left.png");
    const nextIconUrl = withBaseUrl("icons/toolbar/arrow-right.png");
    const zoomOutIconUrl = withBaseUrl("icons/toolbar/zoom-out.png");
    const zoomInIconUrl = withBaseUrl("icons/toolbar/zoom-in.png");

    let addMeasureItems: ResolvedMenuAction[] = [];

    $: addMeasureItems = resolveMenuActions();
</script>

<nav class="vrv-toolbar vrv-text-no-select">
    <div class="vrv-menu">
        <div class="vrv-btn-text" data-before="File"></div>
        <div class="vrv-menu-content">
            <div class="vrv-v-separator"></div>
            <div
                class="vrv-menu-text"
                data-before="Import MEI file"
                on:click={() => onOpen?.()}
            ></div>
            <div class="vrv-v-separator"></div>
            <div
                class="vrv-menu-text"
                data-before="Export MEI file"
                on:click={() => onSave?.()}
            ></div>
            <div
                class="vrv-menu-text"
                data-before="Export as SVG"
                on:click={() => onExport?.()}
            ></div>
        </div>
    </div>
    <div class="vrv-menu">
        <div class="vrv-btn-text" data-before="Edit"></div>
        <div class="vrv-menu-content">
            <div class="vrv-v-separator"></div>
            <div
                class="vrv-menu-text"
                data-before="Score properties"
                on:click={() => onScoreProperties?.()}
            ></div>
        </div>
    </div>
    <div class="vrv-menu">
        <div class="vrv-btn-text" data-before="Add"></div>
        <div class="vrv-menu-content">
            <div class="vrv-submenu">
                <div class="vrv-submenu-text" data-before="Measure"></div>
                <div class="vrv-submenu-content">
                    {#each addMeasureItems as item}
                        <div
                            class="vrv-menu-text"
                            data-before={item.label}
                            on:click={() => onContextAction?.(item)}
                        ></div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
    <div class="vrv-btn-group">
        <div class="vrv-h-separator"></div>
        <div
            class:toggled={xmlMode}
            class="vrv-btn-text"
            data-before="XML"
            on:click={() => onToggleXml?.()}
        ></div>
    </div>
    <div class="vrv-btn-group">
        <div class="vrv-h-separator"></div>
        <div
            class:disabled={!canGoPrev}
            class="vrv-btn-icon-left"
            style={`background-image: url('${prevIconUrl}');`}
            data-before="Previous"
            on:click={() => onPrevPage?.()}
        ></div>
        <div
            class:disabled={!canGoNext}
            class="vrv-btn-icon"
            style={`background-image: url('${nextIconUrl}');`}
            data-before="Next"
            on:click={() => onNextPage?.()}
        ></div>
    </div>
    <div class="vrv-btn-group">
        <div class="vrv-h-separator"></div>
        <div
            class:disabled={!canZoom || !canZoomOut}
            class="vrv-btn-icon-left"
            style={`background-image: url('${zoomOutIconUrl}');`}
            data-before="Zoom out"
            on:click={() => onZoomOut?.()}
        ></div>
        <div
            class:disabled={!canZoom || !canZoomIn}
            class="vrv-btn-icon"
            style={`background-image: url('${zoomInIconUrl}');`}
            data-before="Zoom in"
            on:click={() => onZoomIn?.()}
        ></div>
    </div>
    <div class="vrv-h-separator"></div>
    <div class="vrv-menu">
        <div class="vrv-btn-text" data-before="Help"></div>
        <div class="vrv-menu-content">
            <div class="vrv-v-separator"></div>
            <div
                class="vrv-menu-text"
                data-before="About"
                on:click={() => onAbout?.()}
            ></div>
        </div>
    </div>
</nav>
