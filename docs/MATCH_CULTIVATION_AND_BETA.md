# Match Cultivation and Beta Plan

## Purpose

This document defines the next layer of Project Riverfuck: match cultivation, synthetic profile testing, privacy-controlled media/profile reveal, anti-stringing mechanics, and early free beta intake.

The product should not behave like a normal dating app. It should behave more like an always-running compatibility monitor that waits for evidence, compares profiles, and recommends only when the match is strong enough.

## Core Product Rule

Possible matches are not the same as recommended matches.

The system should continuously evaluate the user pool, but it should not push weak matches just to create activity.

If a match is below threshold, the product should say:

> Possible matches exist, but we do not recommend moving forward yet. The compatibility confidence is below our standard.

## Match Cultivation Concept

The system should behave like a background watcher.

As new users join, complete interviews, correct their profiles, upload media, and verify trust status, the system should continually re-evaluate compatibility.

Similar analogy:

> A screen-watch script notices when the screen goes weird and fixes it.

In this product:

> The match cultivation engine notices when new evidence, new users, or new criteria create a stronger possible match.

## Match Cultivation Engine

Create a background-compatible service skeleton named something like `matchCultivationEngine`.

Responsibilities:

1. Watch for newly eligible users.
2. Watch for updated profile criteria.
3. Watch for completed topic coverage.
4. Watch for trust/verification status changes.
5. Compare users against candidate pools.
6. Identify possible matches.
7. Suppress matches below threshold.
8. Place high-confidence matches into review/recommendation queue.
9. Re-run when important profile evidence changes.
10. Explain why a match is recommended or not recommended.

Prototype can run manually in the UI instead of as a true background worker.

## Key Match Numbers

The product should separate these values:

### Profile Confidence
How well the system understands the user.

Inputs:

- topic coverage
- time spent talking to AI
- number of sessions
- contradiction resolution
- user corrections
- imported AI profile quality
- verification completion

### Pool Probability
How likely it is to find suitable people within the user's constraints.

Inputs:

- location radius
- local population/pool size
- age/life-stage range
- relationship intent
- children/family requirements
- relocation willingness
- attraction flexibility
- rare/strict compatibility needs

### Recommendation Confidence
How strong a specific candidate recommendation is.

Inputs:

- hard gate pass/fail
- values compatibility
- communication fit
- conflict/repair style
- family/children compatibility
- lifestyle fit
- affection/sex compatibility
- attraction floor
- humor/playfulness fit
- trust/safety status
- risk flags

## Threshold Logic

Prototype threshold suggestions:

- Minimum profile confidence before matching: 70%
- Minimum recommendation confidence to show as possible: 65%
- Minimum recommendation confidence to recommend: 75%
- Preferred high-confidence recommendation: 82%+
- Any hard-gate failure: do not recommend

These are prototype values only. Do not advertise them as proven success odds.

## Match Cadence

The product should avoid endless match delivery.

Prototype rule:

- Users may receive up to one serious recommendation per month.
- The system may internally review more candidates, but should not expose a scrollable list.
- In a 12-month service period, the goal is a small number of serious opportunities, not constant browsing.

Potential product statement:

> We do not send matches just to keep you busy. We wait until the evidence supports a meaningful recommendation.

## Pricing Placeholder

Founder direction:

- 12-month service period
- $1,200 annual price target
- Equivalent to $100/month, but positioned as a 12-month compatibility service, not a normal monthly app subscription
- Payment handling/financing can be handled later by partners; the platform should not act like a bank in the prototype

Do not overbuild billing in the first prototype. Represent pricing as placeholder copy only.

Do not promise guaranteed relationships.

## Free Beta Intake

Founder direction:

- Offer limited free memberships during an early beta window.
- Example: 10 free monthly memberships released during a specific join window.
- Possible timing: until July 4 or July 5 for the first test push.

Prototype should support a simple beta invite/claim concept:

- beta slots available
- claim free month
- early tester acknowledgment
- no guarantee disclaimer
- consent for private AI profile-building
- feedback requested

Important: beta testers are helping test the interview and profile-building process. Full matching may be limited until enough users exist.

## Synthetic Test Profiles

Before real users exist, build synthetic profiles to test the engine.

Codex/Claude/Coding agents should generate at least 1,000 synthetic test personas for matching simulation.

These are not fake users shown publicly. They are internal QA data.

Each synthetic profile should include:

- age
- location region
- relationship status
- relationship intent
- children status
- wants children / does not want children
- religion/worldview
- politics tolerance
- communication style
- conflict style
- emotional regulation
- attachment/closeness style
- humor/playfulness style
- affection level
- libido level
- sexual boundary compatibility placeholders
- lifestyle preferences
- work/money values
- health/substance boundaries
- attraction preferences
- dealbreakers
- flexibility levels
- verification status placeholder
- risk flags placeholder

## Synthetic Profile Variance

The generator must create realistic variety.

Include profiles that are:

- mainstream/easy-to-match
- high-specificity/rarer-fit
- rural
- urban
- divorced with kids
- never married
- widowed
- religious
- nonreligious
- politically strict
- politically tolerant
- affectionate/high-libido
- affectionate/low-libido
- emotionally steady
- conflict avoidant
- direct communicators
- indirect communicators
- playful/banter-heavy
- serious/low-playfulness
- relocation-open
- location-locked

Do not make every synthetic profile ideal. The engine needs bad matches, weak matches, possible matches, and strong matches.

## Synthetic Match Simulation

Build a test harness that can:

1. Generate N synthetic profiles.
2. Pick one seed profile.
3. Compare seed profile against all candidates.
4. Sort candidates by recommendation confidence.
5. Show why top candidates rank high.
6. Show why vetoed candidates fail.
7. Show threshold bands:
   - do not recommend
   - possible but weak
   - possible but needs more info
   - recommended
   - high-confidence recommended

## Privacy-Controlled Profile Reveal

Users may upload private material, including:

- current photos
- older photos
- childhood photos
- videos
- personal stories
- voice/video introductions
- private profile sections

But these are not public browsing content.

Default rule:

> Private materials are used to build the user's compatibility model and are not shown to other users unless the user approves a reveal.

Recommended reveal flow:

1. System identifies a high-confidence match.
2. Both users receive an AI recommendation summary.
3. Both users independently choose accept/decline.
4. If both accept, the system opens a controlled mutual reveal.
5. Users can choose which profile sections/media are shared.
6. Messaging opens only after mutual acceptance.

## Match Recommendation Summary

Before users see full profiles, they should see a compatibility summary.

Include:

- why the AI recommends this match
- shared strengths
- complementary differences
- caution areas
- readiness/confidence levels
- trust/verification status
- attraction floor status, without reducing the person to looks

Do not show raw private transcripts.

## Anti-Stringing Mechanics

Users are here to meet someone, not collect attention.

The product should discourage dragging people along.

Prototype rules:

- No endless open inbox.
- Messaging opens only after mutual acceptance.
- Suggested move-forward checkpoints.
- If both users keep engaging, the AI periodically asks whether they want to meet, continue talking, or close the match.
- If one user repeatedly delays without reason, the system can mark the match as stalled.
- Users can close a match cleanly without ghosting.

Possible UI states:

- Recommendation received
- Accepted by you
- Awaiting other person
- Mutual reveal open
- Messaging open
- First conversation suggested
- Meet/continue/close checkpoint
- Closed respectfully
- Stalled

## Media and Looks

Looks matter, but they should not dominate.

The system should include:

- attraction preferences
- current photos
- optional historical photos
- videos
- style/aesthetic info

But it should not become a public photo-rating market.

Attraction should operate as:

- attraction floor
- attraction compatibility
- style/vibe understanding
- photo/video context after recommendation

Not as:

- swipe-first sorting
- hotness ranking
- public browsing
- infinite profile shopping

## Chemistry Categories

The engine must include chemistry beyond looks.

Track:

- banter compatibility
- playful antagonistic chemistry
- physical affection preference
- libido compatibility
- sexual communication comfort
- emotional safety
- good-intent default
- ability to tell intensity from anger/attack
- ability to talk through confusion

For some users, these categories are major or required.

## Data Model Additions

Add prototype types/interfaces for:

```ts
type MatchCultivationRun = {
  id: string;
  startedAt: string;
  completedAt?: string;
  seedUserId?: string;
  candidatesEvaluated: number;
  possibleMatches: number;
  recommendedMatches: number;
  vetoedMatches: number;
};

type MatchQueueItem = {
  id: string;
  userId: string;
  candidateUserId: string;
  status: 'possible' | 'needs_more_info' | 'recommended' | 'shown' | 'accepted_by_user' | 'mutual_accept' | 'declined' | 'closed' | 'stalled';
  recommendationConfidence: number;
  profileConfidence: number;
  poolProbability: number;
  hardGatePass: boolean;
  reasonsForMatch: string[];
  cautionAreas: string[];
  vetoReasons: string[];
  createdAt: string;
  updatedAt: string;
};

type BetaSlot = {
  id: string;
  label: string;
  status: 'available' | 'claimed' | 'expired';
  freeMonths: number;
  claimedByUserId?: string;
  claimedAt?: string;
};

type PrivateMediaAsset = {
  id: string;
  userId: string;
  type: 'photo' | 'video' | 'voice' | 'document' | 'story';
  title: string;
  description?: string;
  visibility: 'private_ai_only' | 'approved_for_mutual_reveal' | 'shared_after_mutual_accept';
  createdAt: string;
};
```

## Prototype Pages to Add or Extend

Add/extend:

- `/app/beta` — claim beta/free month page
- `/app/media` — private media/profile material vault
- `/app/match-queue` — recommendation queue/status page, no browsing
- `/app/match/[id]` — controlled recommendation summary and accept/decline
- `/admin/synthetic-profiles` — generate/test synthetic personas
- `/admin/cultivation-runs` — view match simulation/cultivation runs

## Direct Codex Instruction

Add this layer after the initial app shell and profile dashboard exist.

Build mock-first.

The prototype should demonstrate that:

- users build deep private profiles over time
- the system keeps watching for better matches as more people join
- weak matches are suppressed
- mutual reveal is controlled
- private media is not public browsing
- synthetic profiles can test the matching engine before real users exist
- early beta access can be represented with limited free-month slots

Do not build a normal dating app.
Do not build a swipe deck.
Do not build public browsing.
Do not let messaging become endless attention collection.

Build a serious compatibility service where users are guided toward meeting someone, not stringing people along.
