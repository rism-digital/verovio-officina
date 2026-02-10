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

  async function renderMei(text: string) {
    workerStatus.set('busy');
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

<div class="vrv-wrapper">
  <Menu on:open={triggerOpenFile} on:save={saveDoc} on:export={exportDoc}>
  </Menu>

  <input
    class="vrv-file-input"
    type="file"
    accept=".mei,.xml"
    bind:this={fileInput}
    on:change={openFile}
  />

  <Toolbar mode={$mode} onToggleMode={toggleMode} />

  <EditorSurface view={$viewModel} onSelect={handleSelect} />

  <StatusBar status={$statusLine} dirty={$dirty} version={verovioVersion} />
</div>
