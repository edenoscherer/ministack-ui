export interface RuntimeProvider {
  logs(): Promise<void>;
  queues(): Promise<void>;
  topics(): Promise<void>;
  secrets(): Promise<void>;
  streamLogs(
    onLog: (log: string) => void,
    filter?: { logGroup?: string; logStream?: string },
  ): Promise<() => void>;
  getLogGroups(): Promise<string[]>;
  getLogStreams(logGroup: string): Promise<string[]>;
}
