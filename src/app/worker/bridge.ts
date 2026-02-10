import type { WorkerRequest, WorkerResponse, VerovioRequest } from './messages';

let seq = 0;

export type WorkerBridge = {
  init: (verovioUrl: string) => Promise<void>;
  call: <T = unknown>(method: string, args?: unknown[]) => Promise<T>;
};

export function createWorkerBridge(worker: Worker): WorkerBridge {
  const pending = new Map<string, { resolve: (value: any) => void; reject: (err: Error) => void }>();

  worker.addEventListener('message', (event: MessageEvent<WorkerResponse>) => {
    const message = event.data;
    const handler = pending.get(message.taskId);
    if (!handler) return;
    pending.delete(message.taskId);
    handler.resolve(message.result);
  });

  function call<T>(method: string, args?: unknown[]): Promise<T> {
    const taskId = `task_${seq++}`;
    const payload: VerovioRequest = { taskId, method, args };
    return new Promise<T>((resolve, reject) => {
      pending.set(taskId, { resolve, reject });
      worker.postMessage(payload as WorkerRequest);
    });
  }

  return {
    async init(verovioUrl: string) {
      worker.postMessage({ verovioUrl } as WorkerRequest);
      await call('onRuntimeInitialized');
    },
    call
  };
}
