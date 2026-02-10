<script lang="ts">
  import type { ViewModel } from "../app/types";

  export let view: ViewModel;
  export let onSelect: (active: boolean) => void;
</script>

<div class="vrv-view">
  <div class="vrv-h-split">
    <div class="vrv-editor-tool-panel"></div>
    <div class="vrv-v-split">
      <div
        class="vrv-view">
        <div class="vrv-svg-wrapper">{@html view.svg}</div>
        <div
          class="vrv-svg-overlay"
          on:focus={() => onSelect(true)}
          on:blur={() => onSelect(false)}
          on:click={() => onSelect(true)}
        ></div>
      </div>
      <div class="vrv-keyboard-panel" style="display: flex;"></div>
    </div>
  </div>
</div>
