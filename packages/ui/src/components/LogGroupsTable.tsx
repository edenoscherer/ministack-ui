import type { JSX } from 'react';
import type { LogGroupMetadata } from '@ministack-ui/shared';

export interface LogGroupsTableProps {
  groups: LogGroupMetadata[];
  onDelete: (name: string) => void;
  onViewLogs: (name: string) => void;
  isLoading?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatRetention(days: number | null): string {
  if (days === null) return 'Never Expire';
  return `${days} days`;
}

export function LogGroupsTable({
  groups,
  onDelete,
  onViewLogs,
  isLoading = false,
}: LogGroupsTableProps): JSX.Element {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <TableHeader />
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-t border-border">
                {Array.from({ length: 4 }).map((__, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 rounded bg-muted animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <TableHeader />
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                No log groups found. Create one to get started.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <TableHeader />
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr
              key={group.name}
              className="border-t border-border hover:bg-muted/40 transition-colors"
            >
              <td className="px-4 py-3">
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md text-foreground">
                  {group.name}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatRetention(group.retentionDays)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatBytes(group.storedBytes)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewLogs(group.name)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    View Logs
                  </button>
                  <button
                    onClick={() => onDelete(group.name)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-2.5 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader(): JSX.Element {
  return (
    <tr className="bg-muted/50">
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Name
      </th>
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Retention
      </th>
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Stored Size
      </th>
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Actions
      </th>
    </tr>
  );
}
