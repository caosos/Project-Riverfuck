// Combined synthetic dataset: 1,000 Codex-generated + 1,000 Claude-imported
// QA personas. Each is run through the Eligibility Gate so the Eligible Match
// Pool can be cleanly separated from Intake / QA records (Needs Completion and
// Not Eligible Yet). Recommendation strength is only meaningful inside the pool.
//
// All profiles here are synthetic QA/test data — they are not real customers.

import { assessCompatibility } from './matching';
import { seedProfile } from './mock-data';
import { syntheticProfiles } from './synthetic-profiles';
import { claudeSyntheticProfiles, claudeImportValidation } from './claude-profiles';
import { evaluateEligibility, ELIGIBILITY_LABELS, type EligibilityResult, type EligibilityStatus } from './eligibility';
import type {
  ClassifiedSyntheticProfile,
  SyntheticProfile,
  SyntheticQueueStatus,
} from './synthetic-profiles';

// Recommendation strength of a Codex profile assessed against the seed profile.
function classifyCodex(profile: SyntheticProfile): SyntheticQueueStatus {
  const a = assessCompatibility(seedProfile, profile);
  if (!a.hardGatePass) return 'vetoed';
  if (a.recommendationConfidence >= 82) return 'high';
  if (a.recommendationConfidence >= 75) return 'recommended';
  return 'possible';
}

export const codexSyntheticProfiles: ClassifiedSyntheticProfile[] = syntheticProfiles.map((p) => ({
  ...p,
  source: 'codex',
  sourceLabel: 'Codex generated',
  queueStatus: classifyCodex(p),
}));

export { claudeSyntheticProfiles, claudeImportValidation };

export const combinedSyntheticProfiles: ClassifiedSyntheticProfile[] = [
  ...codexSyntheticProfiles,
  ...claudeSyntheticProfiles,
];

// Eligibility evaluated once per profile and reused everywhere.
export const eligibilityById: Map<string, EligibilityResult> = new Map(
  combinedSyntheticProfiles.map((p) => [p.user.id, evaluateEligibility(p)]),
);

export function eligibilityFor(id: string): EligibilityResult | undefined {
  return eligibilityById.get(id);
}

const statusOf = (p: ClassifiedSyntheticProfile): EligibilityStatus => eligibilityById.get(p.user.id)!.status;

export const eligibleMatchPool: ClassifiedSyntheticProfile[] = combinedSyntheticProfiles.filter(
  (p) => statusOf(p) === 'eligible',
);

function countBy(profiles: ClassifiedSyntheticProfile[], status: SyntheticQueueStatus): number {
  return profiles.filter((p) => p.queueStatus === status).length;
}

export const syntheticCounts = {
  codex: codexSyntheticProfiles.length,
  claude: claudeSyntheticProfiles.length,
  total: combinedSyntheticProfiles.length,
  // Eligibility segmentation (the real separation that matters):
  eligible: combinedSyntheticProfiles.filter((p) => statusOf(p) === 'eligible').length,
  needsCompletion: combinedSyntheticProfiles.filter((p) => statusOf(p) === 'needs_completion').length,
  notEligible: combinedSyntheticProfiles.filter((p) => statusOf(p) === 'not_eligible').length,
  // Recommendation strength WITHIN the Eligible Match Pool only:
  poolHigh: countBy(eligibleMatchPool, 'high'),
  poolRecommended: countBy(eligibleMatchPool, 'recommended'),
  poolPossible: countBy(eligibleMatchPool, 'possible'),
  poolVetoed: countBy(eligibleMatchPool, 'vetoed'),
};

export const queueStatusLabels: Record<SyntheticQueueStatus, string> = {
  vetoed: 'Vetoed (pairwise)',
  possible: 'Possible',
  recommended: 'Recommended',
  high: 'High-confidence recommended',
};

export { ELIGIBILITY_LABELS };
