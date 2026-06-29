// Loader, validator, and normalizer for the Claude-generated synthetic profiles.
//
// Source file: data/synthetic/claude_synthetic_profiles_1000.json
// These are QA/test personas only — never real users.

import rawImport from '@/data/synthetic/claude_synthetic_profiles_1000.json';
import type {
  ClassifiedSyntheticProfile,
  SyntheticProfile,
  SyntheticQueueStatus,
} from './synthetic-profiles';

// --- Raw shape (loose; the importer is defensive about missing fields) -------

type RawClaudeProfile = {
  profile_id?: string;
  uuid?: string;
  synthetic?: boolean;
  verification?: { status?: string; identity_verified?: boolean };
  match_readiness?: { status?: string; profile_completeness_pct?: number };
  identity?: {
    preferred_name?: string;
    last_name_initial?: string;
    age?: number;
    location?: { city?: string; state?: string };
  };
  relationship_intent?: { summary?: string };
  values_worldview?: { religion?: string; politics_tolerance?: string };
  communication?: { style?: string; conflict_repair?: string };
  conflict_stress?: { anger_style?: string; escalation_risk?: string };
  attachment_emotional?: { attachment_style?: string; affection_level?: string };
  lifestyle?: { hobbies?: string[] };
  health_wellness?: { substances?: string[]; smoking?: string; drinking?: string };
  work_money?: { financial_style?: string };
  family_children?: { children_status?: string; wants_children?: string };
  attraction?: { physical_preferences_keywords?: string[] };
  sexual_romantic?: { libido?: string; boundaries_flagged?: boolean };
  chemistry?: { primary_chemistry_tags?: string[] };
  dealbreakers?: { hard?: string[]; logistics_hard_limits?: { open_to_relocation?: boolean } };
  match_dimension_scores?: Record<string, number>;
  risk_flags?: string[];
  match_queue_status?: string;
};

type RawClaudeFile = {
  schema_version?: number | string;
  count?: number;
  synthetic?: boolean;
  profiles?: RawClaudeProfile[];
};

const rawFile = rawImport as unknown as RawClaudeFile;

// --- Validation --------------------------------------------------------------

export type ClaudeImportValidation = {
  ok: boolean;
  fileLoaded: boolean;
  hasSchemaVersion: boolean;
  schemaVersion: string | null;
  hasProfilesArray: boolean;
  count: number;
  countIsThousand: boolean;
  allSynthetic: boolean;
  errors: string[];
};

export function validateClaudeImport(file: RawClaudeFile = rawFile): ClaudeImportValidation {
  const errors: string[] = [];
  const fileLoaded = Boolean(file && typeof file === 'object');
  if (!fileLoaded) errors.push('Import file did not load.');

  const hasProfilesArray = Array.isArray(file?.profiles);
  if (!hasProfilesArray) errors.push('profiles array is missing.');

  const profiles = hasProfilesArray ? (file.profiles as RawClaudeProfile[]) : [];
  const count = profiles.length;
  const countIsThousand = count === 1000;
  if (!countIsThousand) errors.push(`Expected 1000 profiles, found ${count}.`);

  const hasSchemaVersion = file?.schema_version !== undefined && file?.schema_version !== null;
  if (!hasSchemaVersion) errors.push('schema_version is missing.');

  const allSynthetic = profiles.length > 0 && profiles.every((p) => p?.synthetic === true);
  if (!allSynthetic) errors.push('Not all profiles are marked synthetic.');

  return {
    ok: errors.length === 0,
    fileLoaded,
    hasSchemaVersion,
    schemaVersion: hasSchemaVersion ? String(file.schema_version) : null,
    hasProfilesArray,
    count,
    countIsThousand,
    allSynthetic,
    errors,
  };
}

// --- Normalization -----------------------------------------------------------

const QUEUE_MAP: Record<string, SyntheticQueueStatus> = {
  do_not_recommend: 'vetoed',
  possible_but_weak: 'possible',
  possible_needs_more_info: 'possible',
  recommended: 'recommended',
  high_confidence_recommended: 'high',
};

function pct(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.round(value <= 1 ? value * 100 : value);
}

function avgScore(scores: Record<string, number> | undefined, keys: string[], fallback: number): number {
  if (!scores) return fallback;
  const vals = keys.map((k) => scores[k]).filter((v) => typeof v === 'number') as number[];
  if (vals.length === 0) return fallback;
  return pct(vals.reduce((a, b) => a + b, 0) / vals.length, fallback);
}

function normalizeClaudeProfile(raw: RawClaudeProfile, index: number): ClassifiedSyntheticProfile {
  const n = index + 1;
  const id = raw.profile_id || `CLAUDE-${String(n).padStart(4, '0')}`;
  const name = [raw.identity?.preferred_name, raw.identity?.last_name_initial ? `${raw.identity.last_name_initial}.` : '']
    .filter(Boolean)
    .join(' ')
    .trim() || `Claude Persona ${String(n).padStart(4, '0')}`;
  const city = raw.identity?.location?.city || 'Internal';
  const state = raw.identity?.location?.state || 'QA';
  const queueStatus = QUEUE_MAP[raw.match_queue_status ?? ''] ?? 'possible';
  const scores = raw.match_dimension_scores;

  const profile: SyntheticProfile = {
    synthetic: true,
    user: {
      id,
      preferredName: name,
      age: raw.identity?.age ?? 30,
      relationshipStatus: raw.verification?.identity_verified ? 'available declared (verified)' : 'available declared',
      relationshipIntent: raw.relationship_intent?.summary || 'serious long-term relationship',
      locationCity: city,
      locationState: state,
      relocationWillingness: raw.dealbreakers?.logistics_hard_limits?.open_to_relocation
        ? 'relocation-open'
        : 'location-locked',
      verificationStatus: raw.verification?.status || 'verification incomplete',
      trustStatus: raw.match_readiness?.status || 'trust review pending',
    },
    locationRegion: `${city}, ${state}`,
    childrenStatus: raw.family_children?.children_status || 'unspecified',
    wantsChildren: raw.family_children?.wants_children || 'unsure / needs discussion',
    religionWorldview: raw.values_worldview?.religion || 'unspecified',
    politicsTolerance: raw.values_worldview?.politics_tolerance || 'unspecified',
    communicationStyle: raw.communication?.style || 'unspecified',
    conflictStyle: raw.communication?.conflict_repair || raw.conflict_stress?.anger_style || 'unspecified',
    emotionalRegulation: raw.conflict_stress?.escalation_risk
      ? `escalation risk ${raw.conflict_stress.escalation_risk}`
      : 'unspecified',
    attachmentClosenessStyle: raw.attachment_emotional?.attachment_style || 'unspecified',
    humorPlayfulnessStyle: (raw.chemistry?.primary_chemistry_tags || []).join(', ') || 'unspecified',
    affectionLevel: raw.attachment_emotional?.affection_level || 'unspecified',
    libidoLevel: raw.sexual_romantic?.libido || 'unspecified',
    sexualBoundaryCompatibility: raw.sexual_romantic?.boundaries_flagged
      ? 'boundaries flagged — needs review'
      : 'clear sexual communication',
    lifestylePreferences: raw.lifestyle?.hobbies || [],
    workMoneyValues: raw.work_money?.financial_style || 'unspecified',
    healthSubstanceBoundaries: [
      ...(raw.health_wellness?.substances || []),
      raw.health_wellness?.smoking ? `smoking: ${raw.health_wellness.smoking}` : '',
    ].filter(Boolean),
    attractionPreferences: raw.attraction?.physical_preferences_keywords || [],
    dealbreakers: raw.dealbreakers?.hard || [],
    flexibilityLevels: [
      raw.dealbreakers?.logistics_hard_limits?.open_to_relocation ? 'relocation-open' : 'location-locked',
    ],
    topics: [],
    categories: [],
    // Native source verdict drives counts; keep a hard gate when the source vetoed it.
    hardGates: queueStatus === 'vetoed' ? ['source model flagged do_not_recommend'] : [],
    riskFlags: raw.risk_flags || [],
    attractionFloor: pct(scores?.attraction_fit, 60),
    profileConfidence: raw.match_readiness?.profile_completeness_pct ?? 60,
    poolProbability: avgScore(scores, ['relationship_intent', 'logistics', 'trust_verification'], 50),
  };

  return { ...profile, source: 'claude', sourceLabel: 'Claude imported', queueStatus };
}

// --- Exports -----------------------------------------------------------------

export const claudeImportValidation: ClaudeImportValidation = validateClaudeImport();

export const claudeSyntheticProfiles: ClassifiedSyntheticProfile[] = (rawFile.profiles ?? []).map(
  normalizeClaudeProfile,
);
