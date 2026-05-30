import { useEffect, useRef, useCallback } from 'react';
import { useLogStore } from '../store/useLogStore';

export function useLogStream(provider: 'ministack' | 'localstack' = 'ministack') {
  const addLog = useLogStore((s) => s.addLog);
  const setConnectionStatus = useLogStore((s) => s.setConnectionStatus);
  const clearLogs = useLogStore((s) => s.clearLogs);
  const selectedLogGroup = useLogStore((s) => s.selectedLogGroup);
  const selectedLogStream = useLogStore((s) => s.selectedLogStream);

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionStatus('CONNECTING');

    let url = `/api/logs/stream?provider=${provider}`;
    if (selectedLogGroup && selectedLogGroup !== 'ALL') {
      url += `&logGroup=${encodeURIComponent(selectedLogGroup)}`;
    }
    if (selectedLogStream && selectedLogStream !== 'ALL') {
      url += `&logStream=${encodeURIComponent(selectedLogStream)}`;
    }

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
  }, [provider, addLog, setConnectionStatus, selectedLogGroup, selectedLogStream]);

  useEffect(() => {
    // Clear display buffer when switching provider or stream to keep lists clean
    clearLogs();
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
  }, [connect, clearLogs, setConnectionStatus]);

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
