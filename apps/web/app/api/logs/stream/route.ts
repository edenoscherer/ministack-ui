import type { NextRequest } from 'next/server';
import { MiniStackProvider, LocalStackProvider } from '@ministack-ui/runtime-sdk';
import { parseLog } from '@ministack-ui/log-engine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const providerParam = searchParams.get('provider') || 'ministack';
  const logGroup = searchParams.get('logGroup') || undefined;
  const logStream = searchParams.get('logStream') || undefined;

  // Select the appropriate provider based on parameter
  const provider =
    providerParam === 'localstack' ? new LocalStackProvider() : new MiniStackProvider();

  let unsubscribe: (() => void) | null = null;
  let heartbeatInterval: NodeJS.Timeout | null = null;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Envia sinal inicial de conexão estabelecida
        controller.enqueue(encoder.encode(':connected\n\n'));

        // Subscribe to log stream from runtime-sdk
        unsubscribe = await provider.streamLogs(
          (rawLog: string) => {
            // Parse the raw log line into a structured LogMessage
            const parsedLog = parseLog(rawLog);
            const sseMessage = `data: ${JSON.stringify(parsedLog)}\n\n`;
            controller.enqueue(encoder.encode(sseMessage));
          },
          { logGroup, logStream },
        );

        // Periodic heartbeat keep-alive every 15 seconds
        heartbeatInterval = setInterval(() => {
          controller.enqueue(encoder.encode(':keep-alive\n\n'));
        }, 15000);
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      if (unsubscribe) {
        unsubscribe();
      }
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
