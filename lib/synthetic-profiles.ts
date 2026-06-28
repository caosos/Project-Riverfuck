import type { MockProfile } from './types';

export type SyntheticProfile = MockProfile & {
  synthetic: true;
  locationRegion: string;
  childrenStatus: string;
  wantsChildren: string;
  religionWorldview: string;
  politicsTolerance: string;
  communicationStyle: string;
  conflictStyle: string;
  emotionalRegulation: string;
  attachmentClosenessStyle: string;
  humorPlayfulnessStyle: string;
  affectionLevel: string;
  libidoLevel: string;
  sexualBoundaryCompatibility: string;
  lifestylePreferences: string[];
  workMoneyValues: string;
  healthSubstanceBoundaries: string[];
  attractionPreferences: string[];
  dealbreakers: string[];
  flexibilityLevels: string[];
};

type OptionSet = {
  regions: string[];
  relationshipStatuses: string[];
  relationshipIntents: string[];
  childrenStatuses: string[];
  wantsChildren: string[];
  worldviews: string[];
  politics: string[];
  communication: string[];
  conflict: string[];
  regulation: string[];
  closeness: string[];
  humor: string[];
  affection: string[];
  libido: string[];
  boundaries: string[];
  lifestyle: string[];
  money: string[];
  substances: string[];
  attraction: string[];
  dealbreakers: string[];
  flexibility: string[];
  verification: string[];
  riskFlags: string[];
};

const options: OptionSet = {
  regions: ['Austin, TX', 'Denver, CO', 'Seattle, WA', 'Chicago, IL', 'Atlanta, GA', 'Boston, MA', 'Phoenix, AZ', 'Portland, OR', 'Nashville, TN', 'Raleigh, NC', 'Boise, ID', 'rural Midwest', 'rural Mountain West', 'suburban Northeast', 'small-town South'],
  relationshipStatuses: ['single / available declared', 'divorced / available declared', 'widowed / available declared', 'separated / requires verification', 'relationship status unresolved'],
  relationshipIntents: ['serious long-term relationship', 'marriage-oriented long-term relationship', 'long-term relationship with slow pace', 'casual or uncertain'],
  childrenStatuses: ['no children', 'has children part-time', 'has children full-time', 'adult children', 'wants privacy on children details'],
  wantsChildren: ['wants children', 'does not want children', 'open to children', 'unsure / needs discussion', 'already has children and may be complete'],
  worldviews: ['Christian', 'Jewish', 'Muslim', 'spiritual but not religious', 'agnostic', 'atheist', 'interfaith-tolerant', 'values-led nonreligious'],
  politics: ['politically strict', 'politically tolerant', 'moderate / mixed household possible', 'apolitical but values-aware', 'high conflict if values diverge'],
  communication: ['direct and explicit', 'warm and diplomatic', 'reflective processor', 'fast verbal processor', 'reserved until trust builds', 'high-context communicator'],
  conflict: ['repair-oriented', 'conflict avoidant', 'direct confrontation then repair', 'needs cooldown before repair', 'collaborative problem solver', 'defensive under stress'],
  regulation: ['emotionally steady', 'anxious under uncertainty', 'shutdown under stress', 'high intensity but accountable', 'needs reassurance loops', 'well-regulated after cooldown'],
  closeness: ['secure / steady closeness', 'needs independence', 'high-touch closeness', 'slow-burn attachment', 'anxious closeness needs clarity', 'avoidant when pressured'],
  humor: ['dry wit', 'banter-heavy', 'playful antagonistic chemistry', 'gentle playful', 'serious / low playfulness', 'absurd and goofy'],
  affection: ['low affection', 'moderate affection', 'high affection', 'very high affection', 'private affection only'],
  libido: ['low libido', 'moderate libido', 'high libido', 'variable libido', 'needs strong emotional safety first'],
  boundaries: ['clear sexual communication', 'needs more intimacy-boundary evidence', 'conservative intimacy boundaries', 'sex-positive with explicit consent', 'low comfort discussing sex early'],
  lifestyle: ['urban walkable life', 'suburban stability', 'rural quiet', 'fitness-centered', 'homebody', 'travel-curious', 'community/family-heavy', 'career-intensive'],
  money: ['budget-conscious planner', 'entrepreneurial risk tolerant', 'stable saver', 'generous but needs guardrails', 'debt-averse', 'career rebuilding'],
  substances: ['no hard drugs', 'sober lifestyle', 'social alcohol acceptable', 'no smoking', 'cannabis incompatible', 'substance boundaries unresolved'],
  attraction: ['warm grounded presentation', 'expressive face', 'understated style', 'fitness-oriented lifestyle', 'creative aesthetic', 'traditional presentation', 'voice and presence matter', 'style flexibility high'],
  dealbreakers: ['fake identity', 'hidden unavailability', 'monogamy mismatch', 'wants children mismatch', 'major substance conflict', 'location impossibility', 'deliberate deception', 'incompatible intimacy boundaries'],
  flexibility: ['relocation-open', 'location-locked', 'age range flexible', 'age range strict', 'worldview flexible', 'worldview strict', 'family timeline flexible', 'family timeline strict'],
  verification: ['identity pending', 'identity verified', 'availability declared', 'trust review complete', 'verification incomplete'],
  riskFlags: ['verification pending', 'relationship status needs verification', 'low intimacy-boundary coverage', 'conflict repair needs more evidence', 'location constraint strict', 'politics tolerance unresolved', 'substance boundaries unresolved', 'no active risk flags'],
};

const pick = <T,>(arr: T[], i: number, salt = 0) => arr[(i * 37 + salt * 11) % arr.length];
const pickMany = (arr: string[], i: number, count: number, salt = 0) => Array.from({ length: count }, (_, n) => pick(arr, i + n, salt + n)).filter((v, n, a) => a.indexOf(v) === n);

export function generateSyntheticProfiles(count = 1000): SyntheticProfile[] {
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    const region = pick(options.regions, n, 1);
    const [locationCity, locationState = 'Internal'] = region.includes(', ') ? region.split(', ') : [region, 'Internal'];
    const relationshipIntent = pick(options.relationshipIntents, n, 3);
    const relationshipStatus = pick(options.relationshipStatuses, n, 2);
    const riskBase = pickMany(options.riskFlags, n, n % 5 === 0 ? 2 : 1, 9).filter((r) => r !== 'no active risk flags');
    const hardGates = n % 11 === 0 ? [pick(options.dealbreakers, n, 7)] : n % 29 === 0 ? ['relationship intent mismatch risk'] : [];
    const profileConfidence = Math.min(94, Math.max(34, 50 + (n * 17) % 45));
    const poolProbability = Math.min(88, Math.max(18, 28 + (n * 13) % 61));
    const attractionFloor = Math.min(92, Math.max(35, 45 + (n * 19) % 52));
    return {
      synthetic: true,
      user: {
        id: `synthetic-${String(n).padStart(4, '0')}`,
        preferredName: `Synthetic Persona ${String(n).padStart(4, '0')}`,
        age: 24 + (n * 7) % 34,
        relationshipStatus,
        relationshipIntent,
        locationCity,
        locationState,
        relocationWillingness: pick(options.flexibility, n, 12).includes('relocation') ? pick(options.flexibility, n, 12) : pick(['relocation-open', 'location-locked', 'open for exceptional fit'], n, 4),
        verificationStatus: pick(options.verification, n, 5),
        trustStatus: pick(['availability declared', 'trust review pending', 'trust review complete', 'requires follow-up'], n, 6),
      },
      locationRegion: region,
      childrenStatus: pick(options.childrenStatuses, n, 4),
      wantsChildren: pick(options.wantsChildren, n, 5),
      religionWorldview: pick(options.worldviews, n, 6),
      politicsTolerance: pick(options.politics, n, 7),
      communicationStyle: pick(options.communication, n, 8),
      conflictStyle: pick(options.conflict, n, 9),
      emotionalRegulation: pick(options.regulation, n, 10),
      attachmentClosenessStyle: pick(options.closeness, n, 11),
      humorPlayfulnessStyle: pick(options.humor, n, 12),
      affectionLevel: pick(options.affection, n, 13),
      libidoLevel: pick(options.libido, n, 14),
      sexualBoundaryCompatibility: pick(options.boundaries, n, 15),
      lifestylePreferences: pickMany(options.lifestyle, n, 3, 16),
      workMoneyValues: pick(options.money, n, 17),
      healthSubstanceBoundaries: pickMany(options.substances, n, 2, 18),
      attractionPreferences: pickMany(options.attraction, n, 3, 19),
      dealbreakers: pickMany(options.dealbreakers, n, 2, 20),
      flexibilityLevels: pickMany(options.flexibility, n, 3, 21),
      topics: [],
      categories: [],
      hardGates,
      riskFlags: riskBase,
      attractionFloor,
      profileConfidence,
      poolProbability,
    };
  });
}

export const syntheticProfiles = generateSyntheticProfiles(1000);
