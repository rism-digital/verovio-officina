<script lang="ts">
    import type { InputMode, UserPreferences } from "../../app/state";
    import { DEFAULT_USER_PREFERENCES } from "../../app/state";
    import {
        clonePreferredAttributes,
        type PreferredAttributes,
    } from "../../app/attribute-preferences";
    import type { RNGLoader } from "../../app/rng-loader";
    import PreferredAttributesPreference from "../PreferredAttributesPreference.svelte";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "Settings";
    export let value: UserPreferences = DEFAULT_USER_PREFERENCES;
    export let rngMEIAll: RNGLoader | null = null;
    export let onConfirm: ((preferences: UserPreferences) => void) | null = null;
    export let onClose: ((value: number) => void) | null = null;
    export let onOk: ((value: number) => void) | null = null;
    export let onCancel: ((value: number) => void) | null = null;

    let inputMode: InputMode = value.inputMode;
    let preferredAttributes = clonePreferredAttributes(
        value.preferredAttributes,
    );

    $: if (open) {
        inputMode = value.inputMode;
        preferredAttributes = clonePreferredAttributes(
            value.preferredAttributes,
        );
    }

    function handlePreferredAttributesChange(next: PreferredAttributes) {
        preferredAttributes = next;
    }

    function handleOk(result: number) {
        onConfirm?.({
            ...value,
            inputMode,
            preferredAttributes,
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
            <option value="combined">Combined</option>
        </select>
    </div>
    <PreferredAttributesPreference
        {rngMEIAll}
        value={preferredAttributes}
        onChange={handlePreferredAttributesChange}
    />
</Dialog>
