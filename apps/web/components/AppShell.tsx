'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ScrollText, Search, Bell, Box, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  searchPlaceholder?: string;
}

export function AppShell({
  children,
  searchPlaceholder = 'Search services, logs, correlation IDs...',
}: Props): React.JSX.Element {
  const pathname = usePathname();
  const isActive = (p: string) => (p === '/' ? pathname === '/' : pathname.startsWith(p));

  const items = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/logs', label: 'Realtime Logs', icon: ScrollText },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-card">
            <Box className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-[15px] text-foreground tracking-tight">
              MiniStack UI
            </div>
            <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
              Observability
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5">
          <div className="px-3 pb-2 text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
            Workspace
          </div>
          <ul className="space-y-1">
            {items.map((it) => {
              const active = isActive(it.to);
              const Icon = it.icon;
              return (
                <li key={it.to}>
                  <Link
                    href={it.to}
                    className={[
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                      active
                        ? 'bg-primary-soft text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    ].join(' ')}
                  >
                    <Icon
                      className={`h-4 w-4 ${active ? 'text-primary' : ''}`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    <span>{it.label}</span>
                    {it.to === '/logs' && (
                      <span className="ml-auto inline-flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="m-3 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
            <div className="text-sm font-medium">Local Runtime</div>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Region us-east-1 · Port 4566</div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[64%] rounded-full bg-primary" />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
            <span>Memory 64%</span>
            <span>2.1/4 GB</span>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 md:px-8 backdrop-blur-md">
          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            MiniStack Active
          </div>

          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
          </button>

          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card pl-1 pr-3 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.55_0.14_180)] text-xs font-semibold text-primary-foreground">
              DV
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-[13px] font-medium">dev@local</div>
              <div className="text-[10.5px] text-muted-foreground">local · dev</div>
            </div>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}
