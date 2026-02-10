<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import Menu from './components/Menu.svelte';
  import Toolbar from './components/Toolbar.svelte';
  import EditorSurface from './components/EditorSurface.svelte';
  import StatusBar from './components/StatusBar.svelte';
  import { createWorkerBridge } from './app/worker/bridge';
  import { dirty, mode, selection, statusLine, viewModel, workerStatus } from './app/state';
  import type { SelectionInfo, ViewModel } from './app/types';
  import type { VerovioOptions } from './app/worker/verovio-types';

  const VEROVIO_URL = 'https://www.verovio.org/javascript/develop/verovio-toolkit-wasm.js';
  let fileInput: HTMLInputElement | null = null;
  let verovioVersion = '';

  const worker = new Worker(new URL('./app/worker/worker.ts', import.meta.url), {
    type: 'classic'
  });
  const bridge = createWorkerBridge(worker);

  onMount(async () => {
    workerStatus.set('busy');
    await bridge.init(VEROVIO_URL);
    verovioVersion = await bridge.verovio.getVersion();
    workerStatus.set('idle');
  });

  let lastLayoutSize = { width: 0, height: 0 };

  function buildVerovioOptions(size: { width: number; height: number }): VerovioOptions {
    return {
      adjustPageHeight: false,
      adjustPageWidth: false,
      breaks: 'auto',
      footer: 'auto',
      justifyVertically: false,
      mensuralResponsiveView: 'auto',
      pageHeight: Math.max(0, Math.floor(size.height)),
      pageWidth: Math.max(0, Math.floor(size.width)),
      pageMarginLeft: 50,
      pageMarginRight: 50,
      pageMarginTop: 50,
      pageMarginBottom: 50,
      scale: 100,
      xmlIdSeed: 1
    };
  }

  async function renderMei(text: string) {
    workerStatus.set('busy');
    if (lastLayoutSize.width && lastLayoutSize.height) {
      const options = buildVerovioOptions(lastLayoutSize);
      await bridge.verovio.setOptions(options);
    }
    await bridge.verovio.loadData(text);
    const svg = await bridge.verovio.renderToSVG(1);
    const nextView: ViewModel = {
      text,
      svg,
      selection: get(selection)
    };
    viewModel.set(nextView);
    workerStatus.set('idle');
  }

  async function applyLayoutForSize(size: { width: number; height: number }) {
    console.log(size);
    if (!size.width || !size.height) return;
    lastLayoutSize = size;
    const current = get(viewModel);
    if (!current.svg) return;
    workerStatus.set('busy');
    const options = buildVerovioOptions(size);
    await bridge.verovio.setOptions(options);
    await bridge.verovio.redoLayout();
    const svg = await bridge.verovio.renderToSVG(1);
    viewModel.set({ ...current, svg });
    workerStatus.set('idle');
  }

  async function setSelection(next: SelectionInfo) {
    selection.set(next);
    viewModel.update((current) => ({ ...current, selection: next }));
  }

  async function handleSelect(active: boolean) {
    const view = get(viewModel);
    if (active) {
      await setSelection({
        type: 'text',
        label: 'Body Text',
        properties: {
          length: String(view.text.length)
        }
      });
    } else {
      await setSelection({ type: 'none' });
    }
  }

  function toggleMode() {
    mode.update((current) => (current === 'insert' ? 'edit' : 'insert'));
  }

  function triggerOpenFile() {
    fileInput?.click();
  }

  async function openFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const content = await file.text();
    await renderMei(content);
    selection.set({ type: 'none' });
    dirty.set(false);
    statusLine.set(`Opened ${file.name}.`);
    target.value = '';
  }


  async function saveDoc() {
    const exported = await bridge.verovio.getMEI();
    localStorage.setItem('svelte-editor-doc', exported);
    dirty.set(false);
    statusLine.set('Saved to local storage.');
  }

  async function exportDoc() {
    const exported = await bridge.verovio.renderToSVG(1);
    const blob = new Blob([exported], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'score-export.svg';
    link.click();
    URL.revokeObjectURL(url);
    statusLine.set('Exported SVG file.');
  }
</script>

<input
  class="vrv-file-input"
  type="file"
  accept=".mei,.xml"
  bind:this={fileInput}
  on:change={openFile}
/>

<div class="vrv-wrapper">
  <Menu on:open={triggerOpenFile} on:save={saveDoc} on:export={exportDoc}>
  </Menu>

  <Toolbar mode={$mode} onToggleMode={toggleMode} />

  <EditorSurface view={$viewModel} onSelect={handleSelect} onResize={applyLayoutForSize} />

  <StatusBar status={$statusLine} dirty={$dirty} version={verovioVersion} />
</div>
