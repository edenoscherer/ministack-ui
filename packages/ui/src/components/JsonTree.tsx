import type { JSX } from 'react';

export interface JsonTreeProps {
  data: unknown;
}

export function JsonTree({ data }: JsonTreeProps): JSX.Element {
  return <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>;
}
