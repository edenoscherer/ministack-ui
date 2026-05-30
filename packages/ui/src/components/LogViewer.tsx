import { useState, useEffect, useRef } from 'react';
import type { JSX } from 'react';
import type { LogMessage, LogLevel, ConnectionStatus } from '@ministack-ui/shared';
import { JsonTree } from './JsonTree';

export interface LogViewerProps {
  logs?: LogMessage[];
  isPaused?: boolean;
  onPauseToggle?: () => void;
  autoScroll?: boolean;
  onAutoScrollToggle?: () => void;
  onClear?: () => void;
  connectionStatus?: ConnectionStatus;
}

const levelStyles: Record<LogLevel, { text: string; bg: string; border: string }> = {
  INFO: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  WARN: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ERROR: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  DEBUG: { text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
};

export function LogViewer({
  logs = [],
  isPaused = false,
  onPauseToggle,
  autoScroll = true,
  onAutoScrollToggle,
  onClear,
  connectionStatus = 'DISCONNECTED',
}: LogViewerProps): JSX.Element {
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<LogMessage | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  // Extract unique services from logs array for dropdown list
  const availableServices = Array.from(new Set(logs.map((log) => log.service))).filter(Boolean);

  // Auto scroll effect
  useEffect(() => {
    if (autoScroll && listRef.current && !isPaused) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [logs, autoScroll, isPaused]);

  // Handle manual scroll to pause auto-scroll if user scrolls up
  const handleScroll = () => {
    if (!listRef.current || !onAutoScrollToggle) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    // Check if user has scrolled away from the bottom (within a threshold of 10px)
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
    if (!isAtBottom && autoScroll) {
      onAutoScrollToggle();
    } else if (isAtBottom && !autoScroll) {
      onAutoScrollToggle();
    }
  };

  // Filtering logic
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchText.toLowerCase()) ||
      log.service.toLowerCase().includes(searchText.toLowerCase());

    const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    const matchesService = selectedService === 'ALL' || log.service === selectedService;

    return matchesSearch && matchesLevel && matchesService;
  });

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return (
        date.toLocaleTimeString('pt-BR', { hour12: false }) +
        '.' +
        String(date.getMilliseconds()).padStart(3, '0')
      );
    } catch {
      return isoString;
    }
  };

  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case 'CONNECTED':
        return 'bg-emerald-500 shadow-emerald-500/50 animate-pulse';
      case 'CONNECTING':
        return 'bg-amber-500 shadow-amber-500/50 animate-bounce';
      case 'DISCONNECTED':
      default:
        return 'bg-red-500 shadow-red-500/50';
    }
  };

  return (
    <div className="flex h-full w-full bg-zinc-950/80 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-md text-zinc-300 font-sans shadow-xl">
      {/* Main logs display area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Controls and filter header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm">
          {/* Status Indicator */}
          <div className="flex items-center gap-2.5">
            <div
              className={`h-3 w-3 rounded-full shadow-[0_0_8px_1px] ${getStatusColor(connectionStatus)}`}
            />
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase select-none">
              {connectionStatus}
            </span>
          </div>

          {/* Filtering inputs */}
          <div className="flex flex-wrap items-center gap-2 flex-1 max-w-2xl min-w-[280px]">
            <input
              type="text"
              placeholder="Buscar logs por mensagem..."
              value={searchText}
              onChange={(e) => setSearchText((e.target as HTMLInputElement).value)}
              className="flex-1 min-w-[150px] bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />

            <select
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel((e.target as HTMLSelectElement).value as LogLevel | 'ALL')
              }
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="ALL">Todos os Níveis</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
              <option value="DEBUG">DEBUG</option>
            </select>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService((e.target as HTMLSelectElement).value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 cursor-pointer max-w-[150px]"
            >
              <option value="ALL">Todos Serviços</option>
              {availableServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPauseToggle}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all select-none border border-zinc-800 ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white'
              }`}
              title={isPaused ? 'Retomar Streaming' : 'Pausar Visualização'}
            >
              <span className="text-[10px]">{isPaused ? '▶' : '⏸'}</span>
              <span>{isPaused ? 'Retomar' : 'Pausar'}</span>
            </button>

            <button
              onClick={onAutoScrollToggle}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all select-none border border-zinc-800 ${
                autoScroll
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/30 hover:bg-sky-500/30'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
              title="Fixar a rolagem automática no fim"
            >
              <span className="text-[8px]">{autoScroll ? '▼' : '▲'}</span>
              <span>Auto-scroll</span>
            </button>

            <button
              onClick={onClear}
              className="p-1.5 px-3 rounded-lg text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all select-none"
              title="Limpar buffer de logs da tela"
            >
              <span>Limpar</span>
            </button>
          </div>
        </div>

        {/* Streaming Logs display list container */}
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="flex-1 p-3 overflow-y-auto font-mono text-xs leading-relaxed space-y-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent select-text"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-zinc-500 select-none py-10">
              Nenhum log correspondente aos filtros foi recebido.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const styles = levelStyles[log.level] || levelStyles.INFO;
              const hasPayload = log.payload !== undefined && log.payload !== null;
              const isSelected = selectedLog?.id === log.id;

              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(isSelected ? null : log)}
                  className={`flex items-start gap-3 py-1 px-2 rounded-md transition-colors cursor-pointer group ${
                    isSelected ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-900/60 text-zinc-300'
                  }`}
                >
                  {/* Timestamp */}
                  <span className="text-zinc-500 select-none flex-shrink-0">
                    {formatTimestamp(log.timestamp)}
                  </span>

                  {/* Severity level tag */}
                  <span
                    className={`inline-block px-1.5 py-0.25 rounded text-[10px] font-bold border flex-shrink-0 tracking-wide select-none ${styles.text} ${styles.bg} ${styles.border}`}
                  >
                    {log.level}
                  </span>

                  {/* Service emitter tag */}
                  <span className="text-sky-400/90 font-semibold select-none flex-shrink-0 bg-sky-950/20 border border-sky-900/10 px-1 py-0.25 rounded">
                    {log.service}
                  </span>

                  {/* Log message */}
                  <span className="break-all flex-1 text-zinc-200">{log.message}</span>

                  {/* Payload expand indicator */}
                  {hasPayload && (
                    <span
                      className={`text-[10px] px-1.5 py-0.25 rounded font-sans border transition-all ${
                        isSelected
                          ? 'bg-sky-500 text-white border-sky-400'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-800 group-hover:text-sky-400 group-hover:border-sky-500/20'
                      }`}
                    >
                      {'{ } Payload'}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Structured log inspection drawer panel (Sidebar) */}
      {selectedLog && (
        <div className="w-[450px] border-l border-zinc-800/80 bg-zinc-900/20 backdrop-blur-lg flex flex-col h-full shadow-2xl relative animate-in slide-in-from-right duration-250 min-w-[320px]">
          {/* Header Panel */}
          <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/40 backdrop-blur-sm select-none">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Inspeção de Log
              </span>
              <span
                className={`px-1.5 py-0.25 rounded text-[10px] font-bold border ${levelStyles[selectedLog.level].text} ${levelStyles[selectedLog.level].bg} ${levelStyles[selectedLog.level].border}`}
              >
                {selectedLog.level}
              </span>
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="h-6 w-6 rounded-md hover:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
              title="Fechar Inspeção"
            >
              ✕
            </button>
          </div>

          {/* Details Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {/* Context details */}
            <div className="space-y-2 border-b border-zinc-800/60 pb-4">
              <div className="text-[11px] flex justify-between">
                <span className="text-zinc-500">ID do Log:</span>
                <span className="font-mono text-zinc-300 break-all select-all">
                  {selectedLog.id}
                </span>
              </div>
              <div className="text-[11px] flex justify-between">
                <span className="text-zinc-500">Timestamp:</span>
                <span className="font-mono text-zinc-300 select-all">{selectedLog.timestamp}</span>
              </div>
              <div className="text-[11px] flex justify-between">
                <span className="text-zinc-500">Serviço:</span>
                <span className="font-mono font-semibold text-sky-400 select-all">
                  {selectedLog.service}
                </span>
              </div>
            </div>

            {/* Message section */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
                Mensagem
              </span>
              <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg font-mono text-xs text-zinc-100 break-words leading-relaxed select-text">
                {selectedLog.message}
              </div>
            </div>

            {/* Payload JSON tree interactive inspection */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
                Payload Estruturado
              </span>
              {selectedLog.payload ? (
                <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-lg overflow-x-auto scrollbar-thin">
                  <JsonTree data={selectedLog.payload} initialExpanded={true} />
                </div>
              ) : (
                <div className="p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-lg text-zinc-500 text-xs italic text-center select-none">
                  Nenhum payload estruturado disponível para este log.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
