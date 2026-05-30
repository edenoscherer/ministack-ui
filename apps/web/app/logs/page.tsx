'use client';

import { useState } from 'react';
import { LogViewer } from '@ministack-ui/ui';
import { useLogStream } from '../../hooks/useLogStream';

export default function LogsPage() {
  const [provider, setProvider] = useState<'ministack' | 'localstack'>('ministack');

  const { logs, isPaused, togglePause, autoScroll, toggleAutoScroll, clearLogs, connectionStatus } =
    useLogStream(provider);

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-zinc-100 p-6 overflow-hidden">
      {/* Dashboard Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 select-none flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Runtime Inspector
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Observe e inspecione logs estruturados de runtime e serviços em tempo real.
          </p>
        </div>

        {/* Runtime Switcher Tabs */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
          <button
            onClick={() => setProvider('ministack')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              provider === 'ministack'
                ? 'bg-zinc-800 text-white shadow-md border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            MiniStack Local
          </button>
          <button
            onClick={() => setProvider('localstack')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              provider === 'localstack'
                ? 'bg-zinc-800 text-white shadow-md border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            LocalStack Container
          </button>
        </div>
      </div>

      {/* Main LogViewer Integration */}
      <div className="flex-1 min-h-0 relative">
        <LogViewer
          logs={logs}
          isPaused={isPaused}
          onPauseToggle={togglePause}
          autoScroll={autoScroll}
          onAutoScrollToggle={toggleAutoScroll}
          onClear={clearLogs}
          connectionStatus={connectionStatus}
        />
      </div>
    </div>
  );
}
