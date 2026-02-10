export type VerovioInitMessage = {
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
};
