<script lang="ts">
  import type { TreeNodeData } from '../app/types';

  export let node: TreeNodeData;
  export let isRoot = false;
</script>

<div
  class={isRoot ? 'vrv-tree-root open' : `vrv-tree-node${node.isLeaf ? ' leaf' : ''}`}
  data-id={node.id}
  data-element={node.element}
  data-app-el-id={node.appElId}
>
  <div
    class="vrv-mei-element vrv-node-label"
    data-id={node.id}
    data-element={node.element}
    style={isRoot ? 'display: none;' : undefined}
  >
    {node.element}
  </div>
  <div class="vrv-node-children">
    {#if node.children?.length}
      {#each node.children as child}
        <svelte:self node={child} />
      {/each}
    {/if}
  </div>
</div>
