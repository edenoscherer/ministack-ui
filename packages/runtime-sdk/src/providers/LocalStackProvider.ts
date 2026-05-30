import type { RuntimeProvider } from '../types';

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

  async streamLogs(onLog: (log: string) => void): Promise<() => void> {
    const services = ['localstack-s3', 'localstack-sqs', 'localstack-sns', 'localstack-dynamodb'];
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
      const level = levels[Math.floor(Math.random() * levels.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      const messageText = messages[Math.floor(Math.random() * messages.length)];

      const payload = {
        requestId: `req-${Math.floor(Math.random() * 1000000)}`,
        executionTimeMs: Math.floor(Math.random() * 150),
        region: 'us-east-1',
      };

      let logString = '';
      const generateJsonLog = Math.random() > 0.3;

      if (generateJsonLog) {
        logString = JSON.stringify({
          id: `localstack-log-${counter++}`,
          timestamp,
          level,
          service,
          message: messageText,
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
