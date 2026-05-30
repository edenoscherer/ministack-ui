'use client';

import { useState, useEffect } from 'react';
import { LogViewer } from '@ministack-ui/ui';
import { useLogStream } from '../../hooks/useLogStream';
import { useLogStore } from '../../store/useLogStore';

export default function LogsPage() {
  const [provider, setProvider] = useState<'ministack' | 'localstack'>('ministack');

  const { logs, isPaused, togglePause, autoScroll, toggleAutoScroll, clearLogs, connectionStatus } =
    useLogStream(provider);

  const logGroups = useLogStore((s) => s.logGroups);
  const logStreams = useLogStore((s) => s.logStreams);
  const selectedLogGroup = useLogStore((s) => s.selectedLogGroup);
  const selectedLogStream = useLogStore((s) => s.selectedLogStream);
  const setLogGroups = useLogStore((s) => s.setLogGroups);
  const setLogStreams = useLogStore((s) => s.setLogStreams);
  const setSelectedLogGroup = useLogStore((s) => s.setSelectedLogGroup);
  const setSelectedLogStream = useLogStore((s) => s.setSelectedLogStream);
  const isLoadingMetadata = useLogStore((s) => s.isLoadingMetadata);
  const setIsLoadingMetadata = useLogStore((s) => s.setIsLoadingMetadata);

  // Reset selectors when switching providers
  useEffect(() => {
    setSelectedLogGroup('ALL');
    setSelectedLogStream('ALL');
  }, [provider, setSelectedLogGroup, setSelectedLogStream]);

  // Fetch Log Groups when provider changes
  useEffect(() => {
    async function fetchGroups() {
      setIsLoadingMetadata(true);
      try {
        const res = await fetch(`/api/logs/groups?provider=${provider}`);
        const data = await res.json();
        if (data.data?.groups) {
          setLogGroups(data.data.groups);
        }
      } catch (err) {
        console.error('Failed to fetch log groups:', err);
      } finally {
        setIsLoadingMetadata(false);
      }
    }
    fetchGroups();
  }, [provider, setLogGroups, setIsLoadingMetadata]);

  // Fetch Log Streams when selectedLogGroup changes
  useEffect(() => {
    if (selectedLogGroup === 'ALL') {
      setLogStreams([]);
      return;
    }
    async function fetchStreams() {
      setIsLoadingMetadata(true);
      try {
        const res = await fetch(
          `/api/logs/streams?provider=${provider}&logGroup=${encodeURIComponent(selectedLogGroup)}`,
        );
        const data = await res.json();
        if (data.data?.streams) {
          setLogStreams(data.data.streams);
        }
      } catch (err) {
        console.error('Failed to fetch log streams:', err);
      } finally {
        setIsLoadingMetadata(false);
      }
    }
    fetchStreams();
  }, [provider, selectedLogGroup, setLogStreams, setIsLoadingMetadata]);

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
          logGroups={logGroups}
          logStreams={logStreams}
          selectedLogGroup={selectedLogGroup}
          selectedLogStream={selectedLogStream}
          onLogGroupChange={setSelectedLogGroup}
          onLogStreamChange={setSelectedLogStream}
          isLoadingMetadata={isLoadingMetadata}
        />
      </div>
    </div>
  );
}
