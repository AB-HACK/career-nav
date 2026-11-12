# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary Users**: Students, recent graduates, and early-career professionals (initially focused on Nigerian, African, and international talent) navigating complex local and cross-border career pathways across 10 destination contexts (Nigeria, Ghana, Kenya, South Africa, UK, US, Canada, Germany, Netherlands, and Global Remote) and 13 curated professional fields.
- **Internal Curators (`/curator`)**: Verification reviewers who audit primary regulatory sources, opportunity deadlines, and eligibility rules before opportunities can be surfaced as High or Exceptional Leverage.
- **Reviewers & Evaluators (`/simulator`)**: Product and engineering reviewers inspecting the Section 9 deterministic scoring arithmetic, archetype sensitivity, and execution engine triggers.

## Product Purpose

North is a **Career Navigation System** that translates a user's chosen career goal and destination into an honest, source-backed requirement map, a ranked gap analysis, a calm weekly execution roadmap, and a verified opportunity funnel. Success means a user knows their exact standing against real regulatory and institutional requirements, focuses on at most three high-impact priorities at a time, and advances through six concrete progress levels (`Exploring` → `Defining` → `Building` → `Positioning` → `Launching` → `Advancing`) backed by verifiable evidence rather than self-reported claims.

## Positioning

Unlike job boards, course marketplaces, or gamified habit trackers, North operates as a deterministic, evidence-backed navigation system built on six interlocking engines:

1. **Living Career Identity**: Distinguishes `Declared` claims from `Evidenced` records (transcripts, licenses, portfolios, certificates, and completed in-app milestones) and uses progressive profiling with a clear reason sentence for every question.
2. **Three Starting Modes**: Supports `Explorer` (advisory discovery), `Decider` (side-by-side comparison of 2–3 pathways), and `Builder` (direct execution) with seamless handoff and zero data re-entry.
3. **Destination-Specific Pathway Intelligence**: Maps 13 career fields across 10 destinations so the same career goal produces distinct regulatory pathways per destination across 9 difficulty dimensions, while honestly flagging unsupported custom goals (`Rule PI-8`).
4. **Gap Analysis & Dynamic Roadmap**: Compares pathway requirements against the user's Career Identity (`Missing`, `Declared Only`, `Evidenced`), sequences tasks with prerequisite locking (`Today`, `This Week`, `This Month`, `Later`), and adapts workload to demonstrated capacity.
5. **7-Stage Opportunity Funnel & 5-State Verification**: Filters opportunities through 7 explicit stages (`Available` → `Relevant` → `Eligible` → `Accessible` → `Valuable` → `Worth Your Time` → `Recommended Action`), tracks 5 verification states (`unverified`, `under_review`, `verified`, `questionable`, `rejected`), and enforces a hard cap where unverified opportunities cannot exceed `Normal` leverage (`Rule OP-6`).
6. **Value Orientation Weighting & Explainable Leverage Scoring**: Combines 4 archetypes (`Maximizer`, `Balanced Builder`, `Stability Seeker`, `Mission-Driven`) and 3 fine-tuning sliders (`Orientation`, `Risk Appetite`, `Time Horizon`) with a transparent formula (`Score = Σ(w × Benefit) - [w_disruption × Disruption + w_delay × Delay]`) and a one-tap breakdown modal (`Rule LV-6`).

## Operating Context

- **User App Routes**:
  - `/` (`HomeScreen` or `ExplorerDeciderView` when in Explorer/Decider mode; `OnboardingFlow` when onboarding is incomplete)
  - `/pathway` (`PathwayView`: 7-item Goal Framing Panel, 9-dimension difficulty matrix, requirement verification cards, destination switcher)
  - `/roadmap` (`RoadmapView`: layered task execution across `Today`, `This Week`, `This Month`, `Later`, prerequisite locks, and ranked gap list)
  - `/opportunities` (`OpportunitiesView`: 7-stage funnel header, curated recommendations capped at 4 items, held-back/ineligible audit view, 8-state application lifecycle tracker)
  - `/profile` (`ProfileSettingsView`: Career Identity wallet, evidence attachment, Value Orientation archetype & sliders, consent controls, JSON export, profile reset)
- **Internal & Evaluation Routes**:
  - `/curator` (`CuratorDashboard`: opportunity verification queue, staleness monitoring, live discovery ingestion)
  - `/simulator` (`PrdSimulatorView`: Section 9 worked example calculator and behavioral trigger sandbox)
- **Review Mode Gate**: Reviewer route switchers, onboarding replay triggers, `/curator` references in user views, and manual task-slip simulation buttons are gated behind `import.meta.env.VITE_REVIEW_MODE`.

## Capabilities and Constraints

- **Hard Product Rules (Non-Negotiable)**:
  - **User Destination Autonomy (`Keynote K3`, `SM-4`, `EX-8`)**: Assessments and comparisons are strictly advisory information, never a verdict. Strategic pushback challenges the timeline or plan, never the user's chosen destination.
  - **Calm, Guilt-Free Execution (`HS-2`, `EX-4`, `EX-5`, `EX-6`)**: Home shows at most 3 weekly priorities (`effectiveWeeklyCap <= 3`) and 1 verified high-leverage card (`HS-3`). No streaks, points, leaderboards, or guilt/shame copy anywhere in the product. Repeated misses automatically scale weekly capacity down (`3 → 2 → 1`) and offer neutral replanning options (`reschedule`, `reduce_scope`, `reprioritize`, `drop_lowest`, `replan`).
  - **Verification & Provenance (`PI-4`, `PI-5`, `OP-4`..`OP-7`)**: Every requirement and opportunity displays source, last-verified date, and verification state. Unverified deadlines must display `"Verification required"`. Unverified opportunities enter as `unverified` and are capped at `Normal` leverage until verified.
  - **Explainable Scoring (`LV-1`..`LV-6`, `VO-1`..`VO-6`)**: Every displayed leverage score opens a one-tap breakdown showing exact benefit/cost factor math, archetype weights, combo gaps closed, and any verification cap.
  - **Privacy & Consent (`CI-6`, `CI-7`)**: Sensitive constraint categories (`finances`, `geography`, `visa`, `barriers`) require explicit, withdrawable consent before filtering, and users can export (`JSON`) or reset their profile data at any time.
- **Technical Stack & Architecture**:
  - React 19, TypeScript, Vite 6, Tailwind CSS 3, Zustand 5 (atomic selectors, versioned/migrated/partialized `localStorage` persistence under `north-career-navigation-v1`), Lucide React icons.
  - Native History API routing (`/`, `/pathway`, `/roadmap`, `/opportunities`, `/profile`, `/curator`, `/simulator`, plus `404` fallback) with scroll reset and lazy-loaded `/curator` and `/simulator` bundles.
  - Client-side deterministic engine suite verified by `npm.cmd test` (`tests/verifyPrdAcceptance.ts`).

## Brand Commitments

- **Name**: **NORTH** — Career Navigation System.
- **Voice & Tone**: Calm, authoritative, transparent, and respectful of user agency. Never judgmental, urgent-for-urgency's-sake, or gamified.

## Evidence on Hand

- **Seeded Domain Data**:
  - 13 curated career fields (`medicine-surgery`, `healthcare-nursing`, `pharmacy`, `law`, `engineering`, `cs-it`, `data-ai`, `banking-capital-markets`, `accounting-finance`, `consulting-strategy`, `creative-design`, `media-communications`, `public-policy-dev`) plus unsupported custom goal fallback (`custom-unsupported`) in `src/data/careersAndDestinations.ts` and `src/data/pathwaysSeed.ts`.
  - 10 origin/destination regulatory contexts (`nigeria`, `ghana`, `kenya`, `south-africa`, `uk`, `us`, `canada`, `germany`, `netherlands`, `global-remote`) in `src/data/careersAndDestinations.ts`.
  - Curated opportunity dataset including the PRD Section 9 Worked Example (`opp-sec9-funded-research`) and unverified cap benchmark (`opp-unverified-ai-health-grant`) in `src/data/opportunitiesSeed.ts`.
- **Absences Not to Fabricate**:
  - No live external scraping backend, third-party authentication provider, or real user testimonials/customer logos exist yet; do not fabricate social proof, customer counts, or live institutional partnerships.

## Product Principles

1. **Direction Over Volume**: Wide screen space and rich data buy clarity, never clutter—cap weekly priorities at 3 and curated opportunity recommendations at a small, high-signal set.
2. **Evidence Over Claims**: Every requirement, deadline, and user milestone distinguishes declared intent from verified proof and cites its primary source.
3. **Agency Without Verdict**: The user owns their destination; the system illuminates the exact requirements, trade-offs, and timeline realities required to get there.
4. **Transparent Arithmetic**: Every recommendation and score must be explainable in one tap down to its underlying benefit/cost factors and user-controlled Value Orientation weights.
5. **Capacity-Aware Execution**: When life interrupts a plan, the system adapts scope and pacing neutrally—never through streaks, points, or guilt.

