export function generatePythonReplay(): string {
    return `import json
from pathlib import Path

import verovio


def replay_actions():
    recording_dir = Path(__file__).resolve().parent
    recording = json.loads(
        recording_dir.joinpath("recording.json").read_text(encoding="utf-8")
    )
    toolkit = verovio.toolkit()
    initial_mei = recording_dir.joinpath("initial.mei").read_text(encoding="utf-8")

    toolkit.setOptions(recording["initial"]["options"])
    toolkit.loadData(initial_mei)
    toolkit.renderToSVG(recording["initial"]["page"])

    for event in recording["events"]:
        method = getattr(toolkit, event["method"], None)
        if method is None:
            raise RuntimeError(f"Unsupported Verovio method: {event['method']}")
        method(*event["args"])

    Path("replayed.mei").write_text(toolkit.getMEI(), encoding="utf-8")


if __name__ == "__main__":
    replay_actions()
`;
}
