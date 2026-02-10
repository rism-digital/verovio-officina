<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ open: void; save: void; export: void }>();
</script>

<nav class="menu">
  <div class="menu__group">
    <span class="menu__label">File</span>
    <button type="button" on:click={() => dispatch('open')}>Open</button>
    <button type="button" on:click={() => dispatch('save')}>Save</button>
    <button type="button" on:click={() => dispatch('export')}>Export</button>
  </div>
  <div class="menu__group">
    <span class="menu__label">Mode</span>
    <slot name="mode" />
  </div>
</nav>

<style lang="scss">
  .menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1.25rem;
    background: var(--surface-1);
    border-bottom: 1px solid var(--border-1);
  }

  .menu__group {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .menu__label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ink-2);
  }

  :global(.menu__group button) {
    border: 1px solid var(--border-1);
    background: var(--bg-2);
    padding: 0.4rem 0.8rem;
    border-radius: 999px;
    cursor: pointer;
  }
</style>
