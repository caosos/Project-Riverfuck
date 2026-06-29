import Link from 'next/link';
import { PublicNav, Metric } from '@/components/ui';

const moments: { kicker: string; title: string; sub: string; bg: string }[] = [
  { kicker: 'Chapter 01', title: 'The first real conversation', sub: 'Not small talk — the kind that actually goes somewhere.', bg: 'linear-gradient(135deg,#1f5f55,#0d2b27)' },
  { kicker: 'Chapter 02', title: 'Walking in the park', sub: 'Unhurried hours where you forget to check your phone.', bg: 'linear-gradient(135deg,#3a6f3a,#16361f)' },
  { kicker: 'Chapter 03', title: 'Cooking together', sub: 'A small kitchen, two people, no audience.', bg: 'linear-gradient(135deg,#a46c35,#5a3413)' },
  { kicker: 'Chapter 04', title: 'Laughing until it hurts', sub: 'The same humor, finally pointed the same direction.', bg: 'linear-gradient(135deg,#c2693f,#5e2418)' },
  { kicker: 'Chapter 05', title: 'Meeting the family', sub: 'Being chosen, and choosing back, out loud.', bg: 'linear-gradient(135deg,#5b6cb5,#222a52)' },
  { kicker: 'Chapter 06', title: 'Nieces, nephews, Sunday noise', sub: 'Fitting into a life that was already full.', bg: 'linear-gradient(135deg,#9a5ba6,#3a1f47)' },
  { kicker: 'Chapter 07', title: 'Helping with the project', sub: 'Showing up for the unglamorous parts.', bg: 'linear-gradient(135deg,#2f7d8a,#123238)' },
  { kicker: 'Chapter 08', title: 'A thoughtful gift', sub: 'Proof that someone was paying attention.', bg: 'linear-gradient(135deg,#b5485f,#4a1726)' },
  { kicker: 'Chapter 09', title: 'Building a future together', sub: 'The long version of the story, on purpose.', bg: 'linear-gradient(135deg,#17332f,#0a1714)' },
];

const previewTurns = [
  { who: 'Interviewer', text: 'You do not need to impress me — I am not your match. My job is to understand you accurately enough to search for someone who could actually work for you. What does a good week look like for you right now?' },
  { who: 'You', text: 'Busy but steady. I need closeness, but I also need real solitude after work to reset.' },
  { who: 'Interviewer', text: "Noted — closeness with a protected recharge window. That's a compatibility detail, not a flaw. We've covered values well; we haven't touched conflict and repair yet. When something goes wrong with someone you love, what do you do first?" },
];

export default function Home() {
  return (
    <>
      <PublicNav />
      <main className="mx-auto max-w-6xl p-6">
        {/* 1. Hero */}
        <section className="grid items-center gap-8 py-16 md:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="label">No swipes. No public browsing. No engagement games.</p>
            <h1 className="mt-4 text-6xl font-black tracking-[-.06em]">Find someone who actually fits.</h1>
            <p className="mt-6 text-xl text-stone-600">Private AI-guided compatibility matching built on conversation, trust, and evidence — not swipes, public profiles, or engagement games.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn" href="/app/interview">Start your private AI profile</Link>
              <Link className="btn secondary" href="#how-it-works">See how it works</Link>
            </div>
            <p className="mt-4 text-sm text-stone-500">Prototype preview. A private interview builds your model — it is never published for browsing.</p>
          </div>
          <div className="card p-6">
            <p className="label">Current prototype center</p>
            <h2 className="mt-3 text-3xl font-black">AI interview → private compatibility model → readiness check.</h2>
            <p className="mt-4 text-stone-600">One strong recommendation is better than many weak matches. If confidence is low, the system says so instead of pushing a weak match.</p>
          </div>
        </section>

        {/* 2. Life Moment Carousel / video reel */}
        <section className="py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="label">Life-moment reel</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-.04em]">What we are actually optimizing for.</h2>
            </div>
            <p className="hidden max-w-xs text-sm text-stone-500 md:block">Not a profile grid — the real life on the other side of a good match. Stylized placeholders.</p>
          </div>
          <div className="reel" role="list" aria-label="Life moments this product is built for">
            <div className="reel-track">
              {[...moments, ...moments].map((m, i) => (
                <article role="listitem" aria-hidden={i >= moments.length} className="moment" key={i} style={{ background: m.bg }}>
                  <span className="moment-dot" aria-hidden />
                  <span className="moment-kicker">{m.kicker}</span>
                  <h3 className="moment-title">{m.title}</h3>
                  <p className="moment-sub">{m.sub}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 3. How it works */}
        <section id="how-it-works" className="py-12">
          <p className="label">How it works</p>
          <h2 className="mt-2 text-4xl font-black tracking-[-.05em]">Conversation in. Compatibility model out.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              { n: '01', t: 'Private AI interview', d: 'You talk to a calm interviewer, not a flirt bot. No performance, no audience.' },
              { n: '02', t: 'Evidence-based model', d: 'The system writes a private compatibility model from what you actually say, and you can correct it.' },
              { n: '03', t: 'Trust & readiness', d: 'Identity, availability, and topic coverage are checked before anyone is matched.' },
              { n: '04', t: 'Controlled reveal', d: 'Only when a recommendation is strong do two people meet — gradually, not on display.' },
            ].map((s) => (
              <div className="card p-5" key={s.n}>
                <p className="label">{s.n}</p>
                <h3 className="mt-2 text-xl font-black">{s.t}</h3>
                <p className="mt-2 text-sm text-stone-600">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Why dating apps fail */}
        <section className="py-12">
          <p className="label">Why dating apps fail</p>
          <h2 className="mt-2 text-4xl font-black tracking-[-.05em]">The format is the problem.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { t: 'They sell browsing, not fit', d: 'Endless grids reward attention, not compatibility. The product wins when you keep scrolling, not when you leave.' },
              { t: 'They lead with attraction only', d: 'A face tells you almost nothing about values, conflict style, or whether a life fits together.' },
              { t: 'They hide the hard truths', d: 'Unavailability, mismatched intent, and dealbreakers surface months in — after the time is already spent.' },
            ].map((s) => (
              <div className="card p-5" key={s.t}>
                <h3 className="text-xl font-black">{s.t}</h3>
                <p className="mt-2 text-sm text-stone-600">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. What we measure */}
        <section className="py-12">
          <p className="label">What we measure</p>
          <h2 className="mt-2 text-4xl font-black tracking-[-.05em]">Compatibility is more than one category.</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {['Relationship intent', 'Values & worldview', 'Communication style', 'Conflict & repair', 'Emotional regulation', 'Family & children', 'Lifestyle & routine', 'Work & money', 'Health & substances', 'Intimacy & boundaries', 'Attraction (as one category)', 'Dealbreakers & hard requirements', 'Trust & verification', 'Topic coverage'].map((c) => (
              <span className="pill" key={c}>{c}</span>
            ))}
          </div>
          <p className="mt-4 max-w-2xl text-sm text-stone-600">Attraction is treated as one structured category among many — a floor, not a ranking ladder. Hard requirements and dealbreakers can override an otherwise strong match.</p>
        </section>

        {/* 6. Simulated prototype metrics */}
        <section className="py-12">
          <div className="flex items-center gap-3">
            <p className="label">Simulated prototype metrics</p>
            <span className="pill">Simulated · not real outcomes</span>
          </div>
          <h2 className="mt-2 text-4xl font-black tracking-[-.05em]">How the model talks about confidence.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Metric label="Profile confidence" value="68%" help="Simulated: how well the system understands a user." />
            <Metric label="Pool probability" value="46%" help="Simulated: likelihood within constraints — not a success promise." />
            <Metric label="Recommendation confidence" value="Pending" help="Simulated: no candidate is surfaced before evidence supports it." />
          </div>
          <p className="mt-4 text-sm text-stone-500">These figures are illustrative prototype values for demonstration only. They are not real match outcomes and make no success claims.</p>
        </section>

        {/* 7. AI conversation preview */}
        <section className="py-12">
          <p className="label">AI conversation preview</p>
          <h2 className="mt-2 text-4xl font-black tracking-[-.05em]">A glimpse of the interview.</h2>
          <div className="mt-8 grid gap-3 md:max-w-3xl">
            {previewTurns.map((t, i) => (
              <div key={i} className={`rounded-2xl p-4 ${t.who === 'Interviewer' ? 'bg-[#17332f] text-white' : 'bg-stone-100'}`}>
                <p className="label" style={{ color: t.who === 'Interviewer' ? '#9fc6bd' : undefined }}>{t.who}</p>
                <p className="mt-1">{t.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link className="btn" href="/app/interview">Start your private AI profile</Link>
          </div>
        </section>

        {/* 8. Beta CTA */}
        <section className="py-12">
          <div className="card grid gap-4 p-8 md:grid-cols-[1.3fr_.7fr] md:items-center">
            <div>
              <p className="label">Private beta</p>
              <h2 className="mt-2 text-4xl font-black tracking-[-.05em]">Build your private model before you meet anyone.</h2>
              <p className="mt-3 text-stone-600">No public profile. No swiping. Just a conversation that does the work of a hundred bad first dates.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link className="btn" href="/app/interview">Start your private AI profile</Link>
              <Link className="btn secondary" href="/trust-safety">Read trust &amp; safety</Link>
            </div>
          </div>
        </section>

        {/* 9. Footer */}
        <footer className="mt-12 border-t border-stone-200 py-10 text-sm text-stone-500">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-black tracking-[-.04em] text-stone-700">Private Compatibility Engine</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/how-it-works">How it works</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/trust-safety">Trust &amp; safety</Link>
              <Link href="/app">Open prototype</Link>
            </div>
          </div>
          <p className="mt-6 max-w-2xl">Prototype build. Imagery is stylized placeholder art. Metrics shown are simulated and do not represent real match outcomes. No real user data is displayed.</p>
        </footer>
      </main>
    </>
  );
}
