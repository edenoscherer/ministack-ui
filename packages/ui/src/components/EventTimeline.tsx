export interface TimelineEvent {
  id: string;
  label: string;
  timestamp: Date;
}

export interface EventTimelineProps {
  events?: TimelineEvent[];
}

export function EventTimeline({ events = [] }: EventTimelineProps) {
  return (
    <ul className="space-y-2">
      {events.map((e) => (
        <li key={e.id} className="text-sm">
          {e.label}
        </li>
      ))}
    </ul>
  );
}
