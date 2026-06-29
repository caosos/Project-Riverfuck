import type { MatchAssessment, MockProfile, RelationshipStructure } from './types';

// Corrected compatibility model for a serious, exclusive-by-default partnership service.
//
// Key correction: monogamy is the expected target state, NOT a veto. Two exclusive
// people are a normal, compatible pairing. A structure veto only fires when one
// person requires exclusivity and the other explicitly wants open/poly/non-exclusive.
// Likewise, intent is no longer vetoed on a free-text string mismatch — only a real
// serious-vs-casual conflict, a not-ethically-available status, or a true hard
// disqualifier produces a veto.

const OPEN_STRUCTURES: RelationshipStructure[] = ['open_relationship', 'polyamorous', 'non_exclusive'];
const SERIOUS_INTENTS = ['lifelong_partner', 'marriage_or_life_commitment', 'serious_long_term', 'long_term_but_slow_pace'];

export function assessCompatibility(a: MockProfile, b: MockProfile): MatchAssessment {
  const vetoReasons: string[] = [];

  // 1. True hard disqualifiers carried on either case file.
  const combinedGates = [...a.hardGates, ...b.hardGates];
  if (combinedGates.length) vetoReasons.push(...combinedGates.map((g) => `hard disqualifier: ${g}`));

  // 2. Structure conflict — exclusivity required vs explicitly open/poly/non-exclusive.
  const aExclusive = a.relationshipStructure === 'exclusive_monogamous';
  const bExclusive = b.relationshipStructure === 'exclusive_monogamous';
  const aOpen = OPEN_STRUCTURES.includes(a.relationshipStructure);
  const bOpen = OPEN_STRUCTURES.includes(b.relationshipStructure);
  if ((aExclusive && bOpen) || (bExclusive && aOpen)) {
    vetoReasons.push('relationship structure conflict: one requires exclusivity, the other wants open/non-exclusive');
  }

  // 3. Commitment conflict — serious/lifelong vs casual. (Not a string mismatch.)
  const aSerious = SERIOUS_INTENTS.includes(a.relationshipIntentCategory);
  const bSerious = SERIOUS_INTENTS.includes(b.relationshipIntentCategory);
  const aCasual = a.relationshipIntentCategory === 'casual';
  const bCasual = b.relationshipIntentCategory === 'casual';
  if ((aSerious && bCasual) || (bSerious && aCasual)) {
    vetoReasons.push('commitment mismatch: serious/lifelong intent vs casual intent');
  }

  // 4. Not ethically available — currently involved and not in an open structure.
  if (b.currentAvailabilityStatus === 'currently_involved' && !bOpen) {
    vetoReasons.push('candidate is not ethically available (currently involved)');
  }
  if (a.currentAvailabilityStatus === 'currently_involved' && !aOpen) {
    vetoReasons.push('seeker is not ethically available (currently involved)');
  }

  // Cautions are concerns that lower confidence without vetoing.
  const cautionAreas = ['More evidence needed on conflict repair and intimacy boundaries'];
  if (a.currentAvailabilityStatus === 'unclear' || b.currentAvailabilityStatus === 'unclear') {
    cautionAreas.push('Current availability is unclear and needs verification');
  }
  if (a.relationshipIntentCategory === 'uncertain' || b.relationshipIntentCategory === 'uncertain') {
    cautionAreas.push('Relationship intent is not yet clear');
  }
  if (a.poolProbability < 45 || b.poolProbability < 45) {
    cautionAreas.push('Local pool probability may limit timing');
  }

  const attractionFloorPass = (a.attractionFloor + b.attractionFloor) / 2 >= 60;
  const profileConfidence = Math.round((a.profileConfidence + b.profileConfidence) / 2);
  const poolProbability = Math.min(a.poolProbability, b.poolProbability);
  const riskFlags = [...new Set([...a.riskFlags, ...b.riskFlags])];

  // Both exclusive + both serious is the product's target; reward it.
  const bothExclusiveSerious = aExclusive && bExclusive && aSerious && bSerious;
  const recommendationConfidence = Math.max(
    0,
    Math.min(
      95,
      Math.round(
        profileConfidence * 0.45 +
          poolProbability * 0.2 +
          (attractionFloorPass ? 18 : 0) +
          (bothExclusiveSerious ? 8 : 0) -
          riskFlags.length * 4 -
          vetoReasons.length * 25,
      ),
    ),
  );

  const reasonsForMatch: string[] = [];
  if (bothExclusiveSerious) reasonsForMatch.push('Both seek exclusive, serious long-term commitment (product target state)');
  reasonsForMatch.push('Honesty and verification are prioritized on both case files');
  if (attractionFloorPass) reasonsForMatch.push('Attraction floor is met as one structured category among many');

  return {
    hardGatePass: vetoReasons.length === 0,
    profileConfidence,
    poolProbability,
    recommendationConfidence,
    attractionFloorPass,
    riskFlags,
    reasonsForMatch,
    cautionAreas,
    vetoReasons,
  };
}
