import type { LogMessage, LogLevel } from '@ministack-ui/shared';

// Matches: 2026-05-30T13:00:00.000Z [INFO] service-name: Message text { "payload": "json" }
// Case-sensitive exact regex to reduce backtracking complexity and avoid duplicate class alerts
const RAW_LOG_REGEX =
  /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)\s+\[(INFO|WARN|ERROR|DEBUG|info|warn|error|debug)\]\s+([a-zA-Z0-9_-]+):\s+(.*?)(?:\s+(\{.*\}))?$/;

function parseJsonLog(trimmed: string): LogMessage | null {
  if (!(trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    return null;
  }
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
    // Return null on failure to allow falling back to regex parser
    return null;
  }
}

function parseRegexLog(trimmed: string): LogMessage | null {
  const match = RAW_LOG_REGEX.exec(trimmed);
  if (!match) {
    return null;
  }

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
      // Return payload as undefined if payload is malformed JSON
      payload = undefined;
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

function parseFallbackLog(trimmed: string): LogMessage {
  let level: LogLevel = 'INFO';
  if (/error/i.test(trimmed)) level = 'ERROR';
  else if (/warn/i.test(trimmed)) level = 'WARN';
  else if (/debug/i.test(trimmed)) level = 'DEBUG';

  let timestamp = new Date().toISOString();
  let message = trimmed;

  const dateMatch = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)\s*(.*)/.exec(trimmed);
  if (dateMatch) {
    try {
      const matchedDate = dateMatch[1];
      if (matchedDate) {
        timestamp = new Date(matchedDate).toISOString();
        message = dateMatch[2] || trimmed;
      }
    } catch (e) {
      // Keep initial timestamp if date parsing throws error
      timestamp = new Date().toISOString();
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

export function parseLog(raw: string): LogMessage {
  const trimmed = raw.trim();

  const jsonLog = parseJsonLog(trimmed);
  if (jsonLog) return jsonLog;

  const regexLog = parseRegexLog(trimmed);
  if (regexLog) return regexLog;

  return parseFallbackLog(trimmed);
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
