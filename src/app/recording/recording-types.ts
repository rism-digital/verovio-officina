export type ActionRecordingStatus = "idle" | "starting" | "recording" | "stopping";

export type RecordedToolkitCall = {
    sequence: number;
    elapsedMs: number;
    method: string;
    args: unknown[];
};

export type ActionRecordingInitialState = {
    meiFile: "initial.mei";
    options: Record<string, unknown>;
    page: number;
    scale: number;
    zoom: number;
    viewMode: "page" | "responsive";
    layoutSize: {
        width: number;
        height: number;
    };
};

export type ActionRecording = {
    formatVersion: 1;
    createdAt: string;
    verovioVersion: string;
    recordInDepthActions: boolean;
    initial: ActionRecordingInitialState;
    events: RecordedToolkitCall[];
};

export type ActionRecordingStart = {
    initialMEI: string;
    verovioVersion: string;
    initial: ActionRecordingInitialState;
};

export type ActionRecordingBundle = {
    initialMEI: string;
    finalMEI: string;
    recording: ActionRecording;
};
