<script lang="ts">
    import { onMount } from "svelte";
    import * as monaco from "monaco-editor/editor/editor.api";
    import EditorWorker from "monaco-editor/editor/editor.worker?worker";
    import "monaco-editor/languages/definitions/xml/register";
    import "../../node_modules/monaco-editor/min/vs/editor/editor.main.css";

    export let value = "";
    export let selectedId: string | null = null;
    export let workerBusy = false;
    export let onChange: ((value: string) => void) | null = null;

    let editorHost: HTMLDivElement | null = null;
    let editor: monaco.editor.IStandaloneCodeEditor | null = null;
    let model: monaco.editor.ITextModel | null = null;
    let settingValue = false;

    onMount(() => {
        if (!editorHost) return;

        (self as typeof self & {
            MonacoEnvironment?: monaco.Environment;
        }).MonacoEnvironment = {
            getWorker: () => new EditorWorker(),
        };

        model = monaco.editor.createModel(value, "xml");
        editor = monaco.editor.create(editorHost, {
            model,
            automaticLayout: true,
            minimap: { enabled: false },
            readOnly: workerBusy,
            scrollBeyondLastLine: false,
            theme: "vs-dark",
            wordWrap: "on",
        });

        const changeSubscription = editor.onDidChangeModelContent(() => {
            if (settingValue) return;
            onChange?.(editor?.getValue() ?? "");
        });

        return () => {
            changeSubscription.dispose();
            editor?.dispose();
            model?.dispose();
            editor = null;
            model = null;
        };
    });

    $: if (editor && value !== editor.getValue()) {
        settingValue = true;
        editor.setValue(value);
        settingValue = false;
    }

    $: editor?.updateOptions({ readOnly: workerBusy });
</script>

<div class="vrv-main-panel vrv-xml-panel">
    <div
        class="vrv-xml-editor"
        data-selected-id={selectedId ?? undefined}
        bind:this={editorHost}
    ></div>
</div>
