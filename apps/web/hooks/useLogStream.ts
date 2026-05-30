import { useEffect, useRef } from 'react';
import { useLogStore } from '../store/useLogStore';

export function useLogStream(provider: 'ministack' | 'localstack' = 'ministack') {
  const addLog = useLogStore((s) => s.addLog);
  const setConnectionStatus = useLogStore((s) => s.setConnectionStatus);
  const clearLogs = useLogStore((s) => s.clearLogs);

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Clear display buffer when switching provider to keep lists clean
    clearLogs();

    function connect() {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      setConnectionStatus('CONNECTING');

      const url = `/api/logs/stream?provider=${provider}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onopen = () => {
        setConnectionStatus('CONNECTED');
      };

      es.onmessage = (event) => {
        try {
          if (!event.data) return;
          const parsedLog = JSON.parse(event.data);
          addLog(parsedLog);
        } catch (error) {
          console.error('Error parsing SSE log message:', error);
        }
      };

      es.onerror = () => {
        setConnectionStatus('DISCONNECTED');
        es.close();

        // Schedule resilient automatic reconnection in 3 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };
    }

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      setConnectionStatus('DISCONNECTED');
    };
  }, [provider, addLog, setConnectionStatus, clearLogs]);

  // Return reactive states and callbacks to be bound directly in LogViewer
  return {
    logs: useLogStore((s) => s.logs),
    isPaused: useLogStore((s) => s.isPaused),
    togglePause: useLogStore((s) => s.togglePause),
    autoScroll: useLogStore((s) => s.autoScroll),
    toggleAutoScroll: useLogStore((s) => s.toggleAutoScroll),
    clearLogs: useLogStore((s) => s.clearLogs),
    connectionStatus: useLogStore((s) => s.connectionStatus),
  };
}
