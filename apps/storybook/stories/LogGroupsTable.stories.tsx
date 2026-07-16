import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LogGroupsTable } from '@ministack-ui/ui';
import type { LogGroupMetadata } from '@ministack-ui/shared';

const meta: Meta<typeof LogGroupsTable> = {
  title: 'Components/LogGroupsTable',
  component: LogGroupsTable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

const sampleGroups: LogGroupMetadata[] = [
  {
    name: '/demo-app/api',
    retentionDays: null,
    storedBytes: 7163136,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    name: '/ecs/demo-api',
    retentionDays: null,
    storedBytes: 1829918,
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    name: '/ecs/demo-worker',
    retentionDays: null,
    storedBytes: 1159495,
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    name: '/infra/ministack',
    retentionDays: null,
    storedBytes: 0,
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    name: '/aws/lambda/auth-fn',
    retentionDays: 7,
    storedBytes: 512000,
    createdAt: '2026-04-01T00:00:00Z',
  },
];

export const WithData: StoryObj<typeof LogGroupsTable> = {
  args: {
    groups: sampleGroups,
    onDelete: (name) => alert(`Delete: ${name}`),
    onViewLogs: (name) => alert(`View Logs: ${name}`),
    isLoading: false,
  },
};

export const Loading: StoryObj<typeof LogGroupsTable> = {
  args: {
    groups: [],
    onDelete: () => {},
    onViewLogs: () => {},
    isLoading: true,
  },
};

export const Empty: StoryObj<typeof LogGroupsTable> = {
  args: {
    groups: [],
    onDelete: () => {},
    onViewLogs: () => {},
    isLoading: false,
  },
};
