<script lang="ts">
  import type { Mode, ViewModel } from '../app/types';

  export let view: ViewModel;
  export let mode: Mode;
  export let onSelect: (active: boolean) => void;
</script>

<section class="editor">
  <header>
    <h2>Canvas</h2>
    <p>{mode === 'insert' ? 'Insertion mode: type to add content.' : 'Editing mode: selection only.'}</p>
  </header>
  <div class="editor__panel">
    <div
      class="editor__svg"
      tabindex="0"
      on:focus={() => onSelect(true)}
      on:blur={() => onSelect(false)}
      on:click={() => onSelect(true)}
    >
      {@html view.svg}
    </div>
    <aside class="editor__meta">
      <h3>Selection</h3>
      <div class="badge">{view.selection.type}</div>
      {#if view.selection.properties}
        <ul>
          {#each Object.entries(view.selection.properties) as [key, value]}
            <li>{key}: {value}</li>
          {/each}
        </ul>
      {:else}
        <p>No properties yet.</p>
      {/if}
    </aside>
  </div>
</section>

<style lang="scss">
  .editor {
    padding: 1.5rem;
    display: grid;
    gap: 1rem;
  }

  h2 {
    margin: 0;
    font-size: 1.4rem;
  }

  p {
    margin: 0.25rem 0 0;
    color: var(--ink-2);
  }

  .editor__panel {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 240px;
    gap: 1.25rem;
    align-items: stretch;
  }

  .editor__svg {
    width: 100%;
    min-height: 320px;
    padding: 0.5rem;
    border-radius: 20px;
    border: 1px solid var(--border-1);
    background: var(--surface-1);
    outline: none;
    box-shadow: var(--shadow-1);
    display: grid;
    place-items: center;
  }

  .editor__svg :global(svg) {
    width: 100%;
    height: auto;
  }

  .editor__meta {
    background: var(--surface-1);
    border: 1px solid var(--border-1);
    border-radius: 18px;
    padding: 1rem;
    box-shadow: var(--shadow-1);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: var(--accent-3);
    color: var(--ink-1);
    font-weight: 600;
    margin-bottom: 0.8rem;
  }

  ul {
    padding: 0;
    list-style: none;
    margin: 0;
    display: grid;
    gap: 0.35rem;
  }

  li {
    font-size: 0.85rem;
  }

  @media (max-width: 900px) {
    .editor__panel {
      grid-template-columns: 1fr;
    }
  }
</style>
