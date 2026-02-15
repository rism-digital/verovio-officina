<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";
    import SidePanel from "./SidePanel.svelte";
    import type { EditActionSetParam, EditActionSetHandler, EditInfoContent, SelectElementHandler, ViewModel } from "../app/types";
    import type { RNGLoader } from "../app/rng-loader";

    export let view: ViewModel;
    export let onResize: (size: { width: number; height: number }) => void;
    export let onElementSelect: SelectElementHandler | null = null;
    export let onAttributeEdit: EditActionSetHandler | null = null;
    export let editInfoContent: EditInfoContent| null = null;
    export let rngMEIAll: RNGLoader | null = null;
    export let rngMEIBasic: RNGLoader | null = null;

    function handleSelect(id: string | null) {
        if (id) onElementSelect?.(id);
    }

    function handleHover(id: string | null) {
        highlightHover(id);
    }

    function handleEditAttribute(param: EditActionSetParam, commit: boolean) {
        onAttributeEdit?.(param, commit);
    }

    const RESIZE_DEBOUNCE_MS = 150;

    let verovioView: HTMLDivElement | null = null;
    let svgWrapper: HTMLDivElement | null = null;
    let svgOverlay: HTMLDivElement | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let lastSize = { width: 0, height: 0 };
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastSvgId = 0;
    let lastSelectedId: string | null = null;
    let filterMarkup: string = "";
    let mouseoverId: string = "";

    function emitSize(width: number, height: number) {
        if (!onResize) return;
        if (width === lastSize.width && height === lastSize.height) return;
        lastSize = { width, height };
        if (resizeTimer) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(() => {
            resizeTimer = null;
            onResize(lastSize);
        }, RESIZE_DEBOUNCE_MS);
    }

    onMount(() => {
        fetch("/css/filter.xml")
            .then((response) => (response.ok ? response.text() : ""))
            .then((text) => {
                filterMarkup = text;
            })
            .catch(() => {
                filterMarkup = "";
            });

        if (!verovioView || typeof ResizeObserver === "undefined") return;
        resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                emitSize(Math.max(0, Math.floor(width)), Math.max(0, Math.floor(height)));
            }
        });
        resizeObserver.observe(verovioView);
    });

    onDestroy(() => {
        resizeObserver?.disconnect();
        resizeObserver = null;
        if (resizeTimer) {
            clearTimeout(resizeTimer);
            resizeTimer = null;
        }
    });

    function updateOverlay() {
        if (!svgWrapper || !svgOverlay) return;
        svgOverlay.innerHTML = svgWrapper.innerHTML;

        // Remove bounding boxes and other non-essential elements, and prepare for selection
        svgWrapper.querySelectorAll("g.bounding-box").forEach((node) => {
            node.remove();
        });

        svgOverlay.querySelectorAll(".slur.bounding-box, .tie.bounding-box").forEach((node) => {
            node.remove();
        });

        // Make all elements transparent but still hittable
        svgOverlay.querySelectorAll("g, path, text, ellipse, polyline").forEach((node) => {
            const element = node as SVGElement;
            element.style.stroke = "transparent";
            element.style.fill = "transparent";
        });

        svgOverlay
            .querySelectorAll(".slur path, .tie path, .stem rect, .dots ellipse, .barLineAttr path")
            .forEach((node) => {
                const element = node as SVGElement;
                element.style.strokeWidth = "90";
            });

        svgOverlay.querySelectorAll("g").forEach((node) => {
            const element = node as SVGGElement & {
                dataset: { bound?: string };
            };
            if (element.dataset.bound === "true") return;
            element.dataset.bound = "true";
            element.addEventListener("mousedown", onSVGOverlayMouseDown);
        });
    }

    function clearHover() {
        if (!svgWrapper || mouseoverId === "") return;
        let element = <SVGElement>svgWrapper.querySelector("#" + mouseoverId);
        if (element) element.style.filter = "";
        mouseoverId = "";
    }

    function highlightHover(id: string | null) {
        clearHover();
        if (!svgWrapper || !id) return;
        let element = <SVGElement>svgWrapper.querySelector("#" + id);
        if (element) {
            element.style.filter = "url(#highlighting)";
            mouseoverId = id;
        }
    }

    function clearSelected(id: string | null) {
        if (!svgWrapper || !id) return;
        let element = <SVGElement>svgWrapper.querySelector("#" + id);
        if (element) {
            highlightWithColor(element, "");
        }
    }

    function highlightSelected(id: string | null) {
        if (!svgWrapper || !id) return;
        let element = <SVGElement>svgWrapper.querySelector("#" + id);
        if (element) {
            highlightWithColor(element, "#cd0000");
        }
    }

    function highlightWithColor(g: SVGElement, color: string) {
        for (const node of Array.from(g.querySelectorAll("*:not(g)"))) {
            const parent = node.parentNode as SVGElement;
            // Do not highlight bounding box elements
            if (parent.classList.contains("bounding-box")) continue;
            const el = node as SVGElement;
            el.style.fill = color;
            el.style.stroke = color;
        }
    }

    function getClosestMEIElement(node: Element | null, elementType?: string): SVGGElement | null {
        if (!node) return null;

        const isG = node.tagName?.toLowerCase() === "g";
        const isBlocked = node.classList.contains("bounding-box") || node.classList.contains("notehead");

        if (!isG || isBlocked) {
            return getClosestMEIElement(node.parentElement, elementType);
        }

        if (elementType && !node.classList.contains(elementType)) {
            return getClosestMEIElement(node.parentElement, elementType);
        }

        return node as SVGGElement;
    }

    function onSVGOverlayMouseDown(event: MouseEvent) {
        event.stopPropagation();

        // Clicking on the overlay - nothing to do
        if (<HTMLDivElement>(<HTMLElement>event.target).parentNode === svgOverlay) {
            return;
        }

        // Get MEI element
        let node: SVGGElement | null = getClosestMEIElement(<SVGElement>event.target);
        if (!node || !node.id) {
            console.log(node, "MEI element not found or with no id");
            return; // this should never happen, but as a safety
        }

        onElementSelect?.(node.id);
    }

    async function refreshOverlay() {
        await tick();
        updateOverlay();
        if (view.selection?.type === "element") {
            highlightSelected(view.selection.id ?? null);
        }
    }

    $: if (view.svg && view.svgId !== lastSvgId) {
        lastSvgId = view.svgId;
        refreshOverlay();
    }

    $: if (!view.svg && lastSvgId !== 0) {
        lastSvgId = 0;
        if (svgOverlay) svgOverlay.innerHTML = "";
    }

    $: if (view.selection?.type === "element") {
        if (lastSelectedId && lastSelectedId !== view.selection.id) {
            clearSelected(lastSelectedId);
        }
        highlightSelected(view.selection.id ?? null);
        lastSelectedId = view.selection.id ?? null;
    }

    $: if (view.selection?.type === "none" && lastSelectedId) {
        clearSelected(lastSelectedId);
        lastSelectedId = null;
    }
</script>

<div class="vrv-main-panel">
    {#if filterMarkup}
        <div class="vrv-filter" aria-hidden="true">{@html filterMarkup}</div>
    {/if}
    <div class="vrv-h-split">
        <SidePanel
            onSelectElement={handleSelect}
            onHoverElement={handleHover}
            onEditAttribute={handleEditAttribute}
            {editInfoContent}
            {rngMEIAll}
            {rngMEIBasic}
        />
        <div class="vrv-v-split">
            <div class="vrv-verovio-view" bind:this={verovioView}>
                <div class="vrv-svg-wrapper" bind:this={svgWrapper}>
                    {@html view.svg}
                </div>
                <div
                    class="vrv-svg-overlay"
                    bind:this={svgOverlay}
                ></div>
            </div>
            <div class="vrv-keyboard-panel" style="display: flex;"></div>
        </div>
    </div>
</div>
