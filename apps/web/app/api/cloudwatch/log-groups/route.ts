import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MiniStackProvider, LocalStackProvider } from '@ministack-ui/runtime-sdk';

function getProvider(param: string | null) {
  return param === 'localstack' ? new LocalStackProvider() : new MiniStackProvider();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = getProvider(searchParams.get('provider'));

  try {
    const groups = await provider.getLogGroupsWithMetadata();
    return NextResponse.json({ data: { groups }, error: null });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to list log groups';
    return NextResponse.json(
      { data: null, error: { message, code: 'INTERNAL_ERROR' } },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      retentionDays,
      provider: providerParam,
    } = body as {
      name: string;
      retentionDays?: number | null;
      provider?: string;
    };

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { data: null, error: { message: 'name is required', code: 'VALIDATION_ERROR' } },
        { status: 400 },
      );
    }

    const provider = getProvider(providerParam ?? null);
    const group = await provider.createLogGroup(name, retentionDays);
    return NextResponse.json({ data: { group }, error: null }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create log group';
    return NextResponse.json(
      { data: null, error: { message, code: 'INTERNAL_ERROR' } },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const providerParam = searchParams.get('provider');

  if (!name) {
    return NextResponse.json(
      { data: null, error: { message: 'name query param is required', code: 'VALIDATION_ERROR' } },
      { status: 400 },
    );
  }

  try {
    const provider = getProvider(providerParam);
    await provider.deleteLogGroup(name);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete log group';
    return NextResponse.json(
      { data: null, error: { message, code: 'INTERNAL_ERROR' } },
      { status: 500 },
    );
  }
}
