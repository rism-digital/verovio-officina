<script lang="ts">
  import type { Mode, SelectionInfo } from "../app/types";

  export let mode: Mode;
  export let onToggleMode: () => void;
</script>

<section class="vrv-editor-toolbar vrv-text-no-select" style="display: block;">
  <div class="vrv-btn-group">
    <div
      class="vrv-btn vrv-toggleable {mode === 'insert' ? 'toggled' : ''}"
      on:click={onToggleMode}
    >
      {mode === "insert" ? "Insert" : "Edit"}
    </div>
    <div class="vrv-h-separator"></div>
    <div
      class="vrv-btn-icon-large"
      style="background-image: url('/icons/toolbar/editor-xml.png');"
    >
      <span class="vrv-tooltip">Open or close the XML editor</span>
    </div>
    <div
      class="vrv-btn-icon-large disabled"
      style="background-image: url('/icons/toolbar/layout-v.png'); display: none;"
    >
      <span class="vrv-tooltip">Change the divider orientation</span>
    </div>
    <div
      class="vrv-btn-icon-large disabled"
      style="background-image: url('/icons/toolbar/validate.png'); display: none;"
    >
      <span class="vrv-tooltip"
        >Validate and refresh rendering ('Shift-Ctrl-V')</span
      >
    </div>
    <div
      class="vrv-btn-icon-large disabled"
      style="background-image: url('/icons/toolbar/force.png'); display: none;"
    >
      <span class="vrv-tooltip">By-pass XML validation and force reload</span>
    </div>
  </div>
  <div class="vrv-h-separator"></div>
  <div
    class="vrv-btn-icon-large disabled"
    style="background-image: url('/icons/editor/undo.png');"
  >
    <span class="vrv-tooltip">Undo ('Shift-Ctrl-V')</span>
  </div>
  <div
    class="vrv-btn-icon-large disabled"
    style="background-image: url('/icons/editor/redo.png');"
  >
    <span class="vrv-tooltip">Redo ('Shift-Ctrl-V')</span>
  </div>
</section>
