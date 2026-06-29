// Eligibility Gate.
//
// A person is NOT a match candidate until they have cleared the baseline. The
// Eligible Match Pool contains only complete, verified, baseline-qualified,
// consented, ethically-available profiles. Everything else is Intake / QA work:
// "Needs Completion" (fixable) or "Not Eligible Yet" (a hard reason).
//
// This is the opposite of a public dating marketplace — nobody browses an
// unverified or incomplete person, because they are never in the pool.

import type { MockProfile } from './types';

export type EligibilityStatus = 'eligible' | 'needs_completion' | 'not_eligible';

export type EligibilityCheck = {
  key: string;
  label: string;
  passed: boolean;
  severity: 'hard' | 'completion';
  detail: string;
};

export type EligibilityResult = {
  status: EligibilityStatus;
  statusLabel: string;
  readinessScore: number; // 0-100, share of baseline gates cleared
  checks: EligibilityCheck[];
  blockingReasons: string[];
  summary: string;
};

export const ELIGIBILITY_LABELS: Record<EligibilityStatus, string> = {
  eligible: 'Eligible Match Pool',
  needs_completion: 'Needs Completion',
  not_eligible: 'Not Eligible Yet',
};

// Thresholds for the baseline interview / readiness gate.
const TOPIC_COVERAGE_MIN = 60;
const READINESS_MIN = 75;

const includesAny = (s: string, ...needles: string[]) => needles.some((n) => s.toLowerCase().includes(n));

export function evaluateEligibility(p: MockProfile): EligibilityResult {
  const verification = p.user.verificationStatus ?? '';
  const trust = p.user.trustStatus ?? '';

  const identityVerified = includesAny(verification, 'verified', 'complete') && !includesAny(verification, 'incomplete', 'pending');
  const interviewComplete = p.profileConfidence >= TOPIC_COVERAGE_MIN || includesAny(trust, 'ready', 'complete');
  const topicsCovered = p.profileConfidence >= TOPIC_COVERAGE_MIN;
  const readinessMet = p.profileConfidence >= READINESS_MIN || includesAny(trust, 'ready', 'complete');
  const hasHardDisqualifier = p.hardGates.length > 0;
  const availability = p.currentAvailabilityStatus;
  const intent = p.relationshipIntentCategory;

  const checks: EligibilityCheck[] = [
    {
      key: 'identity_verified',
      label: 'Identity verification complete',
      passed: identityVerified,
      severity: 'completion',
      detail: identityVerified ? `Verified (${verification})` : `Verification pending/incomplete (${verification || 'unknown'})`,
    },
    {
      key: 'interview_complete',
      label: 'Baseline interview complete',
      passed: interviewComplete,
      severity: 'completion',
      detail: interviewComplete ? 'Baseline intake interview is complete' : 'Baseline intake interview is unfinished',
    },
    {
      key: 'topics_covered',
      label: 'Required compatibility topics covered',
      passed: topicsCovered,
      severity: 'completion',
      detail: `Topic coverage ~${p.profileConfidence}% (min ${TOPIC_COVERAGE_MIN}%)`,
    },
    {
      key: 'matching_consent',
      label: 'Consented to matching',
      passed: p.matchingConsent,
      severity: 'completion',
      detail: p.matchingConsent ? 'User has consented to enter matching' : 'User has not yet consented to matching',
    },
    {
      key: 'readiness_threshold',
      label: 'Profile readiness threshold met',
      passed: readinessMet,
      severity: 'completion',
      detail: `Profile confidence ${p.profileConfidence}% (threshold ${READINESS_MIN}%)`,
    },
    {
      key: 'hard_disqualifiers_resolved',
      label: 'Hard disqualifiers resolved',
      passed: !hasHardDisqualifier,
      severity: 'hard',
      detail: hasHardDisqualifier ? `Unresolved: ${p.hardGates.join('; ')}` : 'No hard disqualifiers carried',
    },
    {
      key: 'availability_clear',
      label: 'Current availability clear & ethically available',
      passed: availability === 'single' || availability === 'divorced' || availability === 'widowed',
      severity: availability === 'currently_involved' ? 'hard' : 'completion',
      detail:
        availability === 'currently_involved'
          ? 'Currently involved — not ethically available'
          : availability === 'separated'
            ? 'Separated — availability requires verification'
            : availability === 'unclear'
              ? 'Availability unclear — needs verification'
              : `Available (${availability})`,
    },
    {
      key: 'intent_qualifies',
      label: 'Seeking a serious long-term partner',
      passed: intent !== 'casual' && intent !== 'uncertain',
      severity: intent === 'casual' ? 'hard' : 'completion',
      detail:
        intent === 'casual'
          ? 'Seeking casual — outside this service’s serious long-term scope'
          : intent === 'uncertain'
            ? 'Relationship intent not yet clear'
            : `Serious intent (${intent})`,
    },
  ];

  const hardFailures = checks.filter((c) => !c.passed && c.severity === 'hard');
  const completionFailures = checks.filter((c) => !c.passed && c.severity === 'completion');

  const status: EligibilityStatus = hardFailures.length
    ? 'not_eligible'
    : completionFailures.length
      ? 'needs_completion'
      : 'eligible';

  const readinessScore = Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);
  const blockingReasons = [...hardFailures, ...completionFailures].map((c) => c.detail);

  const summary =
    status === 'eligible'
      ? 'Baseline complete, verified, consented, and ethically available — in the Eligible Match Pool.'
      : status === 'not_eligible'
        ? `Not a match candidate: ${hardFailures.map((c) => c.label.toLowerCase()).join('; ')}.`
        : `Needs completion before matching: ${completionFailures.map((c) => c.label.toLowerCase()).join('; ')}.`;

  return { status, statusLabel: ELIGIBILITY_LABELS[status], readinessScore, checks, blockingReasons, summary };
}
