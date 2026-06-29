// Evidence Map.
//
// Criteria must not appear magically. Every criterion in a Compatibility Case
// File traces back to an intake interview: session id, question id, the answer
// text, the extracted trait, whether it was a direct observation or an
// inference, the model's confidence, the match dimension it affects, and a
// follow-up question when the evidence is incomplete.
//
// For synthetic QA profiles, the answers are reconstructed deterministically
// from the persona's fields (and the Claude source confidence where present).

import type { Confidence } from './types';
import type { SyntheticProfile } from './synthetic-profiles';
import type { RawClaudeProfile } from './claude-profiles';

export type ObservationType = 'direct_observation' | 'inference';

export type EvidenceItem = {
  sessionId: string;
  questionId: string;
  question: string;
  answerText: string;
  extractedTrait: string;
  criterion: string;
  matchDimension: string;
  observationType: ObservationType;
  confidence: Confidence;
  followUp: string | null;
  complete: boolean;
};

type EvidenceSpec = {
  questionId: string;
  matchDimension: string;
  question: string;
  criterion: string;
  trait: (p: SyntheticProfile) => string;
  value: (p: SyntheticProfile) => string;
  rawConfidence?: (raw: RawClaudeProfile) => string | undefined;
  observationType: ObservationType;
  followUp: string;
};

const SPECS: EvidenceSpec[] = [
  {
    questionId: 'INT-01',
    matchDimension: 'relationship_intent',
    question: 'What kind of relationship are you ultimately looking for?',
    criterion: 'Relationship intent: serious long-term partner',
    trait: (p) => p.relationshipIntentCategory,
    value: (p) => p.relationshipIntentCategory.replace(/_/g, ' '),
    rawConfidence: (r) => r.relationship_intent?.confidence,
    observationType: 'direct_observation',
    followUp: 'Clarify whether marriage/lifelong commitment is required and on what timeline.',
  },
  {
    questionId: 'STR-01',
    matchDimension: 'relationship_intent',
    question: 'Do you want exclusivity, or an open / non-exclusive arrangement?',
    criterion: 'Relationship structure preference',
    trait: (p) => p.relationshipStructure,
    value: (p) => p.relationshipStructure.replace(/_/g, ' '),
    rawConfidence: (r) => r.relationship_intent?.confidence,
    observationType: 'direct_observation',
    followUp: 'Confirm exclusivity expectations explicitly to avoid a structure conflict.',
  },
  {
    questionId: 'AVL-01',
    matchDimension: 'trust_verification',
    question: 'What is your current relationship availability?',
    criterion: 'Ethical availability',
    trait: (p) => p.currentAvailabilityStatus,
    value: (p) => p.currentAvailabilityStatus.replace(/_/g, ' '),
    observationType: 'direct_observation',
    followUp: 'Verify current relationship status before entering the pool.',
  },
  {
    questionId: 'COM-01',
    matchDimension: 'communication',
    question: 'When something matters to you, how do you communicate it?',
    criterion: 'Communication style',
    trait: (p) => p.communicationStyle,
    value: (p) => p.communicationStyle,
    rawConfidence: (r) => r.communication?.confidence,
    observationType: 'direct_observation',
    followUp: 'Explore how directness is received under stress.',
  },
  {
    questionId: 'CON-01',
    matchDimension: 'conflict_stress',
    question: 'After a conflict with someone you love, what does repair look like?',
    criterion: 'Conflict & repair pattern',
    trait: (p) => p.conflictStyle,
    value: (p) => p.conflictStyle,
    rawConfidence: (r) => r.conflict_stress?.confidence,
    observationType: 'direct_observation',
    followUp: 'Probe escalation risk and cooldown needs.',
  },
  {
    questionId: 'ATT-01',
    matchDimension: 'emotional_attachment',
    question: 'How much closeness versus independence do you need day to day?',
    criterion: 'Attachment / closeness style',
    trait: (p) => p.attachmentClosenessStyle,
    value: (p) => p.attachmentClosenessStyle,
    observationType: 'inference',
    followUp: 'Confirm the inferred attachment self-description with the user.',
  },
  {
    questionId: 'FAM-01',
    matchDimension: 'family_children',
    question: 'Where do you stand on having (or not having) children?',
    criterion: 'Family & children intent',
    trait: (p) => p.wantsChildren,
    value: (p) => `${p.childrenStatus}; wants: ${p.wantsChildren}`,
    rawConfidence: (r) => r.family_children?.confidence,
    observationType: 'direct_observation',
    followUp: 'Clarify how firm the children stance is.',
  },
  {
    questionId: 'VAL-01',
    matchDimension: 'values_worldview',
    question: 'Which values could you not build a life without?',
    criterion: 'Core values & worldview',
    trait: (p) => p.religionWorldview,
    value: (p) => `${p.religionWorldview}; politics: ${p.politicsTolerance}`,
    rawConfidence: (r) => r.values_worldview?.confidence,
    observationType: 'direct_observation',
    followUp: 'Distinguish flexible values from required ones.',
  },
  {
    questionId: 'SEX-01',
    matchDimension: 'sexual_romantic',
    question: 'How important is intimacy compatibility, and where are your boundaries firm?',
    criterion: 'Intimacy & boundaries',
    trait: (p) => p.sexualBoundaryCompatibility,
    value: (p) => `${p.libidoLevel}; ${p.sexualBoundaryCompatibility}`,
    rawConfidence: (r) => r.sexual_romantic?.confidence,
    observationType: 'direct_observation',
    followUp: 'Gather more intimacy-boundary evidence before recommending.',
  },
  {
    questionId: 'VER-01',
    matchDimension: 'trust_verification',
    question: 'Are you willing to verify identity, photos, and availability?',
    criterion: 'Verification readiness',
    trait: (p) => p.user.verificationStatus,
    value: (p) => p.user.verificationStatus,
    observationType: 'direct_observation',
    followUp: 'Complete identity verification to enter the Eligible Match Pool.',
  },
  {
    questionId: 'GRW-01',
    matchDimension: 'growth_readiness',
    question: 'What would you do differently from your last relationship?',
    criterion: 'Growth & accountability readiness',
    trait: (p) => `profile confidence ${p.profileConfidence}%`,
    value: (p) => `model-estimated readiness ${p.profileConfidence}%`,
    rawConfidence: (r) => r.past_relationship_patterns?.confidence,
    observationType: 'inference',
    followUp: 'Ask directly about accountability for past relationship patterns.',
  },
];

const VALID_CONFIDENCE: Confidence[] = ['low', 'medium', 'high'];

function deriveConfidence(p: SyntheticProfile): Confidence {
  if (p.profileConfidence >= 75) return 'high';
  if (p.profileConfidence >= 55) return 'medium';
  return 'low';
}

function isMissing(value: string): boolean {
  return !value || /unspecified|unknown|unresolved|unclear|pending|incomplete/i.test(value);
}

export function buildEvidenceMap(p: SyntheticProfile, raw: RawClaudeProfile | null): EvidenceItem[] {
  const sessionId = `INTAKE-${p.user.id}`;
  return SPECS.map((spec) => {
    const value = spec.value(p);
    const rawConf = raw && spec.rawConfidence ? spec.rawConfidence(raw) : undefined;
    const confidence: Confidence =
      rawConf && (VALID_CONFIDENCE as string[]).includes(rawConf) ? (rawConf as Confidence) : deriveConfidence(p);
    const missing = isMissing(value);
    const complete = !missing && confidence !== 'low';
    return {
      sessionId,
      questionId: spec.questionId,
      question: spec.question,
      answerText: `Synthetic intake answer: “${value}.”`,
      extractedTrait: spec.trait(p),
      criterion: spec.criterion,
      matchDimension: spec.matchDimension,
      observationType: spec.observationType,
      confidence,
      followUp: complete ? null : spec.followUp,
      complete,
    };
  });
}
