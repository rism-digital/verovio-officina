export function generateJavaScriptReplay(): string {
    return `/**
 * Replay with a compatible Verovio JavaScript toolkit instance.
 * The initial.mei and recording.json files are expected next to this module.
 */
export async function replayActions(toolkit) {
    const [initialMEI, recording] = await Promise.all([
        fetch(new URL("./initial.mei", import.meta.url))
            .then((response) => response.text()),
        fetch(new URL("./recording.json", import.meta.url))
            .then((response) => response.json()),
    ]);

    toolkit.setOptions(recording.initial.options);
    toolkit.loadData(initialMEI);
    toolkit.renderToSVG(recording.initial.page);

    for (const event of recording.events) {
        const method = toolkit[event.method];
        if (typeof method !== "function") {
            throw new Error(\`Unsupported Verovio method: \${event.method}\`);
        }
        method.apply(toolkit, event.args);
    }

    return toolkit;
}
`;
}
