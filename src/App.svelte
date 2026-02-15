<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { get } from "svelte/store";
    import MainPanel from "./components/MainPanel.svelte";
    import Menu from "./components/Menu.svelte";
    import Toolbar from "./components/Toolbar.svelte";
    import StatusBar from "./components/StatusBar.svelte";
    import { EditorController } from "./app/editor-controller";
    import { RNGLoader } from "./app/rng-loader";
    import {
        dirty,
        editInfoContent,
        mode,
        selection,
        statusLine,
        verovioState,
        viewModel,
        workerStatus,
    } from "./app/state";

    const VEROVIO_URL =
        "https://www.verovio.org/javascript/develop/verovio-toolkit-wasm.js";
    const MEI_ALL_SCHEMA_URL = "https://music-encoding.org/schema/5.1/mei-all.rng";
    const MEI_BASIC_SCHEMA_URL = "https://music-encoding.org/schema/5.1/mei-basic.rng";
    const STORAGE_KEY = "verovio-editor";
    
    let fileInput: HTMLInputElement | null = null;
    let verovioVersion = "";
    const zoomLevels = [10, 20, 35, 75, 100, 150, 200];
    let rngMEIAll: RNGLoader | null = null;
    let rngMEIBasic: RNGLoader | null = null;

    async function loadRngSchema(loader: RNGLoader, schemaUrl: string) {
        const response = await fetch(schemaUrl);
        if (!response.ok) {
            throw new Error(`Failed to load RNG schema: ${response.status}`);
        }
        const schemaText = await response.text();
        loader.setRelaxNGSchema(schemaText);
    }

    const controller = new EditorController(
        new URL("./app/worker/worker.ts", import.meta.url),
        {
            verovioState,
            viewModel,
            selection,
            statusLine,
            workerStatus,
            dirty,
            editInfoContent,
        },
    );

    onMount(async () => {
        verovioVersion = await controller.init(VEROVIO_URL);

        rngMEIAll = new RNGLoader();
        rngMEIBasic = new RNGLoader();

        try {
            await loadRngSchema(rngMEIAll, MEI_ALL_SCHEMA_URL);
            await loadRngSchema(rngMEIBasic, MEI_BASIC_SCHEMA_URL);
            statusLine.set("Loaded RNG schemas.");
        } catch (error) {
            console.error("Failed to load RNG schema", error);
            statusLine.set("Failed to load RNG schema.");
        }

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            await controller.loadData(stored);
            statusLine.set("Loaded from local storage.");
            dirty.set(false);
        }
    });

    onDestroy(() => {
        controller.destroy();
    });

    function getNextZoom(current: number, direction: 1 | -1) {
        const sorted = [...zoomLevels].sort((a, b) => a - b);
        const index = sorted.findIndex((level) => level >= current);
        if (direction > 0) {
            if (index === -1) return sorted[sorted.length - 1];
            const next = sorted[index] === current ? index + 1 : index;
            return sorted[Math.min(next, sorted.length - 1)];
        }
        if (index === -1) return sorted[0];
        const prev = sorted[index] === current ? index - 1 : index - 1;
        return sorted[Math.max(prev, 0)];
    }

    function getZoomIndex(value: number) {
        const sorted = [...zoomLevels].sort((a, b) => a - b);
        const index = sorted.findIndex((level) => level >= value);
        if (index === -1) return sorted.length - 1;
        return sorted[index] === value ? index : Math.max(index - 1, 0);
    }

    async function adjustZoom(direction: 1 | -1) {
        verovioState.update((current) => ({
            ...current,
            zoom: Math.min(200, Math.max(10, Math.floor(getNextZoom(current.zoom, direction)))),
        }));
        if (controller.hasLayoutSize()) {
            await controller.applyLayoutForLastSize();
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
        localStorage.setItem(STORAGE_KEY, content);
        await controller.loadData(content);
        dirty.set(false);
        statusLine.set(`Opened ${file.name}.`);
        target.value = "";
    }

    async function saveDoc() {
        const exported = await controller.saveDoc();
        localStorage.setItem(STORAGE_KEY, exported);
    }

    async function exportDoc() {
        const exported = await controller.exportSvg();
        const blob = new Blob([exported], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "score-export.svg";
        link.click();
        URL.revokeObjectURL(url);
    }
</script>

<input class="vrv-file-input" type="file" accept=".mei,.xml" bind:this={fileInput} on:change={openFile} />

<div class="vrv-wrapper">
    <Menu
        on:open={triggerOpenFile}
        on:save={saveDoc}
        on:export={exportDoc}
        on:zoomIn={() => adjustZoom(1)}
        on:zoomOut={() => adjustZoom(-1)}
        on:prevPage={() => controller.setCurrentPage(get(verovioState).currentPage - 1)}
        on:nextPage={() => controller.setCurrentPage(get(verovioState).currentPage + 1)}
        canZoom={$verovioState.pageCount > 0}
        canZoomIn={getZoomIndex($verovioState.zoom) < zoomLevels.length - 1}
        canZoomOut={getZoomIndex($verovioState.zoom) > 0}
        canGoPrev={$verovioState.currentPage > 1}
        canGoNext={$verovioState.currentPage < $verovioState.pageCount}
    ></Menu>

    <Toolbar mode={$mode} onToggleMode={toggleMode} />

    <MainPanel
        view={$viewModel}
        onResize={(size) => controller.applyLayoutForSize(size)}
        onElementSelect={(id) => controller.handleSelect(id)}
        onAttributeEdit={(edit) => controller.handleAttributeEdit(edit)}
        editInfoContent={$editInfoContent}
        {rngMEIAll}
        {rngMEIBasic}
    />

    <StatusBar status={$statusLine} dirty={$dirty} version={verovioVersion} />
</div>
