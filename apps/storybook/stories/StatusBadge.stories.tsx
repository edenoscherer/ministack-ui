import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from '@ministack-ui/ui';

const meta: Meta<typeof StatusBadge> = {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['healthy', 'warning', 'offline', 'degraded', 'unavailable'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Healthy: Story = {
  args: {
    status: 'healthy',
  },
};

export const Warning: Story = {
  args: {
    status: 'warning',
  },
};

export const Offline: Story = {
  args: {
    status: 'offline',
  },
};

export const Degraded: Story = {
  args: {
    status: 'degraded',
  },
};

export const Unavailable: Story = {
  args: {
    status: 'unavailable',
  },
};
