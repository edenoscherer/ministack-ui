export interface LogViewerProps {
  logs?: string[];
}

export function LogViewer({ logs = [] }: LogViewerProps) {
  return (
    <div className="font-mono text-sm">
      {logs.map((log, i) => (
        <div key={i}>{log}</div>
      ))}
    </div>
  );
}
