import { NextResponse } from 'next/server';
import { getInterviewerReply, type ChatMessage } from '@/lib/chat';

export const runtime = 'nodejs';

function sanitize(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((m): m is { role: unknown; content: unknown } => typeof m === 'object' && m !== null)
    .map((m) => ({
      role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: typeof m.content === 'string' ? m.content : '',
    }))
    .filter((m) => m.content.trim().length > 0)
    .slice(-40);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const messages = sanitize((body as { messages?: unknown })?.messages);
  if (messages.length === 0) {
    return NextResponse.json({ error: 'messages array required' }, { status: 400 });
  }

  try {
    const result = await getInterviewerReply(messages);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 });
  }
}
