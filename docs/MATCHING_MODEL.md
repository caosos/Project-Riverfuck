# Matching Model — v0.1

This is an early conceptual model. It is not scientifically validated yet.

## Core idea

The matching system should not simply maximize attraction or profile similarity. It should estimate the probability that two people can form a stable, satisfying, mutually desired relationship based on structured compatibility, hard constraints, risk factors, and user goals.

## Match pipeline

```text
User A profile
User B profile
        ↓
Hard constraint filter
        ↓
Safety/fraud filter
        ↓
Dealbreaker compatibility
        ↓
Dimension scoring
        ↓
Risk analysis
        ↓
Explanation generation
        ↓
Recommendation / no recommendation
```

## Step 1 — Hard constraint filter

Examples:

- age constraints
- location/distance limits
- relationship intent mismatch
- children/family goals mismatch
- monogamy/non-monogamy mismatch
- religious/political hard non-negotiables
- substance/lifestyle hard boundaries
- safety disqualifiers

If a hard constraint fails, do not recommend unless user explicitly marks it flexible.

## Step 2 — Safety and fraud filter

Signals:

- unverified identity
- suspicious account behavior
- inconsistent self-reporting
- known scam patterns
- photo mismatch
- relationship status ambiguity
- coercive or unsafe communication

Safety filters should take priority over compatibility score.

## Step 3 — Compatibility dimensions

Suggested initial weighted dimensions:

1. Relationship intent alignment
2. Values and worldview alignment
3. Communication compatibility
4. Conflict/stress compatibility
5. Emotional attachment compatibility
6. Lifestyle compatibility
7. Family/children compatibility
8. Money/work compatibility
9. Religion/politics tolerance
10. Attraction preference fit
11. Sexual/romantic compatibility
12. Logistics feasibility
13. Growth/readiness compatibility
14. Trust/verification confidence

## Score types

### Dimension score

Numeric estimate for each compatibility dimension.

Example:

```json
{
  "communication": 0.82,
  "family_goals": 0.91,
  "money_behavior": 0.64,
  "logistics": 0.77
}
```

### Confidence score

How much evidence supports the dimension score.

Low confidence should not be hidden. It should appear in the explanation.

Example:

```json
{
  "sexual_compatibility": {
    "score": 0.70,
    "confidence": 0.32,
    "reason": "Both users gave limited answers. Ask follow-up questions before relying on this score."
  }
}
```

### Risk score

Potential mismatch or concern requiring conversation.

Risk is not automatic rejection. Some risks are manageable if acknowledged.

Examples:

- one wants high reassurance, the other values independence
- different money habits
- different religious intensity
- one has children and rigid schedule, other is spontaneous
- attraction uncertainty
- high conflict avoidance on both sides

### Unknown score

Missing or insufficient information.

The system should prefer asking follow-up questions over making false certainty claims.

## Recommendation classes

### Do not recommend

A hard constraint, safety issue, or major mismatch exists.

### Needs more information

Potential fit, but important dimensions are low-confidence.

### Possible match

No major blockers, several good fits, but some risks.

### Strong match

High compatibility across major dimensions and manageable risks.

### Exceptional match

Rare high-fit candidate. Should receive a detailed explanation and suggested first conversation plan.

## Match explanation structure

Every recommendation should include:

```text
Why this person was selected
Top compatibility strengths
Potential friction points
Unknowns / missing evidence
Suggested first conversation topics
Confidence level
What not to assume
```

## Decline feedback model

If user declines, collect reason:

- physical attraction
- distance/logistics
- values concern
- family/children concern
- political/religious concern
- fear/uncertainty
- not ready
- profile missing information
- dealbreaker discovered
- unclear / gut feeling

Then classify decline reason:

1. Valid hard constraint
2. New preference to model
3. Possible shallow rejection
4. Contradiction with stated priorities
5. Information gap
6. Safety concern

If contradiction exists, AI may say something like:

> You previously said emotional stability and family alignment were your top priorities. This match scored highly there. Your decline reason appears based mostly on first-impression attraction. Should future matching prioritize attraction more strongly, or do you want to keep long-term compatibility weighted higher?

## Matching cadence

Possible model:

- no endless browsing
- one high-quality match per month
- or match only when score threshold is reached
- or user-controlled cadence with serious-mode defaults

Cadence should reinforce that the system is not a slot machine.

## Future model improvements

- outcome-based learning
- post-date feedback
- long-term relationship success tracking
- calibrated confidence models
- personality instrument integration
- communication simulation
- compatibility conversation prompts
- human coach review
- fraud/safety model integration

## Warning

Do not overstate accuracy. This is a recommendation model, not destiny, certainty, or soulmate detection.
