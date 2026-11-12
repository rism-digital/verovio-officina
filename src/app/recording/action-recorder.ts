import type { WorkerCall } from "../worker/bridge";
import type {
    ActionRecording,
    ActionRecordingBundle,
    ActionRecordingStart,
    RecordedToolkitCall,
} from "./recording-types";

const NON_IN_DEPTH_METHODS = new Set([
    "editResponse",
    "editStatus",
    "getMEI",
    "getPageWithElement",
    "redoPagePitchPosLayout",
    "renderToSVG",
]);

function cloneValue<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

function isNonInDepthEdit(call: WorkerCall): boolean {
    if (call.method !== "edit") return false;
    const action = call.args[0];
    if (!action || typeof action !== "object") return false;
    const candidate = action as {
        action?: unknown;
        param?: { phase?: unknown };
    };
    return candidate.action === "context"
        || (candidate.action === "drag" && candidate.param?.phase === "move");
}

export class ActionRecorder {
    private recording: ActionRecording | null = null;
    private initialMEI = "";
    private startedAt = 0;

    isRecording(): boolean {
        return this.recording !== null;
    }

    start(start: ActionRecordingStart, recordInDepthActions: boolean): void {
        if (this.recording) throw new Error("Action recording is already active");
        this.initialMEI = start.initialMEI;
        this.startedAt = performance.now();
        this.recording = {
            formatVersion: 1,
            createdAt: new Date().toISOString(),
            verovioVersion: start.verovioVersion,
            recordInDepthActions,
            initial: cloneValue(start.initial),
            events: [],
        };
    }

    recordWorkerCall(call: WorkerCall): void {
        if (!this.recording) return;
        if (!this.recording.recordInDepthActions) {
            if (NON_IN_DEPTH_METHODS.has(call.method) || isNonInDepthEdit(call)) return;
        }
        const event: RecordedToolkitCall = {
            sequence: this.recording.events.length + 1,
            elapsedMs: Math.round(performance.now() - this.startedAt),
            method: call.method,
            args: cloneValue(call.args),
        };
        this.recording.events.push(event);
    }

    stop(): ActionRecordingBundle {
        if (!this.recording) throw new Error("Action recording is not active");
        const bundle: ActionRecordingBundle = {
            initialMEI: this.initialMEI,
            recording: cloneValue(this.recording),
        };
        this.recording = null;
        this.initialMEI = "";
        this.startedAt = 0;
        return bundle;
    }
}
