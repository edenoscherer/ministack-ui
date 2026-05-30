import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/query-client';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'MiniStack UI',
  description: 'Local observability and distributed debugging for AWS-compatible stacks',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
