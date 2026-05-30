import type { RuntimeProvider } from '../types';

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

  async streamLogs(onLog: (log: string) => void): Promise<() => void> {
    const services = ['auth-service', 'payment-service', 'notification-service', 'user-service'];
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
      { userId: '582910', ip: '189.12.33.45', durationMs: 42 },
      { error: 'Connection timeout', host: 'redis-cache-01', port: 6379, retries: 3 },
      { invoiceId: '89283', amount: 249.9, currency: 'BRL', gateway: 'stripe' },
      { email: 'user@example.com', templateId: 'welcome-email', status: 'delivered' },
      null,
    ];

    let counter = 0;
    const intervalId = setInterval(() => {
      const timestamp = new Date().toISOString();
      const level = levels[Math.floor(Math.random() * levels.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      const messageText = messages[Math.floor(Math.random() * messages.length)];

      const attachPayload = Math.random() > 0.5;
      const payload = attachPayload ? payloads[Math.floor(Math.random() * payloads.length)] : null;

      let logString = '';
      const generateJsonLog = Math.random() > 0.4;

      if (generateJsonLog) {
        logString = JSON.stringify({
          id: `log-${counter++}`,
          timestamp,
          level,
          service,
          message: messageText,
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
