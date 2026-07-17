<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";
    import ContextMenu from "./ContextMenu.svelte";
    import SidePanel from "./SidePanel.svelte";
    import { withBaseUrl } from "../app/asset-url";
    import type {
        Action,
        EditActionSetParam,
        EditActionSetHandler,
        EditResponseContent,
        EditStatus,
        SelectElementHandler,
        TargetedContextActionHandler,
        ViewModel,
    } from "../app/types";
    import type { RNGLoader } from "../app/rng-loader";
    import Keyboard from "./Keyboard.svelte";

    export let view: ViewModel;
    export let selection: EditStatus["selection"] = null;
    export let insertMode = false;
    export let pianoKeyboardEnabled = false;
    export let pianoKeyboardOctave = 4;
    export let onResize: (size: { width: number; height: number }) => void;
    export let onElementSelect: SelectElementHandler | null = null;
    export let onElementSecondarySelect: SelectElementHandler | null = null;
    export let onNoteDoubleClick: SelectElementHandler | null = null;
    export let onTextParentDoubleClick: SelectElementHandler | null = null;
    export let onAttributeEdit: EditActionSetHandler | null = null;
    export let onPianoKeyboardOctaveChange: ((octave: number) => void | Promise<void>) | null = null;
    export let onPianoKeyboardMidiSelect: ((midi: number) => void | Promise<void>) | null = null;
    export let onTargetedContextAction: TargetedContextActionHandler | null = null;
    export let editResponseContent: EditResponseContent| null = null;
    export let rngMEIAll: RNGLoader | null = null;
    export let rngMEIBasic: RNGLoader | null = null;

    async function handleSelect(id: string | null) {
        if (id) await onElementSelect?.(id);
    }

    function handleHover(id: string | null) {
        highlightHover(id);
    }

    function handleEditAttribute(param: EditActionSetParam, commit: boolean) {
        onAttributeEdit?.(param, commit);
    }

    function focusMainPanel() {
        verovioView?.focus();
    }

    const RESIZE_DEBOUNCE_MS = 150;

    let verovioView: HTMLDivElement | null = null;
    let svgWrapper: HTMLDivElement | null = null;
    let svgOverlay: HTMLDivElement | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let lastSize = { width: 0, height: 0 };
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastSvgId = 0;
    let lastHighlights: Array<{ id: string; color: string }> = [];
    let filterMarkup: string = "";
    let mouseoverId: string = "";
    let overlayContextMenu: {
        x: number;
        y: number;
        targetId: string;
        targetElement: string;
    } | null = null;

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
        fetch(withBaseUrl("css/filter.xml"))
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
        svgOverlay.querySelectorAll("g, path, text, ellipse, polyline, rect").forEach((node) => {
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
            element.addEventListener("dblclick", onSVGOverlayDoubleClick);
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

    function highlightSelected(id: string | null, color: string) {
        if (!svgWrapper || !id) return;
        let element = <SVGElement>svgWrapper.querySelector("#" + id);
        if (element) {
            highlightWithColor(element, color);
        }
    }

    function selectionHighlights(): Array<{ id: string; color: string }> {
        if (insertMode) return [];
        if (!selection?.id) return [];
        const highlights = [{ id: selection.id, color: "#cd0000" }];
        if (selection.secondaryId && selection.secondaryId !== selection.id) {
            highlights.push({ id: selection.secondaryId, color: "#f28c28" });
        }
        return highlights;
    }

    function syncSelectionHighlight() {
        if (!svgWrapper) return;
        const nextHighlights = selectionHighlights();
        for (const previous of lastHighlights) {
            const next = nextHighlights.find((highlight) => highlight.id === previous.id);
            if (!next || next.color !== previous.color) clearSelected(previous.id);
        }
        for (const next of nextHighlights) {
            const previous = lastHighlights.find((highlight) => highlight.id === next.id);
            if (!previous || previous.color !== next.color) {
                highlightSelected(next.id, next.color);
            }
        }
        lastHighlights = nextHighlights;
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

    function getClosestMEIElement(node: Element | null, elementType?: string | string[]): SVGGElement | null {
        if (!node) return null;

        const isG = node.tagName?.toLowerCase() === "g";
        const isBlocked = node.matches(".bounding-box, .notehead, .stem, .flag");

        if (!isG || isBlocked) {
            return getClosestMEIElement(node.parentElement, elementType);
        }

        const elementTypes = Array.isArray(elementType) ? elementType : [elementType];
        if (elementType && !elementTypes.some((type) => type && node.classList.contains(type))) {
            return getClosestMEIElement(node.parentElement, elementType);
        }

        return node as SVGGElement;
    }

    function getMEIElementName(node: SVGGElement | null): string | null {
        if (!node) return null;
        const ignored = new Set(["bounding-box", "notehead"]);
        for (const className of Array.from(node.classList)) {
            if (!ignored.has(className)) return className;
        }
        return null;
    }

    async function onSVGOverlayMouseDown(event: MouseEvent) {
        event.stopPropagation();

        // Clicking on the overlay - nothing to do
        if (<HTMLDivElement>(<HTMLElement>event.target).parentNode === svgOverlay) {
            return;
        }

        // Get MEI element
        let node: SVGGElement | null = getClosestMEIElement(<SVGElement>event.target);
        if (!node || !node.id) {
            return; // this should never happen, but as a safety
        }

        if (event.shiftKey && selection?.id) {
            await onElementSecondarySelect?.(node.id);
            return;
        }

        await onElementSelect?.(node.id);
    }

    async function onSVGOverlayDoubleClick(event: MouseEvent) {
        event.stopPropagation();

        if (<HTMLDivElement>(<HTMLElement>event.target).parentNode === svgOverlay) {
            return;
        }

        const node = getClosestMEIElement(<SVGElement>event.target, "note");
        if (node?.id) await onNoteDoubleClick?.(node.id);

        const nodeDir = getClosestMEIElement(<SVGElement>event.target, ["dir", "dynam", "fing", "syl"]);
        if (nodeDir?.id) await onTextParentDoubleClick?.(nodeDir.id);
    }

    function closeOverlayContextMenu() {
        overlayContextMenu = null;
    }

    async function onSVGOverlayContextMenu(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        if (!selection?.id || !selection.element) {
            closeOverlayContextMenu();
            return;
        }

        overlayContextMenu = {
            x: event.clientX,
            y: event.clientY,
            targetId: selection.id,
            targetElement: selection.element,
        };
    }

    function handleOverlayContextAction(action: Action) {
        const currentOverlayContextMenu = overlayContextMenu;
        if (!currentOverlayContextMenu) return;
        onTargetedContextAction?.({
            ...action,
            targetId: currentOverlayContextMenu.targetId,
            targetElement: currentOverlayContextMenu.targetElement,
        });
        closeOverlayContextMenu();
    }

    async function refreshOverlay() {
        await tick();
        updateOverlay();
        lastHighlights = [];
        syncSelectionHighlight();
    }

    $: if (view.svg && view.svgId !== lastSvgId) {
        lastSvgId = view.svgId;
        refreshOverlay();
    }

    $: if (!view.svg && lastSvgId !== 0) {
        lastSvgId = 0;
        if (svgOverlay) svgOverlay.innerHTML = "";
    }

    $: {
        selection;
        insertMode;
        syncSelectionHighlight();
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
            {onTargetedContextAction}
            {editResponseContent}
            {rngMEIAll}
            {rngMEIBasic}
        />
        <div class="vrv-v-split">
            <div class="vrv-verovio-view" bind:this={verovioView} tabindex="-1">
                <div class="vrv-svg-wrapper" bind:this={svgWrapper}>
                    {@html view.svg}
                </div>
                <div
                    class="vrv-svg-overlay"
                    bind:this={svgOverlay}
                    on:contextmenu={onSVGOverlayContextMenu}
                ></div>
                {#if overlayContextMenu}
                    <ContextMenu
                        x={overlayContextMenu?.x ?? 0}
                        y={overlayContextMenu?.y ?? 0}
                        elementName={overlayContextMenu?.targetElement ?? ""}
                        onSelect={handleOverlayContextAction}
                        onClose={closeOverlayContextMenu}
                    />
                {/if}
            </div>
            {#if pianoKeyboardEnabled}
                <Keyboard
                    octave={pianoKeyboardOctave}
                    onOctaveChange={onPianoKeyboardOctaveChange}
                    onMidiSelect={onPianoKeyboardMidiSelect}
                    onInteractionComplete={focusMainPanel}
                ></Keyboard>
            {/if}
        </div>
    </div>
</div>
