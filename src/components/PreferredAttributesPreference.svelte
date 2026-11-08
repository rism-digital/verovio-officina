<script lang="ts">
    import {
        EXCLUDED_ATTRIBUTES,
        EXCLUDED_PREFERENCE_ELEMENTS,
        type PreferredAttributes,
    } from "../app/attribute-preferences";
    import type { ElementDef, RNGLoader } from "../app/rng-loader";

    export let rngMEIAll: RNGLoader | null = null;
    export let value: PreferredAttributes = {};
    export let onChange: ((value: PreferredAttributes) => void) | null = null;

    let selectedElement = "";

    function isElementDef(value: unknown): value is ElementDef {
        return Boolean(value)
            && typeof value === "object"
            && "attrs" in (value as ElementDef);
    }

    $: elementDefinitions = Object.entries(rngMEIAll?.getTags() ?? {})
        .filter((entry): entry is [string, ElementDef] =>
            isElementDef(entry[1])
            && !EXCLUDED_PREFERENCE_ELEMENTS.has(entry[0]));
    $: elementNames = elementDefinitions.map(([name]) => name).sort();
    $: if (!elementNames.includes(selectedElement)) {
        selectedElement = elementNames[0] ?? "";
    }
    $: selectedDefinition = elementDefinitions.find(
        ([name]) => name === selectedElement,
    )?.[1] ?? null;
    $: excludedNames = new Set(EXCLUDED_ATTRIBUTES[selectedElement] ?? []);
    $: availableAttributes = Object.keys(selectedDefinition?.attrs ?? {})
        .filter((name) => !excludedNames.has(name));
    $: selectedNames = new Set(value[selectedElement] ?? []);

    function handleToggle(event: Event, attribute: string) {
        const target = event.currentTarget as HTMLInputElement;
        const nextNames = new Set(value[selectedElement] ?? []);
        if (target.checked) {
            nextNames.add(attribute);
        } else {
            nextNames.delete(attribute);
        }
        onChange?.({
            ...value,
            [selectedElement]: Array.from(nextNames).sort(),
        });
    }
</script>

<details class="vrv-preferred-attributes">
    <summary>Preferred attributes</summary>
    <div>
        <label class="vrv-preferred-attributes-element">
            <span>Element</span>
            <select class="vrv-form-input" bind:value={selectedElement}>
                {#each elementNames as elementName}
                    <option value={elementName}>{elementName}</option>
                {/each}
            </select>
        </label>

        <div
            class="vrv-preferred-attributes-list"
            role="group"
            aria-label={`Preferred attributes for ${selectedElement}`}
        >
            {#each availableAttributes as attribute}
                <label>
                    <input
                        type="checkbox"
                        checked={selectedNames.has(attribute)}
                        on:change={(event) => handleToggle(event, attribute)}
                    />
                    <span>{attribute}</span>
                </label>
            {/each}
        </div>
    </div>
</details>
