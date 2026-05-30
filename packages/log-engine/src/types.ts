export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}
