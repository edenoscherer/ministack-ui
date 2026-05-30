export type ServiceType = 'lambda' | 'sqs' | 'sns' | 's3' | 'dynamodb' | 'secrets';
export type ServiceStatus = 'healthy' | 'warning' | 'offline';

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  port: number;
  status: ServiceStatus;
  meta: string;
  lastActivity: string;
}

import { SERVICES } from './mock-data-helper';

export const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  lambda: 'Lambda',
  sqs: 'SQS',
  sns: 'SNS',
  s3: 'S3',
  dynamodb: 'DynamoDB',
  secrets: 'Secrets',
};

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  id: string;
  ts: string;
  level: LogLevel;
  service: string;
  message: string;
  correlationId?: string;
  payload: Record<string, unknown>;
  trace?: string[];
}

export const RECENT_TRACES = [
  {
    id: 't1',
    route: 'POST /orders',
    hops: ['API GW', 'SNS', 'SQS', 'Lambda'],
    ms: 184,
    status: 'ok' as const,
  },
  {
    id: 't2',
    route: 'POST /payments',
    hops: ['API GW', 'Lambda', 'DynamoDB'],
    ms: 92,
    status: 'ok' as const,
  },
  {
    id: 't3',
    route: 'PUT /avatars',
    hops: ['API GW', 'Lambda', 'S3'],
    ms: 312,
    status: 'ok' as const,
  },
  {
    id: 't4',
    route: 'POST /webhooks/stripe',
    hops: ['API GW', 'Lambda'],
    ms: 1240,
    status: 'warn' as const,
  },
  { id: 't5', route: 'GET /sessions', hops: ['API GW', 'DynamoDB'], ms: 24, status: 'ok' as const },
];

export const API_LOAD_SERIES = [
  12, 18, 14, 22, 28, 24, 32, 38, 30, 42, 48, 40, 52, 60, 54, 66, 58, 72, 68, 80,
];
