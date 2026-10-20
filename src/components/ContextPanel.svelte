<script lang="ts">
    let closedSections = {
        ornaments: false,
        tempo: false,
    };

    function toggleSection(section: keyof typeof closedSections) {
        closedSections = {
            ...closedSections,
            [section]: !closedSections[section],
        };
    }
</script>

<aside class="vrv-context-panel" aria-label="Context tools">
    <div class="vrv-legend vrv-collapsible" class:close={closedSections.ornaments}>
        Ornaments
        <button
            class="icon"
            type="button"
            aria-label="Toggle ornaments toolbar"
            aria-expanded={!closedSections.ornaments}
            on:click={() => toggleSection("ornaments")}
        >▼</button>
    </div>
    <div
        class="vrv-field-set vrv-collapsible vrv-context-toolbar-section"
        class:close={closedSections.ornaments}
    >
        <div
            class="vrv-field-set-panel vrv-context-toolbar"
            aria-label="Ornaments toolbar"
        ></div>
    </div>

    <div class="vrv-legend vrv-collapsible" class:close={closedSections.tempo}>
        Tempo
        <button
            class="icon"
            type="button"
            aria-label="Toggle tempo toolbar"
            aria-expanded={!closedSections.tempo}
            on:click={() => toggleSection("tempo")}
        >▼</button>
    </div>
    <div
        class="vrv-field-set vrv-collapsible vrv-context-toolbar-section"
        class:close={closedSections.tempo}
    >
        <div
            class="vrv-field-set-panel vrv-context-toolbar"
            aria-label="Tempo toolbar"
        ></div>
    </div>
</aside>
