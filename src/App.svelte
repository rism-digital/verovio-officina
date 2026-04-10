<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { get } from "svelte/store";
    import MainPanel from "./components/MainPanel.svelte";
    import XmlPanel from "./components/XmlPanel.svelte";
    import DialogAbout from "./components/dialogs/DialogAbout.svelte";
    import DialogExport from "./components/dialogs/DialogExport.svelte";
    import DialogScoreProperties from "./components/dialogs/DialogScoreProperties.svelte";
    import DialogXmlReload from "./components/dialogs/DialogXmlReload.svelte";
    import Menu from "./components/Menu.svelte";
    import Toolbar from "./components/Toolbar.svelte";
    import StatusBar from "./components/StatusBar.svelte";
    import { EditorController } from "./app/editor-controller";
    import { RNGLoader } from "./app/rng-loader";
    import type { MEIExportOptions, TreeNodeData } from "./app/types";
    import {
        dirty,
        editInfoContent,
        mode,
        selection,
        statusLine,
        isMensuralMusicOnly,
        verovioState,
        viewModel,
        workerBusy,
    } from "./app/state";

    const VEROVIO_URL =
        //"https://www.verovio.org/javascript/develop/verovio-toolkit-wasm.js";
        "http://localhost:8001/build/verovio-toolkit-wasm.js";
    const MEI_ALL_SCHEMA_URL =
        "https://music-encoding.org/schema/5.1/mei-all.rng";
    const MEI_BASIC_SCHEMA_URL =
        "https://music-encoding.org/schema/5.1/mei-basic.rng";
    const STORAGE_KEY = "verovio-editor";
    const MEI_EXPORT_OPTIONS_STORAGE_KEY = "verovio-mei-export-options";
    const DEFAULT_MEI_EXPORT_OPTIONS: MEIExportOptions = {
        basic: false,
        removeIds: false,
        ignoreHeader: false,
    };

    let fileInput: HTMLInputElement | null = null;
    let verovioVersion = "";
    let rngMEIAll: RNGLoader | null = null;
    let rngMEIBasic: RNGLoader | null = null;
    let xmlMode = false;
    let xmlContent = "";
    let aboutOpen = false;
    let exportDialogOpen = false;
    let scorePropertiesOpen = false;
    let dialogScoreDef: TreeNodeData | null = null;
    let xmlReloadDialogOpen = false;
    let meiExportOptions: MEIExportOptions = DEFAULT_MEI_EXPORT_OPTIONS;
    let xmlInitialContent = "";

    const ABOUT_LIBRARIES_HTML = `Libraries used in this application:\n\n\
* [html-midi-player](https://github.com/cifkao/html-midi-player)\n\
* [marked](https://marked.js.org/)\n\n`;
    const ABOUT_LICENSE_URL =
        "https://raw.githubusercontent.com/rism-digital/verovio-editor/refs/heads/main/LICENSE";
    const ABOUT_CHANGELOG_URL =
        "https://raw.githubusercontent.com/rism-digital/verovio-editor/refs/heads/main/CHANGELOG.md";

    async function loadRngSchema(loader: RNGLoader, schemaUrl: string) {
        const response = await fetch(schemaUrl);
        if (!response.ok) {
            throw new Error(`Failed to load RNG schema: ${response.status}`);
        }
        const schemaText = await response.text();
        loader.setRelaxNGSchema(schemaText);
    }

    function loadMEIExportOptionsFromStorage(): MEIExportOptions {
        const raw = localStorage.getItem(MEI_EXPORT_OPTIONS_STORAGE_KEY);
        if (!raw) return DEFAULT_MEI_EXPORT_OPTIONS;
        return JSON.parse(raw) as MEIExportOptions;
    }

    const controller = new EditorController(
        new URL("./app/worker/worker.ts", import.meta.url),
        {
            verovioState,
            viewModel,
            selection,
            statusLine,
            workerBusy,
            dirty,
            editInfoContent,
            isMensuralMusicOnly,
        },
    );

    onMount(async () => {
        verovioVersion = await controller.init(VEROVIO_URL);
        meiExportOptions = loadMEIExportOptionsFromStorage();

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

    async function toggleXmlMode() {
        const switchToXmlMode = !xmlMode;
        if (switchToXmlMode) {
            exportDialogOpen = true;
        } else {
            if (xmlContent === xmlInitialContent) {
                xmlMode = false;
                statusLine.set("Score view enabled.");
                return;
            }

            // Placeholder for XML validation before confirming reload.
            xmlReloadDialogOpen = true;
        }
    }

    async function confirmXmlReload() {
        xmlReloadDialogOpen = false;
        try {
            selection.set({ type: "none" });
            localStorage.setItem(STORAGE_KEY, xmlContent);
            await controller.loadData(xmlContent);
            xmlInitialContent = xmlContent;
            xmlMode = false;
            statusLine.set("Score view enabled.");
        } catch (error) {
            console.error("Failed to reload score from XML", error);
            statusLine.set("Failed to reload score from XML.");
        }
    }

    function skipXmlReload() {
        xmlReloadDialogOpen = false;
        xmlMode = false;
        statusLine.set("Score view enabled without XML reload.");
    }

    function cancelXmlReload() {
        xmlReloadDialogOpen = false;
        statusLine.set("Stayed in XML editor.");
    }

    function closeExportDialog() {
        exportDialogOpen = false;
    }

    async function confirmExportOptions(options: MEIExportOptions) {
        meiExportOptions = options;
        localStorage.setItem(
            MEI_EXPORT_OPTIONS_STORAGE_KEY,
            JSON.stringify(meiExportOptions),
        );
        xmlContent = await controller.getMEI(meiExportOptions);
        xmlInitialContent = xmlContent;
        xmlMode = true;
        exportDialogOpen = false;
        statusLine.set("XML editor enabled.");
    }

    async function applyXmlContent() {
        if (!xmlContent.trim()) {
            statusLine.set("XML editor is empty.");
            return;
        }
        try {
            selection.set({ type: "none" });
            localStorage.setItem(STORAGE_KEY, xmlContent);
            await controller.loadData(xmlContent);
            xmlInitialContent = xmlContent;
            dirty.set(false);
            statusLine.set("Applied XML content.");
        } catch (error) {
            console.error("Failed to apply XML content", error);
            statusLine.set("Failed to apply XML content.");
        }
    }

    async function validateXmlContent() {
        // Placeholder for XML validation logic
    }

    function openAboutDialog() {
        aboutOpen = true;
    }

    async function openScorePropertiesDialog() {
        const scoreDef = await controller.getScoreDefForDialog();
        if (!scoreDef) {
            statusLine.set("Failed to load score properties.");
            return;
        }
        dialogScoreDef = scoreDef;
        scorePropertiesOpen = true;
    }

    function closeScorePropertiesDialog() {
        scorePropertiesOpen = false;
        dialogScoreDef = null;
    }

    async function confirmScorePropertiesDialog(
        scoreDef: TreeNodeData | null,
        edited: boolean,
    ) {
        if (edited && scoreDef) {
            const ok = await controller.applyScoreDefFromDialog(scoreDef);
            if (!ok) {
                statusLine.set("Failed to apply score properties.");
                return;
            }
            statusLine.set("Applied score properties.");
        }
        scorePropertiesOpen = false;
        dialogScoreDef = null;
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
        onOpen={triggerOpenFile}
        onSave={saveDoc}
        onExport={exportDoc}
        onZoomIn={() => controller.adjustZoom(1)}
        onZoomOut={() => controller.adjustZoom(-1)}
        onPrevPage={() =>
            controller.setCurrentPage(get(verovioState).currentPage - 1)}
        onNextPage={() =>
            controller.setCurrentPage(get(verovioState).currentPage + 1)}
        onToggleXml={toggleXmlMode}
        onScoreProperties={openScorePropertiesDialog}
        canZoom={!xmlMode && !$workerBusy && $verovioState.pageCount > 0}
        canZoomIn={!xmlMode &&
            !$workerBusy &&
            controller.canZoomIn($verovioState.zoom)}
        canZoomOut={!xmlMode &&
            !$workerBusy &&
            controller.canZoomOut($verovioState.zoom)}
        canGoPrev={!xmlMode && !$workerBusy && $verovioState.currentPage > 1}
        canGoNext={!xmlMode &&
            !$workerBusy &&
            $verovioState.currentPage < $verovioState.pageCount}
        onAbout={openAboutDialog}
        {xmlMode}
    ></Menu>

    <Toolbar
        mode={$mode}
        onToggleMode={toggleMode}
        {xmlMode}
        workerBusy={$workerBusy}
        onValidateXml={validateXmlContent}
    />

    {#if xmlMode}
        <XmlPanel
            value={xmlContent}
            workerBusy={$workerBusy}
            selectedId={$selection.type === "element" ? $selection.id : null}
            onChange={(value) => (xmlContent = value)}
        />
    {:else}
        <MainPanel
            view={$viewModel}
            onResize={(size) => controller.applyLayoutForSize(size)}
            onElementSelect={(id) => controller.handleSelect(id)}
            onAttributeEdit={(param, commit) =>
                controller.handleAttributeEdit(param, commit)}
            editInfoContent={$editInfoContent}
            {rngMEIAll}
            {rngMEIBasic}
        />
    {/if}

    <StatusBar status={$statusLine} dirty={$dirty} version={verovioVersion} />

    <DialogAbout
        open={aboutOpen}
        title="About"
        libraries={ABOUT_LIBRARIES_HTML}
        licenseUrl={ABOUT_LICENSE_URL}
        changelogUrl={ABOUT_CHANGELOG_URL}
        onClose={() => (aboutOpen = false)}
    />

    <DialogExport
        open={exportDialogOpen}
        value={meiExportOptions}
        onConfirm={confirmExportOptions}
        onCancel={closeExportDialog}
        onClose={closeExportDialog}
    />

    <DialogScoreProperties
        open={scorePropertiesOpen}
        scoreDef={dialogScoreDef}
        onConfirm={confirmScorePropertiesDialog}
        onCancel={closeScorePropertiesDialog}
        onClose={closeScorePropertiesDialog}
    />

    <DialogXmlReload
        open={xmlReloadDialogOpen}
        onYes={confirmXmlReload}
        onNo={skipXmlReload}
        onCancel={cancelXmlReload}
    />
</div>
