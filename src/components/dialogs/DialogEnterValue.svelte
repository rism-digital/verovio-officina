<script lang="ts">
    import { tick } from "svelte";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "Enter Value";
    export let label = "Value";
    export let value = "";
    export let inputType: "text" | "number" = "text";
    export let onConfirm: ((value: string | number) => void) | null = null;
    export let onCancel: (() => void) | null = null;

    let localValue = value;
    let inputEl: HTMLInputElement | null = null;

    $: if (open) {
        localValue = value;
        tick().then(() => {
            inputEl?.focus();
            inputEl?.select();
        });
    }

    function handleConfirm() {
        onConfirm?.(localValue);
    }

    function handleCancel() {
        onCancel?.();
    }

    function handleInputKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleConfirm();
            return;
        }
        if (event.key === "Escape") {
            event.preventDefault();
            handleCancel();
        }
    }

    function handleActionKeydown(
        event: KeyboardEvent,
        action: "ok" | "cancel",
    ) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        if (action === "ok") {
            handleConfirm();
            return;
        }
        handleCancel();
    }
</script>

<Dialog
    {open}
    {title}
    icon="info"
    type="custom"
    onCancel={handleCancel}
>
    <div class="vrv-dialog-form">
        <div class="vrv-dialog-label">{label}</div>
        <input
            class="vrv-dialog-input"
            type={inputType}
            bind:value={localValue}
            bind:this={inputEl}
            on:keydown={handleInputKeydown}
        />
    </div>

    <svelte:fragment slot="buttons">
        <div
            class="vrv-dialog-btn"
            role="button"
            tabindex="0"
            data-before="Cancel"
            on:click={handleCancel}
            on:keydown={(event) => handleActionKeydown(event, "cancel")}
        ></div>
        <div
            class="vrv-dialog-btn"
            role="button"
            tabindex="0"
            data-before="OK"
            on:click={handleConfirm}
            on:keydown={(event) => handleActionKeydown(event, "ok")}
        ></div>
    </svelte:fragment>
</Dialog>
