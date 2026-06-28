# Product Specification — Project Riverfuck

## Temporary codename

Project Riverfuck

Public brand name: TBD.

## Category

AI-powered human compatibility platform.

Initial use case: serious romantic relationship matching.

Long-term category: trusted human compatibility and introduction system.

## Problem

Most dating apps are designed around engagement loops, not relationship outcomes. Users are encouraged to browse, swipe, judge quickly, and keep returning. This creates poor incentives:

- shallow visual-first selection
- inflated profiles
- fake or low-effort accounts
- ghosting
- decision fatigue
- unrealistic preference loops
- poor compatibility discovery
- revenue tied to continued singleness or continued usage

## Mission

Build a system that helps people find genuinely compatible partners through truth-first profile construction, AI-guided self-discovery, compatibility analysis, and high-quality introductions.

## Core user promise

We are not trying to show you hundreds of people. We are trying to find one person worth meeting.

## Foundational principles

1. Truth first
   - The profile should be honest, detailed, and internally consistent.
   - AI should help users discover and express the truth, not market themselves falsely.

2. Compatibility over popularity
   - Ranking should not optimize for likes, swipes, or superficial popularity.
   - Scoring should optimize for likely long-term fit.

3. Low-volume, high-confidence introductions
   - One strong match per period may be better than constant browsing.
   - Cadence may be monthly or adaptive.

4. Explainability
   - Users should understand why a match is recommended.
   - The system should expose compatibility strengths, risks, and unknowns.

5. Agency with challenge
   - Users can accept or decline.
   - If they decline, the system should ask why.
   - If their reason conflicts with stated priorities, the system may respectfully challenge the contradiction.

6. Verification where useful
   - Claims should be optionally verified where reasonable: identity, age, relationship status, employment, location, photos, etc.
   - Verification should reduce fraud and misrepresentation.

7. Privacy and consent
   - Deep profiles require strong privacy boundaries.
   - Users must understand what is collected, why, and how it is used.

## Core product loop

1. Intake
   - User creates account.
   - User selects relationship intent.
   - User confirms they want a serious compatibility process, not swipe browsing.

2. AI interview
   - AI conducts a layered interview.
   - User answers structured and open-ended questions.
   - AI asks follow-up questions for ambiguity, contradiction, and missing context.

3. Profile construction
   - System converts raw responses into a structured compatibility profile.
   - User can review, correct, lock, or mark sensitive fields.

4. Preference modeling
   - User describes desired partner.
   - AI separates hard requirements, strong preferences, flexible preferences, shallow filters, and possible contradictions.

5. Compatibility analysis
   - System compares users across profile dimensions.
   - Incompatibilities are filtered before matches are shown.
   - High-fit candidates receive explanation scoring.

6. Introduction recommendation
   - User receives a limited number of high-confidence recommendations, possibly one per month.
   - Recommendation includes reasoning, not just a profile card.

7. Acceptance / decline
   - If both accept, introduction proceeds.
   - If declined, AI collects reason and updates model.

8. Feedback and learning
   - After communication or meeting, users can provide outcome feedback.
   - The system learns from match quality, not app engagement alone.

## MVP scope

The MVP should prove the core claim: a deeper AI-built profile can produce a better explained compatibility recommendation than swipe browsing.

### MVP must include

- Account creation
- AI-guided intake prototype
- Structured profile schema
- Basic question bank
- Preference/dealbreaker capture
- Compatibility scoring prototype
- Match explanation generator
- Decline reason capture
- Admin/debug view of profile dimensions and scores

### MVP should not include yet

- Real payments
- Large public launch
- Full identity verification
- Real-time chat at scale
- Dating marketplace growth features
- Ads
- Public claims of scientific validation

## Key product features

### AI profile builder

The AI should interview the user like a serious compatibility consultant. It should ask questions, detect vague responses, ask for examples, and build a structured model of the person.

### Compatibility engine

The engine should evaluate:

- values alignment
- lifestyle alignment
- emotional/communication fit
- conflict style compatibility
- family/children expectations
- religion/politics tolerance
- money behavior
- time availability
- location/logistics
- attraction preferences
- dealbreakers
- growth mindset
- relationship goals

### Match explanation

Every recommendation should include:

- why this person was selected
- highest compatibility dimensions
- known risks or differences
- recommended first conversation topics
- what not to assume
- confidence level and missing information

### Decline reasoning

When a user rejects a match, ask:

- What specifically caused the decline?
- Was it a hard requirement, strong preference, uncertainty, attraction issue, fear, logistics, or something else?
- Should this update future matching?

### Anti-swipe design

Avoid interfaces that encourage rapid superficial rejection.

Potential UI concepts:

- recommendation dossier
- guided introduction
- compatibility report
- meeting readiness checklist
- blind/limited-photo flow until mutual interest

## Possible business model

- Serious membership subscription
- Paid profile-building process
- Match success guarantee/refund experiment
- Referral rewards
- Minimal ads or no ads
- Premium verification services
- Coaching/introduction support

Important: incentives should align with successful relationships, not endless usage.

## Success metrics

Avoid pure engagement metrics as primary success metrics.

Better metrics:

- profile completion depth
- self-reported profile accuracy
- match acceptance rate
- first conversation rate
- meeting rate
- post-meeting satisfaction
- 30/90/180/365-day relationship outcomes
- decline reasons and avoidable mismatch rate
- user trust score

## Strategic positioning

Not another dating app.

A serious compatibility system for people who are tired of swiping, guessing, and wasting time.

Possible positioning lines:

- One serious match is worth more than a thousand swipes.
- Dating is guessing. Compatibility is evidence.
- We do not show you everyone. We find someone worth meeting.
- Truth before attraction.
- Built on compatibility, not popularity.
