// Admin Match Lab engine (server-only).
//
// Turns each synthetic profile into an explainable "lab record": a normalized
// view, the original source data (Claude only), an AI-process/audit panel, a
// per-dimension score breakdown, and a seed-comparison debugger. Nothing here is
// shipped to the client directly — the page passes compact rows, and details are
// fetched on demand through /api/match-lab.
//
// All profiles handled here are synthetic QA personas, not real users.

import { assessCompatibility } from './matching';
import { seedProfile } from './mock-data';
import { combinedSyntheticProfiles, queueStatusLabels, eligibilityById } from './synthetic-dataset';
import { evaluateEligibility, ELIGIBILITY_LABELS, type EligibilityResult, type EligibilityStatus } from './eligibility';
import { buildEvidenceMap, type EvidenceItem } from './evidence';
import { getClaudeRaw, type RawClaudeProfile } from './claude-profiles';
import type { ClassifiedSyntheticProfile, SyntheticQueueStatus } from './synthetic-profiles';
import type { MatchAssessment } from './types';

// ---------------------------------------------------------------------------
// Types shared with the client (imported there with `import type`).
// ---------------------------------------------------------------------------

export type LabRow = {
  id: string;
  source: 'codex' | 'claude';
  sourceLabel: string;
  name: string;
  age: number;
  city: string;
  state: string;
  region: string;
  relationshipIntent: string;
  childrenStatus: string;
  affectionLevel: string;
  libidoLevel: string;
  communicationStyle: string;
  verificationStatus: string;
  queueStatus: SyntheticQueueStatus;
  queueLabel: string;
  hardGatePass: boolean;
  recommendationConfidence: number;
  riskFlags: string[];
  relationshipStructure: string;
  relationshipIntentCategory: string;
  currentAvailabilityStatus: string;
  eligibilityStatus: EligibilityStatus;
  eligibilityLabel: string;
  inPool: boolean;
  why: string;
};

export type ScoreImpact = 'helped' | 'hurt' | 'neutral';
export type ScoreDimension = {
  key: string;
  label: string;
  score: number;
  impact: ScoreImpact;
  reason: string;
  evidence: string;
  fromModel: boolean;
};

export type AuditPanel = {
  extractedTraits: string[];
  evidenceFields: string[];
  criteriaCreated: string[];
  hardGatesDetected: string[];
  softPreferences: string[];
  contradictions: string[];
  missingInfo: string[];
  riskFlagsCreated: string[];
  bucketAssigned: string;
};

export type ComparisonPanel = {
  recommendationConfidence: number;
  hardGatePass: boolean;
  vetoReasons: string[];
  cautionAreas: string[];
  strengths: string[];
  mismatchRisks: string[];
  suggestedQuestions: string[];
};

export type InspectorPanel = {
  matchReadiness: string;
  profileConfidence: number;
  poolProbability: number;
  attractionFloor: number;
  verificationStatus: string;
  trustStatus: string;
  relationshipIntent: string;
  relationshipStructure: string;
  relationshipIntentCategory: string;
  currentAvailabilityStatus: string;
  matchingConsent: boolean;
  communicationStyle: string;
  conflictStyle: string;
  emotionalRegulation: string;
  attachmentClosenessStyle: string;
  childrenStatus: string;
  wantsChildren: string;
  attractionPreferences: string[];
  libidoLevel: string;
  affectionLevel: string;
  sexualBoundaryCompatibility: string;
  chemistryTags: string[];
  dealbreakers: string[];
  riskFlags: string[];
};

export type LabDetail = {
  row: LabRow;
  normalized: ClassifiedSyntheticProfile;
  inspector: InspectorPanel;
  sourceData: RawClaudeProfile | null;
  sourceNote: string;
  eligibility: EligibilityResult;
  evidence: EvidenceItem[];
  audit: AuditPanel;
  scores: ScoreDimension[];
  comparison: ComparisonPanel;
};

export type FilterOptions = {
  sources: string[];
  segments: { value: EligibilityStatus; label: string }[];
  buckets: { value: SyntheticQueueStatus; label: string }[];
  relationshipStructures: string[];
  relationshipIntents: string[];
  childrenStatuses: string[];
  affectionLevels: string[];
  libidoLevels: string[];
  communicationStyles: string[];
  verificationStatuses: string[];
  states: string[];
  riskFlags: string[];
  ageMin: number;
  ageMax: number;
};

export type SeedSummary = {
  name: string;
  age: number;
  region: string;
  relationshipIntent: string;
  relationshipStructure: string;
  relationshipIntentCategory: string;
  communicationStyle: string;
  verificationStatus: string;
};

// ---------------------------------------------------------------------------
// Assessment cache (seed vs every synthetic profile), computed once.
// ---------------------------------------------------------------------------

const assessments = new Map<string, MatchAssessment>(
  combinedSyntheticProfiles.map((p) => [p.user.id, assessCompatibility(seedProfile, p)]),
);

const byId = new Map<string, ClassifiedSyntheticProfile>(combinedSyntheticProfiles.map((p) => [p.user.id, p]));

function getAssessment(p: ClassifiedSyntheticProfile): MatchAssessment {
  return assessments.get(p.user.id) ?? assessCompatibility(seedProfile, p);
}

// ---------------------------------------------------------------------------
// Score breakdown
// ---------------------------------------------------------------------------

const SEED_STATE = seedProfile.user.locationState; // 'TX'

function impactOf(score: number): ScoreImpact {
  if (score >= 70) return 'helped';
  if (score <= 49) return 'hurt';
  return 'neutral';
}

type DimSpec = {
  key: string;
  label: string;
  modelKey?: string; // key in Claude match_dimension_scores
  evidence: (p: ClassifiedSyntheticProfile) => string;
  heuristic: (p: ClassifiedSyntheticProfile) => number;
  question: string;
};

const has = (s: string, ...needles: string[]) => needles.some((n) => s.toLowerCase().includes(n));

const DIMENSIONS: DimSpec[] = [
  {
    key: 'relationship_intent',
    label: 'Relationship intent',
    modelKey: 'relationship_intent',
    evidence: (p) => p.user.relationshipIntent,
    heuristic: (p) => {
      const v = p.user.relationshipIntent;
      if (v === seedProfile.user.relationshipIntent) return 92;
      if (has(v, 'casual', 'uncertain')) return 28;
      if (has(v, 'serious', 'long-term', 'marriage')) return 74;
      return 55;
    },
    question: 'Is marriage required or optional, and on what timeline?',
  },
  {
    key: 'values_worldview',
    label: 'Values / worldview',
    modelKey: 'values_worldview',
    evidence: (p) => p.religionWorldview,
    heuristic: (p) => (has(p.politicsTolerance, 'tolerant', 'moderate', 'flexible') ? 70 : 52),
    question: 'Which values are genuinely non-negotiable versus flexible?',
  },
  {
    key: 'communication',
    label: 'Communication',
    modelKey: 'communication',
    evidence: (p) => p.communicationStyle,
    heuristic: (p) => (has(p.communicationStyle, 'direct') ? 78 : has(p.communicationStyle, 'reserved', 'avoidant') ? 50 : 62),
    question: 'How do you prefer hard topics to be raised — directly or gently?',
  },
  {
    key: 'conflict_stress',
    label: 'Conflict & repair',
    modelKey: 'conflict_stress',
    evidence: (p) => p.conflictStyle,
    heuristic: (p) => (has(p.conflictStyle, 'repair', 'collaborative') ? 80 : has(p.conflictStyle, 'avoidant', 'defensive', 'quiet') ? 44 : 60),
    question: 'After a fight, what does real repair look like for you?',
  },
  {
    key: 'emotional_attachment',
    label: 'Emotional attachment',
    modelKey: 'emotional_attachment',
    evidence: (p) => p.attachmentClosenessStyle,
    heuristic: (p) => (has(p.attachmentClosenessStyle, 'secure') ? 80 : has(p.attachmentClosenessStyle, 'anxious', 'avoidant') ? 48 : 62),
    question: 'How much closeness versus independence do you need day to day?',
  },
  {
    key: 'lifestyle',
    label: 'Lifestyle',
    modelKey: 'lifestyle',
    evidence: (p) => p.lifestylePreferences.join(', ') || 'unspecified',
    heuristic: (p) => (p.lifestylePreferences.length >= 3 ? 66 : 56),
    question: 'Walk me through an ordinary week — structure versus spontaneity?',
  },
  {
    key: 'family_children',
    label: 'Family / children',
    modelKey: 'family_children',
    evidence: (p) => `${p.childrenStatus} · wants: ${p.wantsChildren}`,
    heuristic: (p) => (has(p.wantsChildren, 'unsure', 'discussion') ? 46 : 70),
    question: 'How firm is your stance on having (or not having) children?',
  },
  {
    key: 'money_work',
    label: 'Work / money',
    modelKey: 'money_work',
    evidence: (p) => p.workMoneyValues,
    heuristic: (p) => (has(p.workMoneyValues, 'stable', 'saver', 'planner') ? 70 : has(p.workMoneyValues, 'debt', 'rebuilding', 'risk') ? 50 : 60),
    question: 'How do you approach money, debt, and financial transparency?',
  },
  {
    key: 'religion_politics',
    label: 'Religion / politics',
    modelKey: 'religion_politics',
    evidence: (p) => p.politicsTolerance,
    heuristic: (p) => (has(p.politicsTolerance, 'strict', 'high conflict') ? 42 : has(p.politicsTolerance, 'tolerant', 'flexible', 'moderate') ? 72 : 58),
    question: 'Could you build a life with someone of different faith or politics?',
  },
  {
    key: 'attraction_fit',
    label: 'Attraction fit',
    modelKey: 'attraction_fit',
    evidence: (p) => p.attractionPreferences.join(', ') || 'unspecified',
    heuristic: (p) => p.attractionFloor,
    question: 'Which attraction traits are truly important versus flexible?',
  },
  {
    key: 'sexual_romantic',
    label: 'Sexual / romantic',
    modelKey: 'sexual_romantic',
    evidence: (p) => `${p.libidoLevel} · ${p.sexualBoundaryCompatibility}`,
    heuristic: (p) => (has(p.sexualBoundaryCompatibility, 'clear', 'positive') ? 72 : has(p.sexualBoundaryCompatibility, 'flagged', 'unresolved', 'low comfort') ? 46 : 58),
    question: 'How important is intimacy compatibility, and where are boundaries firm?',
  },
  {
    key: 'logistics',
    label: 'Logistics',
    modelKey: 'logistics',
    evidence: (p) => `${p.user.locationState} · ${p.user.relocationWillingness}`,
    heuristic: (p) => (p.user.locationState === SEED_STATE ? 80 : has(p.user.relocationWillingness, 'open') ? 66 : 44),
    question: 'Are you open to relocating for an exceptional fit?',
  },
  {
    key: 'growth_readiness',
    label: 'Growth readiness',
    modelKey: 'growth_readiness',
    evidence: (p) => `profile confidence ${p.profileConfidence}%`,
    heuristic: (p) => Math.max(30, Math.min(90, p.profileConfidence)),
    question: 'What would you do differently from your last relationship?',
  },
  {
    key: 'trust_verification',
    label: 'Trust / verification',
    modelKey: 'trust_verification',
    evidence: (p) => `${p.user.verificationStatus} · ${p.user.trustStatus}`,
    heuristic: (p) => (has(p.user.verificationStatus, 'verified', 'complete') ? 84 : has(p.user.verificationStatus, 'pending', 'incomplete') ? 46 : 60),
    question: 'Are you willing to verify identity, photos, and availability?',
  },
];

function buildScores(p: ClassifiedSyntheticProfile, raw: RawClaudeProfile | null): ScoreDimension[] {
  const modelScores = raw?.match_dimension_scores;
  return DIMENSIONS.map((d) => {
    const modelVal = modelScores && d.modelKey ? modelScores[d.modelKey] : undefined;
    const fromModel = typeof modelVal === 'number';
    const score = fromModel ? Math.round((modelVal as number) * 100) : Math.round(d.heuristic(p));
    const evidence = d.evidence(p);
    const impact = impactOf(score);
    const quality = impact === 'helped' ? 'Strong fit on' : impact === 'hurt' ? 'Weak fit on' : 'Partial fit on';
    const reason = `${quality} ${d.label.toLowerCase()}${fromModel ? ' (model dimension score)' : ' (derived from profile fields)'}: ${evidence}.`;
    return { key: d.key, label: d.label, score, impact, reason, evidence, fromModel };
  });
}

// ---------------------------------------------------------------------------
// Audit panel
// ---------------------------------------------------------------------------

function buildAudit(p: ClassifiedSyntheticProfile, raw: RawClaudeProfile | null): AuditPanel {
  const unspecified = (v: string) => !v || v === 'unspecified';

  const extractedTraits = [
    p.communicationStyle,
    p.conflictStyle,
    p.attachmentClosenessStyle,
    p.emotionalRegulation,
    p.affectionLevel,
    p.libidoLevel,
    p.workMoneyValues,
  ].filter((v) => !unspecified(v));

  const evidenceFields = raw
    ? Object.keys(raw).filter((k) => !['profile_id', 'uuid', 'synthetic', 'date_created'].includes(k))
    : ['generated deterministic attributes (no free-text source)'];

  const hardFromRaw = (raw?.dealbreakers?.hard ?? []).map((d) => `hard dealbreaker: ${d}`);
  const softFromRaw = (raw?.dealbreakers?.soft ?? []).map((d) => `soft: ${d}`);

  const criteriaCreated = [
    ...p.dealbreakers.map((d) => `hard requirement: ${d}`),
    ...softFromRaw,
    ...(p.attractionPreferences.slice(0, 2).map((a) => `soft preference: ${a}`)),
  ];

  const hardGatesDetected = [...new Set([...p.hardGates, ...hardFromRaw])];
  if (hardGatesDetected.length === 0) hardGatesDetected.push('none detected');

  const softPreferences = [...softFromRaw, ...p.attractionPreferences.map((a) => `attraction: ${a}`)];
  if (softPreferences.length === 0) softPreferences.push('none recorded');

  const contradictionMarkers = raw?.ai_observed?.contradiction_markers ?? raw?.match_readiness?.contradictions_flagged;
  const contradictions =
    typeof contradictionMarkers === 'number' && contradictionMarkers > 0
      ? [`${contradictionMarkers} contradiction marker(s) flagged by the model (not facts)`]
      : ['none flagged'];

  const missingInfo: string[] = [];
  for (const [label, value] of [
    ['religion / worldview', p.religionWorldview],
    ['communication style', p.communicationStyle],
    ['conflict style', p.conflictStyle],
    ['attachment style', p.attachmentClosenessStyle],
    ['affection level', p.affectionLevel],
    ['libido level', p.libidoLevel],
  ] as const) {
    if (unspecified(value)) missingInfo.push(`${label} not captured`);
  }
  if (p.lifestylePreferences.length === 0) missingInfo.push('lifestyle preferences not captured');
  if (raw?.match_readiness?.profile_completeness_pct != null && raw.match_readiness.profile_completeness_pct < 100) {
    missingInfo.push(`profile ${raw.match_readiness.profile_completeness_pct}% complete (model estimate)`);
  }
  if (!raw && p.topics.length === 0) missingInfo.push('no conversation topics recorded (synthetic generation)');
  if (missingInfo.length === 0) missingInfo.push('no major gaps detected');

  const riskFlagsCreated = p.riskFlags.length ? p.riskFlags : ['none'];

  return {
    extractedTraits,
    evidenceFields,
    criteriaCreated: criteriaCreated.length ? criteriaCreated : ['no explicit criteria created'],
    hardGatesDetected,
    softPreferences,
    contradictions,
    missingInfo,
    riskFlagsCreated,
    bucketAssigned: `${queueStatusLabels[p.queueStatus]} (${p.queueStatus})`,
  };
}

// ---------------------------------------------------------------------------
// Comparison debugger (vs seed)
// ---------------------------------------------------------------------------

function buildComparison(
  p: ClassifiedSyntheticProfile,
  scores: ScoreDimension[],
  assessment: MatchAssessment,
): ComparisonPanel {
  const helped = scores.filter((s) => s.impact === 'helped').sort((a, b) => b.score - a.score);
  const hurt = scores.filter((s) => s.impact === 'hurt').sort((a, b) => a.score - b.score);

  const strengths = helped.slice(0, 4).map((s) => `${s.label} (${s.score}): ${s.evidence}`);
  if (strengths.length === 0) strengths.push('No dimension scored as a clear strength yet.');

  const mismatchRisks = [
    ...hurt.slice(0, 4).map((s) => `${s.label} (${s.score}): ${s.evidence}`),
    ...assessment.riskFlags.map((r) => `risk flag: ${r}`),
  ];
  if (mismatchRisks.length === 0) mismatchRisks.push('No significant mismatch risks detected.');

  // Questions that would most improve confidence: gaps + weak/uncertain dimensions.
  const weakKeys = scores.filter((s) => s.impact !== 'helped').sort((a, b) => a.score - b.score);
  const suggestedQuestions = [...new Set(weakKeys.map((s) => DIMENSIONS.find((d) => d.key === s.key)?.question).filter(Boolean) as string[])].slice(0, 5);
  if (suggestedQuestions.length === 0) suggestedQuestions.push('Coverage is strong — confirm dealbreakers and verification.');

  return {
    recommendationConfidence: assessment.recommendationConfidence,
    hardGatePass: assessment.hardGatePass,
    vetoReasons: assessment.vetoReasons.length ? assessment.vetoReasons : ['none'],
    cautionAreas: assessment.cautionAreas,
    strengths,
    mismatchRisks,
    suggestedQuestions,
  };
}

// ---------------------------------------------------------------------------
// Rows + detail + filter metadata
// ---------------------------------------------------------------------------

// Eligibility is decided first; recommendation strength is only explained for
// profiles that are actually in the Eligible Match Pool.
function whyLine(elig: EligibilityResult, p: ClassifiedSyntheticProfile, assessment: MatchAssessment): string {
  if (elig.status === 'not_eligible') return `Not a match candidate — ${elig.summary}`;
  if (elig.status === 'needs_completion') return `Intake/QA — ${elig.summary}`;
  if (!assessment.hardGatePass) return `In pool but vetoed against seed: ${assessment.vetoReasons[0] ?? 'structure/availability conflict'}`;
  if (p.queueStatus === 'high') return `Eligible · high confidence (${assessment.recommendationConfidence}%): both exclusive & serious, strong signals`;
  if (p.queueStatus === 'recommended') return `Eligible · recommended (${assessment.recommendationConfidence}%): clears the bar with minor cautions`;
  return `Eligible · possible (${assessment.recommendationConfidence}%): below the recommendation threshold, needs more evidence`;
}

function getEligibility(p: ClassifiedSyntheticProfile): EligibilityResult {
  return eligibilityById.get(p.user.id) ?? evaluateEligibility(p);
}

function buildRow(p: ClassifiedSyntheticProfile): LabRow {
  const a = getAssessment(p);
  const elig = getEligibility(p);
  return {
    id: p.user.id,
    source: p.source,
    sourceLabel: p.sourceLabel,
    name: p.user.preferredName,
    age: p.user.age,
    city: p.user.locationCity,
    state: p.user.locationState,
    region: p.locationRegion,
    relationshipIntent: p.user.relationshipIntent,
    childrenStatus: p.childrenStatus,
    affectionLevel: p.affectionLevel,
    libidoLevel: p.libidoLevel,
    communicationStyle: p.communicationStyle,
    verificationStatus: p.user.verificationStatus,
    queueStatus: p.queueStatus,
    queueLabel: queueStatusLabels[p.queueStatus],
    hardGatePass: a.hardGatePass,
    recommendationConfidence: a.recommendationConfidence,
    riskFlags: p.riskFlags,
    relationshipStructure: p.relationshipStructure,
    relationshipIntentCategory: p.relationshipIntentCategory,
    currentAvailabilityStatus: p.currentAvailabilityStatus,
    eligibilityStatus: elig.status,
    eligibilityLabel: elig.statusLabel,
    inPool: elig.status === 'eligible',
    why: whyLine(elig, p, a),
  };
}

export function getLabRows(): LabRow[] {
  return combinedSyntheticProfiles.map(buildRow);
}

export function getLabDetail(id: string): LabDetail | null {
  const p = byId.get(id);
  if (!p) return null;
  const raw = p.source === 'claude' ? getClaudeRaw(id) : null;
  const assessment = getAssessment(p);
  const scores = buildScores(p, raw);
  const inspector: InspectorPanel = {
    matchReadiness: p.user.trustStatus,
    profileConfidence: p.profileConfidence,
    poolProbability: p.poolProbability,
    attractionFloor: p.attractionFloor,
    verificationStatus: p.user.verificationStatus,
    trustStatus: p.user.trustStatus,
    relationshipIntent: p.user.relationshipIntent,
    relationshipStructure: p.relationshipStructure,
    relationshipIntentCategory: p.relationshipIntentCategory,
    currentAvailabilityStatus: p.currentAvailabilityStatus,
    matchingConsent: p.matchingConsent,
    communicationStyle: p.communicationStyle,
    conflictStyle: p.conflictStyle,
    emotionalRegulation: p.emotionalRegulation,
    attachmentClosenessStyle: p.attachmentClosenessStyle,
    childrenStatus: p.childrenStatus,
    wantsChildren: p.wantsChildren,
    attractionPreferences: p.attractionPreferences,
    libidoLevel: p.libidoLevel,
    affectionLevel: p.affectionLevel,
    sexualBoundaryCompatibility: p.sexualBoundaryCompatibility,
    chemistryTags: p.humorPlayfulnessStyle ? p.humorPlayfulnessStyle.split(',').map((s) => s.trim()).filter(Boolean) : [],
    dealbreakers: p.dealbreakers,
    riskFlags: p.riskFlags,
  };
  return {
    row: buildRow(p),
    normalized: p,
    inspector,
    sourceData: raw,
    sourceNote:
      p.source === 'claude'
        ? 'Original Claude-generated source profile shown below the normalized view.'
        : 'Codex profiles are generated deterministically in-app; the normalized record above is the source of truth (no separate raw document).',
    eligibility: getEligibility(p),
    evidence: buildEvidenceMap(p, raw),
    audit: buildAudit(p, raw),
    scores,
    comparison: buildComparison(p, scores, assessment),
  };
}

export function getFilterOptions(): FilterOptions {
  const rows = combinedSyntheticProfiles;
  const distinct = (vals: string[]) => [...new Set(vals.filter(Boolean))].sort();
  const ages = rows.map((p) => p.user.age);
  return {
    sources: ['codex', 'claude'],
    segments: (['eligible', 'needs_completion', 'not_eligible'] as EligibilityStatus[]).map((value) => ({
      value,
      label: ELIGIBILITY_LABELS[value],
    })),
    buckets: (['vetoed', 'possible', 'recommended', 'high'] as SyntheticQueueStatus[]).map((value) => ({
      value,
      label: queueStatusLabels[value],
    })),
    relationshipStructures: distinct(rows.map((p) => p.relationshipStructure)),
    relationshipIntents: distinct(rows.map((p) => p.user.relationshipIntent)),
    childrenStatuses: distinct(rows.map((p) => p.childrenStatus)),
    affectionLevels: distinct(rows.map((p) => p.affectionLevel)),
    libidoLevels: distinct(rows.map((p) => p.libidoLevel)),
    communicationStyles: distinct(rows.map((p) => p.communicationStyle)),
    verificationStatuses: distinct(rows.map((p) => p.user.verificationStatus)),
    states: distinct(rows.map((p) => p.user.locationState)),
    riskFlags: distinct(rows.flatMap((p) => p.riskFlags)),
    ageMin: Math.min(...ages),
    ageMax: Math.max(...ages),
  };
}

export function getSeedSummary(): SeedSummary {
  return {
    name: seedProfile.user.preferredName,
    age: seedProfile.user.age,
    region: `${seedProfile.user.locationCity}, ${seedProfile.user.locationState}`,
    relationshipIntent: seedProfile.user.relationshipIntent,
    relationshipStructure: seedProfile.relationshipStructure,
    relationshipIntentCategory: seedProfile.relationshipIntentCategory,
    communicationStyle: 'direct, accuracy-oriented',
    verificationStatus: seedProfile.user.verificationStatus,
  };
}
