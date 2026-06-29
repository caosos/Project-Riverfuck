# Claude Code Task — Project Riverfuck Visual AI Prototype

## Rules

Inspect before writing.
Do not build a swipe app.
Do not build public browsing.
Do not expose private personal data.
Do not use ABOUTME.txt.
Do not assume port 3000 is available.
Run typecheck and build before final summary.

## Product

Project Riverfuck is a private AI-powered human compatibility service.

It is not Tinder.
It is not hot-or-not.
It is not endless messaging.
It is not public profile shopping.

It is:
- private AI interview
- deep compatibility modeling
- trust and verification readiness
- controlled mutual reveal
- match cultivation
- real-life human connection

## Task 1 — Upgrade the front page

Upgrade app/page.tsx into a strong public landing page.

Hero:
- headline: Find someone who actually fits.
- subheadline: Private AI-guided compatibility matching built on conversation, trust, and evidence — not swipes, public profiles, or engagement games.
- CTA: Start your private AI profile
- CTA: See how it works

Add a Life Moment Carousel.

This may also be called:
- image carousel
- slider
- slideshow
- video reel
- rotating hero montage
- crossfade carousel
- life-moment reel

The carousel should show cards that feel like small videos or cinematic stills:
- first real conversation
- walking in a park
- cooking together
- laughing together
- meeting family
- nieces/nephews/family time
- helping with a project
- giving a thoughtful gift
- building a future together

Use CSS gradients or local-safe placeholders for now.
Do not use copyrighted remote images.
Add subtle motion if practical.
Respect reduced-motion.

Landing page sections:
1. Hero
2. Life Moment Carousel
3. How it works
4. Why dating apps fail
5. What we measure
6. Simulated prototype metrics
7. AI conversation preview
8. Beta CTA
9. Footer

Simulated metrics must be clearly labeled prototype/simulated.
Do not make fake success claims.

## Task 2 — Build text-first AI conversation

Upgrade /app/interview.

Requirements:
- text-first
- click send
- no full-duplex voice
- no always-listening voice
- add /api/chat
- if no API key exists, return strong mock responses
- use provider abstraction so real AI can be wired later
- AI acts like a private compatibility interviewer, not a flirt bot

The AI should:
- ask natural questions
- summarize what it is learning
- detect topic gaps
- preserve the idea that conversation builds the private profile

## Task 3 — Import Claude JSON

Use existing file:

data/synthetic/claude_synthetic_profiles_1000.json

Add:
- loader
- validator
- normalizer

Validate:
- file exists
- count === 1000
- schema_version exists
- profiles array exists
- profiles are synthetic

Normalize into the internal matching structure.

Combine:
- 1,000 Codex generated profiles
- 1,000 Claude imported profiles

Update /admin/synthetic-profiles so it shows:
- Codex generated profiles: 1,000
- Claude imported profiles: 1,000
- Total synthetic profiles: 2,000
- Vetoed
- Possible
- Recommended
- High-confidence recommended

Make clear all synthetic profiles are QA data, not real users.

## Task 4 — Add server deployment docs

Create docs/SERVER_DEPLOYMENT.md.

Include server protocol:

First inspect current services:

sudo ss -tulpn
pm2 list || true
ls -la /etc/nginx/sites-enabled /etc/nginx/sites-available 2>/dev/null || true
ls -la /etc/caddy 2>/dev/null || true

Then deploy on a configurable port, example:

cd ~/Project-Riverfuck
npm install
npm run build
PORT=3010 npm run start

PM2 example:

cd ~/Project-Riverfuck
pm2 start npm --name project-riverfuck -- start -- --port 3010
pm2 save
pm2 list

Note: do not assume 3000 is free.

## Task 5 — Test

Run:

npm install
npm run typecheck
npm run build

Fix failures.

## Task 6 — Git

After successful build:

git status
git add .
git commit -m "Upgrade visual AI prototype and synthetic import"

Do not push unless the user explicitly says to push.

## Final report

Report:
- files changed
- whether Claude JSON imported
- whether total synthetic count is 2,000
- whether typecheck passed
- whether build passed
- preview command
