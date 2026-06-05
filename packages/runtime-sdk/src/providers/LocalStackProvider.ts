import type { RuntimeProvider, LogGroupMetadata } from '../types';
import { streamMockLogs } from './mockHelper';

let localStackLogGroupsStore: LogGroupMetadata[] = [
  {
    name: '/aws/lambda/localstack-s3-trigger',
    retentionDays: 7,
    storedBytes: 512000,
    createdAt: '2026-03-10T00:00:00Z',
  },
  {
    name: '/aws/lambda/localstack-sqs-consumer',
    retentionDays: 7,
    storedBytes: 204800,
    createdAt: '2026-03-10T00:00:00Z',
  },
  {
    name: '/aws/rds/localstack-db',
    retentionDays: 30,
    storedBytes: 3145728,
    createdAt: '2026-03-15T00:00:00Z',
  },
  {
    name: '/aws/ecs/localstack-web-container',
    retentionDays: null,
    storedBytes: 921600,
    createdAt: '2026-04-01T00:00:00Z',
  },
];

export class LocalStackProvider implements RuntimeProvider {
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
    return localStackLogGroupsStore.map((g) => g.name);
  }

  async getLogStreams(logGroup: string): Promise<string[]> {
    const groups: Record<string, string[]> = {
      '/aws/lambda/localstack-s3-trigger': ['lambda-s3-stream-1', 'lambda-s3-stream-2'],
      '/aws/lambda/localstack-sqs-consumer': ['lambda-sqs-stream-main'],
      '/aws/rds/localstack-db': ['rds-db-log-stream'],
      '/aws/ecs/localstack-web-container': ['ecs-container-instance-1'],
    };
    return groups[logGroup] || [];
  }

  async getLogGroupsWithMetadata(): Promise<LogGroupMetadata[]> {
    return [...localStackLogGroupsStore];
  }

  async createLogGroup(name: string, retentionDays?: number | null): Promise<LogGroupMetadata> {
    const group: LogGroupMetadata = {
      name,
      retentionDays: retentionDays ?? null,
      storedBytes: 0,
      createdAt: new Date().toISOString(),
    };
    localStackLogGroupsStore = [...localStackLogGroupsStore, group];
    return group;
  }

  async deleteLogGroup(name: string): Promise<void> {
    localStackLogGroupsStore = localStackLogGroupsStore.filter((g) => g.name !== name);
  }

  async streamLogs(
    onLog: (log: string) => void,
    filter?: { logGroup?: string; logStream?: string },
  ): Promise<() => void> {
    const defaultGroup = filter?.logGroup || '/aws/lambda/localstack-s3-trigger';
    const defaultStream = filter?.logStream || 'lambda-s3-stream-1';

    const messages = [
      'Bucket mini-stack-bucket created successfully',
      'Queue main-dead-letter-queue polling started',
      'Received SQS message with ID 9283-abc-9283',
      'Published SNS message to topic system-events',
      'DynamoDB PutItem successfully executed on table users',
      'S3 object uploaded: /uploads/avatars/user-9282.png',
      'SQS message processing failed, moving to DLQ: main-dead-letter-queue',
    ];

    const payloads = [
      {
        requestId: 'req-localstack-mock',
        executionTimeMs: 82,
        region: 'us-east-1',
      },
    ];

    return streamMockLogs(onLog, {
      defaultGroup,
      defaultStream,
      messages,
      payloads,
      intervalMs: 2000,
      idPrefix: 'localstack-log',
      jsonProbability: 0.3,
    });
  }
}
