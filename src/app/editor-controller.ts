import { get, type Writable } from "svelte/store";
import { actionDefinitions } from "./actions/action.bundle";
import type {
    EditActionSetParam,
    EditResponseContent,
    EditAction,
    EditStatus,
    MEIExportOptions,
    TreeNodeData,
    ViewModel,
    EditActionParam,
    EditActionUpdatePitchParam,
    EditActionInsertCursorByPitchParam,
    EditActionInsertCursorByTypeParam,
} from "./types";
import type { VerovioOptions } from "./worker/verovio-types";
import { createWorkerBridge, type WorkerBridge } from "./worker/bridge";
import { enableInsertMode } from "./editor-rules";
import {
    keyboardOctaveForPitch,
    midiForKeyboardCode,
    noteForMidi,
} from "./piano-keyboard";
import type { PianoKeyboardMode, UserPreferences } from "./state";

const zoomLevels = [10, 20, 35, 75, 100, 150, 200];
const MIN_ZOOM = zoomLevels[0];
const MAX_ZOOM = zoomLevels[zoomLevels.length - 1];
const NON_DELETABLE_ELEMENTS = new Set(["staff", "layer"]);

export const finaleSpeedyDurationToMEI: Record<number, string> = {
    55: "1",
    54: "2",
    53: "4",
    52: "8",
    51: "16",
    50: "32",
    49: "64",
};

type ControllerStores = {
    verovioState: Writable<{ zoom: number; pageCount: number; currentPage: number }>;
    viewModel: Writable<ViewModel>;
    editStatus: Writable<EditStatus>;
    statusLine: Writable<string>;
    workerBusy: Writable<boolean>;
    dirty: Writable<boolean>;
    documentRevision: Writable<number>;
    editResponseContent: Writable<EditResponseContent | null>;
    pianoKeyboardMode: Writable<PianoKeyboardMode>;
    pianoKeyboardOctave: Writable<number>;
    userPreferences: Writable<UserPreferences>;
};

export class EditorController {
    private readonly worker: Worker;
    private readonly bridge: WorkerBridge;
    private readonly stores: ControllerStores;
    private lastLayoutSize = { width: 0, height: 0 };
    private svgRenderId = 0;
    private verovioOptions: VerovioOptions = {
        adjustPageHeight: false,
        adjustPageWidth: false,
        breaks: "auto",
        footer: "auto",
        justifyVertically: false,
        measureMinWidth: 25,
        mensuralResponsiveView: "none",
        pageHeight: 0,
        pageWidth: 0,
        pageMarginLeft: 50,
        pageMarginRight: 50,
        pageMarginTop: 50,
        pageMarginBottom: 50,
        scale: 100,
        scaleToPageSize: true,
        svgBoundingBoxes: true,
        xmlIdSeed: 1,
    };

    constructor(workerUrl: string | URL, stores: ControllerStores) {
        this.worker = new Worker(workerUrl, { type: "classic" });
        this.bridge = createWorkerBridge(this.worker);
        this.stores = stores;
    }

    async adjustZoom(direction: 1 | -1): Promise<void> {
        await this.vrvRefreshStatus();
        this.stores.verovioState.update((current) => ({
            ...current,
            zoom: this.clampZoom(this.getNextZoom(current.zoom, direction)),
        }));
        if (this.hasLayoutSize()) {
            await this.applyLayoutForLastSize();
        }
    }

    async applyLayoutForLastSize(): Promise<void> {
        if (!this.hasLayoutSize()) return;
        await this.applyLayoutForSize(this.lastLayoutSize);
    }

    async applyLayoutForSize(size: { width: number; height: number }): Promise<void> {
        if (!size.width || !size.height) return;
        this.lastLayoutSize = size;
        const viewModel = get(this.stores.viewModel);
        if (!viewModel.svg) return;
        this.stores.workerBusy.set(true);
        this.updateOptionsForSize(size);
        await this.vrvSetOptions();
        await this.vrvRedoLayoutAndRefreshPageCount();
        await this.vrvRefreshSVG();
    }

    async applyScoreDefFromDialog(scoreDef: TreeNodeData): Promise<boolean> {
        let scoreDefStr = (scoreDef ? JSON.stringify(scoreDef) : "");
        const ok = await this.vrvEdit({
            action: "properties",
            param: { scoreDef: scoreDefStr },
        }, "Failed to apply scoreDef");
        if (!ok) {
            return false;
        }
        await this.vrvApplyEditLayout(true);
        this.markDocumentChanged();
        await this.vrvRefreshContextFromSelection();
        return true;
    }

    canZoomIn(zoom: number): boolean {
        return this.getZoomIndex(zoom) < zoomLevels.length - 1;
    }

    canZoomOut(zoom: number): boolean {
        return this.getZoomIndex(zoom) > 0;
    }

    private clampZoom(value: number): number {
        return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.floor(value)));
    }

    async deleteSelectedElement(backspace: boolean): Promise<boolean> {
        const elementName = get(this.stores.editStatus).selection?.element;
        if (!elementName || NON_DELETABLE_ELEMENTS.has(elementName)) {
            this.stores.statusLine.set(elementName
                ? `Cannot delete <${elementName}>.`
                : "Cannot delete selected element.");
            return false;
        }
        const definition = actionDefinitions[backspace ? "delete-backspace" : "delete"];
        if (!definition) {
            this.stores.statusLine.set("Failed: delete action is not available.");
            return false;
        }
        const ok = await this.handleEditAction(definition);
        this.stores.statusLine.set(ok
            ? `Deleted <${elementName}>.`
            : `Failed: delete <${elementName}>.`);
        return ok;
    }

    destroy(): void {
        this.worker.terminate();
    }

    async exportSvg(): Promise<string> {
        const exported = await this.bridge.verovio.renderToSVG(1);
        this.stores.statusLine.set("Exported SVG file.");
        return exported;
    }

    async getMEI(options?: MEIExportOptions): Promise<string> {
        return this.bridge.verovio.getMEI(options);
    }

    getNextZoom(current: number, direction: 1 | -1): number {
        const index = zoomLevels.findIndex((level) => level >= current);
        if (direction > 0) {
            if (index === -1) return MAX_ZOOM;
            const next = zoomLevels[index] === current ? index + 1 : index;
            return zoomLevels[Math.min(next, zoomLevels.length - 1)];
        }
        if (index === -1) return MIN_ZOOM;
        const prev = zoomLevels[index] === current ? index - 1 : index - 1;
        return zoomLevels[Math.max(prev, 0)];
    }

    async getScoreDefForDialog(): Promise<TreeNodeData | null> {
        try {
            const scoreDefContextOk = await this.vrvEdit({
                action: "properties",
                param: {},
            }, "Failed to load scoreDef");
            if (!scoreDefContextOk) {
                return null;
            }
            const scoreDef = await this.bridge.verovio.editResponseScoreDef();
            this.stores.workerBusy.set(false);
            return scoreDef;
        } catch (error) {
            console.error("Failed to load scoreDef", error);
            this.stores.workerBusy.set(false);
            return null;
        }
    }

    getZoomIndex(value: number): number {
        const index = zoomLevels.findIndex((level) => level >= value);
        if (index === -1) return zoomLevels.length - 1;
        return zoomLevels[index] === value ? index : Math.max(index - 1, 0);
    }

    hasLayoutSize(): boolean {
        return Boolean(this.lastLayoutSize.width && this.lastLayoutSize.height);
    }

    async handleArrow(key: 37 | 38 | 39 | 40,
        options: { ctrlKey?: boolean; shiftKey?: boolean } = {},
    ): Promise<void> {
        const editStatus = get(this.stores.editStatus);
        const inputMode = get(this.stores.userPreferences).inputMode;
        if (!editStatus?.selection?.id) return;
        // Left arrow in chordMode
        if (editStatus.insertMode && inputMode === "pitchFirst" && editStatus.insertion?.chordMode && key === 39) {
            return await this.vrvResetCursor(true);
        }
        if (editStatus?.insertMode) {
            // In durationFirst set it to g to ensure keyboard octave move
            if (inputMode === "durationFirst") {
                await this.handleSetSelectionAttribute("pname", "g");
                // Add control to trigger octave shift
                options.ctrlKey = true;
            }
            return await this.handleKeyDown(key, options);
        }
        else if (options.shiftKey) {
            return await this.handleKeyDown(key, options);
        }
        else {
            await this.vrvNavigate(key, options);
            return;
        }
    }

    async handleDuration(key: 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57,
    ): Promise<void> {
        const editStatus = get(this.stores.editStatus);
        const inputMode = get(this.stores.userPreferences).inputMode;
        if (!editStatus?.selection?.id) return;
        if (editStatus?.insertMode && inputMode === "pitchFirst") {
            return await this.handleInsertNote(key);
        }
        else {
            const editActionParam: EditActionParam = {
                elementId: editStatus.selection.id,
                attribute: "dur",
                value: finaleSpeedyDurationToMEI[key]
            };
            await this.vrvSet(editActionParam, true);
        }
    }

    async handleEditAction(
        action: EditAction,
        dialogValue?: string | number,
        options: { redoLayout?: boolean } = {},
    ): Promise<boolean> {
        const editAction = this.resolveEditAction(action, dialogValue);
        const ok = await this.vrvEdit(editAction, "Failed to apply edit action");
        if (!ok) {
            return false;
        }
        const editStatus = await this.vrvRefreshStatusAndSelectChainedId();
        if (options.redoLayout) {
            await this.vrvRedoLayoutAndRefreshPageCount();
        }
        await this.vrvRefreshSVG();
        if (!editStatus.chainedId) {
            await this.vrvRefreshContextFromSelection();
        }
        this.markDocumentChanged();
        return true;
    }

    async handleEnter(chordMode = false): Promise<void> {
        const editStatus = get(this.stores.editStatus);
        const selection = editStatus.selection;
        const inputMode = get(this.stores.userPreferences).inputMode;
        if (editStatus.insertMode) {
            if (chordMode) return;
            if (editStatus.insertion?.chordMode && inputMode === "durationFirst") {
                return await this.vrvResetCursor(true);
            }
            const ok = await this.vrvEdit({
                action: "updateCursor",
                param: {
                    chordMode: true,
                },
            }, "Failed to update the cursor chord mode");
            if (!ok) return;
        }
        else {
            if (!selection?.id) return;
            if (!enableInsertMode(selection.element)) return;
            const ok = await this.vrvEdit({
                action: "setCursor",
                param: {
                    elementId: selection.id,
                    inputMode: get(this.stores.userPreferences).inputMode,
                    chordMode,
                },
            }, "Failed to perform the setCursor action");
            if (!ok) return;
        }
        await this.vrvApplyEditLayout(true);
        await this.vrvRefreshStatus();
    }

    async handleEscape(): Promise<void> {
        const selection = get(this.stores.editStatus).selection;
        if (!selection?.id) return;
        return await this.vrvResetCursor(false);
    }

    async handleInsertNote(
        key: 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57,
    ): Promise<void> {
        const selection = get(this.stores.editStatus).selection;
        const insertMode = get(this.stores.editStatus).insertMode;
        if (!selection?.id || !insertMode) return;
        const ok = await this.vrvEdit({
            action: "insertCursorByDur",
            param: {
                dur: finaleSpeedyDurationToMEI[key],
            },
        }, "Failed to perform the key action");
        if (!ok) return;
        await this.vrvApplyEditLayout(true);
        this.markDocumentChanged();
        await this.vrvRefreshStatusAndSelectChainedId();
    }

    async handleKeyDown(
        key: number,
        options: { ctrlKey?: boolean; shiftKey?: boolean } = {},
    ): Promise<void> {
        const selection = get(this.stores.editStatus).selection;
        if (!selection?.id) return;
        const ok = await this.vrvEdit({
            action: "keyDown",
            param: {
                elementId: selection.id,
                key,
                ...(options.ctrlKey ? { ctrlKey: true } : {}),
                ...(options.shiftKey ? { shiftKey: true } : {}),
            },
        }, "Failed to perform the key action");
        if (!ok) return;
        await this.vrvApplyEditLayout(true);
        this.markDocumentChanged();
        await this.vrvRefreshContextFromSelection();
        await this.vrvRefreshStatus();
    }

    async handleLetter(key: number): Promise<void> {
        const { pianoKeyboardEnabled } = get(this.stores.userPreferences);
        if (pianoKeyboardEnabled) {
            const editStatus = get(this.stores.editStatus);
            if (!editStatus?.selection?.id) return;
            return this.handlePitchFromPianoKeyboard(key);
        } else {
            await this.vrvPitchFromLetter(key);
        }
    }

    async handlePitchFromPianoKeyboard(key: number): Promise<void> {
        const octave = get(this.stores.pianoKeyboardOctave);
        const midi = midiForKeyboardCode(octave, key);
        if (midi === null) return;
        await this.vrvPitchFromPianoKeyboardMidi(midi);
    }

    async handlePitchAccidentalMode(accid: "s" | "f" | "n"): Promise<void> {
        if (get(this.stores.userPreferences).pianoKeyboardEnabled) {
            this.stores.pianoKeyboardMode.set(
                accid === "s" ? "sharp" : accid === "f" ? "flat" : "auto",
            );
            return;
        }
        await this.vrvUpdatePitchAccid(accid);
    }

    async handleRedo(): Promise<boolean> {
        return await this.vrvUndoRedo("redo");
    }

    async handleRefreshLayout(): Promise<void> {
        this.stores.workerBusy.set(true);
        try {
            await this.vrvRedoLayoutAndRefreshPageCount();
            await this.vrvRefreshSVG();
            const editStatus = await this.vrvRefreshStatus();
            if (editStatus.selection?.id) {
                await this.vrvSelect(editStatus.selection?.id);
                await this.vrvRefreshContextFromSelection();
            }
        } finally {
            this.stores.workerBusy.set(false);
        }
    }

    async handleRestMode(restMode: boolean): Promise<void> {
        const editStatus = get(this.stores.editStatus);
        const selection = editStatus.selection;
        const inputMode = get(this.stores.userPreferences).inputMode;
        if (!editStatus.insertMode || inputMode !== "pitchFirst") return;
        if (!selection?.id) return;
        const ok = await this.vrvEdit({
            action: "updateCursor",
            param: {
                restMode,
            },
        }, "Failed to update the cursor rest mode");
        if (!ok) return;
        await this.vrvApplyEditLayout(true);
        await this.vrvRefreshStatus();
    }
    async handleSetSelectionAttribute(attribute: string, value: string): Promise<void> {
        const editStatus = get(this.stores.editStatus);
        if (!editStatus?.selection?.id) return;
        const editActionSetParams = {
            elementId: editStatus.selection.id,
            attribute,
            value
        };
        return await this.vrvSet(editActionSetParams, true);
    }

    async handleSpace(): Promise<void> {
        const editStatus = get(this.stores.editStatus);
        const inputMode = get(this.stores.userPreferences).inputMode;
        if (editStatus.insertMode && inputMode === "durationFirst" && !editStatus.insertion?.chordMode) {
            await this.vrvInsertCursorByType("rest");
            return;
        }
        await this.handleRestMode(true);
    }

    async handleTieMode(insertType: "tie" | "copy"): Promise<void> {
        const editStatus = get(this.stores.editStatus);
        const selection = editStatus.selection;
        const inputMode = get(this.stores.userPreferences).inputMode;
        if (!editStatus.insertMode || !selection?.id) return;

        if (inputMode === "durationFirst") {
            await this.vrvInsertCursorByType(insertType);
            return;
        }

        const ok = await this.vrvEdit({
            action: "updateCursor",
            param: {
                tieMode: insertType,
            },
        }, "Failed to update the cursor tie mode");
        if (!ok) return;
        await this.vrvApplyEditLayout(true);
        await this.vrvRefreshStatus();
    }

    async handleUndo(): Promise<boolean> {
        return await this.vrvUndoRedo("undo");
    }


    async init(verovioUrl: string): Promise<string> {
        this.stores.workerBusy.set(true);
        await this.bridge.init(verovioUrl);
        const version = await this.bridge.verovio.getVersion();
        this.stores.workerBusy.set(false);
        return version;
    }

    async loadData(data: string): Promise<void> {
        this.stores.workerBusy.set(true);
        this.updateVerovioOptions({ adjustPageHeight: true });
        this.stores.verovioState.update((current) => ({
            ...current,
            currentPage: 1,
            pageCount: 0,
        }));
        if (this.hasLayoutSize()) {
            this.updateOptionsForSize(this.lastLayoutSize);
            await this.vrvSetOptions();
        }
        await this.bridge.verovio.loadData(data);
        const editStatus = await this.vrvRefreshStatus();
        const isMensuralMusicOnly = editStatus.isMensuralMusicOnly;
        this.updateVerovioOptions({
            adjustPageHeight: !isMensuralMusicOnly,
            breaks: isMensuralMusicOnly ? "none" : "auto",
        });
        await this.vrvSetOptions();
        // Reload with adjustPageHeight set to false
        if (isMensuralMusicOnly) {
            await this.bridge.verovio.loadData(data);
        }
        await this.vrvRefreshPageCount();
        await this.vrvRefreshSVG();
    }

    private resolveDialogValuePlaceholder<T>(value: T, dialogValue: string | number = ""): T {
        if (typeof value === "string") {
            if (value === "{{dialogValue}}") return dialogValue as T;
            return value.split("{{dialogValue}}").join(String(dialogValue)) as T;
        }
        if (Array.isArray(value)) {
            return value.map((item) => this.resolveDialogValuePlaceholder(item, dialogValue)) as T;
        }
        if (value && typeof value === "object") {
            return Object.fromEntries(
                Object.entries(value).map(([key, entry]) => [
                    key,
                    this.resolveDialogValuePlaceholder(entry, dialogValue),
                ]),
            ) as T;
        }
        return value;
    }

    private resolveEditAction(action: EditAction, dialogValue?: string | number): EditAction {
        if (!("param" in action)) {
            return { action: action.action } as EditAction;
        }
        return {
            action: action.action,
            param: this.resolveDialogValuePlaceholder(action.param, dialogValue),
        } as EditAction;
    }

    async saveDoc(): Promise<string> {
        const exported = await this.bridge.verovio.getMEI();
        this.stores.dirty.set(false);
        this.stores.statusLine.set("Saved to local storage.");
        return exported;
    }

    async setCurrentPage(nextPage: number): Promise<void> {
        await this.vrvRefreshStatus();
        const { pageCount } = get(this.stores.verovioState);
        const clamped = Math.min(Math.max(1, nextPage), Math.max(1, pageCount));
        this.stores.verovioState.update((current) => ({
            ...current,
            currentPage: clamped,
        }));
        if (get(this.stores.viewModel).svg) {
            this.stores.workerBusy.set(true);
            await this.vrvRefreshSVG();
        }
    }

    private updateOptionsForSize(size: { width: number; height: number }): void {
        const { zoom } = get(this.stores.verovioState);
        this.updateVerovioOptions({
            pageHeight: Math.max(0, Math.floor(size.height)),
            pageWidth: Math.max(0, Math.floor(size.width)),
            scale: this.clampZoom(zoom),
        });
    }

    private updateVerovioOptions(patch: Partial<VerovioOptions>): void {
        this.verovioOptions = {
            ...this.verovioOptions,
            ...patch,
        };
    }

    async vrvApplyEditLayout(commit: boolean): Promise<void> {
        if (commit) {
            const editAction: EditAction = {
                action: "commit"
            };
            await this.bridge.verovio.edit(editAction);
        } else {
            await this.bridge.verovio.redoPagePitchPosLayout();
        }
        await this.vrvRefreshSVG();
    }

    private async vrvEdit(
        editAction: EditAction,
        errorMessage: string,
    ): Promise<boolean> {
        this.stores.workerBusy.set(true);
        try {
            const ok = await this.bridge.verovio.edit(editAction);
            if (!ok) {
                this.stores.workerBusy.set(false);
            }
            return ok;
        } catch (error) {
            console.error(errorMessage, error);
            this.stores.workerBusy.set(false);
            return false;
        }
    }

    async vrvInsertCursorByType(type: "rest" | "copy" | "tie"): Promise<void> {
        const selection = get(this.stores.editStatus).selection;
        const insertMode = get(this.stores.editStatus).insertMode;
        const durationFirst = get(this.stores.userPreferences).inputMode === "durationFirst";
        if (!selection?.id || !insertMode || !durationFirst) return;

        const param: EditActionInsertCursorByTypeParam = { type };
        const ok = await this.vrvEdit({
            action: "insertCursorByType",
            param,
        }, `Failed to insert cursor by type: ${type}`);
        if (!ok) return;
        await this.vrvApplyEditLayout(true);
        this.markDocumentChanged();
        await this.vrvRefreshStatusAndSelectChainedId();
    }

    async vrvNavigate(direction: 37 | 38 | 39 | 40,
        options: { ctrlKey?: boolean; shiftKey?: boolean } = {}): Promise<boolean> {
        const selection = get(this.stores.editStatus).selection;
        if (!selection?.id) return false;
        this.stores.workerBusy.set(true);
        try {
            const editAction: EditAction = {
                action: "navigate",
                param: { elementId: selection.id, direction },
            };
            const ok = await this.bridge.verovio.edit(editAction);
            if (!ok) return false;
            const editStatus = await this.vrvRefreshStatus();
            if (!editStatus.chainedId) return false;
            await this.vrvSelect(editStatus.chainedId);
            return true;
        } catch (error) {
            console.error("Failed to navigate selection", error);
            return false;
        } finally {
            this.stores.workerBusy.set(false);
        }
    }

    async vrvPitchFromLetter(key: number): Promise<void> {
        const pname = String.fromCharCode(key).toLowerCase();
        if (!["a", "b", "c", "d", "e", "f", "g"].includes(pname)) return;
        const selection = get(this.stores.editStatus).selection;
        const insertMode = get(this.stores.editStatus).insertMode;
        const durationFirst = get(this.stores.userPreferences).inputMode === "durationFirst";
        if (!selection?.id) return;
        if (insertMode && durationFirst) {
            const ok = await this.vrvEdit({
                action: "insertCursorByPitch",
                param: {
                    pname,
                },
            }, "Failed to insert the pitch name");
            if (!ok) return;
        }
        else {
            const ok = await this.vrvEdit({
                action: "updatePitch",
                param: {
                    elementId: selection.id,
                    pname,
                },
            }, "Failed to update the pitch name");
            if (!ok) return;
        }
        await this.vrvApplyEditLayout(true);
        this.markDocumentChanged();
        if (insertMode) {
            if (durationFirst) {
                await this.vrvRefreshStatusAndSelectChainedId();
            }
            else {
                await this.vrvRefreshStatus();
            }
        }
        else {
            await this.vrvRefreshContextFromSelection();
        }
    }

    async vrvPitchFromPianoKeyboardMidi(midi: number): Promise<void> {
        if (midi < 0) return;
        const keyboardMode = get(this.stores.pianoKeyboardMode);
        const selection = get(this.stores.editStatus).selection;
        const insertMode = get(this.stores.editStatus).insertMode;
        const durationFirst = get(this.stores.userPreferences).inputMode === "durationFirst";
        if (!selection?.id) return;
        let editAction: EditAction;
        if (insertMode && durationFirst) {
            let param: EditActionInsertCursorByPitchParam;
            if (keyboardMode !== "auto") {
                const note = noteForMidi(midi, keyboardMode);
                param = note.accid === "n"
                    ? { midi }
                    : {
                        pname: note.pname,
                        oct: note.oct,
                        accid: note.accid,
                    };
            }
            else {
                param = { midi };
            }
            editAction = {
                action: "insertCursorByPitch",
                param,
            };
        }
        else {
            let param: EditActionUpdatePitchParam;
            if (keyboardMode !== "auto") {
                const note = noteForMidi(midi, keyboardMode);
                param = {
                    elementId: selection.id,
                    pname: note.pname,
                    oct: note.oct,
                    accid: note.accid,
                };
            }
            else {
                param = {
                    elementId: selection.id,
                    midi,
                };
            }
            editAction = {
                action: "updatePitch",
                param,
            };
        }
        const ok = await this.vrvEdit(editAction, "Failed to insert or update the pitch or midi value");
        if (!ok) return;
        await this.vrvApplyEditLayout(true);
        this.markDocumentChanged();
        if (insertMode) {
            if (durationFirst) {
                await this.vrvRefreshStatusAndSelectChainedId();
            }
            else {
                await this.vrvRefreshStatus();
            }
        }
        else {
            await this.vrvRefreshContextFromSelection();
        }
    }

    private async vrvRedoLayoutAndRefreshPageCount(): Promise<void> {
        await this.bridge.verovio.redoLayout();
        await this.vrvRefreshPageCount();
    }

    private async vrvRefreshContextForElement(id: string): Promise<boolean> {
        const contextOk = await this.bridge.verovio.edit({
            action: "context",
            param: { elementId: id },
        });
        this.stores.editResponseContent.set(
            contextOk ? await this.bridge.verovio.editResponseContent() : null,
        );
        return contextOk;
    }

    async vrvRefreshContextFromSelection(): Promise<void> {
        const selection = get(this.stores.editStatus).selection;
        if (!selection?.id) return;
        await this.vrvRefreshContextForElement(selection.id);
    }

    private async vrvRefreshPageCount(): Promise<number> {
        const pageCount = await this.bridge.verovio.getPageCount();
        this.stores.verovioState.update((current) => ({
            ...current,
            pageCount,
            currentPage: Math.min(current.currentPage, Math.max(1, pageCount)),
        }));
        return pageCount;
    }

    private async vrvRefreshStatus(): Promise<EditStatus> {
        const editStatus = await this.bridge.verovio.editStatus();
        this.stores.editStatus.set(editStatus);
        if (editStatus.insertMode && editStatus.insertion) {
            const keyboardOctave = keyboardOctaveForPitch(
                get(this.stores.pianoKeyboardOctave),
                editStatus.insertion,
            );
            if (keyboardOctave !== null) {
                this.stores.pianoKeyboardOctave.set(keyboardOctave);
            }
        }
        return editStatus;
    }

    private async vrvRefreshStatusAndSelectChainedId(): Promise<EditStatus> {
        const editStatus = await this.vrvRefreshStatus();
        if (editStatus.chainedId) {
            await this.vrvSelect(editStatus.chainedId);
        }
        return editStatus;
    }

    async vrvRefreshSVG(): Promise<void> {
        const { currentPage } = get(this.stores.verovioState);
        const svg = await this.bridge.verovio.renderToSVG(currentPage);
        const viewModel = get(this.stores.viewModel);
        this.svgRenderId += 1;
        this.stores.viewModel.set({ ...viewModel, svg, svgId: this.svgRenderId });
        this.stores.workerBusy.set(false);
    }

    async vrvResetCursor(maintainChordMode: boolean): Promise<void> {
        const insertMode = get(this.stores.editStatus).insertMode;
        const ok = await this.vrvEdit({
            action: "resetCursor",
            param: {
                maintainChordMode,
            },
        }, "Failed to perform the resetCursor action");
        if (!ok) return;
        await this.vrvApplyEditLayout(true);
        if (insertMode) {
            await this.vrvRefreshStatusAndSelectChainedId();
        }
        else {
            await this.vrvRefreshStatus();
        }
        return;
    }

    async vrvSelect(id: string | null): Promise<void> {
        if (!id) {
            this.stores.editStatus.update((current) => ({
                ...current,
                selection: null,
            }));
            this.stores.editResponseContent.set(null);
            return;
        }
        const page = await this.bridge.verovio.getPageWithElement(id);
        if (page && page > 0 && page !== get(this.stores.verovioState).currentPage) {
            await this.setCurrentPage(page);
        }
        try {
            const editActionSelect: EditAction = {
                action: "select",
                param: { elementId: id },
            }
            const selectOk = await this.bridge.verovio.edit(editActionSelect);
            const contextOk = selectOk && await this.vrvRefreshContextForElement(id);
            if (selectOk && contextOk) {
                await this.vrvRefreshStatus();
            } else {
                this.stores.editResponseContent.set(null);
            }
        } catch (error) {
            console.error("Failed to load context data", error);
            this.stores.editResponseContent.set(null);
        }
    }

    async vrvSelectSecondary(id: string | null): Promise<void> {
        if (!id || !get(this.stores.editStatus).selection?.id) return;
        try {
            const editActionSelect: EditAction = {
                action: "select",
                param: {
                    elementId: id,
                    secondary: true,
                },
            };
            const selectOk = await this.bridge.verovio.edit(editActionSelect);
            if (selectOk) {
                await this.vrvRefreshStatus();
            }
        } catch (error) {
            console.error("Failed to update secondary selection", error);
        }
    }

    async vrvSelectCustom(id: string | null, custom: "note" | "textParent"): Promise<void> {
        if (!id) return;
        try {
            const editActionSelect: EditAction = {
                action: "select",
                param: {
                    elementId: id,
                    custom,
                },
            };
            const selectOk = await this.bridge.verovio.edit(editActionSelect);
            if (selectOk) {
                await this.vrvRefreshStatus();
                await this.vrvRefreshContextFromSelection();
            }
        } catch (error) {
            console.error("Failed to update custom selection", error);
        }
    }

    async vrvSet(param: EditActionSetParam, commit: boolean): Promise<void> {
        const ok = await this.vrvEdit({
            action: "set",
            param,
        }, "Failed to update attribute");
        if (!ok) return;
        await this.vrvApplyEditLayout(commit);
        if (commit) {
            this.markDocumentChanged();
        }
        await this.vrvRefreshStatus();
        if (commit) {
            await this.vrvRefreshContextFromSelection();
        }
    }

    private async vrvSetOptions(): Promise<void> {
        await this.bridge.verovio.setOptions(this.verovioOptions);
    }

    async vrvUpdatePitchAccid(accid: "s" | "f" | "n"): Promise<void> {
        const editStatus = get(this.stores.editStatus);
        const selection = editStatus.selection;
        if (!selection?.id) return;
        const ok = await this.vrvEdit({
            action: "updatePitch",
            param: {
                elementId: selection.id,
                accid,
            },
        }, "Failed to update the accidental");
        if (!ok) return;
        await this.vrvApplyEditLayout(true);
        this.markDocumentChanged();
        if (editStatus.insertMode) {
            await this.vrvRefreshStatus();
        }
        else {
            await this.vrvRefreshContextFromSelection();
        }
    }

    private async vrvUndoRedo(action: "undo" | "redo"): Promise<boolean> {
        const canApply = action === "undo"
            ? get(this.stores.editStatus).canUndo
            : get(this.stores.editStatus).canRedo;
        if (!canApply) return false;

        const ok = await this.vrvEdit({
            action,
        }, `Failed to ${action}`);
        if (!ok) return false;

        const editStatus = await this.vrvRefreshStatus();
        if (editStatus.invalidLayout === true) {
            await this.vrvRedoLayoutAndRefreshPageCount();
        }
        await this.vrvRefreshSVG();
        if (editStatus.selection?.id) {
            await this.vrvSelect(editStatus.selection?.id);
            await this.vrvRefreshContextFromSelection();
        } else {
            this.stores.editResponseContent.set(null);
        }
        this.markDocumentChanged();
        return true;
    }

    private markDocumentChanged(): void {
        this.stores.dirty.set(true);
        this.stores.documentRevision.update((revision) => revision + 1);
    }
}
