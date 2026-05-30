import type { LogGroupMetadata } from '@ministack-ui/shared';

export type { LogGroupMetadata };

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
  getLogGroupsWithMetadata(): Promise<LogGroupMetadata[]>;
  createLogGroup(name: string, retentionDays?: number | null): Promise<LogGroupMetadata>;
  deleteLogGroup(name: string): Promise<void>;
}
