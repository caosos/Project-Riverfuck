// Combined synthetic dataset: 1,000 Codex-generated + 1,000 Claude-imported
// personas, classified into a single queue-status vocabulary for the admin view.
//
// All profiles here are QA/test data — they are not real users.

import { assessCompatibility } from './matching';
import { seedProfile } from './mock-data';
import { syntheticProfiles } from './synthetic-profiles';
import { claudeSyntheticProfiles, claudeImportValidation } from './claude-profiles';
import type {
  ClassifiedSyntheticProfile,
  SyntheticProfile,
  SyntheticQueueStatus,
} from './synthetic-profiles';

// Classify a Codex profile by assessing it against the seed profile and bucketing
// the recommendation confidence into the shared four-way vocabulary.
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

function countBy(profiles: ClassifiedSyntheticProfile[], status: SyntheticQueueStatus): number {
  return profiles.filter((p) => p.queueStatus === status).length;
}

export const syntheticCounts = {
  codex: codexSyntheticProfiles.length,
  claude: claudeSyntheticProfiles.length,
  total: combinedSyntheticProfiles.length,
  vetoed: countBy(combinedSyntheticProfiles, 'vetoed'),
  possible: countBy(combinedSyntheticProfiles, 'possible'),
  recommended: countBy(combinedSyntheticProfiles, 'recommended'),
  high: countBy(combinedSyntheticProfiles, 'high'),
};

export const queueStatusLabels: Record<SyntheticQueueStatus, string> = {
  vetoed: 'Vetoed',
  possible: 'Possible',
  recommended: 'Recommended',
  high: 'High-confidence recommended',
};
