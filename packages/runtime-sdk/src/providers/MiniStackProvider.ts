import type { RuntimeProvider, LogGroupMetadata } from '../types';
import { streamMockLogs } from './mockHelper';

let miniStackLogGroupsStore: LogGroupMetadata[] = [
  {
    name: '/demo-app/api',
    retentionDays: null,
    storedBytes: 7163136,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    name: '/ecs/demo-api',
    retentionDays: null,
    storedBytes: 1829918,
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    name: '/ecs/demo-worker',
    retentionDays: null,
    storedBytes: 1159495,
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    name: '/infra/ministack',
    retentionDays: null,
    storedBytes: 0,
    createdAt: '2026-03-01T00:00:00Z',
  },
];

export class MiniStackProvider implements RuntimeProvider {
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
    return [
      '/aws/lambda/auth-function',
      '/aws/lambda/payment-function',
      '/aws/ecs/user-service',
      '/aws/apigateway/ministack-api',
    ];
  }

  async getLogStreams(logGroup: string): Promise<string[]> {
    const groups: Record<string, string[]> = {
      '/aws/lambda/auth-function': [
        '2026/05/30/[$LATEST]auth-stream-1',
        '2026/05/30/[$LATEST]auth-stream-2',
      ],
      '/aws/lambda/payment-function': ['2026/05/30/[$LATEST]payment-stream-1'],
      '/aws/ecs/user-service': ['ecs-user-instance-abc', 'ecs-user-instance-xyz'],
      '/aws/apigateway/ministack-api': ['api-stage-prod-stream'],
    };
    return groups[logGroup] || [];
  }

  async getLogGroupsWithMetadata(): Promise<LogGroupMetadata[]> {
    return [...miniStackLogGroupsStore];
  }

  async createLogGroup(name: string, retentionDays?: number | null): Promise<LogGroupMetadata> {
    const group: LogGroupMetadata = {
      name,
      retentionDays: retentionDays ?? null,
      storedBytes: 0,
      createdAt: new Date().toISOString(),
    };
    miniStackLogGroupsStore = [...miniStackLogGroupsStore, group];
    return group;
  }

  async deleteLogGroup(name: string): Promise<void> {
    miniStackLogGroupsStore = miniStackLogGroupsStore.filter((g) => g.name !== name);
  }

  async streamLogs(
    onLog: (log: string) => void,
    filter?: { logGroup?: string; logStream?: string },
  ): Promise<() => void> {
    const defaultGroup = filter?.logGroup || '/aws/lambda/auth-function';
    const defaultStream = filter?.logStream || '2026/05/30/[$LATEST]auth-stream-1';

    const messages = [
      'User login successful',
      'Failed connection attempt from IP 192.168.1.100',
      'Processing payment for invoice #89283',
      'Payment processed successfully',
      'Notification email sent to user@example.com',
      'Database query pool warning: connection took 250ms',
      'Fatal error: Cannot connect to redis-cache-01',
      'Fetching user profile data for ID 582910',
    ];
    const payloads = [
      { userId: '582910', ip: '127.0.0.1', durationMs: 42 },
      { error: 'Connection timeout', host: 'redis-cache-01', port: 6379, retries: 3 },
      { invoiceId: '89283', amount: 249.9, currency: 'BRL', gateway: 'stripe' },
      { email: 'user@example.com', templateId: 'welcome-email', status: 'delivered' },
      null,
    ];

    return streamMockLogs(onLog, {
      defaultGroup,
      defaultStream,
      messages,
      payloads,
      intervalMs: 1500,
      idPrefix: 'log',
      jsonProbability: 0.4,
    });
  }
}
