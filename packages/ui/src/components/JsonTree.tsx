export interface JsonTreeProps {
  data: unknown;
}

export function JsonTree({ data }: JsonTreeProps) {
  return <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>;
}
