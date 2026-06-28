import { PageHeader, Metric } from '@/components/ui';
import { seedProfile } from '@/lib/mock-data';
import { assessCompatibility } from '@/lib/matching';
import { syntheticProfiles } from '@/lib/synthetic-profiles';

const assessed = syntheticProfiles.map((profile) => ({ profile, assessment: assessCompatibility(seedProfile, profile) })).sort((a, b) => b.assessment.recommendationConfidence - a.assessment.recommendationConfidence);
const counts = {
  total: syntheticProfiles.length,
  vetoed: assessed.filter((x) => !x.assessment.hardGatePass).length,
  possible: assessed.filter((x) => x.assessment.hardGatePass && x.assessment.recommendationConfidence >= 65).length,
  recommended: assessed.filter((x) => x.assessment.hardGatePass && x.assessment.recommendationConfidence >= 75).length,
  high: assessed.filter((x) => x.assessment.hardGatePass && x.assessment.recommendationConfidence >= 82).length,
};

export default function Page() {
  const top = assessed.filter((x) => x.assessment.hardGatePass).slice(0, 12);
  const vetoed = assessed.filter((x) => !x.assessment.hardGatePass).slice(0, 6);
  return <main className="p-8"><PageHeader kicker="Internal QA data" title="Synthetic 1,000-profile test harness"><p>These are deterministic mock personas for testing match suppression, hard gates, weak possibilities, and high-confidence recommendations. They are not public users and contain no real private profile data.</p></PageHeader><div className="grid gap-4 md:grid-cols-5"><Metric label="Synthetic profiles" value={counts.total}/><Metric label="Vetoed" value={counts.vetoed}/><Metric label="Possible 65%+" value={counts.possible}/><Metric label="Recommended 75%+" value={counts.recommended}/><Metric label="High confidence 82%+" value={counts.high}/></div><section className="mt-8 grid gap-4"><h2 className="text-2xl font-black">Top non-vetoed candidates against seed profile</h2>{top.map(({ profile, assessment }) => <article className="card p-5" key={profile.user.id}><div className="flex flex-wrap justify-between gap-3"><div><b>{profile.user.preferredName}</b><p className="text-sm text-stone-600">{profile.user.age} · {profile.locationRegion} · {profile.user.relationshipIntent}</p></div><span className="pill">{assessment.recommendationConfidence}% recommendation confidence</span></div><p className="mt-3 text-sm text-stone-700">{profile.communicationStyle} · {profile.conflictStyle} · {profile.humorPlayfulnessStyle} · {profile.affectionLevel} · {profile.libidoLevel}</p><p className="mt-2 text-sm text-stone-600">Cautions: {assessment.cautionAreas.join('; ')} Risk flags: {assessment.riskFlags.join(', ') || 'none'}</p></article>)}</section><section className="mt-8 grid gap-4"><h2 className="text-2xl font-black">Sample vetoed candidates</h2>{vetoed.map(({ profile, assessment }) => <article className="card p-5" key={profile.user.id}><b>{profile.user.preferredName}</b><p className="text-sm text-stone-600">Veto reasons: {assessment.vetoReasons.join('; ')}</p></article>)}</section></main>;
}
