import { get, type Writable } from "svelte/store";
import type {
    EditActionSetParam,
    EditActionParam,
    EditInfoContent,
    EditAction,
    EditActionName,
    MEIExportOptions,
    SelectionInfo,
    TreeNodeData,
    ViewModel,
} from "./types";
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
    isMensuralMusicOnly: Writable<boolean>;
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
        this.stores.isMensuralMusicOnly.set(false);
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
        const editInfo = await this.bridge.verovio.editInfo();
        const isMensuralMusicOnly = editInfo.isMensuralMusicOnly;
        this.stores.isMensuralMusicOnly.set(isMensuralMusicOnly);
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
                action: "commit",
                param: {},
            };
            await this.bridge.verovio.edit(editAction);
        } else {
            await this.bridge.verovio.redoPagePitchPosLayout();
        }
        await this.updateVerovioView();
    }

    async refreshContextFromSelection(): Promise<void> {
        const current = get(this.stores.selection);
        if (current.type !== "element" || !current.id) return;
        const editAction: EditAction = {
            action: "context",
            param: { elementId: current.id },
        };
        const contextOk = await this.bridge.verovio.edit(editAction);
        if (contextOk) {
            this.stores.editInfoContent.set(
                await this.bridge.verovio.editInfoContent(),
            );
        } else {
            this.stores.editInfoContent.set(null);
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
            const scoreDef = await this.bridge.verovio.editInfoScoreDef();
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
                this.stores.editInfoContent.set(
                    await this.bridge.verovio.editInfoContent(),
                );
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

    async navigateSelection(direction: 37 | 39): Promise<boolean> {
        const current = get(this.stores.selection);
        if (current.type !== "element" || !current.id) return false;
        this.stores.workerBusy.set(true);
        try {
            const editAction: EditAction = {
                action: "navigate",
                param: { elementId: current.id, direction },
            };
            const ok = await this.bridge.verovio.edit(editAction);
            if (!ok) return false;
            const editInfo = await this.bridge.verovio.editInfo();
            if (!editInfo.chainedId) return false;
            await this.handleSelect(editInfo.chainedId);
            return true;
        } catch (error) {
            console.error("Failed to navigate selection", error);
            return false;
        } finally {
            this.stores.workerBusy.set(false);
        }
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
                this.stores.editInfoContent.set(
                    await this.bridge.verovio.editInfoContent(),
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

    async handleContextMenuEdit(
        action: EditActionName,
        param: EditActionParam | undefined,
        context: {
            targetId: string;
            targetElement: string;
            parentElement: string | null;
            dialogValue?: string;
        },
    ): Promise<boolean> {
        this.stores.workerBusy.set(true);
        try {
            const resolvedParam = this.replaceActionPlaceholder(param, context);
            const editAction: EditAction = {
                action,
                param: resolvedParam ?? {},
            };
            const ok = await this.bridge.verovio.edit(editAction);
            if (!ok) {
                this.stores.workerBusy.set(false);
                return false;
            }
            const editInfo = await this.bridge.verovio.editInfo();
            if (editInfo.chainedId) {
                await this.setSelection({
                    type: "element",
                    id: editInfo.chainedId,
                });
            }
            await this.updateVerovioView();
            await this.refreshContextFromSelection();
            this.stores.dirty.set(true);
            return true;
        } catch (error) {
            console.error("Failed to apply context menu action", error);
            this.stores.workerBusy.set(false);
            return false;
        }
    }

    private replaceActionPlaceholder(
        param: EditActionParam | undefined,
        context: {
            targetId: string;
            targetElement: string;
            parentElement: string | null;
            dialogValue?: string;
        },
    ): EditActionParam | undefined {
        if (param === undefined) return undefined;
        const placeholders: Record<string, string> = {
            targetId: context.targetId,
            targetElement: context.targetElement,
            parentElement: context.parentElement ?? "",
            dialogValue: context.dialogValue ?? "",
        };
        const placeholderPattern = /^\{\{([a-zA-Z0-9_]+)\}\}$/;

        const replaceValue = (value: unknown): unknown => {
            if (typeof value === "string") {
                const match = value.match(placeholderPattern);
                if (match) {
                    const key = match[1];
                    return placeholders[key] ?? value;
                }
            }
            if (Array.isArray(value)) {
                return value.map((entry) => replaceValue(entry));
            }
            if (value && typeof value === "object") {
                const entries = Object.entries(value as Record<string, unknown>);
                return Object.fromEntries(entries.map(([k, v]) => [k, replaceValue(v)]));
            }
            return value;
        };

        return replaceValue(param) as EditActionParam;
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
