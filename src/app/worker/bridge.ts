import {
    VEROVIO_METHOD_ALIASES,
    type VerovioToolkit,
} from "./verovio-types";

export type VerovioInitMessage = {
    taskId: string;
    verovioUrl: string;
};

export type VerovioRequest = {
    taskId: string;
    method: string;
    args?: unknown[];
};

export type WorkerRequest = VerovioInitMessage | VerovioRequest;

export type WorkerResponse = {
    taskId: string;
    method: string;
    args?: unknown[];
    result: unknown;
    error?: string;
};

export type WorkerCall = {
    taskId: string;
    method: string;
    args: unknown[];
};

export type WorkerCallListener = (call: WorkerCall) => void;


let seq = 0;

type VerovioMethod = keyof VerovioToolkit;
type VerovioMethodAliases = Partial<Record<VerovioMethod, string>>;

export type WorkerBridge = {
    init: (verovioUrl: string) => Promise<void>;
    call: <M extends VerovioMethod>(
        method: M,
        args?: Parameters<VerovioToolkit[M]>
    ) => Promise<ReturnType<VerovioToolkit[M]>>;
    verovio: {
        [M in VerovioMethod]: (...args: Parameters<VerovioToolkit[M]>) => Promise<ReturnType<VerovioToolkit[M]>>;
    };
    subscribeCalls: (listener: WorkerCallListener) => () => void;
    whenIdle: () => Promise<void>;
};

export function createWorkerBridge(
    worker: Worker,
    methodAliases: VerovioMethodAliases = VEROVIO_METHOD_ALIASES,
): WorkerBridge {
    const pending = new Map<
        string,
        { resolve: (value: any) => void; reject: (err: Error) => void }
    >();
    const callListeners = new Set<WorkerCallListener>();
    const idleResolvers = new Set<() => void>();

    function notifyCall(call: WorkerCall) {
        for (const listener of callListeners) {
            try {
                listener(call);
            } catch (error) {
                console.error("Worker call listener failed", error);
            }
        }
    }

    function resolveIdle() {
        if (pending.size !== 0) return;
        for (const resolve of idleResolvers) resolve();
        idleResolvers.clear();
    }

    worker.addEventListener('message', (event: MessageEvent<WorkerResponse>) => {
        const message = event.data;
        const handler = pending.get(message.taskId);
        if (!handler) return;
        pending.delete(message.taskId);
        if (message.error) {
            handler.reject(new Error(message.error));
            resolveIdle();
            return;
        }
        handler.resolve(message.result);
        resolveIdle();
    });

    worker.addEventListener('error', (event) => {
        const message = event.message || 'Worker error';
        for (const [taskId, handler] of pending) {
            pending.delete(taskId);
            handler.reject(new Error(message));
        }
        resolveIdle();
    });

    worker.addEventListener('messageerror', () => {
        for (const [taskId, handler] of pending) {
            pending.delete(taskId);
            handler.reject(new Error('Worker message error'));
        }
        resolveIdle();
    });

    function call<M extends VerovioMethod>(
        method: M,
        args?: Parameters<VerovioToolkit[M]>
    ): Promise<ReturnType<VerovioToolkit[M]>> {
        const taskId = `task_${seq++}`;
        const originalMethod = methodAliases[method] ?? String(method);
        const callArgs = (args ?? []) as unknown[];
        const payload: VerovioRequest = {
            taskId,
            method: originalMethod,
            args: callArgs,
        };
        return new Promise((resolve, reject) => {
            pending.set(taskId, { resolve, reject });
            notifyCall({ taskId, method: originalMethod, args: callArgs });
            worker.postMessage(payload as WorkerRequest);
        });
    }

    const verovio = new Proxy(
        {},
        {
            get(_target, prop: string) {
                return (...args: unknown[]) =>
                    call(prop as VerovioMethod, args as never);
            },
        },
    ) as WorkerBridge["verovio"];

    return {
        async init(verovioUrl: string) {
            const taskId = `task_${seq++}`;
            const payload: VerovioInitMessage = {
                taskId,
                verovioUrl,
            };
            await new Promise<void>((resolve, reject) => {
                pending.set(taskId, { resolve, reject });
                worker.postMessage(payload as WorkerRequest);
            });
        },
        call,
        verovio,
        subscribeCalls(listener) {
            callListeners.add(listener);
            return () => callListeners.delete(listener);
        },
        whenIdle() {
            if (pending.size === 0) return Promise.resolve();
            return new Promise<void>((resolve) => idleResolvers.add(resolve));
        },
    };
}
