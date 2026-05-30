export interface RuntimeProvider {
  logs(): Promise<void>;
  queues(): Promise<void>;
  topics(): Promise<void>;
  secrets(): Promise<void>;
  streamLogs(onLog: (log: string) => void): Promise<() => void>;
}
