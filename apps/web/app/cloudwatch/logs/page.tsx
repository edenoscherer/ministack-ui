'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LogGroupsTable } from '@ministack-ui/ui';
import type { LogGroupMetadata } from '@ministack-ui/shared';

type Provider = 'ministack' | 'localstack';

export default function CloudWatchLogsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider>('ministack');
  const [groups, setGroups] = useState<LogGroupMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createRetention, setCreateRetention] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cloudwatch/log-groups?provider=${provider}`);
      const data = await res.json();
      if (data.data?.groups) {
        setGroups(data.data.groups);
      }
    } catch (err) {
      console.error('Failed to fetch log groups:', err);
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  async function handleCreate() {
    if (!createName.trim()) return;
    setIsCreating(true);
    try {
      const retentionDays = createRetention ? parseInt(createRetention, 10) : null;
      const res = await fetch('/api/cloudwatch/log-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: createName.trim(), retentionDays, provider }),
      });
      const data = await res.json();
      if (data.data?.group) {
        setGroups((prev) => [...prev, data.data.group]);
        setShowCreateModal(false);
        setCreateName('');
        setCreateRetention('');
      }
    } catch (err) {
      console.error('Failed to create log group:', err);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(name: string) {
    if (deleteConfirm !== name) {
      setDeleteConfirm(name);
      return;
    }
    try {
      await fetch(
        `/api/cloudwatch/log-groups?name=${encodeURIComponent(name)}&provider=${provider}`,
        { method: 'DELETE' },
      );
      setGroups((prev) => prev.filter((g) => g.name !== name));
    } catch (err) {
      console.error('Failed to delete log group:', err);
    } finally {
      setDeleteConfirm(null);
    }
  }

  function handleViewLogs(name: string) {
    router.push(`/logs?logGroup=${encodeURIComponent(name)}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            CloudWatch Logs
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            View and manage local application logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Provider switcher */}
          <div className="flex bg-muted border border-border rounded-xl p-1 w-fit">
            {(['ministack', 'localstack'] as Provider[]).map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={[
                  'px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all',
                  provider === p
                    ? 'bg-card text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {p === 'ministack' ? 'MiniStack Local' : 'LocalStack Container'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <span className="text-base leading-none">+</span>
            Create Log Group
          </button>
        </div>
      </div>

      {/* Delete confirmation banner */}
      {deleteConfirm && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
          <span className="text-destructive">
            Are you sure you want to delete{' '}
            <span className="font-mono font-semibold">{deleteConfirm}</span>?
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <LogGroupsTable
        groups={groups}
        isLoading={isLoading}
        onDelete={handleDelete}
        onViewLogs={handleViewLogs}
      />

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">Create Log Group</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a new CloudWatch Log Group to your local environment.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Log Group Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="/my-app/api"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Retention (days)
                  <span className="ml-1.5 text-muted-foreground font-normal">
                    — leave empty for Never Expire
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={createRetention}
                  onChange={(e) => setCreateRetention(e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateName('');
                  setCreateRetention('');
                }}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!createName.trim() || isCreating}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
