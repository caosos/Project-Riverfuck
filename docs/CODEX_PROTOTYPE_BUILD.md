# Codex Prototype Build Spec

## Mission

Build a prototype website for Project Riverfuck, a private AI-powered human compatibility platform.

This is not a dating app clone. This is a conversation-first compatibility engine where the AI learns the user, builds a private model, checks readiness, and recommends only when evidence supports it.

## Product Thesis

Most dating products optimize attention. This product optimizes relationship fit.

Users do not browse strangers. Users do not swipe. Users do not create marketing profiles for public display.

Users talk to the AI. The AI asks follow-up questions, detects contradictions, builds a private compatibility model, and shows the user what it currently understands.

The user's raw conversations remain private. Matching uses structured derived evidence, not public profile performance.

## Prototype Scope

Build a clickable web app prototype with realistic mock data and a clear architecture for later LLM integration.

Required sections:

1. Public landing page
2. How it works page
3. Privacy / trust page
4. Authenticated app shell
5. Onboarding flow
6. Trust and verification flow
7. AI interview dashboard
8. Topic coverage tracker
9. Private compatibility model dashboard
10. Attraction preference builder
11. Match readiness page
12. Matches placeholder page with no swipe UI
13. Internal admin/review pages
14. Matching logic skeleton utilities

## Recommended Stack

If the repo is empty or unopinionated, use:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Local mock data first
- Modular service layer for future LLM/image/auth/verification integrations

If an existing stack is present, adapt this spec to the existing stack instead of replacing working architecture.

## Route Plan

Public:

- `/`
- `/how-it-works`
- `/privacy`
- `/trust-safety`

Authenticated prototype:

- `/app`
- `/app/onboarding`
- `/app/trust`
- `/app/interview`
- `/app/profile`
- `/app/attraction`
- `/app/readiness`
- `/app/matches`
- `/app/settings`

Internal prototype:

- `/admin/users`
- `/admin/users/[id]`
- `/admin/match-review`

## Landing Page Requirements

The landing page should immediately communicate:

- This is not swiping.
- This is not public profile browsing.
- The AI builds a private compatibility model through conversation.
- Identity and trust matter.
- One strong recommendation is better than many weak matches.

Suggested hero copy:

> Find someone who actually fits.

Suggested subheadline:

> Private AI-guided compatibility matching built on conversation, trust, and evidence — not swipes, public profiles, or engagement games.

Core sections:

- Problem with modern dating apps
- How this works
- Private conversation model
- Trust and verification
- Match readiness
- Attraction as one category
- Call to action: Start your private model

## Onboarding Flow

Collect minimal required fields for the prototype:

- preferred name
- age range or DOB placeholder
- location city/state
- relationship status declaration
- relationship intent
- children status / children preference
- location radius
- willingness to relocate
- truthfulness acknowledgment
- privacy acknowledgment

Do not create a 500-question form. This is initial setup only.

## Trust and Verification Flow

Prototype statuses:

- Identity not started
- Identity pending
- Identity verified
- Availability declared
- Relationship availability review pending
- Trust review complete
- Restricted / needs review

Show clear language:

> This system depends on truthful participation. If you give the AI a fake version of yourself, it will search for someone compatible with that fake version.

Use mock verification. Do not integrate a real background-check provider in this prototype.

## AI Interview Dashboard

This is the center of the product.

UI requirements:

- Chat interface
- Optional voice-ready UI placeholder
- Topic coverage sidebar/card
- Current conversation topic
- AI-generated follow-up prompt area
- Saveable mock transcript state

The AI should be framed as a private interviewer, not a chatbot toy.

Example prompts:

- What would you like to talk about today?
- We have talked a lot about values, but not much about conflict. Can we cover that next?
- Earlier you described needing closeness, but also needing solitude after work. Which one matters more in a relationship?
- You do not need to impress me. I am not your match. My job is to understand you accurately enough to search for someone who may actually work for you.

## Topic Coverage Categories

Track at least these categories:

1. Identity and life situation
2. Relationship intent
3. Values and worldview
4. Communication style
5. Conflict and repair style
6. Emotional regulation
7. Family and children
8. Lifestyle and daily routine
9. Work and money
10. Health, sleep, fitness, and substances
11. Sex, affection, boundaries, and intimacy
12. Attraction and aesthetic preferences
13. Dealbreakers and hard requirements
14. Growth, accountability, and self-awareness
15. Natural conversation interests

Each topic should show:

- coverage percentage
- confidence level
- unresolved questions count
- required before matching: true/false

## Private Compatibility Model Dashboard

Display the AI's current model of the user.

Each category card should include:

- summary
- observed traits
- evidence snippets
- confidence level
- importance level
- match logic
- user correction controls

Correction controls:

- Accurate
- Partly accurate
- Inaccurate
- Add clarification
- Ask me more about this

Every observation should store:

- trait
- evidence
- source type
- confidence
- user-confirmed status

## Attraction Preference Builder

Attraction is one category. It matters, but it cannot dominate.

Build a guided attraction builder that lets the user provide examples and structured preferences without turning the app into a public user browser.

Allowed reference inputs:

- actors
- actresses
- fictional characters
- public figures
- style archetypes
- descriptive traits
- movie/show examples

Prototype structured fields:

- hair color
- hair style
- eye preferences
- lips / smile / facial features
- body type
- height range
- clothing style
- grooming style
- general vibe / energy
- turnoffs
- flexibility level

The UI should then summarize:

> Based on your examples, you appear to prefer [summary]. Is that accurate?

Add a placeholder for future representative AI-generated image creation:

- Not a real user
- Not a match candidate
- Only an illustrative preference reference

Important scoring rule:

- Attraction contributes to an attraction floor.
- Attraction should not overpower hard gates, trust, values, conflict style, family/children, or major incompatibilities.

## Readiness Dashboard

Show three separate numbers/statuses:

### Profile Confidence
How well the system understands the user.

### Pool Probability
How likely it is to find suitable people within the user's constraints.

### Recommendation Confidence
How strong a specific recommendation is when a candidate exists.

Do not present one fake universal success percentage.

Show readiness states:

- Not ready
- Needs more conversation
- Verification pending
- Matchable but local pool limited
- Ready for recommendation
- Recommendation available

If below threshold, say:

> Possible matches exist, but we do not recommend moving forward yet. The compatibility confidence is below our standard.

## Matching Logic Skeleton

Create utility functions that accept two mock profiles and return a structured compatibility assessment.

Required output:

```ts
type MatchAssessment = {
  hardGatePass: boolean;
  profileConfidence: number;
  poolProbability: number;
  recommendationConfidence: number;
  attractionFloorPass: boolean;
  riskFlags: string[];
  reasonsForMatch: string[];
  cautionAreas: string[];
  vetoReasons: string[];
};
```

Prototype logic categories:

Hard gates:

- identity invalid
- relationship unavailable
- hidden marriage / conflict
- monogamy mismatch
- wants children mismatch
- location impossible
- major safety concern
- dealbreaker conflict

Core weighted categories:

- relationship intent
- values
- communication style
- conflict repair
- emotional regulation
- family and children
- lifestyle
- trust consistency

Modifier categories:

- humor
- hobbies
- routines
- social energy
- food and travel preferences
- aesthetics
- attraction

Risk reducers:

- unresolved contradiction
- deception flag
- instability flag
- major mismatch
- low profile confidence

## Data Model Sketch

```ts
type User = {
  id: string;
  legalName?: string;
  preferredName: string;
  dob?: string;
  age?: number;
  gender?: string;
  orientation?: string;
  relationshipStatus: string;
  locationCity: string;
  locationState: string;
  relocationWillingness: string;
  verificationStatus: string;
  trustStatus: string;
  createdAt: string;
  updatedAt: string;
};

type ProfileCategory = {
  id: string;
  userId: string;
  categoryName: string;
  summary: string;
  confidenceLevel: 'low' | 'medium' | 'high';
  importanceLevel: 'minor' | 'moderate' | 'major' | 'required';
  matchLogic: 'similarity_needed' | 'difference_tolerated' | 'complement_preferred' | 'hard_conflict';
  lastUpdated: string;
};

type ProfileObservation = {
  id: string;
  userId: string;
  categoryId: string;
  traitName: string;
  evidenceText: string;
  sourceType: 'conversation' | 'imported_ai_packet' | 'user_correction' | 'verification' | 'trusted_context';
  confidenceLevel: 'low' | 'medium' | 'high';
  userConfirmed: boolean | null;
  createdAt: string;
};

type AttractionProfile = {
  id: string;
  userId: string;
  description: string;
  exampleReferences: string[];
  visualTraits: Record<string, unknown>;
  generatedReferenceImageUrl?: string;
  confidenceLevel: 'low' | 'medium' | 'high';
};
```

## Seed Data

Use sanitized mock data only.

Create a thoughtful/direct serious-user seed persona:

- practical
- direct communicator
- values honesty
- dislikes fake interaction
- wants serious relationship
- sex matters but is not the foundation
- wants to avoid months of accidental incompatibility discovery
- prefers evidence-guided matching over swipe behavior
- needs someone who can handle intensity without assuming hostility

Do not include real private personal details in public seed data.

## Admin Prototype

Admin/reviewer pages should show:

- user list
- verification status
- topic coverage
- profile confidence
- unresolved contradictions
- risk flags
- match readiness
- candidate match queue placeholder

Admin pages are prototype-only and should not expose raw transcripts by default.

## Implementation Order

### Phase 1

- app shell
- landing page
- public pages
- mock auth/session
- onboarding

### Phase 2

- interview page
- topic coverage tracker
- profile dashboard
- mock model data

### Phase 3

- attraction builder
- readiness dashboard
- matching utilities

### Phase 4

- admin pages
- polished mock data
- refine copy and layout

## Acceptance Criteria

The prototype is acceptable when:

- There is no swipe UI.
- The landing page clearly explains the difference from dating apps.
- The app has a private AI interview page.
- The user can see topic coverage and profile confidence.
- The private profile dashboard shows evidence-based observations.
- Attraction is presented as one category only.
- The readiness page separates profile confidence, pool probability, and recommendation confidence.
- The match skeleton can explain why a match is recommended or not recommended.
- Public/private data boundaries are respected.
- The UI feels serious, modern, and high-trust.

## Do Not Do

- Do not build public browsing.
- Do not build swipe cards.
- Do not use hot-or-not scoring language.
- Do not make attraction the dominant mechanic.
- Do not commit real private user profiles.
- Do not promise public success percentages without real outcome data.
- Do not make the system engagement-addictive.
- Do not bury the AI interview behind forms.

## Direct Codex Instruction

Use this spec as the source of truth for the first prototype build.

Build the site as a serious private compatibility engine. The prototype should make the product philosophy obvious immediately: conversation, trust, evidence, privacy, readiness, and one strong recommendation over endless weak matches.
