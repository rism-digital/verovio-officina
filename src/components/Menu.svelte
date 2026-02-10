<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ open: void; save: void; export: void }>();
</script>

<nav class="vrv-toolbar vrv-text-no-select">
  <div class="vrv-menu">
    <div class="vrv-btn-text" data-before="File"></div>
    <div class="vrv-menu-content">
      <div class="vrv-v-separator"></div>
      <div class="vrv-menu-text" data-before="Import MEI file" on:click={() => dispatch('open')}></div>
      <div class="vrv-v-separator"></div>
      <div class="vrv-menu-text" data-before="Export MEI file" on:click={() => dispatch('save')}></div>
      <div class="vrv-menu-text" data-before="Export as SVG" on:click={() => dispatch('export')}></div>
    </div>
  </div>
  <div class="vrv-menu" style="display: block;">
    <div class="vrv-btn-text" data-before="Edit"></div>
    <div class="vrv-menu-content">
      <div class="vrv-v-separator"></div>
      <div class="vrv-menu-text" data-before="Score properties"></div>
    </div>
  </div>
</nav>
