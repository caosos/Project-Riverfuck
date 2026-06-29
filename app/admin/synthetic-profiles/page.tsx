import Link from 'next/link';
import { PageHeader, Metric } from '@/components/ui';
import {
  combinedSyntheticProfiles,
  syntheticCounts,
  claudeImportValidation,
  queueStatusLabels,
} from '@/lib/synthetic-dataset';

const recommended = combinedSyntheticProfiles
  .filter((p) => p.queueStatus === 'high' || p.queueStatus === 'recommended')
  .slice(0, 12);
const vetoed = combinedSyntheticProfiles.filter((p) => p.queueStatus === 'vetoed').slice(0, 6);

export default function Page() {
  const v = claudeImportValidation;
  return (
    <main className="p-8">
      <PageHeader kicker="Internal QA data" title="Synthetic 2,000-profile test harness">
        <p>
          Deterministic mock personas for testing match suppression, hard gates, weak possibilities, and high-confidence
          recommendations. They combine Codex-generated and Claude-imported profiles. None are public users and they contain
          no real private profile data — this is QA data, not real users.
        </p>
      </PageHeader>

      <div className="mb-6">
        <Link className="btn" href="/admin/match-lab">Open Admin Match Lab →</Link>
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <Metric label="Codex generated profiles" value={syntheticCounts.codex.toLocaleString()} help="Deterministically generated in-app." />
        <Metric label="Claude imported profiles" value={syntheticCounts.claude.toLocaleString()} help="Imported & normalized from JSON." />
        <Metric label="Total synthetic profiles" value={syntheticCounts.total.toLocaleString()} help="Combined QA pool." />
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-4">
        <Metric label={queueStatusLabels.vetoed} value={syntheticCounts.vetoed.toLocaleString()} help="Hard-gated / not recommended." />
        <Metric label={queueStatusLabels.possible} value={syntheticCounts.possible.toLocaleString()} help="Possible but below recommendation bar." />
        <Metric label={queueStatusLabels.recommended} value={syntheticCounts.recommended.toLocaleString()} help="Cleared the recommendation threshold." />
        <Metric label={queueStatusLabels.high} value={syntheticCounts.high.toLocaleString()} help="Strongest recommendations." />
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
        <h2 className="text-2xl font-black">Sample recommended candidates (both sources)</h2>
        {recommended.map((profile) => (
          <article className="card p-5" key={profile.user.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <b>{profile.user.preferredName}</b>
                <p className="text-sm text-stone-600">
                  {profile.user.age} · {profile.locationRegion} · {profile.user.relationshipIntent}
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
            <p className="mt-2 text-sm text-stone-600">
              Profile confidence {profile.profileConfidence}% · Pool probability {profile.poolProbability}% · Risk flags:{' '}
              {profile.riskFlags.join(', ') || 'none'}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-4">
        <h2 className="text-2xl font-black">Sample vetoed candidates</h2>
        {vetoed.map((profile) => (
          <article className="card p-5" key={profile.user.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <b>{profile.user.preferredName}</b>
              <span className="pill">{profile.sourceLabel}</span>
            </div>
            <p className="text-sm text-stone-600">
              Hard gates: {profile.hardGates.join('; ') || 'none'} · Risk flags: {profile.riskFlags.join(', ') || 'none'}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
