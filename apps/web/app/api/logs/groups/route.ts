import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MiniStackProvider, LocalStackProvider } from '@ministack-ui/runtime-sdk';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const providerParam = searchParams.get('provider') || 'ministack';

  const provider =
    providerParam === 'localstack' ? new LocalStackProvider() : new MiniStackProvider();

  try {
    const groups = await provider.getLogGroups();
    return NextResponse.json({ data: { groups }, error: null });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to list log groups';
    return NextResponse.json(
      {
        data: null,
        error: { message, code: 'INTERNAL_ERROR' },
      },
      { status: 500 },
    );
  }
}
