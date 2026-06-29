// Text-first AI compatibility interviewer.
//
// Provider abstraction: if an Anthropic API key is configured, real model
// responses are used; otherwise a strong deterministic mock interviewer keeps
// the prototype fully functional offline. The mock and the real provider return
// the same shape, so the UI never needs to know which one answered.

export type ChatRole = 'user' | 'assistant';
export type ChatMessage = { role: ChatRole; content: string };

export type InterviewState = {
  currentTopic: string;
  learning: string[];
  gaps: string[];
};

export type InterviewReply = InterviewState & {
  reply: string;
  provider: 'anthropic' | 'mock';
};

// The interview walks structured compatibility territory in a natural order.
const TOPIC_FLOW: { topic: string; question: string; learns: string }[] = [
  { topic: 'Relationship intent', question: 'Are you looking for something serious and long-term, and is marriage part of the picture or beside the point for you?', learns: 'what kind of relationship you actually want' },
  { topic: 'Values and worldview', question: 'What are the values you could not build a life with someone who lacked?', learns: 'the values you treat as non-negotiable' },
  { topic: 'Communication style', question: 'When something matters to you, do you say it plainly, or do you tend to soften it first?', learns: 'how you communicate when it counts' },
  { topic: 'Conflict and repair', question: 'When something goes wrong with someone you love, what do you do first — push toward it, or step back?', learns: 'how you handle conflict and repair' },
  { topic: 'Emotional regulation', question: 'Under real stress, do you tend to get louder, go quiet, or need time before you can talk?', learns: 'how you regulate under stress' },
  { topic: 'Family and children', question: 'Where do you land on children — wanting them, done, undecided — and how firm is that?', learns: 'your stance on family and children' },
  { topic: 'Lifestyle and routine', question: 'Walk me through an ordinary week. How much of it is structure versus spontaneity?', learns: 'the rhythm of your daily life' },
  { topic: 'Intimacy and boundaries', question: 'How important is physical closeness to you, and where are your boundaries firm?', learns: 'your needs and boundaries around intimacy' },
  { topic: 'Dealbreakers', question: 'What is the behavior or situation that would end things for you, no matter how good everything else was?', learns: 'your hard dealbreakers' },
];

const INTRO =
  'You do not need to impress me — I am not your match. My job is to understand you accurately enough to search for someone who could actually work for you. Nothing here is published or browsable. ' +
  TOPIC_FLOW[0].question;

export function interviewIntro(): string {
  return INTRO;
}

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const SYSTEM_PROMPT =
  'You are a private compatibility interviewer for a serious relationship-matching service. ' +
  'You are NOT the user\'s match and you do not flirt. You are calm, precise, and high-trust. ' +
  'Your job is to understand the user accurately enough to find someone genuinely compatible. ' +
  'In every reply: (1) briefly reflect back what you just learned in one sentence so the user feels understood, ' +
  '(2) note if you noticed a gap or contradiction, and (3) ask exactly one natural follow-up question. ' +
  'Walk through relationship intent, values, communication, conflict and repair, emotional regulation, family and children, ' +
  'lifestyle, intimacy and boundaries, and dealbreakers over the course of the conversation. ' +
  'Never push a match, never rate the user, never use dating-app language like "swipe" or "hot". ' +
  'Keep replies to 2-4 sentences. Remind the user, when natural, that this conversation is what builds their private profile.';

// Count how many substantive answers the user has given so far.
function userTurns(messages: ChatMessage[]): number {
  return messages.filter((m) => m.role === 'user' && m.content.trim().length > 0).length;
}

// Derive interview progress deterministically from the transcript. This drives
// the side panels ("what I'm learning" / "topic gaps") regardless of provider.
export function deriveInterviewState(messages: ChatMessage[]): InterviewState {
  const answered = userTurns(messages);
  const idx = Math.min(answered, TOPIC_FLOW.length - 1);
  const currentTopic = answered >= TOPIC_FLOW.length ? 'Synthesis and corrections' : TOPIC_FLOW[idx].topic;

  const learning = TOPIC_FLOW.slice(0, Math.min(answered, TOPIC_FLOW.length)).map(
    (t) => `Captured ${t.learns}.`,
  );
  if (learning.length === 0) learning.push('Listening — nothing recorded into your model yet.');

  const gaps = TOPIC_FLOW.slice(Math.min(answered, TOPIC_FLOW.length)).map((t) => t.topic);
  if (gaps.length === 0) gaps.push('Core topics covered — depth and corrections remain.');

  return { currentTopic, learning, gaps };
}

function firstSentence(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, ' ');
  const match = cleaned.match(/^(.{0,140}?[.!?])(\s|$)/);
  return (match ? match[1] : cleaned.slice(0, 140)).trim();
}

// Strong deterministic interviewer used when no API key is configured.
function mockReply(messages: ChatMessage[], state: InterviewState): string {
  const answered = userTurns(messages);
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content?.trim() ?? '';

  if (answered === 0 || !lastUser) {
    return interviewIntro();
  }

  const reflection = `Noted — "${firstSentence(lastUser)}" That tells me something real about you, and it goes into your private model, not on display anywhere.`;

  const next = answered < TOPIC_FLOW.length ? TOPIC_FLOW[answered] : null;
  if (next) {
    const gapNote =
      answered >= 2
        ? ` We still haven't touched ${state.gaps[0]?.toLowerCase() ?? 'a few areas'}, so let's go there.`
        : '';
    return `${reflection}${gapNote} ${next.question}`;
  }

  return `${reflection} We've now covered the core territory — intent, values, communication, conflict, regulation, family, lifestyle, intimacy, and dealbreakers. If anything I summarized felt slightly off, tell me now and I'll correct your model; otherwise, what feels most important that I haven't asked about?`;
}

async function anthropicReply(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY as string;
  const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) {
    throw new Error(`Anthropic API error ${res.status}`);
  }
  const data: { content?: { type: string; text?: string }[] } = await res.json();
  const text = (data.content ?? [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('')
    .trim();
  if (!text) throw new Error('Empty response from Anthropic API');
  return text;
}

// Provider entry point. Always returns a usable reply: if the real provider is
// unavailable or fails, it falls back to the deterministic mock interviewer.
export async function getInterviewerReply(messages: ChatMessage[]): Promise<InterviewReply> {
  const state = deriveInterviewState(messages);
  if (hasApiKey()) {
    try {
      const reply = await anthropicReply(messages);
      return { reply, provider: 'anthropic', ...state };
    } catch {
      // fall through to mock on any provider failure
    }
  }
  return { reply: mockReply(messages, state), provider: 'mock', ...state };
}
