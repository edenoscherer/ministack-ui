import React, { useState, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LogViewer } from '@ministack-ui/ui';
import { LogMessage } from '@ministack-ui/shared';

const meta: Meta<typeof LogViewer> = {
  title: 'Components/LogViewer',
  component: LogViewer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

const staticLogs: LogMessage[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 5000).toISOString(),
    level: 'INFO',
    service: 'auth-service',
    message: 'User authentication requested for user_92831',
    payload: { userId: 'user_92831', provider: 'google', ip: '127.0.0.1' },
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 4000).toISOString(),
    level: 'DEBUG',
    service: 'auth-service',
    message: 'JWT generated successfully with expiration in 3600 seconds',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 3000).toISOString(),
    level: 'WARN',
    service: 'database-pool',
    message: 'Postgres connection took longer than expected: 320ms (threshold: 300ms)',
    payload: { durationMs: 320, activeConnections: 12, maxConnections: 50 },
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 2000).toISOString(),
    level: 'ERROR',
    service: 'payment-service',
    message: 'Failed to process payment invoice #948271. Gateway returned error status 402',
    payload: {
      invoiceId: '948271',
      gateway: 'stripe',
      error: { code: 'card_declined', decline_code: 'insufficient_funds' },
    },
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 1000).toISOString(),
    level: 'INFO',
    service: 'notification-service',
    message: 'Triggered fallback email notification for user_92831 due to payment failure',
  },
];

export const StaticLogs: StoryObj<typeof LogViewer> = {
  args: {
    logs: staticLogs,
    connectionStatus: 'CONNECTED',
    isPaused: false,
    autoScroll: true,
  },
};

export const DisconnectedState: StoryObj<typeof LogViewer> = {
  args: {
    logs: staticLogs.slice(0, 2),
    connectionStatus: 'DISCONNECTED',
    isPaused: false,
    autoScroll: true,
  },
};

export const ConnectingState: StoryObj<typeof LogViewer> = {
  args: {
    logs: staticLogs.slice(0, 3),
    connectionStatus: 'CONNECTING',
    isPaused: false,
    autoScroll: true,
  },
};

function InteractiveStreamingWrapper() {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'DISCONNECTED'>(
    'CONNECTED',
  );

  const pendingLogsRef = useRef<LogMessage[]>([]);
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const services = [
    'auth-service',
    'payment-service',
    'database-pool',
    'api-gateway',
    'worker-queue',
  ];
  const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'] as const;
  const messages = [
    'Route GET /api/v1/users resolved in 42ms',
    'Database connection pool acquired socket #12',
    'Processing job transaction-settlement-9828',
    'Token verification succeeded',
    'Failed to lookup geolocation for IP 189.12.33.20',
    'Slow query detected: SELECT * FROM audit_logs WHERE user_id = $1 (240ms)',
    'Successfully pushed message to dead letter queue',
    'Heartbeat ping to localstack bucket mini-stack-bucket succeeded',
  ];

  const payloads = [
    { durationMs: 42, path: '/api/v1/users', method: 'GET' },
    { jobId: 'transaction-settlement-9828', queue: 'settlements', attempts: 1 },
    { error: 'Connection refused', host: 'localhost', port: 5432 },
    { region: 'us-east-1', bucket: 'mini-stack-bucket', sizeBytes: 1024398 },
    null,
  ];

  useEffect(() => {
    let logId = 0;
    const interval = setInterval(() => {
      if (connectionStatus === 'DISCONNECTED') return;

      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const randomPayload = payloads[Math.floor(Math.random() * payloads.length)] || undefined;

      const newLog: LogMessage = {
        id: `stream-log-${logId++}`,
        timestamp: new Date().toISOString(),
        level: randomLevel,
        service: randomService,
        message: randomMessage,
        payload: randomPayload,
      };

      if (isPausedRef.current) {
        pendingLogsRef.current.push(newLog);
        if (pendingLogsRef.current.length + logs.length > 1000) {
          pendingLogsRef.current.shift();
        }
      } else {
        setLogs((prev) => {
          const combined = [...prev, newLog];
          if (combined.length > 1000) {
            return combined.slice(-1000);
          }
          return combined;
        });
      }
    }, 250);

    return () => clearInterval(interval);
  }, [connectionStatus, logs.length]);

  const handlePauseToggle = () => {
    if (isPaused) {
      setLogs((prev) => {
        const combined = [...prev, ...pendingLogsRef.current];
        pendingLogsRef.current = [];
        if (combined.length > 1000) {
          return combined.slice(-1000);
        }
        return combined;
      });
    }
    setIsPaused(!isPaused);
  };

  const handleClear = () => {
    setLogs([]);
    pendingLogsRef.current = [];
  };

  return (
    <div className="h-screen w-screen p-6 bg-zinc-950 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4 select-none flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white">Simulador de Alta Vazão</h2>
          <span className="text-xs text-zinc-500">Logs gerados em tempo real a cada 250ms</span>
        </div>
        <button
          onClick={() =>
            setConnectionStatus((s) => (s === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED'))
          }
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            connectionStatus === 'CONNECTED'
              ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          {connectionStatus === 'CONNECTED' ? 'Forçar Desconexão' : 'Restaurar Conexão'}
        </button>
      </div>
      <div className="flex-1 min-h-0">
        <LogViewer
          logs={logs}
          isPaused={isPaused}
          onPauseToggle={handlePauseToggle}
          autoScroll={autoScroll}
          onAutoScrollToggle={() => setAutoScroll(!autoScroll)}
          onClear={handleClear}
          connectionStatus={connectionStatus}
        />
      </div>
    </div>
  );
}

export const HighThroughputStreaming: StoryObj<typeof LogViewer> = {
  render: () => <InteractiveStreamingWrapper />,
};
