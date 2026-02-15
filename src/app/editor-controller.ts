import { get, type Writable } from "svelte/store";
import type { EditActionSetParam, EditInfoContent, EditAction, SelectionInfo, ViewModel } from "./types";
import type { VerovioOptions } from "./worker/verovio-types";
import { createWorkerBridge, type WorkerBridge } from "./worker/bridge";

const zoomLevels = [10, 20, 35, 75, 100, 150, 200];

type ControllerStores = {
    verovioState: Writable<{ zoom: number; pageCount: number; currentPage: number }>;
    viewModel: Writable<ViewModel>;
    selection: Writable<SelectionInfo>;
    statusLine: Writable<string>;
    workerBusy: Writable<boolean>;
    dirty: Writable<boolean>;
    editInfoContent: Writable<EditInfoContent | null>;
};

export class EditorController {
    private readonly worker: Worker;
    private readonly bridge: WorkerBridge;
    private readonly stores: ControllerStores;
    private lastLayoutSize = { width: 0, height: 0 };
    private svgRenderId = 0;

    constructor(workerUrl: URL, stores: ControllerStores) {
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

    async setSelection(next: SelectionInfo): Promise<void> {
        this.stores.selection.set(next);
        this.stores.viewModel.update((current) => ({ ...current, selection: next }));
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
        this.stores.verovioState.update((current) => ({
            ...current,
            currentPage: 1,
            pageCount: 0,
        }));
        if (this.hasLayoutSize()) {
            const options = this.buildVerovioOptions(this.lastLayoutSize);
            await this.bridge.verovio.setOptions(options);
        }
        await this.bridge.verovio.loadData(data);
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
        const options = this.buildVerovioOptions(size);
        await this.bridge.verovio.setOptions(options);
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
            await this.bridge.verovio.edit({ action: "commit", param: {} });
        } else {
            await this.bridge.verovio.redoPagePitchPosLayout();
        }
        await this.updateVerovioView();
    }

    async refreshContextFromSelection(): Promise<void> {
        const current = get(this.stores.selection);
        if (current.type !== "element" || !current.id) return;
        const contextOk = await this.bridge.verovio.edit({
            action: "context",
            param: { elementId: current.id },
        });
        if (contextOk) {
            this.stores.editInfoContent.set(await this.bridge.verovio.editInfo() as EditInfoContent);
        } else {
            this.stores.editInfoContent.set(null);
        }
    }

    async handleSelect(id: string | null): Promise<void> {
        if (!id) {
            await this.setSelection({ type: "none" });
            this.stores.editInfoContent.set(null);
            return;
        }
        const page = await this.bridge.verovio.getPageWithElement(id);
        if (page && page > 0 && page !== get(this.stores.verovioState).currentPage) {
            await this.setCurrentPage(page);
        }
        try {
            const editAction: EditAction = {
                action: "context",
                param: { elementId: id },
            };
            const contextOk = await this.bridge.verovio.edit(editAction);
            if (contextOk) {
                this.stores.editInfoContent.set(await this.bridge.verovio.editInfo() as EditInfoContent);
            } else {
                this.stores.editInfoContent.set(null);
            }
        } catch (error) {
            console.error("Failed to load context data", error);
            this.stores.editInfoContent.set(null);
        }
        await this.setSelection({
            type: "element",
            id,
        });
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
                this.stores.editInfoContent.set(await this.bridge.verovio.editInfo() as EditInfoContent);
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

    async saveDoc(): Promise<string> {
        const exported = await this.bridge.verovio.getMEI();
        this.stores.dirty.set(false);
        this.stores.statusLine.set("Saved to local storage.");
        return exported;
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

    private buildVerovioOptions(size: { width: number; height: number }): VerovioOptions {
        const { zoom } = get(this.stores.verovioState);
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
            scale: this.clampZoom(zoom),
            scaleToPageSize: true,
            xmlIdSeed: 1,
        };
    }
}
