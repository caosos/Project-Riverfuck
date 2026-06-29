import { NextResponse } from 'next/server';
import { getLabDetail } from '@/lib/match-lab';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id query parameter required' }, { status: 400 });
  }
  const detail = getLabDetail(id);
  if (!detail) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  return NextResponse.json(detail);
}
