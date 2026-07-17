import { get, type Readable, type Unsubscriber, type Writable } from "svelte/store";
import type { EditorController } from "./editor-controller";

type AutosaveStores = {
    documentRevision: Readable<number>;
    workerBusy: Readable<boolean>;
    statusLine: Writable<string>;
};

export type AutosaveHandle = {
    markClean: () => void;
    destroy: () => void;
};

const AUTOSAVE_DELAY_MS = 500;

export function initMEIAutosave(
    controller: EditorController,
    stores: AutosaveStores,
    storageKey: string,
): AutosaveHandle {
    let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
    let autosaveInFlight = false;
    let pendingAutosaveRevision = 0;
    let savedAutosaveRevision = 0;
    let initialized = false;
    let unsubscribe: Unsubscriber | null = null;

    function clearAutosaveTimer() {
        if (!autosaveTimer) return;
        clearTimeout(autosaveTimer);
        autosaveTimer = null;
    }

    function markClean() {
        clearAutosaveTimer();
        const revision = get(stores.documentRevision);
        pendingAutosaveRevision = revision;
        savedAutosaveRevision = revision;
    }

    function scheduleAutosave(delay = AUTOSAVE_DELAY_MS) {
        clearAutosaveTimer();
        autosaveTimer = setTimeout(() => {
            void autosaveCurrentMEI();
        }, delay);
    }

    async function autosaveCurrentMEI() {
        autosaveTimer = null;
        if (autosaveInFlight) {
            scheduleAutosave();
            return;
        }
        if (pendingAutosaveRevision <= savedAutosaveRevision) return;
        if (get(stores.workerBusy)) {
            scheduleAutosave();
            return;
        }

        autosaveInFlight = true;
        const revisionToSave = pendingAutosaveRevision;
        try {
            const mei = await controller.getMEI();
            localStorage.setItem(storageKey, mei);
            savedAutosaveRevision = revisionToSave;
        } catch (error) {
            console.error("Failed to autosave MEI", error);
            stores.statusLine.set("Failed to autosave score.");
        } finally {
            autosaveInFlight = false;
        }

        if (pendingAutosaveRevision > revisionToSave) {
            scheduleAutosave();
        }
    }

    unsubscribe = stores.documentRevision.subscribe((revision) => {
        pendingAutosaveRevision = revision;
        if (!initialized) {
            initialized = true;
            savedAutosaveRevision = revision;
            return;
        }
        scheduleAutosave();
    });

    return {
        markClean,
        destroy: () => {
            unsubscribe?.();
            clearAutosaveTimer();
        },
    };
}
