import React from 'react';

export type ServiceStatus = 'healthy' | 'warning' | 'offline' | 'degraded' | 'unavailable';

const styles: Record<ServiceStatus, { bg: string; fg: string; dot: string; label: string }> = {
  healthy: { bg: 'bg-primary-soft', fg: 'text-primary', dot: 'bg-primary', label: 'Healthy' },
  warning: {
    bg: 'bg-warning-soft',
    fg: 'text-[oklch(0.45_0.14_60)]',
    dot: 'bg-warning',
    label: 'Warning',
  },
  offline: {
    bg: 'bg-muted',
    fg: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
    label: 'Offline',
  },
  degraded: {
    bg: 'bg-warning-soft',
    fg: 'text-[oklch(0.45_0.14_60)]',
    dot: 'bg-warning',
    label: 'Degraded',
  },
  unavailable: {
    bg: 'bg-muted',
    fg: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
    label: 'Unavailable',
  },
};

export function StatusBadge({ status }: { status: ServiceStatus }): React.JSX.Element {
  const s = styles[status] || styles.offline;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${s.bg} px-2.5 py-1 text-[11px] font-medium ${s.fg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
