import React from 'react';

interface Props {
  data: number[];
  height?: number;
  className?: string;
}

export function MiniLineChart({ data, height = 120, className }: Props): React.JSX.Element {
  const w = 320;
  const h = height;
  const pad = 6;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const step = (w - pad * 2) / (data.length - 1);

  const pts = data.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });

  // smooth path
  const d = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const prev = pts[i - 1];
    if (!prev) return acc;
    const [px, py] = prev;
    const cx = (px + x) / 2;
    return `${acc} Q ${cx} ${py}, ${cx} ${(py + y) / 2} T ${x} ${y}`;
  }, '');

  const area = `${d} L ${pad + (data.length - 1) * step} ${h - pad} L ${pad} ${h - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      preserveAspectRatio="none"
      style={{ width: '100%', height }}
    >
      <defs>
        <linearGradient id="lc-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lc-grad)" />
      <path
        d={d}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
