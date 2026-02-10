<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import SidePanel from "./SidePanel.svelte";
  import type { ViewModel } from "../app/types";

  export let view: ViewModel;
  export let onSelect: (active: boolean) => void;
  export let onResize: (size: { width: number; height: number }) => void;
  export let onElementSelect: (id: string | null) => void;

  function forwardSelect(event: CustomEvent<string>) {
    onElementSelect?.(event.detail);
  }

  let verovioView: HTMLDivElement | null = null;
  let svgWrapper: HTMLDivElement | null = null;
  let svgOverlay: HTMLDivElement | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let lastSize = { width: 0, height: 0 };
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  const RESIZE_DEBOUNCE_MS = 150;

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
    if (!verovioView || typeof ResizeObserver === "undefined") return;
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        emitSize(
          Math.max(0, Math.floor(width)),
          Math.max(0, Math.floor(height)),
        );
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

    svgOverlay
      .querySelectorAll(".slur.bounding-box, .tie.bounding-box")
      .forEach((node) => {
        node.remove();
      });

    // Make all elements transparent but still hittable
    svgOverlay
      .querySelectorAll("g, path, text, ellipse, polyline")
      .forEach((node) => {
        const element = node as SVGElement;
        element.style.stroke = "transparent";
        element.style.fill = "transparent";
      });

    svgOverlay
      .querySelectorAll(
        ".slur path, .tie path, .stem rect, .dots ellipse, .barLineAttr path",
      )
      .forEach((node) => {
        const element = node as SVGElement;
        element.style.strokeWidth = "90";
      });

    svgOverlay.querySelectorAll("g").forEach((node) => {
      const element = node as SVGGElement & { dataset: { bound?: string } };
      if (element.dataset.bound === "true") return;
      element.dataset.bound = "true";
      element.addEventListener("mousedown", handleOverlayMouseDown);
    });
  }

  function clearOverlaySelection() {
    if (!svgOverlay) return;
    svgOverlay.querySelectorAll("g.selected").forEach((node) => {
      node.classList.remove("selected");
    });
  }

  function getClosestMEIElement(
    node: Element | null,
    elementType?: string,
  ): SVGGElement | null {
    if (!node) return null;

    const isG = node.tagName?.toLowerCase() === "g";
    const isBlocked =
      node.classList.contains("bounding-box") ||
      node.classList.contains("notehead");

    if (!isG || isBlocked) {
      return getClosestMEIElement(node.parentElement, elementType);
    }

    if (elementType && !node.classList.contains(elementType)) {
      return getClosestMEIElement(node.parentElement, elementType);
    }

    return node as SVGGElement;
  }

  function handleOverlayMouseDown(event: MouseEvent) {
    event.stopPropagation();

    // Clicking on the overlay - nothing to do
    if (<HTMLDivElement>(<HTMLElement>event.target).parentNode === svgOverlay) {
      return;
    }

    // Get MEI element
    let node: SVGGElement | null = getClosestMEIElement(
      <SVGElement>event.target,
    );
    if (!node || !node.id) {
      console.log(node, "MEI element not found or with no id");
      return; // this should never happen, but as a safety
    }
    // console.log(node);
    onElementSelect?.(node.id);
  }

  async function refreshOverlay() {
    await tick();
    updateOverlay();
  }

  $: if (view.svg) {
    refreshOverlay();
  }
</script>

<div class="vrv-editor-surface">
  <div class="vrv-h-split">
    <SidePanel on:selectElement={forwardSelect} />
    <div class="vrv-v-split">
      <div class="vrv-verovio-view" bind:this={verovioView}>
        <div class="vrv-svg-wrapper" bind:this={svgWrapper}>
          {@html view.svg}
        </div>
        <div
          class="vrv-svg-overlay"
          bind:this={svgOverlay}
          on:focus={() => onSelect(true)}
          on:blur={() => onSelect(false)}
        ></div>
      </div>
      <div class="vrv-keyboard-panel" style="display: flex;"></div>
    </div>
  </div>
</div>
