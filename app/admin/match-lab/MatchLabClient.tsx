'use client';

import { useMemo, useState } from 'react';
import type { FilterOptions, LabDetail, LabRow, ScoreDimension, SeedSummary } from '@/lib/match-lab';

type Props = { rows: LabRow[]; filters: FilterOptions; seed: SeedSummary };

type FilterState = {
  q: string;
  segment: string;
  source: string;
  bucket: string;
  hardGate: string;
  structure: string;
  intent: string;
  children: string;
  affection: string;
  libido: string;
  communication: string;
  verification: string;
  state: string;
  risk: string;
  ageMin: string;
  ageMax: string;
};

const EMPTY: FilterState = {
  q: '', segment: '', source: '', bucket: '', hardGate: '', structure: '', intent: '', children: '',
  affection: '', libido: '', communication: '', verification: '', state: '', risk: '', ageMin: '', ageMax: '',
};

const bucketTone: Record<string, string> = {
  vetoed: 'bg-red-100 text-red-800',
  possible: 'bg-stone-200 text-stone-700',
  recommended: 'bg-emerald-100 text-emerald-800',
  high: 'bg-emerald-200 text-emerald-900',
};
const eligTone: Record<string, string> = {
  eligible: 'bg-emerald-200 text-emerald-900',
  needs_completion: 'bg-amber-100 text-amber-900',
  not_eligible: 'bg-red-100 text-red-800',
};
const impactTone: Record<string, string> = {
  helped: 'bg-emerald-100 text-emerald-800',
  hurt: 'bg-red-100 text-red-800',
  neutral: 'bg-stone-200 text-stone-700',
};

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</span>
      <select className="rounded-xl border border-stone-300 bg-white px-2 py-1.5" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 text-sm text-stone-800">{value || '—'}</p>
    </div>
  );
}

function List({ title, items, tone }: { title: string; items: string[]; tone?: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{title}</p>
      <ul className="mt-2 grid gap-1.5">
        {items.map((it, i) => (
          <li key={i} className={`rounded-lg px-2.5 py-1.5 text-sm ${tone ?? 'bg-stone-100 text-stone-800'}`}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function ScoreRow({ s }: { s: ScoreDimension }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <b className="text-sm">{s.label}</b>
        <div className="flex items-center gap-2">
          <span className={`pill ${impactTone[s.impact]}`}>{s.impact}</span>
          <span className="text-sm font-black tabular-nums">{s.score}</span>
        </div>
      </div>
      <div className="mt-2 h-2 rounded-full bg-stone-200">
        <div className={`h-2 rounded-full ${s.impact === 'hurt' ? 'bg-red-500' : s.impact === 'helped' ? 'bg-emerald-600' : 'bg-stone-400'}`} style={{ width: `${s.score}%` }} />
      </div>
      <p className="mt-2 text-sm text-stone-600">{s.reason}</p>
      <p className="mt-1 text-xs text-stone-500">Evidence: {s.evidence} · {s.fromModel ? 'model dimension score' : 'derived from profile fields'}</p>
    </div>
  );
}

type Tab = 'eligibility' | 'explanation' | 'scores' | 'evidence' | 'audit' | 'casefile' | 'tuning';
type TuningAction = { id: number; profileId: string; action: string; target: string };

export default function MatchLabClient({ rows, filters, seed }: Props) {
  const [f, setF] = useState<FilterState>(EMPTY);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<LabDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('eligibility');
  const [actions, setActions] = useState<TuningAction[]>([]);

  const set = (k: keyof FilterState) => (v: string) => setF((prev) => ({ ...prev, [k]: v }));

  const filtered = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const min = f.ageMin ? Number(f.ageMin) : -Infinity;
    const max = f.ageMax ? Number(f.ageMax) : Infinity;
    return rows.filter((r) => {
      if (f.segment && r.eligibilityStatus !== f.segment) return false;
      if (f.source && r.source !== f.source) return false;
      if (f.bucket && r.queueStatus !== f.bucket) return false;
      if (f.hardGate === 'pass' && !r.hardGatePass) return false;
      if (f.hardGate === 'fail' && r.hardGatePass) return false;
      if (f.structure && r.relationshipStructure !== f.structure) return false;
      if (f.intent && r.relationshipIntent !== f.intent) return false;
      if (f.children && r.childrenStatus !== f.children) return false;
      if (f.affection && r.affectionLevel !== f.affection) return false;
      if (f.libido && r.libidoLevel !== f.libido) return false;
      if (f.communication && r.communicationStyle !== f.communication) return false;
      if (f.verification && r.verificationStatus !== f.verification) return false;
      if (f.state && r.state !== f.state) return false;
      if (f.risk && !r.riskFlags.includes(f.risk)) return false;
      if (r.age < min || r.age > max) return false;
      if (q && !(`${r.name} ${r.region} ${r.relationshipIntent} ${r.id}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [rows, f]);

  const shown = filtered.slice(0, 80);

  async function select(id: string) {
    setSelectedId(id);
    setLoading(true);
    setDetail(null);
    try {
      const res = await fetch(`/api/match-lab?id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error();
      setDetail(await res.json());
    } catch {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }

  function queue(action: string, target: string) {
    if (!selectedId) return;
    setActions((prev) => [{ id: Date.now(), profileId: selectedId, action, target }, ...prev].slice(0, 12));
  }

  return (
    <div className="grid gap-6">
      {/* Filters */}
      <section className="card p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="label">Synthetic profile browser · QA only</p>
          <button className="btn secondary !px-4 !py-2" onClick={() => setF(EMPTY)}>Reset filters</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-bold uppercase tracking-wide text-stone-500">Search</span>
            <input className="rounded-xl border border-stone-300 bg-white px-2 py-1.5" placeholder="name, region, id…" value={f.q} onChange={(e) => set('q')(e.target.value)} />
          </label>
          <Select label="Eligibility segment" value={f.segment} onChange={set('segment')} options={filters.segments.map((s) => ({ value: s.value, label: s.label }))} />
          <Select label="Source" value={f.source} onChange={set('source')} options={filters.sources.map((s) => ({ value: s, label: s === 'codex' ? 'Codex generated' : 'Claude imported' }))} />
          <Select label="Recommendation (pool)" value={f.bucket} onChange={set('bucket')} options={filters.buckets.map((b) => ({ value: b.value, label: b.label }))} />
          <Select label="Hard gate vs seed" value={f.hardGate} onChange={set('hardGate')} options={[{ value: 'pass', label: 'Pass' }, { value: 'fail', label: 'Fail' }]} />
          <Select label="Relationship structure" value={f.structure} onChange={set('structure')} options={filters.relationshipStructures.map((v) => ({ value: v, label: v.replace(/_/g, ' ') }))} />
          <Select label="Relationship intent" value={f.intent} onChange={set('intent')} options={filters.relationshipIntents.map((v) => ({ value: v, label: v }))} />
          <Select label="Children status" value={f.children} onChange={set('children')} options={filters.childrenStatuses.map((v) => ({ value: v, label: v }))} />
          <Select label="Affection level" value={f.affection} onChange={set('affection')} options={filters.affectionLevels.map((v) => ({ value: v, label: v }))} />
          <Select label="Libido level" value={f.libido} onChange={set('libido')} options={filters.libidoLevels.map((v) => ({ value: v, label: v }))} />
          <Select label="Communication style" value={f.communication} onChange={set('communication')} options={filters.communicationStyles.map((v) => ({ value: v, label: v }))} />
          <Select label="Verification status" value={f.verification} onChange={set('verification')} options={filters.verificationStatuses.map((v) => ({ value: v, label: v }))} />
          <Select label="Location (state)" value={f.state} onChange={set('state')} options={filters.states.map((v) => ({ value: v, label: v }))} />
          <Select label="Risk flag" value={f.risk} onChange={set('risk')} options={filters.riskFlags.map((v) => ({ value: v, label: v }))} />
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-bold uppercase tracking-wide text-stone-500">Age min</span>
            <input type="number" className="rounded-xl border border-stone-300 bg-white px-2 py-1.5" placeholder={String(filters.ageMin)} value={f.ageMin} onChange={(e) => set('ageMin')(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-bold uppercase tracking-wide text-stone-500">Age max</span>
            <input type="number" className="rounded-xl border border-stone-300 bg-white px-2 py-1.5" placeholder={String(filters.ageMax)} value={f.ageMax} onChange={(e) => set('ageMax')(e.target.value)} />
          </label>
        </div>
        <p className="mt-3 text-sm text-stone-500">{filtered.length.toLocaleString()} of {rows.length.toLocaleString()} synthetic profiles match{shown.length < filtered.length ? ` · showing first ${shown.length}` : ''}. Only the Eligible Match Pool contains real match candidates.</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
        {/* Browser list */}
        <section className="grid max-h-[760px] gap-2 overflow-y-auto pr-1">
          {shown.map((r) => (
            <button
              key={r.id}
              onClick={() => select(r.id)}
              className={`card p-4 text-left transition ${selectedId === r.id ? 'ring-2 ring-[#1f5f55]' : 'hover:border-stone-400'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <b className="text-sm">{r.name}</b>
                <span className={`pill ${eligTone[r.eligibilityStatus]}`}>{r.eligibilityLabel}</span>
              </div>
              <p className="mt-1 text-xs text-stone-600">{r.age} · {r.region} · {r.relationshipIntentCategory.replace(/_/g, ' ')} · {r.relationshipStructure.replace(/_/g, ' ')}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="pill">{r.sourceLabel}</span>
                {r.inPool ? <span className={`pill ${bucketTone[r.queueStatus]}`}>{r.queueLabel}</span> : <span className="pill">not a match candidate</span>}
              </div>
              <p className="mt-2 text-xs text-stone-500">{r.why}</p>
            </button>
          ))}
          {shown.length === 0 && <p className="text-sm text-stone-500">No profiles match these filters.</p>}
        </section>

        {/* Detail */}
        <section>
          {!selectedId && <div className="card p-8 text-stone-500">Select a synthetic profile to inspect how the intake/eligibility/matching system processed it.</div>}
          {selectedId && loading && <div className="card p-8 text-stone-500">Loading case file…</div>}
          {selectedId && !loading && !detail && <div className="card p-8 text-red-700">Could not load this profile.</div>}
          {detail && (
            <div className="grid gap-4">
              <div className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="label">{detail.normalized.sourceLabel} · {detail.row.id} · Compatibility Case File</p>
                    <h2 className="mt-1 text-2xl font-black tracking-[-.03em]">{detail.row.name}</h2>
                    <p className="text-sm text-stone-600">{detail.row.age} · {detail.row.region} · {detail.inspector.relationshipIntentCategory.replace(/_/g, ' ')} · {detail.inspector.relationshipStructure.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`pill ${eligTone[detail.row.eligibilityStatus]}`}>{detail.row.eligibilityLabel}</span>
                    {detail.row.inPool
                      ? <span className={`pill ${bucketTone[detail.row.queueStatus]}`}>{detail.row.queueLabel}</span>
                      : <span className="text-xs text-stone-500">not a match candidate</span>}
                  </div>
                </div>
                {/* Always-visible explanation */}
                <p className="mt-3 rounded-xl bg-stone-100 px-3 py-2 text-sm text-stone-700"><b>Why:</b> {detail.row.why}</p>
                {!detail.row.inPool && (
                  <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">Matching does not begin until baseline completion. This profile is an Intake/QA record, not a candidate in the Eligible Match Pool.</p>
                )}
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                {([
                  ['eligibility', 'Eligibility Gate'],
                  ['explanation', 'Match Explanation'],
                  ['scores', 'Score Breakdown'],
                  ['evidence', 'Evidence Map'],
                  ['audit', 'Criteria Builder / Audit'],
                  ['casefile', 'Compatibility Case File'],
                  ['tuning', 'Admin Tuning'],
                ] as [Tab, string][]).map(([t, lbl]) => (
                  <button key={t} className={`pill ${tab === t ? '!bg-[#17332f] !text-white' : ''}`} onClick={() => setTab(t)}>{lbl}</button>
                ))}
              </div>

              {tab === 'eligibility' && (
                <div className="card grid gap-4 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="label">Eligibility Gate · readiness {detail.eligibility.readinessScore}%</p>
                    <span className={`pill ${eligTone[detail.eligibility.status]}`}>{detail.eligibility.statusLabel}</span>
                  </div>
                  <p className="text-sm text-stone-700">{detail.eligibility.summary}</p>
                  <div className="grid gap-2">
                    {detail.eligibility.checks.map((c) => (
                      <div key={c.key} className="flex items-start justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3">
                        <div>
                          <b className="text-sm">{c.label}</b>
                          <p className="text-xs text-stone-600">{c.detail}</p>
                        </div>
                        <span className={`pill ${c.passed ? 'bg-emerald-100 text-emerald-800' : c.severity === 'hard' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'}`}>
                          {c.passed ? 'pass' : c.severity === 'hard' ? 'blocks (hard)' : 'needs completion'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'explanation' && (
                <div className="card grid gap-4 p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="label">Match Explanation · vs seed {seed.name} ({seed.region})</p>
                    <span className="pill">{seed.relationshipIntentCategory.replace(/_/g, ' ')}</span>
                    <span className="pill">{seed.relationshipStructure.replace(/_/g, ' ')}</span>
                  </div>
                  {!detail.row.inPool && <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">Shown for QA debugging only — this profile is not in the Eligible Match Pool, so no recommendation is issued.</p>}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Final recommendation confidence" value={`${detail.comparison.recommendationConfidence}%`} />
                    <Field label="Hard gate (pairwise)" value={detail.comparison.hardGatePass ? 'PASS' : 'FAIL'} />
                  </div>
                  <List title="Veto reasons" items={detail.comparison.vetoReasons} tone={detail.comparison.hardGatePass ? undefined : 'bg-red-100 text-red-800'} />
                  <List title="Match strengths" items={detail.comparison.strengths} tone="bg-emerald-50 text-emerald-900" />
                  <List title="Mismatch risks" items={detail.comparison.mismatchRisks} tone="bg-red-50 text-red-900" />
                  <List title="Caution areas" items={detail.comparison.cautionAreas} />
                  <List title="Questions that would improve confidence" items={detail.comparison.suggestedQuestions} tone="bg-amber-50 text-amber-900" />
                </div>
              )}

              {tab === 'scores' && (
                <div className="card grid gap-3 p-5">
                  <p className="label">Score breakdown · {detail.scores.some((s) => s.fromModel) ? 'model dimension scores where available' : 'derived from profile fields'}</p>
                  {detail.scores.map((s) => <ScoreRow key={s.key} s={s} />)}
                </div>
              )}

              {tab === 'evidence' && (
                <div className="card grid gap-3 p-5">
                  <div>
                    <p className="label">Evidence Map · criteria trace back to intake answers</p>
                    <p className="mt-1 text-sm text-stone-600">Every criterion below traces to an intake session, question, answer, extracted trait, observation type, confidence, the dimension it affects, and a follow-up when incomplete. Synthetic answers are reconstructed from the persona.</p>
                  </div>
                  {detail.evidence.map((e) => (
                    <div key={e.questionId} className="rounded-xl border border-stone-200 bg-white p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <b className="text-sm">{e.criterion}</b>
                        <div className="flex gap-1.5">
                          <span className="pill">{e.matchDimension}</span>
                          <span className={`pill ${e.observationType === 'direct_observation' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'}`}>{e.observationType.replace(/_/g, ' ')}</span>
                          <span className="pill">conf: {e.confidence}</span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-stone-500">{e.sessionId} · {e.questionId}</p>
                      <p className="mt-2 text-sm text-stone-700"><b>Q:</b> {e.question}</p>
                      <p className="mt-1 text-sm text-stone-700"><b>A:</b> {e.answerText}</p>
                      <p className="mt-1 text-sm text-stone-600">Extracted trait: {e.extractedTrait}</p>
                      {e.followUp ? (
                        <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-sm text-amber-900">Follow-up needed: {e.followUp}</p>
                      ) : (
                        <p className="mt-2 text-xs text-emerald-700">Evidence complete.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {tab === 'audit' && (
                <div className="card grid gap-4 p-5">
                  <p className="label">Criteria Builder / Audit · how this profile was processed</p>
                  <Field label="Recommendation bucket assigned (within pool)" value={detail.audit.bucketAssigned} />
                  <List title="Extracted traits" items={detail.audit.extractedTraits} />
                  <List title="Evidence fields used" items={detail.audit.evidenceFields} />
                  <List title="Criteria created" items={detail.audit.criteriaCreated} />
                  <List title="Hard gates detected" items={detail.audit.hardGatesDetected} tone="bg-red-50 text-red-900" />
                  <List title="Soft preferences detected" items={detail.audit.softPreferences} />
                  <List title="Contradictions found" items={detail.audit.contradictions} />
                  <List title="Missing information / topic gaps" items={detail.audit.missingInfo} tone="bg-amber-50 text-amber-900" />
                  <List title="Risk flags created" items={detail.audit.riskFlagsCreated} tone="bg-red-50 text-red-900" />
                </div>
              )}

              {tab === 'casefile' && (
                <div className="grid gap-4">
                  <div className="card grid gap-3 p-5">
                    <p className="label">Compatibility Case File · normalized record</p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <Field label="Match readiness" value={detail.inspector.matchReadiness} />
                      <Field label="Profile confidence" value={`${detail.inspector.profileConfidence}%`} />
                      <Field label="Pool probability" value={`${detail.inspector.poolProbability}%`} />
                      <Field label="Relationship structure" value={detail.inspector.relationshipStructure.replace(/_/g, ' ')} />
                      <Field label="Relationship intent" value={detail.inspector.relationshipIntentCategory.replace(/_/g, ' ')} />
                      <Field label="Current availability" value={detail.inspector.currentAvailabilityStatus.replace(/_/g, ' ')} />
                      <Field label="Consented to matching" value={detail.inspector.matchingConsent ? 'yes' : 'no'} />
                      <Field label="Verification status" value={detail.inspector.verificationStatus} />
                      <Field label="Trust status" value={detail.inspector.trustStatus} />
                      <Field label="Attraction floor" value={`${detail.inspector.attractionFloor}%`} />
                      <Field label="Communication style" value={detail.inspector.communicationStyle} />
                      <Field label="Conflict style" value={detail.inspector.conflictStyle} />
                      <Field label="Emotional regulation" value={detail.inspector.emotionalRegulation} />
                      <Field label="Attachment / closeness" value={detail.inspector.attachmentClosenessStyle} />
                      <Field label="Children status" value={detail.inspector.childrenStatus} />
                      <Field label="Wants children" value={detail.inspector.wantsChildren} />
                      <Field label="Libido level" value={detail.inspector.libidoLevel} />
                      <Field label="Affection level" value={detail.inspector.affectionLevel} />
                      <Field label="Sexual boundary compatibility" value={detail.inspector.sexualBoundaryCompatibility} />
                      <Field label="Attraction preferences" value={detail.inspector.attractionPreferences.join(', ')} />
                      <Field label="Chemistry tags" value={detail.inspector.chemistryTags.join(', ')} />
                      <Field label="Dealbreakers" value={detail.inspector.dealbreakers.join(', ')} />
                      <Field label="Risk flags" value={detail.inspector.riskFlags.join(', ')} />
                    </div>
                  </div>
                  <div className="card grid gap-3 p-5">
                    <p className="label">Source profile data</p>
                    <p className="text-sm text-stone-600">{detail.sourceNote} Synthetic QA record — full admin visibility is allowed here; real customer raw data would be permissioned and redacted.</p>
                    <pre className="max-h-[420px] overflow-auto rounded-xl bg-[#11201d] p-4 text-xs leading-relaxed text-emerald-50">{JSON.stringify(detail.sourceData ?? detail.normalized, null, 2)}</pre>
                  </div>
                </div>
              )}

              {tab === 'tuning' && (
                <div className="card grid gap-4 p-5">
                  <div>
                    <p className="label">Admin tuning controls</p>
                    <p className="mt-1 text-sm text-stone-600">Mock-only for now. Each action is structured ({'{'} profileId, action, target {'}'}) so it can become a real write later.</p>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Mark a criterion</p>
                    <div className="flex flex-wrap gap-2">
                      {detail.audit.hardGatesDetected.filter((c) => c !== 'none detected').slice(0, 4).map((c) => (
                        <button key={c} className="pill" onClick={() => queue('mark_soft_preference', c)}>↓ make “{c}” soft</button>
                      ))}
                      {detail.audit.softPreferences.filter((c) => c !== 'none recorded').slice(0, 4).map((c) => (
                        <button key={c} className="pill" onClick={() => queue('mark_hard_gate', c)}>↑ make “{c}” a hard gate</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Adjust category weight</p>
                    <div className="flex flex-wrap gap-2">
                      {detail.scores.map((s) => (
                        <span key={s.key} className="inline-flex items-center gap-1 rounded-full border border-stone-300 px-2 py-1 text-xs">
                          {s.label}
                          <button className="font-black" onClick={() => queue('weight_up', s.key)}>+</button>
                          <button className="font-black" onClick={() => queue('weight_down', s.key)}>−</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn secondary !px-4 !py-2" onClick={() => queue('flag_scoring_wrong', detail.row.id)}>Flag scoring as wrong</button>
                    <button className="btn secondary !px-4 !py-2" onClick={() => queue('request_more_questions', detail.comparison.suggestedQuestions[0] ?? 'general')}>Request more questions</button>
                    <button className="btn secondary !px-4 !py-2" onClick={() => queue('override_eligibility_for_qa', detail.row.eligibilityStatus)}>Override eligibility (QA)</button>
                    <button className="btn !px-4 !py-2" onClick={() => queue('qa_approve_recommendation', detail.row.queueStatus)}>Approve for QA</button>
                    <button className="btn secondary !px-4 !py-2" onClick={() => queue('qa_reject_recommendation', detail.row.queueStatus)}>Reject for QA</button>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Queued QA actions (mock)</p>
                    {actions.length === 0 ? (
                      <p className="mt-2 text-sm text-stone-500">No actions queued yet.</p>
                    ) : (
                      <ul className="mt-2 grid gap-1.5">
                        {actions.map((a) => (
                          <li key={a.id} className="rounded-lg bg-stone-100 px-2.5 py-1.5 font-mono text-xs text-stone-700">{`{ profileId: "${a.profileId}", action: "${a.action}", target: "${a.target}" }`}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
