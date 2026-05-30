import React from 'react';
import { Database, Zap, Inbox, Megaphone, HardDrive, KeyRound } from 'lucide-react';

export type ServiceType = 'lambda' | 'sqs' | 'sns' | 's3' | 'dynamodb' | 'secrets';

const map = {
  lambda: { icon: Zap, color: 'text-[oklch(0.65_0.18_70)]', bg: 'bg-warning-soft' },
  sqs: { icon: Inbox, color: 'text-info', bg: 'bg-info-soft' },
  sns: { icon: Megaphone, color: 'text-[oklch(0.6_0.22_300)]', bg: 'bg-[oklch(0.96_0.04_300)]' },
  s3: { icon: HardDrive, color: 'text-primary', bg: 'bg-primary-soft' },
  dynamodb: { icon: Database, color: 'text-[oklch(0.55_0.18_240)]', bg: 'bg-info-soft' },
  secrets: { icon: KeyRound, color: 'text-muted-foreground', bg: 'bg-muted' },
} as const;

export function ServiceIcon({
  type,
  size = 'md',
}: {
  type: ServiceType;
  size?: 'sm' | 'md';
}): React.JSX.Element {
  const cfg = map[type] || map.lambda;
  const Icon = cfg.icon;
  const dim = size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-10 w-10 rounded-xl';
  const ic = size === 'sm' ? 'h-4 w-4' : 'h-4.5 w-4.5';
  return (
    <div className={`flex ${dim} items-center justify-center ${cfg.bg}`}>
      <Icon className={`${ic} ${cfg.color}`} strokeWidth={2} />
    </div>
  );
}
