<script lang="ts">
    import type { EditActionSetParam, EditActionSetHandler } from "../app/types";

    export let elementId: string | null = null;
    export let name: string;
    export let value: string;
    export let optionsAll: string[] | null = null;
    export let optionsBasic: string[] | null = null;
    export let readOnly = false;
    export let customOptions: string[] | null = null;
    export let attributeType: string | null = null;
    export let onEditAttribute: EditActionSetHandler | null = null;

    $: filteredAll = optionsAll && optionsBasic
        ? optionsAll.filter((opt) => !optionsBasic.includes(opt))
        : optionsAll ?? [];

    $: hasOptions = (optionsBasic && optionsBasic.length > 0) || filteredAll.length > 0;

    $: numericInput = attributeType === "positiveInteger"
        ? { type: "number", min: "1", step: "1" }
        : attributeType === "nonNegativeInteger"
            ? { type: "number", min: "0", step: "1" }
            : attributeType === "decimal"
                ? { type: "number", step: "0.1" }
                : null;

    function emitEdit(attValue: string, commit: boolean) {
        if (!elementId) return;
        const param: EditActionSetParam = {
            elementId,
            attribute: name,
            value: attValue,
        };
        onEditAttribute?.(param, commit);
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement | HTMLSelectElement | null;
        if (!target) return;
        emitEdit(target.value, false);
    }

    function handleChange(event: Event) {
        const target = event.target as HTMLInputElement | HTMLSelectElement | null;
        if (!target) return;
        emitEdit(target.value, true);
    }

    function renderOptions(values: string[], selected: string) {
        return values.map((opt) => ({
            value: opt,
            selected: opt === selected,
        }));
    }
</script>

<tr class="vrv-attribute-item">
    <td class="vrv-attribute-name">{name}</td>
    <td class="vrv-attribute-value">
        {#if customOptions}
            <select
                class="vrv-form-input {readOnly ? 'disabled' : ''}"
                disabled={readOnly}
                on:change={handleChange}
            >
                <option value=""></option>
                {#each renderOptions(customOptions, value) as opt}
                    <option value={opt.value} selected={opt.selected}>{opt.value}</option>
                {/each}
            </select>
        {:else if hasOptions}
            <select
                class="vrv-form-input {readOnly ? 'disabled' : ''}"
                disabled={readOnly}
                on:change={handleChange}
            >
                <option value=""></option>
                {#if optionsBasic && filteredAll.length > 0}
                    <optgroup label="MEI-basic">
                        {#each renderOptions(optionsBasic, value) as opt}
                            <option value={opt.value} selected={opt.selected}>{opt.value}</option>
                        {/each}
                    </optgroup>
                    <optgroup label="MEI-all">
                        {#each renderOptions(filteredAll, value) as opt}
                            <option value={opt.value} selected={opt.selected}>{opt.value}</option>
                        {/each}
                    </optgroup>
                {:else}
                    {#each renderOptions(optionsAll ?? optionsBasic ?? [], value) as opt}
                        <option value={opt.value} selected={opt.selected}>{opt.value}</option>
                    {/each}
                {/if}
            </select>
        {:else}
            <input
                class="vrv-form-input {readOnly ? 'disabled' : ''}"
                value={value}
                disabled={readOnly}
                type={numericInput?.type}
                min={numericInput?.min}
                step={numericInput?.step}
                on:input={handleInput}
                on:change={handleChange}
            />
        {/if}
    </td>
</tr>
