# Codex Handoff — Project Riverfuck

## Immediate instruction

You are continuing Michael's AI human compatibility platform project. Do not treat this as a generic dating app. Treat it as a CAOS-style truth-first compatibility system.

Repository: `caosos/Project-Riverfuck`

Codename: `Project Riverfuck`

Codename status: temporary internal name only. Do not build public-facing brand assumptions around it.

## Core product thesis

Dating apps optimize for engagement. This project optimizes for successful human compatibility.

The platform should not flood users with endless profiles. It should build a deep, evidence-grounded understanding of each person, then recommend one genuinely strong match at a time with an explanation of why the match is worth serious consideration.

## Product philosophy

- Truth first.
- Compatibility before chemistry.
- Evidence over guessing.
- One high-quality match beats hundreds of shallow options.
- AI should reduce bad matches before people waste time meeting.
- The system should not emotionally manipulate users, but it can challenge shallow rejection patterns when those patterns conflict with the user's stated priorities.
- People retain agency. AI recommends, explains, challenges, and learns.

## Differentiator

Most dating products ask users to judge strangers from photos and short bios. This product first builds a serious profile through AI-guided conversation, structured questions, verification, behavioral signals, preferences, dealbreakers, and compatibility modeling.

The result should feel more like:

> We found someone who meets your stated standards and appears unusually compatible. Here is the evidence. Give this a real shot.

Not:

> Here are 500 people. Swipe until exhausted.

## Known designed concepts from prior conversations

1. AI-assisted profile creation
   - User works with AI over time.
   - AI asks layered questions.
   - User can write freely, upload photos/videos, and answer structured prompts.
   - AI helps identify contradictions, missing details, vague claims, and unrealistic preferences.

2. Truthful, honest, thorough profile
   - The profile should be deeper than a dating bio.
   - It should include personality, values, habits, goals, stress behavior, communication style, family expectations, money behavior, physical preferences, lifestyle, sex/romance expectations, religion/politics, health constraints, emotional patterns, conflict patterns, and practical life compatibility.

3. Limited matching cadence
   - One match per month was discussed as a possible model.
   - This is not a volume game.
   - Scarcity should signal seriousness, not artificial manipulation.

4. No real-photo-first browsing
   - Users may express attraction/preferences through example metrics or reference standards.
   - Real user photos may be hidden until both parties agree to consider/meet, depending on product design.
   - Purpose: reduce shallow swipe rejection and make compatibility the first layer.

5. Match explanation
   - The system should explain why a person is being recommended.
   - It should show strengths, risks, differences, and areas requiring honest conversation.
   - It should not claim certainty where there is only probability.

6. Decline feedback loop
   - If a user rejects a match, the system asks why.
   - The reason updates the model.
   - If the reason contradicts stated priorities, AI may point that out directly.
   - Example: user says they want long-term stability but rejects every stable candidate for shallow reasons.

7. Business model ideas
   - Subscription or paid serious-membership model.
   - Possible refund/reward idea if a relationship succeeds after a defined period, e.g. one year.
   - Referral program.
   - Minimal advertising, if any.
   - Incentives must align with successful relationships, not endless app usage.

8. Future expansion
   - Same compatibility engine could eventually support friendship, roommates, business partners, mentors, caregivers, senior companions, hiring, and other human-matching needs.
   - Do not overconstrain the architecture to romance only.

## Immediate Codex tasks

1. Create the project documentation structure.
2. Convert product concepts into markdown specs.
3. Define a profile category schema.
4. Define example question banks.
5. Define a compatibility scoring model.
6. Define MVP architecture.
7. Create empty frontend/backend scaffolding only after docs are stable.

## Do not do yet

- Do not build a swipe UI.
- Do not use porn-like, hookup-like, or gimmicky naming assumptions.
- Do not assume the public name is Project Riverfuck.
- Do not build real user data storage without privacy/security design.
- Do not claim scientific/psychological accuracy without validation.
- Do not overpromise soulmate certainty.

## Suggested repo structure

```text
/docs/
  CODEX_HANDOFF.md
  PRODUCT_SPEC.md
  PROFILE_CATEGORIES.md
  MATCHING_MODEL.md
  QUESTION_BANK.md
  ROADMAP.md
  BRANDING_NOTES.md
  SAFETY_PRIVACY.md
/frontend/
/backend/
/ai/
/database/
/research/
```

## Next best action

Read `docs/PRODUCT_SPEC.md`, `docs/PROFILE_CATEGORIES.md`, and `docs/MATCHING_MODEL.md`. Then create a first MVP plan with database tables, API endpoints, and profile-intake flow.
