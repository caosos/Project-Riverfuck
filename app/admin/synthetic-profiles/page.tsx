import Link from 'next/link';
import { PageHeader, Metric } from '@/components/ui';
import {
  combinedSyntheticProfiles,
  eligibleMatchPool,
  eligibilityById,
  syntheticCounts,
  claudeImportValidation,
  queueStatusLabels,
} from '@/lib/synthetic-dataset';

const poolRecommended = eligibleMatchPool
  .filter((p) => p.queueStatus === 'high' || p.queueStatus === 'recommended')
  .slice(0, 10);
const notEligible = combinedSyntheticProfiles
  .filter((p) => eligibilityById.get(p.user.id)!.status !== 'eligible')
  .slice(0, 8);

export default function Page() {
  const v = claudeImportValidation;
  return (
    <main className="p-8">
      <PageHeader kicker="Internal QA dataset" title="Synthetic QA dataset overview">
        <p>
          Deterministic synthetic personas for testing the intake → eligibility → recommendation pipeline. They combine
          Codex-generated and Claude-imported profiles. <b>Matching never begins until a person clears the baseline</b>
          (identity verified, baseline interview complete, required topics covered, consent given, readiness met, hard
          disqualifiers resolved, availability clear). None are real customers and they contain no real private data —
          this is synthetic QA data only.
        </p>
      </PageHeader>

      <div className="mb-6">
        <Link className="btn" href="/admin/match-lab">Open Admin QA Lab (Match Lab) →</Link>
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <Metric label="Codex generated profiles" value={syntheticCounts.codex.toLocaleString()} help="Deterministically generated in-app." />
        <Metric label="Claude imported profiles" value={syntheticCounts.claude.toLocaleString()} help="Imported & normalized from JSON." />
        <Metric label="Total synthetic profiles" value={syntheticCounts.total.toLocaleString()} help="Combined QA dataset." />
      </section>

      <h2 className="mb-3 text-xl font-black">Eligibility Gate — pool vs intake/QA</h2>
      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <Metric label="Eligible Match Pool" value={syntheticCounts.eligible.toLocaleString()} help="Complete, verified, consented, ethically available — the only match candidates." />
        <Metric label="Needs Completion" value={syntheticCounts.needsCompletion.toLocaleString()} help="Intake in progress; not yet match candidates." />
        <Metric label="Not Eligible Yet" value={syntheticCounts.notEligible.toLocaleString()} help="Hard reason (disqualifier, not available, or casual intent)." />
      </section>

      <h2 className="mb-3 text-xl font-black">Recommendation strength — within the Eligible Match Pool only</h2>
      <section className="mb-8 grid gap-4 md:grid-cols-4">
        <Metric label="High-confidence" value={syntheticCounts.poolHigh.toLocaleString()} help="Strongest recommendations vs seed." />
        <Metric label="Recommended" value={syntheticCounts.poolRecommended.toLocaleString()} help="Clears the recommendation bar." />
        <Metric label="Possible" value={syntheticCounts.poolPossible.toLocaleString()} help="In pool, below the bar — needs more evidence." />
        <Metric label="Vetoed (pairwise)" value={syntheticCounts.poolVetoed.toLocaleString()} help="In pool but a structure/availability conflict vs seed." />
      </section>

      <section className="card mb-8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="label">Claude JSON import</p>
            <h2 className="mt-1 text-xl font-black">claude_synthetic_profiles_1000.json</h2>
          </div>
          <span className="pill">{v.ok ? 'Validated ✓' : 'Validation issues'}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="pill">file loaded: {v.fileLoaded ? 'yes' : 'no'}</span>
          <span className="pill">schema_version: {v.schemaVersion ?? 'missing'}</span>
          <span className="pill">count === 1000: {v.countIsThousand ? 'yes' : `no (${v.count})`}</span>
          <span className="pill">profiles array: {v.hasProfilesArray ? 'yes' : 'no'}</span>
          <span className="pill">all synthetic: {v.allSynthetic ? 'yes' : 'no'}</span>
        </div>
        {v.errors.length > 0 && <p className="mt-3 text-sm text-red-700">Issues: {v.errors.join('; ')}</p>}
      </section>

      <section className="mt-8 grid gap-4">
        <h2 className="text-2xl font-black">Sample Eligible Match Pool — recommended</h2>
        {poolRecommended.map((profile) => (
          <article className="card p-5" key={profile.user.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <b>{profile.user.preferredName}</b>
                <p className="text-sm text-stone-600">
                  {profile.user.age} · {profile.locationRegion} · {profile.relationshipIntentCategory.replace(/_/g, ' ')} · {profile.relationshipStructure.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="pill">{profile.sourceLabel}</span>
                <span className="pill">{queueStatusLabels[profile.queueStatus]}</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-stone-700">
              {profile.communicationStyle} · {profile.conflictStyle} · {profile.affectionLevel} · {profile.libidoLevel}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-4">
        <h2 className="text-2xl font-black">Sample Intake / Not Eligible (not match candidates)</h2>
        {notEligible.map((profile) => {
          const e = eligibilityById.get(profile.user.id)!;
          return (
            <article className="card p-5" key={profile.user.id}>
              <div className="flex flex-wrap justify-between gap-3">
                <b>{profile.user.preferredName}</b>
                <span className="pill">{e.statusLabel}</span>
              </div>
              <p className="mt-1 text-sm text-stone-600">{e.summary}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
