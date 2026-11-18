export function generatePythonReplay(): string {
    return `import argparse
import importlib
import json
from pathlib import Path
import sys


def parse_args():
    parser = argparse.ArgumentParser(description="Replay a Verovio action recording")
    parser.add_argument(
        "--verovio-path", type=Path,
        help="Directory containing the local verovio Python package",
    )
    parser.add_argument(
        "--resource-path", type=Path,
        help="Directory containing Verovio engraving resources",
    )
    return parser.parse_args()


def replay_actions(verovio_path=None, resource_path=None):
    if verovio_path is not None:
        sys.path.insert(0, str(verovio_path.expanduser().resolve()))
    verovio = importlib.import_module("verovio")
    recording_dir = Path(__file__).resolve().parent
    output_dir = recording_dir / "replay-output"
    output_dir.mkdir(exist_ok=True)
    recording = json.loads(
        recording_dir.joinpath("recording.json").read_text(encoding="utf-8")
    )
    if resource_path is not None:
        toolkit = verovio.toolkit(False)
        if not toolkit.setResourcePath(str(resource_path.expanduser().resolve())):
            raise RuntimeError(f"Could not load Verovio resources from {resource_path}")
    else:
        toolkit = verovio.toolkit()
    initial_mei = recording_dir.joinpath("initial.mei").read_text(encoding="utf-8")

    toolkit.setOptions(recording["initial"]["options"])
    toolkit.loadData(initial_mei)
    page = recording["initial"]["page"]
    output_dir.joinpath("initial.svg").write_text(
        toolkit.renderToSVG(page), encoding="utf-8"
    )

    for event in recording["events"]:
        method = getattr(toolkit, event["method"], None)
        if method is None:
            raise RuntimeError(f"Unsupported Verovio method: {event['method']}")
        if event["method"] == "renderToSVG" and event["args"]:
            page = event["args"][0]
        method(*event["args"])

    output_dir.joinpath("final.mei").write_text(toolkit.getMEI(), encoding="utf-8")
    output_dir.joinpath("final.svg").write_text(
        toolkit.renderToSVG(page), encoding="utf-8"
    )


if __name__ == "__main__":
    args = parse_args()
    replay_actions(args.verovio_path, args.resource_path)
`;
}
