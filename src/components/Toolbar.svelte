<script lang="ts">
  import type { Mode, SelectionInfo } from '../app/types';

  export let mode: Mode;
  export let selection: SelectionInfo;
  export let onToggleMode: () => void;
</script>

<section class="toolbar">
  <div class="toolbar__section">
    <span class="toolbar__title">Selection</span>
    <strong>{selection.type === 'none' ? 'None' : selection.label ?? selection.type}</strong>
  </div>
  <div class="toolbar__section">
    <span class="toolbar__title">Tools</span>
    {#if selection.type === 'text'}
      <div class="toolbar__row">
        <button type="button">Bold</button>
        <button type="button">Italic</button>
        <button type="button">Highlight</button>
      </div>
    {:else if selection.type === 'block'}
      <div class="toolbar__row">
        <button type="button">Align</button>
        <button type="button">Spacing</button>
        <button type="button">Style</button>
      </div>
    {:else}
      <span class="toolbar__hint">Select an element to see tools.</span>
    {/if}
  </div>
  <div class="toolbar__section toolbar__mode">
    <span class="toolbar__title">Mode</span>
    <button type="button" class:active={mode === 'insert'} on:click={onToggleMode}>
      {mode === 'insert' ? 'Insert' : 'Edit'}
    </button>
  </div>
</section>

<style lang="scss">
  .toolbar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border-1);
  }

  .toolbar__section {
    display: grid;
    gap: 0.4rem;
  }

  .toolbar__title {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--ink-2);
  }

  .toolbar__row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .toolbar__hint {
    font-size: 0.85rem;
    color: var(--ink-2);
  }

  button {
    border: 1px solid var(--border-1);
    background: var(--surface-1);
    padding: 0.4rem 0.7rem;
    border-radius: 10px;
    cursor: pointer;
  }

  button.active {
    background: var(--accent-2);
    color: #fff;
    border-color: transparent;
  }

  .toolbar__mode {
    align-content: start;
  }
</style>
