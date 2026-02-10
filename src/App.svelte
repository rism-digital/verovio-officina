<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import Menu from "./components/Menu.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import EditorSurface from "./components/EditorSurface.svelte";
  import StatusBar from "./components/StatusBar.svelte";
  import { createWorkerBridge } from "./app/worker/bridge";
  import {
    dirty,
    mode,
    selection,
    statusLine,
    verovioState,
    viewModel,
    workerStatus,
  } from "./app/state";
  import type { SelectionInfo, ViewModel } from "./app/types";
  import type { Options as VerovioOptions } from "./app/worker/verovio-types";

  const VEROVIO_URL =
    "https://www.verovio.org/javascript/develop/verovio-toolkit-wasm.js";
  let fileInput: HTMLInputElement | null = null;
  let verovioVersion = "";
  const ZOOM_STEP = 10;

  const worker = new Worker(
    new URL("./app/worker/worker.ts", import.meta.url),
    {
      type: "classic",
    },
  );
  const bridge = createWorkerBridge(worker);

  onMount(async () => {
    workerStatus.set("busy");
    await bridge.init(VEROVIO_URL);
    verovioVersion = await bridge.verovio.getVersion();
    workerStatus.set("idle");
  });

  let lastLayoutSize = { width: 0, height: 0 };

  function clampZoom(value: number) {
    return Math.min(200, Math.max(10, Math.floor(value)));
  }

  function buildVerovioOptions(size: {
    width: number;
    height: number;
  }): VerovioOptions {
    const { zoom } = get(verovioState);
    return {
      adjustPageHeight: false,
      adjustPageWidth: false,
      breaks: "auto",
      footer: "auto",
      justifyVertically: false,
      mensuralResponsiveView: "auto",
      pageHeight: Math.max(0, Math.floor(size.height)),
      pageWidth: Math.max(0, Math.floor(size.width)),
      pageMarginLeft: 50,
      pageMarginRight: 50,
      pageMarginTop: 50,
      pageMarginBottom: 50,
      scale: clampZoom(zoom),
      scaleToPageSize: true,
      xmlIdSeed: 1,
    };
  }
  
  async function updateRenderedView() {
    const { currentPage } = get(verovioState);
    const svg = await bridge.verovio.renderToSVG(currentPage);
    const current = get(viewModel);
    viewModel.set({ ...current, svg });
    workerStatus.set("idle");
  }

  async function loadData(data: string) {
    workerStatus.set("busy");
    verovioState.update((current) => ({ ...current, currentPage: 1, pageCount: 0 }));
    if (lastLayoutSize.width && lastLayoutSize.height) {
      const options = buildVerovioOptions(lastLayoutSize);
      await bridge.verovio.setOptions(options);
    }
    await bridge.verovio.loadData(data);
    const pageCount = await bridge.verovio.getPageCount();
    verovioState.update((current) => ({ ...current, pageCount }));
    await updateRenderedView();
  }

  async function applyLayoutForSize(size: { width: number; height: number }) {
    if (!size.width || !size.height) return;
    lastLayoutSize = size;
    const current = get(viewModel);
    if (!current.svg) return;
    workerStatus.set("busy");
    const options = buildVerovioOptions(size);
    await bridge.verovio.setOptions(options);
    await bridge.verovio.redoLayout();
    const pageCount = await bridge.verovio.getPageCount();
    verovioState.update((current) => ({ ...current, pageCount }));
    const { currentPage } = get(verovioState);
    if (currentPage > pageCount) {
      verovioState.update((current) => ({ ...current, currentPage: pageCount }));
    }
    await updateRenderedView();
  }

  async function adjustZoom(delta: number) {
    verovioState.update((current) => ({
      ...current,
      zoom: clampZoom(current.zoom + delta),
    }));
    if (lastLayoutSize.width && lastLayoutSize.height) {
      await applyLayoutForSize(lastLayoutSize);
    }
  }

  async function setSelection(next: SelectionInfo) {
    selection.set(next);
    viewModel.update((current) => ({ ...current, selection: next }));
  }

  async function handleSelect(active: boolean) {
    if (active) {
      await setSelection({
        type: "text",
        label: "Body Text",
        properties: {},
      });
    } else {
      await setSelection({ type: "none" });
    }
  }

  function toggleMode() {
    mode.update((current) => (current === "insert" ? "edit" : "insert"));
  }

  function triggerOpenFile() {
    fileInput?.click();
  }

  async function openFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    selection.set({ type: "none" });
    const content = await file.text();
    await loadData(content);
    dirty.set(false);
    statusLine.set(`Opened ${file.name}.`);
    target.value = "";
  }

  async function saveDoc() {
    const exported = await bridge.verovio.getMEI();
    localStorage.setItem("svelte-editor-doc", exported);
    dirty.set(false);
    statusLine.set("Saved to local storage.");
  }

  async function exportDoc() {
    const exported = await bridge.verovio.renderToSVG(1);
    const blob = new Blob([exported], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "score-export.svg";
    link.click();
    URL.revokeObjectURL(url);
    statusLine.set("Exported SVG file.");
  }
</script>

<input
  class="vrv-file-input"
  type="file"
  accept=".mei,.xml"
  bind:this={fileInput}
  on:change={openFile}
/>

<div class="vrv-wrapper">
  <Menu
    on:open={triggerOpenFile}
    on:save={saveDoc}
    on:export={exportDoc}
    on:zoomIn={() => adjustZoom(ZOOM_STEP)}
    on:zoomOut={() => adjustZoom(-ZOOM_STEP)}
    canZoom={$verovioState.pageCount > 0}
  ></Menu>

  <Toolbar mode={$mode} onToggleMode={toggleMode} />

  <EditorSurface
    view={$viewModel}
    onSelect={handleSelect}
    onResize={applyLayoutForSize}
  />

  <StatusBar status={$statusLine} dirty={$dirty} version={verovioVersion} />
</div>
