<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { get } from "svelte/store";
    import MainPanel from "./components/MainPanel.svelte";
    import XmlPanel from "./components/XmlPanel.svelte";
    import DialogAbout from "./components/dialogs/DialogAbout.svelte";
    import DialogEnterValue from "./components/dialogs/DialogEnterValue.svelte";
    import DialogExport from "./components/dialogs/DialogExport.svelte";
    import DialogScoreProperties from "./components/dialogs/DialogScoreProperties.svelte";
    import DialogXmlReload from "./components/dialogs/DialogXmlReload.svelte";
    import Menu from "./components/Menu.svelte";
    import Toolbar from "./components/Toolbar.svelte";
    import StatusBar from "./components/StatusBar.svelte";
    import workerUrl from "./app/worker/worker.ts?worker&url";
    import { withBaseUrl } from "./app/asset-url";
    import { EditorController } from "./app/editor-controller";
    import { RNGLoader } from "./app/rng-loader";
    import {
        beginToolbarAction,
        DEFAULT_ENTER_VALUE_DIALOG,
        resolveEnterValueDialog,
        type EnterValueDialogState,
        type ToolbarDispatchAction,
    } from "./app/toolbar-actions";
    import type { EditActionName, EditActionParam, MEIExportOptions, TreeContextAction, TreeNodeData } from "./app/types";
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
        //"http://localhost:8001/build/verovio-toolkit-wasm.js";
        withBaseUrl("verovio/verovio-toolkit-wasm.js");
    const MEI_ALL_SCHEMA_URL ="https://music-encoding.org/schema/5.1/mei-all.rng";
    const MEI_BASIC_SCHEMA_URL = "https://music-encoding.org/schema/5.1/mei-basic.rng";
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
    let enterValueDialogState: EnterValueDialogState | null = null;
    let meiExportOptions: MEIExportOptions = DEFAULT_MEI_EXPORT_OPTIONS;
    let xmlInitialContent = "";

    const ABOUT_LIBRARIES_HTML = `Libraries used in this application:\n\n\
* [html-midi-player](https://github.com/cifkao/html-midi-player)\n\
* [marked](https://marked.js.org/)\n\n`;
    const ABOUT_LICENSE_URL =
        import.meta.env.VITE_ABOUT_LICENSE_URL
        || "https://raw.githubusercontent.com/rism-digital/verovio-editor/refs/heads/main/LICENSE";
    const ABOUT_CHANGELOG_URL =
        import.meta.env.VITE_ABOUT_CHANGELOG_URL
        || "https://raw.githubusercontent.com/rism-digital/verovio-editor/refs/heads/main/CHANGELOG.md";

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
        workerUrl,
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

    onMount(() => {
        window.addEventListener("keydown", handleGlobalKeydown);
        return () => window.removeEventListener("keydown", handleGlobalKeydown);
    });

    onDestroy(() => {
        controller.destroy();
    });

    function isInteractiveTarget(target: EventTarget | null): boolean {
        if (!(target instanceof Element)) return false;
        return Boolean(
            target.closest(
                "input, textarea, select, button, a[href], [contenteditable], [role='button'], [role='menuitem']",
            ),
        );
    }

    function isDialogOpen(): boolean {
        return (
            aboutOpen ||
            exportDialogOpen ||
            scorePropertiesOpen ||
            xmlReloadDialogOpen ||
            Boolean(enterValueDialogState)
        );
    }

    $: menuInteractionEnabled = !xmlMode && !$workerBusy;
    $: canMenuZoom = menuInteractionEnabled && $verovioState.pageCount > 0;
    $: canMenuZoomIn = canMenuZoom && controller.canZoomIn($verovioState.zoom);
    $: canMenuZoomOut = canMenuZoom && controller.canZoomOut($verovioState.zoom);
    $: canMenuGoPrev = menuInteractionEnabled && $verovioState.currentPage > 1;
    $: canMenuGoNext =
        menuInteractionEnabled && $verovioState.currentPage < $verovioState.pageCount;

    async function handleGlobalKeydown(event: KeyboardEvent) {
        const direction = event.key === "ArrowRight"
            ? 39
            : event.key === "ArrowLeft"
                ? 37
                : null;
        if (direction === null) return;
        if (
            event.defaultPrevented ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            xmlMode ||
            isDialogOpen() ||
            isInteractiveTarget(event.target)
        ) {
            return;
        }

        const currentSelection = get(selection);
        if (currentSelection.type !== "element" || !currentSelection.id) return;
        event.preventDefault();
        if (get(workerBusy)) return;
        await controller.navigateSelection(direction);
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

    async function validateXmlContent() {
        // Placeholder for XML validation logic
    }

    async function handleTreeContextAction(action: TreeContextAction) {
        const ok = await controller.handleContextMenuEdit(
            action.action,
            action.param,
            {
                targetId: action.targetId,
                targetElement: action.targetElement,
                parentElement: action.parentElement,
                dialogValue: action.dialogValue,
            },
        );
        if (ok) {
            statusLine.set(`${action.label} for <${action.targetElement}>.`);
        } else {
            statusLine.set(`Failed: ${action.label} for <${action.targetElement}>.`);
        }
    }

    async function dispatchToolbarContextAction(toolbarAction: ToolbarDispatchAction) {
        const object = $editInfoContent?.object;
        if (!object?.id || !object.element) return;
        const parentElement = $editInfoContent?.ancestors?.[0]?.element ?? null;
        await handleTreeContextAction({
            action: toolbarAction.action,
            label: toolbarAction.label,
            param: toolbarAction.param,
            targetId: object.id,
            targetElement: object.element,
            parentElement,
            dialogValue: toolbarAction.dialogValue,
        });
    }

    async function handleToolbarContextAction(
        action: EditActionName,
        label: string,
        param?: EditActionParam,
        _actionKey?: string,
        dialog?: string,
    ) {
        const next = beginToolbarAction({ action, label, param, dialog });
        if (next.kind === "prompt") {
            enterValueDialogState = next.dialogState;
            return;
        }
        await dispatchToolbarContextAction(next.action);
    }

    async function confirmEnterValue(value: string) {
        const pendingAction = enterValueDialogState;
        enterValueDialogState = null;
        if (!pendingAction) return;
        await dispatchToolbarContextAction(
            resolveEnterValueDialog(pendingAction, value),
        );
    }

    function cancelEnterValue() {
        enterValueDialogState = null;
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
        canZoom={canMenuZoom}
        canZoomIn={canMenuZoomIn}
        canZoomOut={canMenuZoomOut}
        canGoPrev={canMenuGoPrev}
        canGoNext={canMenuGoNext}
        onAbout={openAboutDialog}
        {xmlMode}
    ></Menu>

    <Toolbar
        mode={$mode}
        onToggleMode={toggleMode}
        {xmlMode}
        workerBusy={$workerBusy}
        onValidateXml={validateXmlContent}
        selectedElementName={$editInfoContent?.object?.element ?? null}
        onContextAction={handleToolbarContextAction}
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
            onTreeContextAction={handleTreeContextAction}
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

    <DialogEnterValue
        open={Boolean(enterValueDialogState)}
        title={enterValueDialogState?.title ?? DEFAULT_ENTER_VALUE_DIALOG.title}
        label={enterValueDialogState?.fieldLabel ?? DEFAULT_ENTER_VALUE_DIALOG.fieldLabel}
        value={enterValueDialogState?.defaultValue ?? DEFAULT_ENTER_VALUE_DIALOG.defaultValue}
        onConfirm={confirmEnterValue}
        onCancel={cancelEnterValue}
    />
</div>
