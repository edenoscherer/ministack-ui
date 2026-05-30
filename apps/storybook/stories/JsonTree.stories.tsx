import type { Meta, StoryObj } from '@storybook/react';
import { JsonTree } from '@ministack-ui/ui';

const meta: Meta<typeof JsonTree> = {
  title: 'Components/JsonTree',
  component: JsonTree,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JsonTree>;

export const SmallPayload: Story = {
  args: {
    data: {
      userId: 'user_83921',
      active: true,
      role: 'admin',
    },
    initialExpanded: true,
  },
};

export const MediumPayload: Story = {
  args: {
    data: {
      transaction: {
        id: 'tx_9847192',
        amount: 549.99,
        currency: 'BRL',
        status: 'completed',
        gateway: 'stripe',
        metadata: {
          ipAddress: '127.0.0.1',
          device: 'Mobile - iOS',
          attempts: 1,
        },
      },
      user: {
        name: 'Edson Scherer',
        email: 'edson@example.com',
      },
    },
    initialExpanded: true,
  },
};

export const LargePayload: Story = {
  args: {
    data: {
      status: 'healthy',
      timestamp: '2026-05-30T13:00:00.000Z',
      services: [
        {
          name: 'auth-service',
          status: 'healthy',
          metrics: {
            cpu: 12.4,
            memoryMb: 142.1,
            connections: 45,
          },
        },
        {
          name: 'payment-service',
          status: 'degraded',
          metrics: {
            cpu: 88.2,
            memoryMb: 512.4,
            connections: 230,
          },
          errors: [
            {
              time: '2026-05-30T12:58:33.000Z',
              message: 'Timeout connecting to postgres database pool',
              code: 'DB_TIMEOUT',
              payload: {
                timeoutMs: 5000,
                activeConnections: 100,
                maxConnections: 100,
              },
            },
          ],
        },
        {
          name: 'notification-service',
          status: 'healthy',
          metrics: {
            cpu: 2.1,
            memoryMb: 88,
            connections: 12,
          },
        },
      ],
      environment: 'production',
      region: 'sa-east-1',
      version: 'v2.4.1',
    },
    initialExpanded: false,
  },
};

export const EmptyObjectOrArray: Story = {
  args: {
    data: {
      emptyObject: {},
      emptyArray: [],
      nullValue: null,
      undefinedValue: undefined,
      nestedEmpty: {
        inside: {},
      },
    },
    initialExpanded: true,
  },
};
