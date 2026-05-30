export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string; code: string } };

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}>;

export type ServiceStatus = 'healthy' | 'degraded' | 'unavailable';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogMessage {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  payload?: Record<string, any>;
  logGroup?: string;
  logStream?: string;
}

export type ConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';
