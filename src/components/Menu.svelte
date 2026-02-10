<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let canZoom = false;

  const dispatch = createEventDispatcher<{
    open: void;
    save: void;
    export: void;
    zoomIn: void;
    zoomOut: void;
  }>();
</script>

<nav class="vrv-toolbar vrv-text-no-select">
  <div class="vrv-menu">
    <div class="vrv-btn-text" data-before="File"></div>
    <div class="vrv-menu-content">
      <div class="vrv-v-separator"></div>
      <div
        class="vrv-menu-text"
        data-before="Import MEI file"
        on:click={() => dispatch("open")}
      ></div>
      <div class="vrv-v-separator"></div>
      <div
        class="vrv-menu-text"
        data-before="Export MEI file"
        on:click={() => dispatch("save")}
      ></div>
      <div
        class="vrv-menu-text"
        data-before="Export as SVG"
        on:click={() => dispatch("export")}
      ></div>
    </div>
  </div>
  <div class="vrv-menu">
    <div class="vrv-btn-text" data-before="Edit"></div>
    <div class="vrv-menu-content">
      <div class="vrv-v-separator"></div>
      <div class="vrv-menu-text" data-before="Score properties"></div>
    </div>
  </div>
  <div class="vrv-btn-group">
    <div class="vrv-h-separator" />
    <div
      class="vrv-btn-icon-left disabled"
      style="background-image: url('/icons/toolbar/arrow-left.png');"
      data-before="Previous"
    />
    <div
      class="vrv-btn-icon disabled"
      style="background-image: url('/icons/toolbar/arrow-right.png');"
      data-before="Next"
    />
  </div>
  <div class="vrv-btn-group">
    <div class="vrv-h-separator" />
    <div
      class:disabled={!canZoom}
      class="vrv-btn-icon-left"
      style="background-image: url('/icons/toolbar/zoom-out.png');"
      data-before="Zoom out"
      on:click={() => dispatch("zoomOut")}
    />
    <div
      class:disabled={!canZoom}
      class="vrv-btn-icon"
      style="background-image: url('/icons/toolbar/zoom-in.png');"
      data-before="Zoom in"
      on:click={() => dispatch("zoomIn")}
    />
  </div>
</nav>
