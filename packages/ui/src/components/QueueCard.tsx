export interface QueueCardProps {
  name: string;
  messageCount?: number;
}

export function QueueCard({ name, messageCount = 0 }: QueueCardProps) {
  return (
    <div className="rounded border p-4">
      <h3 className="font-medium">{name}</h3>
      <span className="text-sm text-gray-500">{messageCount} messages</span>
    </div>
  );
}
