import { useState } from 'react';
import type { JSX } from 'react';

export interface JsonTreeProps {
  data: unknown;
  label?: string;
  isLast?: boolean;
  depth?: number;
  initialExpanded?: boolean;
}

export function JsonTree({
  data,
  label,
  isLast = true,
  depth = 0,
  initialExpanded = false,
}: JsonTreeProps): JSX.Element {
  const [expanded, setExpanded] = useState(initialExpanded || depth < 1);

  const indentStyle = { paddingLeft: `${depth * 16}px` };

  const renderPrimitive = (value: any) => {
    if (value === null)
      return <span className="text-zinc-500 font-semibold select-none">null</span>;
    if (value === undefined)
      return <span className="text-zinc-500 italic select-none">undefined</span>;

    const type = typeof value;
    if (type === 'string') {
      return <span className="text-emerald-400 font-medium">"{value}"</span>;
    }
    if (type === 'number') {
      return <span className="text-amber-400 font-medium">{value}</span>;
    }
    if (type === 'boolean') {
      return (
        <span className="text-indigo-400 font-semibold select-none">
          {value ? 'true' : 'false'}
        </span>
      );
    }
    return <span className="text-zinc-200">{String(value)}</span>;
  };

  const prefix = label ? (
    <span className="text-sky-400 font-semibold mr-1.5 select-none">{label}:</span>
  ) : null;

  if (data === null || typeof data !== 'object') {
    return (
      <div className="font-mono text-sm leading-6 py-0.5 flex flex-wrap" style={indentStyle}>
        {prefix}
        {renderPrimitive(data)}
        {!isLast && <span className="text-zinc-500 select-none mr-1">,</span>}
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const keys = Object.keys(data);
  const isEmpty = keys.length === 0;
  const startBracket = isArray ? '[' : '{';
  const endBracket = isArray ? ']' : '}';

  if (isEmpty) {
    return (
      <div className="font-mono text-sm leading-6 py-0.5 flex" style={indentStyle}>
        {prefix}
        <span className="text-zinc-500 select-none">
          {startBracket}
          {endBracket}
        </span>
        {!isLast && <span className="text-zinc-500 select-none">,</span>}
      </div>
    );
  }

  return (
    <div className="font-mono text-sm leading-6 py-0.5">
      <div
        className="flex items-center cursor-pointer hover:bg-zinc-800/50 rounded-md px-1.5 py-0.5 transition-colors select-none group w-fit"
        onClick={() => setExpanded(!expanded)}
        style={indentStyle}
      >
        <span className="text-zinc-500 w-4 flex items-center justify-center mr-1 text-[9px] transform transition-transform group-hover:text-zinc-300">
          {expanded ? '▼' : '▶'}
        </span>
        {prefix}
        <span className="text-zinc-400 group-hover:text-zinc-300">
          {startBracket}
          {!expanded && (
            <span className="text-[10px] bg-zinc-800 border border-zinc-700 px-1.5 py-0.25 rounded-full mx-1.5 text-zinc-300 font-sans">
              {isArray ? `${keys.length} items` : `${keys.length} keys`}
            </span>
          )}
        </span>
        {!expanded && (
          <span className="text-zinc-400 group-hover:text-zinc-300">
            {endBracket}
            {!isLast && ','}
          </span>
        )}
      </div>

      {expanded && (
        <div className="mt-0.5">
          {keys.map((key, index) => {
            const value = (data as any)[key];
            const isLastItem = index === keys.length - 1;
            return (
              <JsonTree
                key={key}
                data={value}
                label={isArray ? undefined : key}
                isLast={isLastItem}
                depth={depth + 1}
                initialExpanded={initialExpanded}
              />
            );
          })}
          <div className="text-zinc-400 py-0.5" style={indentStyle}>
            <span className="pl-5 select-none">
              {endBracket}
              {!isLast && ','}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
