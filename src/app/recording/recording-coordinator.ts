import { ActionRecorder } from "./action-recorder";
import type {
    ActionRecordingBundle,
    ActionRecordingStart,
    ActionRecordingStatus,
} from "./recording-types";

export type ActionRecordingHost = {
    getFinalMEI: () => Promise<string>;
    prepareRecordingStart: () => Promise<ActionRecordingStart>;
    setInteractionBlocked: (blocked: boolean) => void;
    setStatus: (status: ActionRecordingStatus) => void;
    whenIdle: () => Promise<void>;
};

export class ActionRecordingCoordinator {
    private status: ActionRecordingStatus = "idle";

    constructor(
        private readonly recorder: ActionRecorder,
        private readonly host: ActionRecordingHost,
    ) {}

    async start(recordInDepthActions: boolean): Promise<boolean> {
        if (this.status !== "idle") return false;
        this.updateStatus("starting");
        this.host.setInteractionBlocked(true);
        try {
            await this.host.whenIdle();
            const start = await this.host.prepareRecordingStart();
            this.recorder.start(start, recordInDepthActions);
            this.updateStatus("recording");
            return true;
        } catch (error) {
            this.updateStatus("idle");
            throw error;
        } finally {
            this.host.setInteractionBlocked(false);
        }
    }

    async stop(): Promise<ActionRecordingBundle | null> {
        if (this.status !== "recording") return null;
        this.updateStatus("stopping");
        this.host.setInteractionBlocked(true);
        try {
            await this.host.whenIdle();
            const finalMEI = await this.host.getFinalMEI();
            const bundle = this.recorder.stop(finalMEI);
            this.updateStatus("idle");
            return bundle;
        } catch (error) {
            this.updateStatus("recording");
            throw error;
        } finally {
            this.host.setInteractionBlocked(false);
        }
    }

    private updateStatus(status: ActionRecordingStatus) {
        this.status = status;
        this.host.setStatus(status);
    }
}
