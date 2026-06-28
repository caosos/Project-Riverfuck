# MVP Plan — Project Riverfuck

## Purpose

This MVP plan translates the product specification, profile categories, and matching model into a first buildable architecture. The goal is not to launch a public dating marketplace. The goal is to prove that a truth-first, AI-guided profile can produce a better explained compatibility recommendation than swipe browsing.

## MVP product slice

The first MVP should support a small closed test with seeded or invited users:

1. A user creates an account and consents to a serious compatibility process.
2. The user completes an AI-guided intake across structured profile categories.
3. The system stores raw answers, structured profile facts, preferences, dealbreakers, and confidence levels.
4. A candidate pair can be scored by hard constraints, compatibility dimensions, risks, and unknowns.
5. The system generates a recommendation dossier instead of a swipe card.
6. The user can accept, decline, or request more information.
7. Decline reasons update the model as feedback.

## Non-goals for the first MVP

- Public marketplace launch
- Swipe browsing
- Real payments
- Full identity verification vendors
- Large-scale chat infrastructure
- Claims of scientific validation
- Automated high-stakes safety decisions without human review

## Recommended architecture

```text
/frontend
  Web app for onboarding, intake, profile review, match dossier, and admin/debug views
/backend
  API server for accounts, intake sessions, profile data, matching, and feedback
/ai
  Prompt templates, profile extraction logic, explanation generation, and evaluation fixtures
/database
  Schema migrations, seed data, and local development fixtures
/docs
  Product, profile, matching, safety, branding, and MVP planning documents
/research
  Notes on validation, questionnaire sources, user interviews, and model evaluation
```

For the first implementation, keep the architecture boring and inspectable:

- A single backend API service
- A relational database
- Server-side compatibility scoring functions before introducing separate model services
- Explicit JSON fields for evolving profile dimensions where the schema is still experimental
- Admin/debug screens that show why a score or recommendation was produced

## Core data model

### `users`

Stores account-level identity and access data.

| Field | Purpose |
| --- | --- |
| `id` | Primary user identifier |
| `email` | Login/contact email |
| `phone` | Optional phone contact |
| `status` | `invited`, `active`, `paused`, `blocked`, `deleted` |
| `created_at` | Account creation timestamp |
| `updated_at` | Last account update timestamp |

### `consent_records`

Stores consent for deep intake, AI processing, sensitive fields, and closed-test participation.

| Field | Purpose |
| --- | --- |
| `id` | Primary consent record identifier |
| `user_id` | User granting consent |
| `consent_type` | Intake, AI processing, sensitive data, feedback, research, etc. |
| `version` | Consent text/policy version |
| `granted_at` | Timestamp of consent |
| `revoked_at` | Optional revocation timestamp |

### `profile_intake_sessions`

Tracks each AI-guided profile-building session.

| Field | Purpose |
| --- | --- |
| `id` | Primary session identifier |
| `user_id` | User being interviewed |
| `status` | `not_started`, `in_progress`, `needs_review`, `completed`, `paused` |
| `current_category` | Current profile category or flow step |
| `completion_percent` | Approximate completion progress |
| `started_at` | Session start timestamp |
| `completed_at` | Completion timestamp |

### `profile_answers`

Stores raw user responses before and after AI follow-up.

| Field | Purpose |
| --- | --- |
| `id` | Primary answer identifier |
| `user_id` | Answering user |
| `session_id` | Intake session |
| `category` | Profile category |
| `question_key` | Stable question identifier |
| `question_text` | Exact displayed question |
| `answer_text` | User response |
| `answer_type` | Free text, single choice, multi choice, scale, upload, etc. |
| `confidence_self_reported` | Optional user confidence in answer |
| `created_at` | Answer timestamp |

### `profile_facts`

Stores structured, reviewable facts extracted from answers.

| Field | Purpose |
| --- | --- |
| `id` | Primary fact identifier |
| `user_id` | Fact owner |
| `category` | Profile category |
| `field_key` | Stable structured field name |
| `value_json` | Extracted value |
| `source_answer_ids` | Source answers supporting the fact |
| `sensitivity` | Public, private, sensitive, hidden-until-consent |
| `confidence` | Evidence confidence |
| `review_status` | `draft`, `user_confirmed`, `user_corrected`, `rejected` |
| `created_at` | Fact creation timestamp |
| `updated_at` | Fact update timestamp |

### `preferences`

Stores desired-partner preferences and their strength.

| Field | Purpose |
| --- | --- |
| `id` | Primary preference identifier |
| `user_id` | Preference owner |
| `category` | Preference category |
| `field_key` | Preference field |
| `value_json` | Desired value/range/condition |
| `strength` | `hard_requirement`, `strong_preference`, `flexible_preference`, `curiosity`, `avoid` |
| `rationale` | User or AI-captured reason |
| `confidence` | Confidence that preference is stable/accurate |
| `created_at` | Creation timestamp |
| `updated_at` | Update timestamp |

### `dealbreakers`

Stores explicit disqualifiers separately so they are easy to audit.

| Field | Purpose |
| --- | --- |
| `id` | Primary dealbreaker identifier |
| `user_id` | Dealbreaker owner |
| `category` | Affected profile category |
| `rule_json` | Machine-readable disqualification rule |
| `description` | Human-readable rule |
| `flexibility` | `absolute`, `rare_exception`, `unknown` |
| `created_at` | Creation timestamp |
| `updated_at` | Update timestamp |

### `candidate_pairs`

Represents a potential match evaluation between two users.

| Field | Purpose |
| --- | --- |
| `id` | Primary pair identifier |
| `user_a_id` | First user |
| `user_b_id` | Second user |
| `status` | `queued`, `scored`, `recommended`, `accepted`, `declined`, `expired`, `blocked` |
| `created_at` | Pair creation timestamp |
| `updated_at` | Pair update timestamp |

### `match_evaluations`

Stores compatibility scoring output for a candidate pair.

| Field | Purpose |
| --- | --- |
| `id` | Primary evaluation identifier |
| `candidate_pair_id` | Evaluated pair |
| `model_version` | Scoring model version |
| `hard_filter_result` | Pass/fail and reasons |
| `dimension_scores_json` | Per-dimension scores and confidence |
| `risk_flags_json` | Risks requiring explanation or conversation |
| `unknowns_json` | Missing evidence |
| `overall_class` | `do_not_recommend`, `needs_more_information`, `possible_match`, `strong_match`, `exceptional_match` |
| `overall_score` | Optional aggregate score |
| `created_at` | Evaluation timestamp |

### `match_recommendations`

Stores the user-facing recommendation dossier.

| Field | Purpose |
| --- | --- |
| `id` | Primary recommendation identifier |
| `candidate_pair_id` | Recommended pair |
| `recipient_user_id` | User receiving the dossier |
| `evaluation_id` | Source evaluation |
| `dossier_json` | Structured explanation content |
| `status` | `draft`, `shown`, `accepted`, `declined`, `expired` |
| `shown_at` | Timestamp shown to user |
| `responded_at` | Timestamp of response |

### `match_feedback`

Stores acceptance, decline, and post-interaction feedback.

| Field | Purpose |
| --- | --- |
| `id` | Primary feedback identifier |
| `recommendation_id` | Recommendation being reviewed |
| `user_id` | Feedback author |
| `response` | `accept`, `decline`, `request_more_info`, `pause` |
| `reason_category` | Attraction, logistics, values, fear, unknowns, safety, etc. |
| `reason_text` | User explanation |
| `model_update_action` | `none`, `add_preference`, `strengthen_preference`, `add_dealbreaker`, `flag_contradiction`, `ask_followup` |
| `created_at` | Feedback timestamp |

### `audit_events`

Stores sensitive product and AI events for debugging and safety review.

| Field | Purpose |
| --- | --- |
| `id` | Primary event identifier |
| `actor_user_id` | User or admin who caused the event |
| `event_type` | Event name |
| `entity_type` | Affected table/domain object |
| `entity_id` | Affected object identifier |
| `metadata_json` | Additional details |
| `created_at` | Event timestamp |

## API endpoints

### Account and consent

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create invited/closed-test account |
| `POST` | `/api/auth/login` | Start authenticated session |
| `GET` | `/api/me` | Fetch current user/account state |
| `POST` | `/api/consents` | Grant a consent record |
| `DELETE` | `/api/consents/{consentType}` | Revoke consent where allowed |

### Intake and profile building

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/intake/sessions` | Start or resume intake |
| `GET` | `/api/intake/sessions/current` | Fetch current intake state |
| `GET` | `/api/intake/questions/next` | Get next question or follow-up |
| `POST` | `/api/intake/answers` | Save a user answer |
| `POST` | `/api/intake/extract-facts` | Convert answers into draft profile facts |
| `GET` | `/api/profile/facts` | Fetch structured profile facts |
| `PATCH` | `/api/profile/facts/{factId}` | Confirm, correct, hide, or reject a fact |
| `GET` | `/api/profile/completion` | Show category completion and missing evidence |

### Preferences and dealbreakers

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/preferences` | List preferences |
| `POST` | `/api/preferences` | Create preference |
| `PATCH` | `/api/preferences/{preferenceId}` | Update preference strength/value |
| `GET` | `/api/dealbreakers` | List dealbreakers |
| `POST` | `/api/dealbreakers` | Create dealbreaker |
| `PATCH` | `/api/dealbreakers/{dealbreakerId}` | Update dealbreaker |

### Matching and recommendations

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/admin/candidate-pairs` | Create a test candidate pair |
| `POST` | `/api/admin/candidate-pairs/{pairId}/evaluate` | Run compatibility scoring |
| `GET` | `/api/admin/match-evaluations/{evaluationId}` | Inspect scoring internals |
| `POST` | `/api/admin/match-evaluations/{evaluationId}/recommend` | Create recommendation dossier |
| `GET` | `/api/recommendations/current` | Fetch current user recommendation |
| `POST` | `/api/recommendations/{recommendationId}/response` | Accept, decline, or request more info |
| `POST` | `/api/recommendations/{recommendationId}/feedback` | Save detailed decline/outcome feedback |

## Profile-intake flow

### 1. Serious-mode confirmation

Before asking deep questions, confirm the user understands the product:

- This is not swipe browsing.
- The system asks personal questions to build a compatibility profile.
- Sensitive answers can be marked private or withheld.
- AI-generated interpretations require user review.
- Recommendations are probabilistic, not certainty claims.

### 2. Baseline structured intake

Capture minimum fields needed to avoid obvious mismatches:

- Identity basics
- Relationship intent
- Location and distance constraints
- Children/family goals
- Monogamy/non-monogamy expectations
- Dealbreakers
- Consent boundaries

### 3. Layered AI interview

Move through the profile categories with a mix of structured and open-ended questions:

- Ask the starter question.
- Ask one or more follow-ups when the answer is vague, contradictory, or high-impact.
- Label hard requirements separately from preferences.
- Ask for examples when claims are abstract.
- Track confidence and missing evidence.

### 4. Structured fact extraction

After each category, the AI proposes structured facts:

- “You appear to prefer direct communication during conflict.”
- “You want children, but timeline is uncertain.”
- “You describe attraction preferences as important but flexible.”

The user must be able to confirm, correct, reject, or mark each fact sensitive.

### 5. Completion and readiness review

The user sees a profile readiness report:

- Completed categories
- Low-confidence categories
- Missing dealbreaker details
- Sensitive/private fields
- Contradictions to resolve before matching

### 6. Candidate evaluation

For a closed-test MVP, candidate pairs can be generated manually by an admin or from a small seed set. The system should evaluate:

- Hard constraints first
- Dealbreaker compatibility
- Dimension scores with confidence
- Risk flags
- Unknowns and recommended follow-up questions

### 7. Recommendation dossier

A recommendation should not look like a swipe card. It should include:

- Why this person was selected
- Top compatibility strengths
- Potential friction points
- Unknowns or missing evidence
- Suggested first conversation topics
- Confidence level
- What not to assume

### 8. Feedback loop

When a user declines or hesitates, ask:

- What specifically caused the reaction?
- Is it a hard requirement, preference, uncertainty, fear, logistics issue, attraction issue, or safety concern?
- Should future matching change because of this?

If the decline conflicts with stated priorities, surface the contradiction respectfully and ask how the model should adapt.

## Admin/debug requirements

The MVP needs internal visibility before it needs polish:

- View a user's profile facts by category
- View raw answers behind each profile fact
- View preferences and dealbreakers separately
- View pair hard-filter outcomes
- View dimension scores and confidence
- View generated recommendation dossiers
- View decline reason classification
- Export anonymized test data for evaluation

## Safety and privacy requirements before real users

Before storing real sensitive profiles, add a dedicated safety/privacy specification and implementation checklist covering:

- Data classification
- Encryption expectations
- Consent withdrawal
- Account deletion
- Sensitive field visibility
- Admin access controls
- Abuse reporting
- Manual safety review
- AI output logging boundaries
- Retention policy

## First implementation milestones

### Milestone 1 — Static product demo

- Landing page that explains the serious compatibility premise
- Mock intake flow
- Mock structured profile preview
- Mock recommendation dossier

### Milestone 2 — Local functional intake

- Account/session basics
- Question bank loading
- Answer storage
- Draft profile fact extraction
- User review/edit flow

### Milestone 3 — Scoring prototype

- Seed two or more test profiles
- Implement hard constraint checks
- Implement weighted dimension scoring
- Generate a transparent match evaluation object

### Milestone 4 — Recommendation and feedback

- Generate recommendation dossier from evaluation
- Capture accept/decline/request-more-info response
- Classify decline feedback
- Show admin/debug scoring view

## Open decisions

- Whether the first frontend should be a static prototype or immediately backed by persisted intake data
- Whether the backend should start as a monolith or split AI workflows into a separate service later
- Which fields are safe to show in a recommendation dossier before mutual acceptance
- Whether real photos are hidden, blurred, delayed, or replaced with preference summaries during early review
- How strict the default cadence should be: monthly, threshold-based, or admin-controlled during beta
