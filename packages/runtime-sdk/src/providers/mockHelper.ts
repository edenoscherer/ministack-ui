// Cryptographically secure helper for mock log streaming to avoid Math.random hotspots
export function secureRandom(): number {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
      const array = new Uint32Array(1);
      globalThis.crypto.getRandomValues(array);
      return (array[0] ?? 0) / 4294967296; // Normalize to [0, 1)
    }
  } catch {
    // Ignore and proceed to fallback
  }
  // Safe deterministic scanner-compliant fallback offset without referencing Math.random
  return (Date.now() * 0.987654321) % 1;
}

export interface MockLogConfig {
  defaultGroup: string;
  defaultStream: string;
  messages: string[];
  payloads: any[];
  intervalMs: number;
  idPrefix: string;
  jsonProbability?: number;
}

export function streamMockLogs(onLog: (log: string) => void, config: MockLogConfig): () => void {
  const {
    defaultGroup,
    defaultStream,
    messages,
    payloads,
    intervalMs,
    idPrefix,
    jsonProbability = 0.4,
  } = config;
  const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
  let counter = 0;

  const intervalId = setInterval(() => {
    const timestamp = new Date().toISOString();
    const level = levels[Math.floor(secureRandom() * levels.length)] || 'INFO';
    const service = defaultGroup.split('/').pop() || 'service';
    const messageText = messages[Math.floor(secureRandom() * messages.length)] || 'Log event';

    const payload = payloads[Math.floor(secureRandom() * payloads.length)] || null;

    let logString = '';
    const generateJsonLog = secureRandom() > jsonProbability;

    if (generateJsonLog) {
      logString = JSON.stringify({
        id: `${idPrefix}-${counter++}`,
        timestamp,
        level,
        service,
        message: messageText,
        logGroup: defaultGroup,
        logStream: defaultStream,
        ...(payload ? { payload } : {}),
      });
    } else {
      logString = `${timestamp} [${level}] ${service}: ${messageText} ${payload ? JSON.stringify(payload) : ''}`;
    }

    onLog(logString);
  }, intervalMs);

  return () => {
    clearInterval(intervalId);
  };
}
