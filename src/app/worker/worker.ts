declare const verovio: any;
let verovioToolkit: any;

type WorkerRequest =
  | { verovioUrl: string }
  | { taskId: string; method: string; args?: unknown[] };

type WorkerResponse = {
  taskId: string;
  method: string;
  args?: unknown[];
  result: unknown;
};

const isVerovioModuleReady = (() => {
  let resolve: (value: null) => void;
  const promise = new Promise<null>((res) => {
    resolve = res;
  });
  return { promise, resolve: resolve! };
})();

addEventListener(
  'message',
  function (event: MessageEvent<WorkerRequest>) {
    if ('verovioUrl' in event.data) {
      // @ts-ignore
      importScripts(event.data.verovioUrl);

      // Initialize the Verovio module once the script is loaded
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      verovio.module.onRuntimeInitialized = function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        verovio.enableLog(verovio.LOG_DEBUG);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        verovioToolkit = new verovio.toolkit();
        isVerovioModuleReady.resolve(null);
      };
      return;
    }

    const { taskId, method, args } = event.data;

    if (method === 'onRuntimeInitialized') {
      isVerovioModuleReady.promise.then(() => {
        postMessage({ taskId, method, args, result: null } as WorkerResponse);
      });
      return;
    }

    const fn = verovioToolkit?.[method || ''];
    let result;
    if (fn) {
      result = fn.apply(verovioToolkit, args || []);
    } else {
      console.warn('Unknown method:', method);
    }

    postMessage({ taskId, method, args, result } as WorkerResponse);
  },
  false
);
