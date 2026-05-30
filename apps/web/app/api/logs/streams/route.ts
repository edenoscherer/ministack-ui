import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MiniStackProvider, LocalStackProvider } from '@ministack-ui/runtime-sdk';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const providerParam = searchParams.get('provider') || 'ministack';
  const logGroup = searchParams.get('logGroup');

  if (!logGroup) {
    return NextResponse.json(
      {
        data: null,
        error: { message: 'Missing required parameter: logGroup', code: 'BAD_REQUEST' },
      },
      { status: 400 },
    );
  }

  const provider =
    providerParam === 'localstack' ? new LocalStackProvider() : new MiniStackProvider();

  try {
    const streams = await provider.getLogStreams(logGroup);
    return NextResponse.json({ data: { streams }, error: null });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to list log streams';
    return NextResponse.json(
      {
        data: null,
        error: { message, code: 'INTERNAL_ERROR' },
      },
      { status: 500 },
    );
  }
}
