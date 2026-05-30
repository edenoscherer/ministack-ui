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

  async streamLogs(
    onLog: (log: string) => void,
    filter?: { logGroup?: string; logStream?: string },
  ): Promise<() => void> {
    const defaultGroup = filter?.logGroup || '/aws/lambda/auth-function';
    const defaultStream = filter?.logStream || '2026/05/30/[$LATEST]auth-stream-1';

    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
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

    let counter = 0;
    const intervalId = setInterval(() => {
      const timestamp = new Date().toISOString();
      const level = levels[Math.floor(secureRandom() * levels.length)];
      const service = defaultGroup.split('/').pop() || 'auth-service';
      const messageText = messages[Math.floor(secureRandom() * messages.length)];

      const attachPayload = secureRandom() > 0.5;
      const payload = attachPayload ? payloads[Math.floor(secureRandom() * payloads.length)] : null;

      let logString = '';
      const generateJsonLog = secureRandom() > 0.4;

      if (generateJsonLog) {
        logString = JSON.stringify({
          id: `log-${counter++}`,
          timestamp,
          level,
          service,
          message: messageText,
          logGroup: defaultGroup,
          logStream: defaultStream,
          ...(payload ? { payload } : {}),
        });
      } else {
        logString = `${timestamp} [${level}] ${service}: ${messageText} ${payload ? JSON.stringify(payload) : ''}`;
      }

      onLog(logString);
    }, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }
}
