import { strToU8, zipSync } from "fflate";
import { generateJavaScriptReplay } from "./generators/javascript";
import { generatePythonReplay } from "./generators/python";
import type { ActionRecordingBundle } from "./recording-types";

function downloadBlob(filename: string, blob: Blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export function downloadActionRecording(bundle: ActionRecordingBundle): void {
    const editChain = {
        action: "chain",
        param: bundle.recording.events
            .filter((event) => event.method === "edit")
            .map((event) => event.args[0]),
    };
    const archive = zipSync({
        "initial.mei": strToU8(bundle.initialMEI),
        "final.mei": strToU8(bundle.finalMEI),
        "recording.json": strToU8(JSON.stringify(bundle.recording, null, 4)),
        "edit-chain.json": strToU8(JSON.stringify(editChain, null, 4)),
        "replay.mjs": strToU8(generateJavaScriptReplay()),
        "replay.py": strToU8(generatePythonReplay()),
    });
    downloadBlob(
        "action-recording.zip",
        new Blob([archive], { type: "application/zip" }),
    );
}
