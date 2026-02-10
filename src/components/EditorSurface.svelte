<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { ViewModel } from '../app/types';

  export let view: ViewModel;
  export let onSelect: (active: boolean) => void;
  export let onResize: (size: { width: number; height: number }) => void;

  let verovioView: HTMLDivElement | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let lastSize = { width: 0, height: 0 };

  function emitSize(width: number, height: number) {
    if (!onResize) return;
    if (width === lastSize.width && height === lastSize.height) return;
    lastSize = { width, height };
    console.log(lastSize)
    onResize(lastSize);
  }

  onMount(() => {
    if (!verovioView || typeof ResizeObserver === 'undefined') return;
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        emitSize(Math.max(0, Math.floor(width)), Math.max(0, Math.floor(height)));
      }
    });
    resizeObserver.observe(verovioView);
  });

  onDestroy(() => {
    resizeObserver?.disconnect();
    resizeObserver = null;
  });
</script>

<div class="vrv-editor-surface">
  <div class="vrv-h-split">
    <div class="vrv-editor-tool-panel"></div>
    <div class="vrv-v-split">
      <div class="vrv-verovio-view" bind:this={verovioView}>
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
