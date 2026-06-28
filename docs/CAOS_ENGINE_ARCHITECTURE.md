# CAOS Engine Architecture Note

## Core architectural decision

Project Riverfuck should be powered by CAOS.

CAOS is not merely a parent brand. CAOS is the underlying cognitive architecture: memory, questioning, quantification, contradiction detection, scoring, verification, and adaptive reasoning.

The dating/relationship product is one application of the larger CAOS human-understanding engine.

## What CAOS does inside this project

CAOS should:

1. Remember long-term conversational context.
2. Convert natural conversation into structured profile dimensions.
3. Quantify information into categories, subcategories, confidence levels, and weights.
4. Detect contradictions, uncertainty, missing information, and possible self-deception.
5. Separate hard requirements from preferences, fears, habits, and shallow filters.
6. Compare two human profiles across many dimensions.
7. Explain why two people may or may not fit.
8. Learn which metrics actually matter for each specific person.

## No fixed universal formula

There is no single compatibility formula.

Two people matching in obvious categories does not automatically mean they are a good match.

Two people differing in important categories does not automatically mean they are a bad match.

Some of the best relationships may involve complementary differences, not sameness.

The system must discover which differences are productive, which differences are dangerous, and which differences are irrelevant for each person.

## Same-score does not mean same-fit

Compatibility cannot be reduced to simple similarity.

Examples:

- Two highly anxious people may understand each other but amplify insecurity.
- One organized person and one chaotic person may balance each other or frustrate each other depending on tolerance and respect.
- Shared religion may matter deeply for one person and barely matter for another.
- Shared humor may overcome many small differences for one pair but not another.
- Opposite social energy may create balance or resentment depending on lifestyle expectations.

The model must evaluate interaction effects, not only category matches.

## Metric weighting must be personal

Every user effectively has an individualized compatibility equation.

CAOS must learn:

- what the user says matters
- what their stories reveal matters
- what their past relationship patterns suggest matters
- what their emotional responses reveal matters
- what they consistently reject or accept
- what is negotiable versus non-negotiable

The user's formula should evolve as the system learns more.

## Quantification layers

Natural language conversation should be translated into multiple layers:

1. Raw answer
2. AI summary
3. Structured category tags
4. Confidence score
5. Importance weight
6. Flexibility rating
7. Contradiction markers
8. Verification status
9. Match relevance
10. Outcome feedback

Example:

```json
{
  "category": "religion",
  "claim": "User prefers a partner who believes in God but does not require church attendance.",
  "importance": 0.72,
  "flexibility": 0.48,
  "confidence": 0.84,
  "verification": "self_reported",
  "match_relevance": "moderate_to_high"
}
```

## Adaptive discovery

The system should not assume it already knows the correct metrics.

It should test hypotheses:

- Does communication style predict match acceptance for this user?
- Does attraction flexibility increase after compatibility explanation?
- Does lifestyle similarity matter more than stated values?
- Does political similarity matter only when political intensity is high?
- Does clothing/aesthetic preference matter for first acceptance but not long-term compatibility?

The platform is a learning system.

## Important product implication

This means Project Riverfuck is not simply building a database of profiles.

It is building a reasoning layer that converts human conversation into a living compatibility model.

CAOS should be treated as the engine that makes that possible.

## Next-agent warning

Do not simplify this into a survey score.

Do not build a one-size-fits-all matching formula.

Do not assume matching equals similarity.

Do not assume the most obvious categories are the most predictive.

The work is to discover the equation, not pretend we already have it.
