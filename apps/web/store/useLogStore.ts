import { create } from 'zustand';
import type { LogMessage, ConnectionStatus } from '@ministack-ui/shared';

interface LogState {
  logs: LogMessage[];
  pendingLogs: LogMessage[];
  isPaused: boolean;
  autoScroll: boolean;
  connectionStatus: ConnectionStatus;

  addLog: (log: LogMessage) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  togglePause: () => void;
  toggleAutoScroll: () => void;
  clearLogs: () => void;
}

const MAX_LOGS_LIMIT = 1000;

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  pendingLogs: [],
  isPaused: false,
  autoScroll: true,
  connectionStatus: 'DISCONNECTED',

  addLog: (log) =>
    set((state) => {
      // Case 1: Stream is paused, queue in pendingLogs buffer
      if (state.isPaused) {
        const updatedPending = [...state.pendingLogs, log];
        // Enforce total 1000 circular limit between logs + pendingLogs
        const totalItems = state.logs.length + updatedPending.length;
        if (totalItems > MAX_LOGS_LIMIT) {
          const overflowCount = totalItems - MAX_LOGS_LIMIT;
          return {
            logs: state.logs.slice(overflowCount),
            pendingLogs: updatedPending,
          };
        }
        return { pendingLogs: updatedPending };
      }

      // Case 2: Stream active, append directly to visible logs
      const updatedLogs = [...state.logs, log];
      if (updatedLogs.length > MAX_LOGS_LIMIT) {
        return { logs: updatedLogs.slice(updatedLogs.length - MAX_LOGS_LIMIT) };
      }
      return { logs: updatedLogs };
    }),

  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

  togglePause: () =>
    set((state) => {
      const nextPaused = !state.isPaused;

      // When resuming, flush the pending background logs into the main list
      if (!nextPaused) {
        const mergedLogs = [...state.logs, ...state.pendingLogs];
        const finalLogs = mergedLogs.slice(Math.max(0, mergedLogs.length - MAX_LOGS_LIMIT));
        return {
          isPaused: nextPaused,
          logs: finalLogs,
          pendingLogs: [],
        };
      }

      return { isPaused: nextPaused };
    }),

  toggleAutoScroll: () => set((state) => ({ autoScroll: !state.autoScroll })),

  clearLogs: () => set({ logs: [], pendingLogs: [] }),
}));
