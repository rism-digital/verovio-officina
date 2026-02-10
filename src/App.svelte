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

  const worker = new Worker(new URL('./app/worker/worker.ts', import.meta.url), {
    type: 'classic'
  });
  const bridge = createWorkerBridge(worker);

  onMount(async () => {
    workerStatus.set('busy');
    await bridge.init(VEROVIO_URL);
    await openSample();
    workerStatus.set('idle');
  });

  async function renderMei(text: string) {
    workerStatus.set('busy');
    await bridge.call('loadData', [text]);
    const svg = (await bridge.call('renderToSVG', [1])) as string;
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

  async function openSample() {
    const sample = `<?xml version="1.0" encoding="UTF-8"?>\n<mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="5.0">\n  <meiHead>\n    <fileDesc>\n      <titleStmt>\n        <title>Verovio Demo</title>\n      </titleStmt>\n      <pubStmt />\n    </fileDesc>\n  </meiHead>\n  <music>\n    <body>\n      <mdiv>\n        <score>\n          <scoreDef meter.count="4" meter.unit="4" key.sig="0">\n            <staffGrp>\n              <staffDef n="1" lines="5" clef.shape="G" clef.line="2" />\n            </staffGrp>\n          </scoreDef>\n          <section>\n            <measure n="1">\n              <staff n="1">\n                <layer n="1">\n                  <note pname="c" oct="4" dur="4" />\n                  <note pname="d" oct="4" dur="4" />\n                  <note pname="e" oct="4" dur="4" />\n                  <note pname="f" oct="4" dur="4" />\n                </layer>\n              </staff>\n            </measure>\n          </section>\n        </score>\n      </mdiv>\n    </body>\n  </music>\n</mei>`;
    workerStatus.set('busy');
    await renderMei(sample);
    selection.set({ type: 'none' });
    dirty.set(false);
    statusLine.set('Sample document loaded.');
    workerStatus.set('idle');
  }

  async function saveDoc() {
    const exported = (await bridge.call('getMEI')) as string;
    localStorage.setItem('svelte-editor-doc', exported);
    dirty.set(false);
    statusLine.set('Saved to local storage.');
  }

  async function exportDoc() {
    const exported = (await bridge.call('renderToSVG', [1])) as string;
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

<div class="app">
  <Menu on:open={openSample} on:save={saveDoc} on:export={exportDoc}>
    <button slot="mode" type="button" class:active={$mode === 'insert'} on:click={toggleMode}>
      {$mode === 'insert' ? 'Insert mode' : 'Edit mode'}
    </button>
  </Menu>

  <Toolbar mode={$mode} selection={$selection} onToggleMode={toggleMode} />

  <EditorSurface view={$viewModel} mode={$mode} onSelect={handleSelect} />

  <StatusBar status={$statusLine} dirty={$dirty} />
</div>

<style lang="scss">
  .app {
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    min-height: 100vh;
  }

  button.active {
    background: var(--accent-1);
    color: #fff;
    border-color: transparent;
  }
</style>
