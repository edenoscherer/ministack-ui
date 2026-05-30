'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  HardDrive,
  Lightbulb,
  Radio,
  Search,
  ArrowUpRight,
  Zap,
  MoreHorizontal,
} from 'lucide-react';
import { MiniLineChart, ServiceIcon, StatusBadge } from '@ministack-ui/ui';
import {
  SERVICES,
  SERVICE_TYPE_LABEL,
  RECENT_TRACES,
  API_LOAD_SERIES,
  type ServiceType,
  type ServiceStatus,
} from '../lib/mock-data';

const TYPE_FILTERS: {
  value: 'all' | 'serverless' | 'messaging' | 'storage' | 'config';
  label: string;
}[] = [
  { value: 'all', label: 'All Services' },
  { value: 'serverless', label: 'Serverless' },
  { value: 'messaging', label: 'Messaging' },
  { value: 'storage', label: 'Storage' },
  { value: 'config', label: 'Config' },
];

const TYPE_GROUP: Record<ServiceType, 'serverless' | 'messaging' | 'storage' | 'config'> = {
  lambda: 'serverless',
  dynamodb: 'serverless',
  sqs: 'messaging',
  sns: 'messaging',
  s3: 'storage',
  secrets: 'config',
};

export default function DashboardPage(): React.JSX.Element {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<(typeof TYPE_FILTERS)[number]['value']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ServiceStatus>('all');

  const filtered = useMemo(() => {
    return SERVICES.filter((s) => {
      if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (typeFilter !== 'all' && TYPE_GROUP[s.type] !== typeFilter) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      return true;
    });
  }, [query, typeFilter, statusFilter]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-fade-in select-none">
      {/* Greeting + insight */}
      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" /> Live ·{' '}
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>
              Workspace: <span className="text-foreground font-medium">local-dev</span>
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Runtime overview <span className="text-muted-foreground font-normal">·</span>{' '}
            <span className="text-primary">healthy</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            12 services emulated locally. 2 attention items: an SQS DLQ build-up and a cold Lambda.
            Everything else is humming.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-foreground">Quick Insight</div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">sqs-order-processor</span> has 2
                messages stuck in DLQ for the last 6 min. Consider replaying or inspecting payload
                schema.
              </p>
              <Link
                href="/logs?service=sqs-order-processor&level=ERROR"
                className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:gap-2 transition-all"
              >
                Inspect failed messages <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Activity className="h-4 w-4" />}
          label="Local Services"
          value="12"
          hint="11 healthy · 1 offline"
          trend={
            <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
          }
        />
        <KpiCard
          icon={<Radio className="h-4 w-4" />}
          label="Active Log Streams"
          value="4"
          hint="Streaming in realtime"
          trend={<span className="text-xs font-medium text-primary">●● ●●</span>}
        />
        <KpiCard
          icon={<AlertTriangle className="h-4 w-4" />}
          label="DLQ Alerts"
          value="2"
          hint="sqs-order-processor"
          warning
        />
        <KpiCard
          icon={<HardDrive className="h-4 w-4" />}
          label="S3 Storage"
          value="1.4 GB"
          hint="15 buckets"
          progress={42}
        />
      </section>

      {/* Services + side column */}
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">AWS Services</h2>
              <p className="text-xs text-muted-foreground">
                {filtered.length} of {SERVICES.length} services shown
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by service name…"
                  className="h-9 w-full sm:w-56 rounded-lg border border-border bg-background pl-8 pr-3 text-[13px] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | ServiceStatus)}
                className="h-9 rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="healthy">Healthy</option>
                <option value="warning">Warning</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 border-b border-border px-5 py-3">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTypeFilter(t.value)}
                className={[
                  'rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-200',
                  typeFilter === t.value
                    ? 'bg-primary-soft text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>

          <ul className="divide-y divide-border">
            {filtered.map((s) => (
              <li
                key={s.id}
                className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
              >
                <ServiceIcon type={s.type} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[14px] text-foreground truncate">
                      {s.name}
                    </span>
                    <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">
                      :{s.port}
                    </span>
                    <span className="rounded-md border border-border px-1.5 py-0.5 text-[10.5px] text-muted-foreground">
                      {SERVICE_TYPE_LABEL[s.type]}
                    </span>
                  </div>
                  <div className="mt-1 text-[12px] text-muted-foreground">{s.meta}</div>
                </div>
                <StatusBadge status={s.status} />
                <div className="hidden md:flex items-center gap-1">
                  <button
                    onClick={() => router.push(`/logs?service=${encodeURIComponent(s.name)}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-[12px] font-medium text-foreground transition-all hover:border-primary hover:bg-primary-soft hover:text-primary"
                  >
                    View Logs
                  </button>
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
                    title="Quick interact"
                  >
                    <Zap className="h-3.5 w-3.5" />
                  </button>
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-5 py-12 text-center text-sm text-muted-foreground">
                No services match these filters.
              </li>
            )}
          </ul>
        </div>

        {/* Right column */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">API Load</h3>
                <p className="text-[11px] text-muted-foreground">Local requests · last 10 min</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold tracking-tight">1.8k</div>
                <div className="text-[11px] font-medium text-primary">↑ 12.4%</div>
              </div>
            </div>
            <div className="mt-4">
              <MiniLineChart data={API_LOAD_SERIES} height={120} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Recent Traces</h3>
              <Link href="/logs" className="text-[11.5px] font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <ul className="space-y-3">
              {RECENT_TRACES.map((t) => (
                <li
                  key={t.id}
                  className="rounded-xl border border-border p-3 transition-all hover:border-primary/40 hover:shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] font-medium text-foreground truncate">
                      {t.route}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${t.status === 'warn' ? 'text-warning' : 'text-primary'}`}
                    >
                      {t.ms}ms
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10.5px] text-muted-foreground overflow-hidden">
                    {t.hops.map((h, i) => (
                      <span key={h} className="flex items-center gap-1">
                        <span className="rounded bg-muted px-1.5 py-0.5 whitespace-nowrap">
                          {h}
                        </span>
                        {i < t.hops.length - 1 && (
                          <span className="text-muted-foreground/60">→</span>
                        )}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  hint,
  trend,
  warning,
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  trend?: React.ReactNode;
  warning?: boolean;
  progress?: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${warning ? 'bg-warning-soft text-warning' : 'bg-primary-soft text-primary'}`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight text-foreground">{value}</span>
        {trend}
      </div>
      <div className="mt-2 text-[11.5px] text-muted-foreground">{hint}</div>
      {typeof progress === 'number' && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
