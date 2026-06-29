<script lang="ts">
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "Help";
    export let onClose: ((value: number) => void) | null = null;
    export let onOk: ((value: number) => void) | null = null;
    export let onCancel: ((value: number) => void) | null = null;
</script>

<Dialog
    {open}
    {title}
    icon="info"
    type="msg"
    okLabel="Close"
    {onClose}
    {onOk}
    {onCancel}
>
    <p>Hello world</p>
</Dialog>
