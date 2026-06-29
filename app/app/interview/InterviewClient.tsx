'use client';

import { useEffect, useRef, useState } from 'react';
import { interviewIntro, type ChatMessage } from '@/lib/chat';

type Meta = { currentTopic: string; learning: string[]; gaps: string[]; provider: 'anthropic' | 'mock' };

const INITIAL_MESSAGES: ChatMessage[] = [{ role: 'assistant', content: interviewIntro() }];
const INITIAL_META: Meta = {
  currentTopic: 'Relationship intent',
  learning: ['Listening — nothing recorded into your model yet.'],
  gaps: ['Values and worldview', 'Communication style', 'Conflict and repair'],
  provider: 'mock',
};

export default function InterviewClient() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [meta, setMeta] = useState<Meta>(INITIAL_META);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
      setMeta({ currentTopic: data.currentTopic, learning: data.learning, gaps: data.gaps, provider: data.provider });
    } catch {
      setError('Could not reach the interviewer. Your last message was kept — try sending again.');
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter adds a newline. The Send button is the primary path.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="card flex flex-col p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="pill">Current topic: {meta.currentTopic}</span>
          <span className="pill">{meta.provider === 'anthropic' ? 'Live AI' : 'Mock interviewer (no API key)'}</span>
        </div>

        <div ref={scrollRef} className="grid max-h-[460px] gap-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 ${m.role === 'assistant' ? 'bg-[#17332f] text-white' : 'bg-stone-100'}`}
            >
              <p className="label" style={{ color: m.role === 'assistant' ? '#9fc6bd' : undefined }}>
                {m.role === 'assistant' ? 'Interviewer' : 'You'}
              </p>
              <p className="mt-1 whitespace-pre-wrap">{m.content}</p>
            </div>
          ))}
          {sending && <div className="rounded-2xl bg-stone-100 p-4 text-stone-500">Interviewer is thinking…</div>}
        </div>

        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

        <div className="mt-4">
          <textarea
            className="min-h-28 w-full rounded-2xl border border-stone-200 p-4"
            placeholder="Answer in your own words… (Enter to send, Shift+Enter for a new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={sending}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-sm text-stone-500">Text-first by design. Nothing here is published or browsable.</p>
            <button className="btn" onClick={send} disabled={sending || !input.trim()}>
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </div>
      </section>

      <aside className="grid gap-4">
        <div className="card p-5">
          <p className="label">What I&apos;m learning</p>
          <ul className="mt-3 grid gap-2 text-sm text-stone-700">
            {meta.learning.map((l, i) => (
              <li key={i}>• {l}</li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <p className="label">Topic gaps</p>
          <p className="mt-1 text-sm text-stone-500">Areas the model still needs before matching.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {meta.gaps.map((g, i) => (
              <span className="pill" key={i}>
                {g}
              </span>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <p className="label">Why this works</p>
          <p className="mt-2 text-sm text-stone-600">
            The conversation is the profile. Every answer becomes private evidence the system can model — and you can correct
            it at any time. It is never shown to your matches.
          </p>
        </div>
      </aside>
    </div>
  );
}
