export interface DistributedEvent {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
  correlationId: string;
  payload: unknown;
  linkedEvents?: string[];
}
