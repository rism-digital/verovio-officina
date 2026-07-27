<script lang="ts">
    import { marked } from "marked";
    import helpMarkdown from "../../app/help.md?raw";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "Help";
    export let onClose: ((value: number) => void) | null = null;
    export let onOk: ((value: number) => void) | null = null;
    export let onCancel: ((value: number) => void) | null = null;

    const helpHtml = marked.parse(helpMarkdown, { async: false });
</script>

<Dialog
    {open}
    {title}
    icon="info"
    type="msg"
    okLabel="Close"
    boxClass="vrv-dialog-help"
    {onClose}
    {onOk}
    {onCancel}
>
    <div class="vrv-help-content">
        {@html helpHtml}
    </div>
</Dialog>
