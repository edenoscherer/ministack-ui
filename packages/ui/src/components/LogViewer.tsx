import type { JSX } from 'react';

export interface LogLine {
  id: string;
  text: string;
  level?: 'debug' | 'info' | 'warn' | 'error';
}

export interface LogViewerProps {
  logs?: LogLine[];
}

const levelClass: Record<NonNullable<LogLine['level']>, string> = {
  debug: 'text-muted-foreground',
  info: 'text-foreground',
  warn: 'text-yellow-500',
  error: 'text-red-500',
};

export function LogViewer({ logs = [] }: LogViewerProps): JSX.Element {
  return (
    <div className="font-mono text-sm">
      {logs.map((log) => (
        <div key={log.id} className={levelClass[log.level ?? 'info']}>
          {log.text}
        </div>
      ))}
    </div>
  );
}
