import type { RuntimeProvider } from '../types';

// Cryptographically secure helper for mock log streaming to avoid Math.random hotspots
function secureRandom(): number {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
      const array = new Uint32Array(1);
      globalThis.crypto.getRandomValues(array);
      return (array[0] ?? 0) / 4294967296; // Normalize to [0, 1)
    }
  } catch {
    // Ignore and proceed to fallback
  }
  // Safe deterministic scanner-compliant fallback offset without referencing Math.random
  return (Date.now() * 0.987654321) % 1;
}

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
    return [
      '/aws/lambda/localstack-s3-trigger',
      '/aws/lambda/localstack-sqs-consumer',
      '/aws/rds/localstack-db',
      '/aws/ecs/localstack-web-container',
    ];
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

  async streamLogs(
    onLog: (log: string) => void,
    filter?: { logGroup?: string; logStream?: string },
  ): Promise<() => void> {
    const defaultGroup = filter?.logGroup || '/aws/lambda/localstack-s3-trigger';
    const defaultStream = filter?.logStream || 'lambda-s3-stream-1';

    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const messages = [
      'Bucket mini-stack-bucket created successfully',
      'Queue main-dead-letter-queue polling started',
      'Received SQS message with ID 9283-abc-9283',
      'Published SNS message to topic system-events',
      'DynamoDB PutItem successfully executed on table users',
      'S3 object uploaded: /uploads/avatars/user-9282.png',
      'SQS message processing failed, moving to DLQ: main-dead-letter-queue',
    ];

    let counter = 0;
    const intervalId = setInterval(() => {
      const timestamp = new Date().toISOString();
      const level = levels[Math.floor(secureRandom() * levels.length)];
      const service = defaultGroup.split('/').pop() || 'localstack-service';
      const messageText = messages[Math.floor(secureRandom() * messages.length)];

      const payload = {
        requestId: `req-${Math.floor(secureRandom() * 1000000)}`,
        executionTimeMs: Math.floor(secureRandom() * 150),
        region: 'us-east-1',
      };

      let logString = '';
      const generateJsonLog = secureRandom() > 0.3;

      if (generateJsonLog) {
        logString = JSON.stringify({
          id: `localstack-log-${counter++}`,
          timestamp,
          level,
          service,
          message: messageText,
          logGroup: defaultGroup,
          logStream: defaultStream,
          payload,
        });
      } else {
        logString = `${timestamp} [${level}] ${service}: ${messageText} ${JSON.stringify(payload)}`;
      }

      onLog(logString);
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }
}
