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
} from "./types";
import type { VerovioOptions } from "./worker/verovio-types";
import { createWorkerBridge, type WorkerBridge } from "./worker/bridge";

const zoomLevels = [10, 20, 35, 75, 100, 150, 200];
const NON_DELETABLE_ELEMENTS = new Set(["staff", "layer"]);

type ControllerStores = {
    verovioState: Writable<{ zoom: number; pageCount: number; currentPage: number }>;
    viewModel: Writable<ViewModel>;
    editStatus: Writable<EditStatus>;
    statusLine: Writable<string>;
    workerBusy: Writable<boolean>;
    dirty: Writable<boolean>;
    editResponseContent: Writable<EditResponseContent | null>;
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
    
    async init(verovioUrl: string): Promise<string> {
        this.stores.workerBusy.set(true);
        await this.bridge.init(verovioUrl);
        const version = await this.bridge.verovio.getVersion();
        this.stores.workerBusy.set(false);
        return version;
    }

    destroy(): void {
        this.worker.terminate();
    }

    hasLayoutSize(): boolean {
        return Boolean(this.lastLayoutSize.width && this.lastLayoutSize.height);
    }

    async applyLayoutForLastSize(): Promise<void> {
        if (!this.hasLayoutSize()) return;
        await this.applyLayoutForSize(this.lastLayoutSize);
    }

    private async refreshEditStatus(): Promise<EditStatus> {
        const editStatus = await this.bridge.verovio.editStatus();
        this.stores.editStatus.set(editStatus);
        return editStatus;
    }

    async updateVerovioView(): Promise<void> {
        const { currentPage } = get(this.stores.verovioState);
        const svg = await this.bridge.verovio.renderToSVG(currentPage);
        const current = get(this.stores.viewModel);
        this.svgRenderId += 1;
        this.stores.viewModel.set({ ...current, svg, svgId: this.svgRenderId });
        this.stores.workerBusy.set(false);
    }

    async setCurrentPage(nextPage: number): Promise<void> {
        const { pageCount } = get(this.stores.verovioState);
        const clamped = Math.min(Math.max(1, nextPage), Math.max(1, pageCount));
        this.stores.verovioState.update((current) => ({
            ...current,
            currentPage: clamped,
        }));
        if (get(this.stores.viewModel).svg) {
            this.stores.workerBusy.set(true);
            await this.updateVerovioView();
        }
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
            await this.applyCurrentOptions();
        }
        await this.bridge.verovio.loadData(data);
        const editStatus = await this.refreshEditStatus();
        const isMensuralMusicOnly = editStatus.isMensuralMusicOnly;
        this.updateVerovioOptions({
            adjustPageHeight: !isMensuralMusicOnly,
            breaks: isMensuralMusicOnly ? "none" : "auto",
        });
        await this.applyCurrentOptions();
        // Reload with adjustPageHeight set to false
        if (isMensuralMusicOnly) {
            await this.bridge.verovio.loadData(data);
        }
        const pageCount = await this.bridge.verovio.getPageCount();
        this.stores.verovioState.update((current) => ({ ...current, pageCount }));
        await this.updateVerovioView();
    }

    async applyLayoutForSize(size: { width: number; height: number }): Promise<void> {
        if (!size.width || !size.height) return;
        this.lastLayoutSize = size;
        const current = get(this.stores.viewModel);
        if (!current.svg) return;
        this.stores.workerBusy.set(true);
        this.updateOptionsForSize(size);
        await this.applyCurrentOptions();
        await this.bridge.verovio.redoLayout();
        const pageCount = await this.bridge.verovio.getPageCount();
        this.stores.verovioState.update((current) => ({ ...current, pageCount }));
        const { currentPage } = get(this.stores.verovioState);
        if (currentPage > pageCount) {
            this.stores.verovioState.update((current) => ({
                ...current,
                currentPage: pageCount,
            }));
        }
        await this.updateVerovioView();
    }

    async applyEditLayout(commit: boolean): Promise<void> {
        if (commit) {
            const editAction: EditAction = {
                action: "commit"
            };
            await this.bridge.verovio.edit(editAction);
        } else {
            await this.bridge.verovio.redoPagePitchPosLayout();
        }
        await this.updateVerovioView();
    }

    async refreshContextFromSelection(): Promise<void> {
        const current = get(this.stores.editStatus).selection;
        if (!current?.id) return;
        const editAction: EditAction = {
            action: "context",
            param: { elementId: current.id },
        };
        const contextOk = await this.bridge.verovio.edit(editAction);
        if (contextOk) {
            this.stores.editResponseContent.set(
                await this.bridge.verovio.editResponseContent(),
            );
        } else {
            this.stores.editResponseContent.set(null);
        }
    }

    async getScoreDefForDialog(): Promise<TreeNodeData | null> {
        this.stores.workerBusy.set(true);
        try {
            const editAction: EditAction = {
                action: "properties",
                param: {},
            };
            const scoreDefContextOk = await this.bridge.verovio.edit(editAction);
            if (!scoreDefContextOk) {
                this.stores.workerBusy.set(false);
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

    async applyScoreDefFromDialog(scoreDef: TreeNodeData): Promise<boolean> {
        this.stores.workerBusy.set(true);
        let scoreDefStr = (scoreDef ? JSON.stringify(scoreDef) : "");
        try {
            const editAction: EditAction = {
                action: "properties",
                param: { scoreDef: scoreDefStr },
            };
            const ok = await this.bridge.verovio.edit(editAction);
            if (!ok) {
                this.stores.workerBusy.set(false);
                return false;
            }
            await this.applyEditLayout(true);
            await this.refreshContextFromSelection();
            return true;
        } catch (error) {
            console.error("Failed to apply scoreDef", error);
            this.stores.workerBusy.set(false);
            return false;
        }
    }

    async handleKeydown(
        key: 38 | 40,
        options: { ctrlKey?: boolean; shiftKey?: boolean } = {},
    ): Promise<void> {
        const current = get(this.stores.editStatus).selection;
        if (!current?.id) return;
        this.stores.workerBusy.set(true);
        try {
            const editAction: EditAction = {
                action: "keyDown",
                param: {
                    elementId: current.id,
                    key,
                    ...(options.ctrlKey ? { ctrlKey: true } : {}),
                    ...(options.shiftKey ? { shiftKey: true } : {}),
                },
            };
            const ok = await this.bridge.verovio.edit(editAction);
            if (ok) {
                this.stores.editResponseContent.set(
                    await this.bridge.verovio.editResponseContent(),
                );
                await this.applyEditLayout(true);
                await this.refreshContextFromSelection();
            } else {
                this.stores.workerBusy.set(false);
            }
        } catch (error) {
            console.error("Failed to perform the key action", error);
            this.stores.workerBusy.set(false);
        }
    }

    async handleSelect(id: string | null): Promise<void> {
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
            const editActionContext: EditAction = {
                action: "context",
                param: { elementId: id },
            };
            const contextOk = await this.bridge.verovio.edit(editActionContext);
            if (selectOk && contextOk) {
                const editResponseContent = await this.bridge.verovio.editResponseContent();
                await this.refreshEditStatus();
                this.stores.editResponseContent.set(
                    editResponseContent,
                );
            } else {
                this.stores.editResponseContent.set(null);
            }
        } catch (error) {
            console.error("Failed to load context data", error);
            this.stores.editResponseContent.set(null);
        }
    }

    async handleSecondarySelect(id: string | null): Promise<void> {
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
                await this.refreshEditStatus();
            }
        } catch (error) {
            console.error("Failed to update secondary selection", error);
        }
    }

    async navigateSelection(direction: 37 | 39): Promise<boolean> {
        const current = get(this.stores.editStatus).selection;
        if (!current?.id) return false;
        this.stores.workerBusy.set(true);
        try {
            const editAction: EditAction = {
                action: "navigate",
                param: { elementId: current.id, direction },
            };
            const ok = await this.bridge.verovio.edit(editAction);
            if (!ok) return false;
            const editStatus = await this.refreshEditStatus();
            if (!editStatus.chainedId) return false;
            await this.handleSelect(editStatus.chainedId);
            return true;
        } catch (error) {
            console.error("Failed to navigate selection", error);
            return false;
        } finally {
            this.stores.workerBusy.set(false);
        }
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

    async handleAttributeEdit(param: EditActionSetParam, commit: boolean): Promise<void> {
        this.stores.workerBusy.set(true);
        try {
            const editorAction: EditAction = {
                action: "set",
                param,
            };
            const ok = await this.bridge.verovio.edit(editorAction);
            if (ok) {
                this.stores.editResponseContent.set(
                    await this.bridge.verovio.editResponseContent(),
                );
                await this.applyEditLayout(commit);
                if (commit) {
                    await this.refreshContextFromSelection();
                }
            } else {
                this.stores.workerBusy.set(false);
            }
        } catch (error) {
            console.error("Failed to update attribute", error);
            this.stores.workerBusy.set(false);
        }
    }

    async handleEditAction(
        action: EditAction,
        dialogValue?: string | number,
        options: { redoLayout?: boolean } = {},
    ): Promise<boolean> {
        this.stores.workerBusy.set(true);
        try {
            const editAction = this.resolveEditAction(action, dialogValue);
            const ok = await this.bridge.verovio.edit(editAction);
            if (!ok) {
                this.stores.workerBusy.set(false);
                return false;
            }
            const editStatus = await this.refreshEditStatus();
            if (editStatus.chainedId) {
                await this.handleSelect(editStatus.chainedId);
            }
            if (options.redoLayout) {
                await this.bridge.verovio.redoLayout();
                const pageCount = await this.bridge.verovio.getPageCount();
                this.stores.verovioState.update((current) => ({
                    ...current,
                    pageCount,
                    currentPage: Math.min(current.currentPage, Math.max(1, pageCount)),
                }));
            }
            await this.updateVerovioView();
            if (!editStatus.chainedId) {
                await this.refreshContextFromSelection();
            }
            this.stores.dirty.set(true);
            return true;
        } catch (error) {
            console.error("Failed to apply edit action", error);
            this.stores.workerBusy.set(false);
            return false;
        }
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

    async saveDoc(): Promise<string> {
        const exported = await this.bridge.verovio.getMEI();
        this.stores.dirty.set(false);
        this.stores.statusLine.set("Saved to local storage.");
        return exported;
    }

    async getMEI(options?: MEIExportOptions): Promise<string> {
        return this.bridge.verovio.getMEI(options);
    }

    async exportSvg(): Promise<string> {
        const exported = await this.bridge.verovio.renderToSVG(1);
        this.stores.statusLine.set("Exported SVG file.");
        return exported;
    }

    canZoomIn(zoom: number): boolean {
        return this.getZoomIndex(zoom) < zoomLevels.length - 1;
    }

    canZoomOut(zoom: number): boolean {
        return this.getZoomIndex(zoom) > 0;
    }

    getZoomIndex(value: number): number {
        const sorted = [...zoomLevels].sort((a, b) => a - b);
        const index = sorted.findIndex((level) => level >= value);
        if (index === -1) return sorted.length - 1;
        return sorted[index] === value ? index : Math.max(index - 1, 0);
    }

    getNextZoom(current: number, direction: 1 | -1): number {
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

    async adjustZoom(direction: 1 | -1): Promise<void> {
        this.stores.verovioState.update((current) => ({
            ...current,
            zoom: Math.min(200, Math.max(10, Math.floor(this.getNextZoom(current.zoom, direction)))),
        }));
        if (this.hasLayoutSize()) {
            await this.applyLayoutForLastSize();
        }
    }

    private clampZoom(value: number): number {
        return Math.min(200, Math.max(10, Math.floor(value)));
    }

    private updateVerovioOptions(patch: Partial<VerovioOptions>): void {
        this.verovioOptions = {
            ...this.verovioOptions,
            ...patch,
        };
    }

    private updateOptionsForSize(size: { width: number; height: number }): void {
        const { zoom } = get(this.stores.verovioState);
        this.updateVerovioOptions({
            pageHeight: Math.max(0, Math.floor(size.height)),
            pageWidth: Math.max(0, Math.floor(size.width)),
            scale: this.clampZoom(zoom),
        });
    }

    private async applyCurrentOptions(): Promise<void> {
        await this.bridge.verovio.setOptions(this.verovioOptions);
    }
}
