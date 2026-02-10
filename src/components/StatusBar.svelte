<script lang="ts">
  export let status: string;
  export let dirty: boolean;
  export let version: string;
</script>

<footer class="vrv-statusbar vrv-text-no-select">
  <span class="vrv-status-text">{status}</span>
  <span class="vrv-status-version">
    {dirty ? 'Unsaved changes' : 'All changes saved'}{version ? ` · ${version}` : ''}
  </span>
</footer>
