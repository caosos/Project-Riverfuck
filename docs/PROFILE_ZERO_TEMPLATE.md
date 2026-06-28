# Profile Zero Template

This document defines the structure for a private compatibility profile used by Project Riverfuck.

This file is a template and sanitized example. Do not commit a real user's private compatibility profile to a public repository.

## Purpose

Profile Zero is the first complete calibration profile used to test whether the system can build a truthful compatibility model from private conversation.

The model should be candid, correctable, and evidence-based.

## Profile Rule

A compatibility profile is not a marketing bio.
It is not a public profile.
It is not a self-flattering description.

It is a private model used to improve match quality.

If a user gives the system a fake version of themselves, the system will search for someone compatible with that fake version.

## Required Profile Fields

Each profile category should store:

1. Summary
2. Observed traits
3. Evidence
4. Confidence level
5. Importance level
6. Match logic
7. User corrections
8. Open questions

## Confidence Levels

- Low: early guess; needs more conversation
- Medium: supported by some evidence
- High: repeatedly supported and/or user-confirmed

## Importance Levels

- Minor: may help but not important
- Moderate: meaningful preference
- Major: strongly affects compatibility
- Required: hard gate or near-hard gate

## Match Logic Types

- Similarity needed
- Difference tolerated
- Complement preferred
- Hard conflict

## Core Categories

1. Identity and life situation
2. Relationship intent
3. Values and worldview
4. Communication style
5. Conflict and repair style
6. Emotional regulation
7. Attachment and closeness style
8. Family and children
9. Lifestyle and daily routine
10. Work and money
11. Health, sleep, fitness, and substances
12. Sex, affection, boundaries, and intimacy
13. Attraction and aesthetic preferences
14. Difference tolerance
15. Complementarity
16. Growth, accountability, and self-awareness
17. Dealbreakers and hard requirements
18. Risk markers
19. Natural conversation interests

## Sanitized Seed Persona Example

### Relationship Intent

Summary:
The user is seeking a serious long-term relationship, not casual dating or attention-based app behavior.

Observed traits:

- wants depth before attachment
- dislikes swipe culture
- wants compatibility checked before emotional overinvestment
- believes sex matters but should not be the foundation

Confidence:
Medium

Importance:
Major

Match logic:
Similarity needed

Open questions:

- Is marriage required or optional?
- What timeline is acceptable?
- What location radius is realistic?

### Communication Style

Summary:
The user communicates directly and may sound intense even when not upset.

Observed traits:

- direct language
- prefers accuracy over tone-polishing
- dislikes vague or performative reassurance
- wants exact wording preserved on important subjects

Confidence:
High

Importance:
Major

Match logic:
Similarity not required, but tolerance is required.

Open questions:

- What kind of directness from a partner feels helpful versus disrespectful?
- How should a partner signal that they need softer delivery without derailing the topic?

### Values

Summary:
The user places high value on honesty, loyalty, practical usefulness, responsibility, and truth-seeking.

Observed traits:

- dislikes fake interaction
- wants claims verified
- values accountability
- prefers evidence and logic over flattery

Confidence:
High

Importance:
Major / Required depending on category

Match logic:
Similarity strongly preferred; dishonesty is a hard conflict.

### Attraction

Summary:
Attraction matters, but it is one category and should not overpower trust, values, or major compatibility factors.

Observed traits:

- wants structured attraction modeling
- may use celebrities, actors, fictional characters, or style examples as references
- wants the AI to summarize the underlying visual pattern rather than treat examples as literal requirements

Confidence:
Medium

Importance:
Moderate to major

Match logic:
Attraction floor required; attraction dominance rejected.

Open questions:

- What physical traits are genuinely important?
- What traits are flexible?
- What type of visual example feels realistic versus fake?

### Risk / Mismatch Notes

Potential mismatch risks:

- partner interprets intensity as anger
- partner avoids hard conversations
- partner wants casual app-style dating
- partner is not serious about honesty
- partner is unavailable or misrepresents relationship status

System response:
Do not recommend until hard requirements, trust status, and relationship intent are clear.

## User Correction Loop

Every category should give the user a way to respond:

- Accurate
- Partly accurate
- Inaccurate
- Add clarification
- Ask me more about this

The model should update from corrections, but it should preserve evidence history instead of silently overwriting everything.

## Privacy Boundary

The full profile is private.
Raw conversation is private.
Matches should not see raw profile notes.

A match may see only:

- approved summary
- compatibility reasoning
- shared strengths
- caution areas
- trust/verification status
- user-approved excerpts

## Implementation Note

Use this template for mock data and UI testing. Keep real Profile Zero data outside the public repo unless the user explicitly approves a sanitized public version.
