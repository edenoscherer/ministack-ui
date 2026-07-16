import type { RuntimeProvider, LogGroupMetadata } from '../types';

export class AwsProvider implements RuntimeProvider {
  async logs(): Promise<void> {
    throw new Error('not implemented');
  }

  async queues(): Promise<void> {
    throw new Error('not implemented');
  }

  async topics(): Promise<void> {
    throw new Error('not implemented');
  }

  async secrets(): Promise<void> {
    throw new Error('not implemented');
  }

  async getLogGroups(): Promise<string[]> {
    return [];
  }

  async getLogStreams(logGroup: string): Promise<string[]> {
    return [];
  }

  async streamLogs(
    onLog: (log: string) => void,
    filter?: { logGroup?: string; logStream?: string },
  ): Promise<() => void> {
    return () => {};
  }

  async getLogGroupsWithMetadata(): Promise<LogGroupMetadata[]> {
    return [];
  }

  async createLogGroup(name: string, retentionDays?: number | null): Promise<LogGroupMetadata> {
    throw new Error('not implemented');
  }

  async deleteLogGroup(name: string): Promise<void> {
    throw new Error('not implemented');
  }
}
