<script lang="ts">
    import type { InputMode, UserPreferences } from "../../app/state";
    import { DEFAULT_USER_PREFERENCES } from "../../app/state";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "Settings";
    export let value: UserPreferences = DEFAULT_USER_PREFERENCES;
    export let onConfirm: ((preferences: UserPreferences) => void) | null = null;
    export let onClose: ((value: number) => void) | null = null;
    export let onOk: ((value: number) => void) | null = null;
    export let onCancel: ((value: number) => void) | null = null;

    let inputMode: InputMode = value.inputMode;

    $: if (open) {
        inputMode = value.inputMode;
    }

    function handleOk(result: number) {
        onConfirm?.({
            ...value,
            inputMode,
        });
        onOk?.(result);
    }
</script>

<Dialog
    {open}
    {title}
    icon="info"
    type="okcancel"
    onOk={handleOk}
    {onClose}
    {onCancel}
>
    <div class="vrv-dialog-form">
        <div class="vrv-dialog-label">Input mode</div>
        <select class="vrv-dialog-input" bind:value={inputMode}>
            <option value="durationFirst">Duration first</option>
            <option value="pitchFirst">Pitch first</option>
        </select>
    </div>
</Dialog>
