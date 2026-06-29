export type Confidence='low'|'medium'|'high'; export type Importance='minor'|'moderate'|'major'|'required';

// Structured relationship taxonomy. These replace vague dating-app "status" fields.
// For this product, exclusive long-term commitment is the expected target state — not a veto.
export type RelationshipStructure='exclusive_monogamous'|'open_relationship'|'polyamorous'|'non_exclusive'|'unclear';
export type RelationshipIntentCategory='lifelong_partner'|'marriage_or_life_commitment'|'serious_long_term'|'long_term_but_slow_pace'|'casual'|'uncertain';
export type CurrentAvailabilityStatus='single'|'divorced'|'widowed'|'separated'|'currently_involved'|'unclear';

export type User={id:string;preferredName:string;age:number;relationshipStatus:string;relationshipIntent:string;locationCity:string;locationState:string;relocationWillingness:string;verificationStatus:string;trustStatus:string;};
export type Topic={name:string;coverage:number;confidence:Confidence;unresolved:number;required:boolean};
export type ProfileObservation={trait:string;evidence:string;sourceType:'conversation'|'user_correction'|'verification'|'trusted_context';confidence:Confidence;userConfirmed:boolean|null};
export type ProfileCategory={id:string;categoryName:string;summary:string;observedTraits:string[];evidenceSnippets:string[];confidenceLevel:Confidence;importanceLevel:Importance;matchLogic:'similarity_needed'|'difference_tolerated'|'complement_preferred'|'hard_conflict';observations:ProfileObservation[];openQuestions:string[]};
export type MockProfile={user:User;topics:Topic[];categories:ProfileCategory[];hardGates:string[];riskFlags:string[];attractionFloor:number;profileConfidence:number;poolProbability:number;relationshipStructure:RelationshipStructure;relationshipIntentCategory:RelationshipIntentCategory;currentAvailabilityStatus:CurrentAvailabilityStatus;matchingConsent:boolean;};
export type MatchAssessment={hardGatePass:boolean;profileConfidence:number;poolProbability:number;recommendationConfidence:number;attractionFloorPass:boolean;riskFlags:string[];reasonsForMatch:string[];cautionAreas:string[];vetoReasons:string[]};
