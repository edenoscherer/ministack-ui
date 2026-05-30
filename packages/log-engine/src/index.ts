export type { LogEntry } from './types';

export function parseLog(raw: string): string {
  return raw;
}

export function correlateLog(entry: string, correlationId: string): string {
  return `${correlationId}:${entry}`;
}

export function filterLog(entries: string[], predicate: (entry: string) => boolean): string[] {
  return entries.filter(predicate);
}

export function formatLog(entry: string): string {
  return entry;
}
