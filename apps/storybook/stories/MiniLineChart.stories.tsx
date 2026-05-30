import type { Meta, StoryObj } from '@storybook/react';
import { MiniLineChart } from '@ministack-ui/ui';

const meta: Meta<typeof MiniLineChart> = {
  title: 'UI/MiniLineChart',
  component: MiniLineChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [12, 18, 14, 22, 28, 24, 32, 38, 30, 42, 48, 40, 52, 60, 54, 66, 58, 72, 68, 80],
    height: 120,
    className: 'w-80 border border-border rounded-xl p-4 bg-card',
  },
};
