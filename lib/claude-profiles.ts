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
import type { RelationshipStructure, RelationshipIntentCategory, CurrentAvailabilityStatus } from './types';

// --- Raw shape (loose; the importer is defensive about missing fields) -------

export type RawClaudeProfile = {
  profile_id?: string;
  uuid?: string;
  synthetic?: boolean;
  date_created?: string;
  verification?: {
    status?: string;
    identity_verified?: boolean;
    photo_verified?: boolean;
    background_check?: boolean;
  };
  match_readiness?: {
    status?: string;
    profile_completeness_pct?: number;
    contradictions_flagged?: number;
    intent_clarity?: string;
  };
  identity?: {
    preferred_name?: string;
    last_name_initial?: string;
    age?: number;
    gender?: string;
    sexual_orientation?: string;
    ethnicity?: string;
    location?: { city?: string; state?: string; country?: string };
  };
  relationship_intent?: {
    summary?: string;
    marriage_interest?: string;
    monogamy?: string;
    timeline_urgency?: string;
    confidence?: string;
    importance?: string;
  };
  values_worldview?: {
    religion?: string;
    politics?: string;
    politics_tolerance?: string;
    ethics_keywords?: string[];
    dealbreaker_values?: string[];
    confidence?: string;
  };
  communication?: {
    style?: string;
    conflict_repair?: string;
    emotional_expressiveness?: string;
    listening_style?: string;
    confidence?: string;
  };
  conflict_stress?: { anger_style?: string; avoidance_tendency?: string; escalation_risk?: string; accountability?: string; confidence?: string };
  attachment_emotional?: {
    attachment_style?: string;
    jealousy_level?: string;
    reassurance_need?: string;
    trust_building_pace?: string;
    affection_level?: string;
  };
  lifestyle?: { hobbies?: string[]; sleep_schedule?: string; introvert_extrovert?: string; routine_vs_spontaneous?: string };
  health_wellness?: {
    fitness_level?: string;
    diet?: string;
    substance_stance?: string;
    substance_dealbreaker?: string;
    mental_health_management?: string;
  };
  work_money?: { occupation?: string; financial_style?: string; ambition_level?: string; income_range?: string };
  family_children?: { children_status?: string; wants_children?: string; family_involvement_desired?: string; confidence?: string };
  religion_politics_detailed?: {
    could_date_different_faith?: boolean;
    could_date_different_politics?: boolean;
    faith_practice_intensity?: string;
  };
  attraction?: {
    partner_gender_preference?: string;
    age_range_preferred?: { min?: number; max?: number };
    physical_preferences_keywords?: string[];
    attraction_flexibility?: string;
    attraction_dominance_over_values?: string;
  };
  sexual_romantic?: {
    affection_style?: string[];
    libido?: string;
    public_affection_comfort?: string;
    exclusivity_expectation?: string;
    boundaries_flagged?: boolean;
    confidence?: string;
  };
  chemistry?: { primary_chemistry_tags?: string[]; banter_affinity?: string; playful_antagonistic?: boolean };
  logistics?: { availability?: string; custody_schedule?: string; timing?: string };
  past_relationship_patterns?: { repeating_theme?: string; accountability_for_past_failures?: string; ready_to_do_differently?: string; confidence?: string };
  trust_signals?: {
    willing_to_verify?: string;
    background_check_consented?: boolean;
    social_proof_linked?: boolean;
    relationship_status_verified?: boolean;
  };
  ai_observed?: {
    consistency_score?: number;
    openness_score?: number;
    seriousness_score?: number;
    rigidity_score?: number;
    contradiction_markers?: number;
    completion_depth?: string;
    note?: string;
  };
  dealbreakers?: { hard?: string[]; soft?: string[]; logistics_hard_limits?: { open_to_relocation?: boolean; max_distance_miles?: number } };
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

  // Structured relationship taxonomy derived from explicit Claude source fields.
  const monogamy = raw.relationship_intent?.monogamy;
  const exclusivity = raw.sexual_romantic?.exclusivity_expectation;
  const relationshipStructure: RelationshipStructure =
    monogamy === 'exclusive_monogamy' || monogamy === 'open_to_monogamy'
      ? 'exclusive_monogamous'
      : monogamy === 'ethical_nonmonogamy'
        ? raw.relationship_intent?.marriage_interest === 'no'
          ? 'polyamorous'
          : exclusivity === 'open_to_discussion'
            ? 'non_exclusive'
            : 'open_relationship'
        : 'unclear';
  const relationshipIntentCategory: RelationshipIntentCategory =
    raw.match_readiness?.intent_clarity === 'unclear'
      ? 'uncertain'
      : raw.relationship_intent?.marriage_interest === 'yes'
        ? 'marriage_or_life_commitment'
        : raw.relationship_intent?.timeline_urgency === 'low'
          ? 'long_term_but_slow_pace'
          : 'serious_long_term';
  const statusVerified = raw.trust_signals?.relationship_status_verified === true;
  const inconsistentStatus = (raw.risk_flags ?? []).includes('inconsistent_relationship_status');
  const currentAvailabilityStatus: CurrentAvailabilityStatus =
    inconsistentStatus || !statusVerified ? 'unclear' : 'single';
  const matchingConsent =
    raw.match_readiness?.status === 'ready' || raw.match_readiness?.status === 'nearly_ready';

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
      raw.health_wellness?.substance_stance || '',
      raw.health_wellness?.substance_dealbreaker ? `dealbreaker: ${raw.health_wellness.substance_dealbreaker}` : '',
      raw.health_wellness?.fitness_level ? `fitness: ${raw.health_wellness.fitness_level}` : '',
    ].filter(Boolean),
    attractionPreferences: raw.attraction?.physical_preferences_keywords || [],
    dealbreakers: raw.dealbreakers?.hard || [],
    flexibilityLevels: [
      raw.dealbreakers?.logistics_hard_limits?.open_to_relocation ? 'relocation-open' : 'location-locked',
    ],
    topics: [],
    categories: [],
    // Hard gates are genuine self-carried disqualifiers only. The model's
    // do_not_recommend verdict drives recommendation strength (queueStatus) and
    // eligibility is derived from real signals — it is not a hard disqualifier here.
    hardGates: [],
    riskFlags: raw.risk_flags || [],
    attractionFloor: pct(scores?.attraction_fit, 60),
    profileConfidence: raw.match_readiness?.profile_completeness_pct ?? 60,
    poolProbability: avgScore(scores, ['relationship_intent', 'logistics', 'trust_verification'], 50),
    relationshipStructure,
    relationshipIntentCategory,
    currentAvailabilityStatus,
    matchingConsent,
  };

  return { ...profile, source: 'claude', sourceLabel: 'Claude imported', queueStatus };
}

// --- Exports -----------------------------------------------------------------

export const claudeImportValidation: ClaudeImportValidation = validateClaudeImport();

export const claudeSyntheticProfiles: ClassifiedSyntheticProfile[] = (rawFile.profiles ?? []).map(
  normalizeClaudeProfile,
);

// Raw source data keyed by normalized profile id — used by the admin Match Lab to
// show the original Claude profile fields behind a normalized record. Server-only.
export const claudeRawById: Map<string, RawClaudeProfile> = new Map(
  (rawFile.profiles ?? []).map((p, i) => [p.profile_id || `CLAUDE-${String(i + 1).padStart(4, '0')}`, p]),
);

export function getClaudeRaw(id: string): RawClaudeProfile | null {
  return claudeRawById.get(id) ?? null;
}
