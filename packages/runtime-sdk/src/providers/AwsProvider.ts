import type { RuntimeProvider } from '../types';

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
    // Retorna uma função de desinscrição vazia, a integração com a AWS real será em sprint posterior.
    return () => {};
  }
}
