export type { DistributedEvent } from './types';

export function traceEvent(eventId: string): string {
  return eventId;
}

export function replayEvent(eventId: string): string {
  return eventId;
}

export function buildTimeline(eventIds: string[]): string[] {
  return eventIds;
}

export function linkPayload(eventId: string, payload: unknown): unknown {
  return { eventId, payload };
}
