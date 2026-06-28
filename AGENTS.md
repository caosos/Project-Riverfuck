# Agent Instructions for Project Riverfuck

Project Riverfuck is the working codename for an AI-powered human compatibility platform.

The name is temporary. The philosophy is not.

## Product North Star

Do not build another dating app.
Build a private human compatibility engine.

Optimize for successful human relationships, not clicks, screen time, swipes, likes, or endless browsing.

## Core Rules

- No swipe UI.
- No public browsing of user profiles.
- No engagement-maximizing loops.
- No fake scarcity mechanics.
- No pay-to-see-more match ladder.
- No attraction-first matching.
- Do not make attraction the whole product.
- Treat attraction as one structured compatibility category among many.
- Conversation is the product.
- The AI interview is the profile-building process.
- The AI writes the private compatibility model from conversation evidence.
- Users can correct the model.
- Raw private conversations are not shown to matches.
- Matching should not occur until the system has enough evidence.

## UX Tone

The product should feel serious, private, intelligent, modern, and high-trust.
Avoid playful dating-app language.
Avoid hearts, swipe cards, hot-or-not mechanics, superficial match grids, or social-feed patterns.

Use language like:

- private compatibility model
- evidence-guided recommendation
- trust and verification
- relationship intent
- profile confidence
- recommendation confidence
- match readiness
- hard requirements
- dealbreakers
- attraction model
- topic coverage

Avoid language like:

- swipe
- hot matches
- browse singles
- endless possibilities
- flirt now
- popular profiles

## Matching Philosophy

The system should separate:

1. Profile Confidence — how well the system understands the user.
2. Pool Probability — how likely the system is to find suitable people within the user's constraints.
3. Recommendation Confidence — how strong a specific proposed match is.

Possible match is not the same as recommended match.

If recommendation confidence is too low, the product should say so instead of pushing a weak match.

## Hard Gates

Any of these may override otherwise strong compatibility:

- fake identity
- undisclosed relationship status
- hidden marriage or unavailability
- monogamy mismatch
- children mismatch when hard-required
- major safety concern
- deliberate deception
- location or relocation impossibility
- incompatible intimacy boundaries
- user-defined non-negotiable dealbreakers

## Privacy Rule

This repo is public. Do not commit real private user compatibility profiles, raw interview transcripts, personal sensitive data, or background-check details.
Use mock data, templates, and sanitized seed personas unless explicitly instructed otherwise in a private development environment.

## Current Build Target

Build the first website prototype around:

- landing page
- onboarding
- trust and verification flow
- AI interview dashboard
- topic coverage tracker
- private compatibility model dashboard
- attraction preference builder
- match readiness dashboard
- internal admin/review prototype

See `docs/CODEX_PROTOTYPE_BUILD.md` for the build specification.
