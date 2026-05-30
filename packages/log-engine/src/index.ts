import type { LogMessage, LogLevel } from '@ministack-ui/shared';

// Matches: 2026-05-30T13:00:00.000Z [INFO] service-name: Message text { "payload": "json" }
const RAW_LOG_REGEX =
  /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)\s+\[(INFO|WARN|ERROR|DEBUG)\]\s+([a-zA-Z0-9_-]+):\s+(.*?)(?:\s+(\{.*\}))?$/i;

export function parseLog(raw: string): LogMessage {
  const trimmed = raw.trim();

  // Case 1: Pure JSON Log
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);

      const id = parsed.id || `log-${Math.random().toString(36).substring(2, 11)}`;
      const timestamp = parsed.timestamp || new Date().toISOString();
      const level = (parsed.level || 'INFO').toUpperCase() as LogLevel;
      const service = parsed.service || 'unknown';
      const message = parsed.message || trimmed;

      // Filter out mapped fields to form the remaining payload
      const { id: _id, timestamp: _t, level: _l, service: _s, message: _m, ...payload } = parsed;

      return {
        id,
        timestamp,
        level,
        service,
        message,
        payload: Object.keys(payload).length > 0 ? payload : undefined,
      };
    } catch (e) {
      // Fall through to regex parser
    }
  }

  // Case 2: Structured Plain Text log via Regex
  const match = trimmed.match(RAW_LOG_REGEX);
  if (match) {
    const timestamp = match[1] || new Date().toISOString();
    const levelStr = match[2] || 'INFO';
    const service = match[3] || 'unknown';
    const message = match[4] || '';
    const rawPayload = match[5];

    const level = levelStr.toUpperCase() as LogLevel;

    let payload: Record<string, any> | undefined = undefined;
    if (rawPayload) {
      try {
        payload = JSON.parse(rawPayload);
      } catch (e) {
        // Ignore malformed payload json
      }
    }

    return {
      id: `log-${Math.random().toString(36).substring(2, 11)}`,
      timestamp,
      level,
      service,
      message,
      payload,
    };
  }

  // Case 3: Flat simple fallback text
  let level: LogLevel = 'INFO';
  if (/error/i.test(trimmed)) level = 'ERROR';
  else if (/warn/i.test(trimmed)) level = 'WARN';
  else if (/debug/i.test(trimmed)) level = 'DEBUG';

  let timestamp = new Date().toISOString();
  let message = trimmed;

  const dateMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)\s*(.*)/i);
  if (dateMatch) {
    try {
      const matchedDate = dateMatch[1];
      if (matchedDate) {
        timestamp = new Date(matchedDate).toISOString();
        message = dateMatch[2] || trimmed;
      }
    } catch {
      // Ignore date parsing failure
    }
  }

  return {
    id: `log-${Math.random().toString(36).substring(2, 11)}`,
    timestamp,
    level,
    service: 'system',
    message,
  };
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
