<script lang="ts">
  export let status: string;
  export let dirty: boolean;
</script>

<footer class="status">
  <span>{status}</span>
  <span class="status__dirty">{dirty ? 'Unsaved changes' : 'All changes saved'}</span>
</footer>

<style lang="scss">
  .status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 1.25rem;
    background: var(--surface-1);
    border-top: 1px solid var(--border-1);
    font-size: 0.85rem;
    color: var(--ink-2);
  }

  .status__dirty {
    font-weight: 600;
  }
</style>
