import type { Service } from '../lib/mock-data';

export const SERVICES: Service[] = [
  {
    id: 'svc-1',
    name: 'lambda-payment-auth',
    type: 'lambda',
    port: 4566,
    status: 'healthy',
    meta: 'Last invoked 2m ago · 142 inv/h',
    lastActivity: '2m',
  },
  {
    id: 'svc-2',
    name: 'sqs-order-processor',
    type: 'sqs',
    port: 4566,
    status: 'warning',
    meta: '0 Msg / 2 in DLQ',
    lastActivity: '8s',
  },
  {
    id: 'svc-3',
    name: 's3-user-avatars',
    type: 's3',
    port: 4566,
    status: 'healthy',
    meta: '1.2 GB · 482 objects',
    lastActivity: '—',
  },
  {
    id: 'svc-4',
    name: 'lambda-webhook-router',
    type: 'lambda',
    port: 4566,
    status: 'offline',
    meta: 'Cold · no recent activity',
    lastActivity: '—',
  },
];
