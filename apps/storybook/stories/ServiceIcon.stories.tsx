import type { Meta, StoryObj } from '@storybook/react';
import { ServiceIcon } from '@ministack-ui/ui';

const meta: Meta<typeof ServiceIcon> = {
  title: 'UI/ServiceIcon',
  component: ServiceIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['lambda', 'sqs', 'sns', 's3', 'dynamodb', 'secrets'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Lambda: Story = {
  args: {
    type: 'lambda',
    size: 'md',
  },
};

export const SQS: Story = {
  args: {
    type: 'sqs',
    size: 'md',
  },
};

export const SNS: Story = {
  args: {
    type: 'sns',
    size: 'md',
  },
};

export const S3: Story = {
  args: {
    type: 's3',
    size: 'md',
  },
};

export const DynamoDB: Story = {
  args: {
    type: 'dynamodb',
    size: 'md',
  },
};

export const Secrets: Story = {
  args: {
    type: 'secrets',
    size: 'md',
  },
};
