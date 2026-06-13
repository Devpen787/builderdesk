# BuilderDesk Brand Lab - 2026-06-13

Status: **brand and UI source of truth for BuilderDesk planning/prototype work, not a submission lock**.

Related:

- [`forgescout-product-spine-and-flywheel-2026-06-13.md`](./forgescout-product-spine-and-flywheel-2026-06-13.md)
- [`forgescout-ux-wireframes-design-gates-2026-06-13.md`](./forgescout-ux-wireframes-design-gates-2026-06-13.md)
- [`builderdesk-drift-control-contract-2026-06-13.md`](./builderdesk-drift-control-contract-2026-06-13.md)
- [`builderdesk.guardrails.json`](./builderdesk.guardrails.json)
- [`builderdesk.brand-tokens.json`](./builderdesk.brand-tokens.json)

Purpose: give BuilderDesk a reusable brandlab before implementation so the product does not drift into a generic AI dashboard, crypto bounty board, card grid, or sponsor-logo demo.

This is inspired by the YourTurn brand lab pattern: one canonical brand doc, clear load order, named tokens, component rules, lab-only mock inventory, route/fragment map, and QA checklist. It is adapted for BuilderDesk's job: **a serious builder cockpit for live funded work, accountable agents, submission evidence, accepted-work receipts, and profile compounding**.

## For Agents And LLMs

When touching BuilderDesk visuals, copy, frontend, prototypes, screenshots, or design docs, read in this order:

1. this file
2. [`builderdesk.brand-tokens.json`](./builderdesk.brand-tokens.json)
3. [`builderdesk-drift-control-contract-2026-06-13.md`](./builderdesk-drift-control-contract-2026-06-13.md)
4. [`forgescout-ux-wireframes-design-gates-2026-06-13.md`](./forgescout-ux-wireframes-design-gates-2026-06-13.md)
5. [`forgescout-product-spine-and-flywheel-2026-06-13.md`](./forgescout-product-spine-and-flywheel-2026-06-13.md)

Decision table:

| You are adding or changing | Use this |
| --- | --- |
| Brand mark, wordmark, or app icon | §7 Mark System and `builderdesk.brand-tokens.json` |
| Product copy | §9 Voice And UX Writing |
| Core screen layout | §10 Screen Grammar and §12 Lab Route Plan |
| Colors, spacing, type, radius, elevation | §4-§6 and `builderdesk.brand-tokens.json` |
| Source/radar/workroom/receipt UI | §8 Component Contracts |
| Mock/demo/live labeling | drift contract claim labels, then §11 State Language |
| New visual direction | §14 Visual Direction Prompts |
| Frontend implementation | §15 Build Checklist before code |

Hard rule: if this file and a visual mock disagree, fix the mock or update this file in the same change.

## 1. Brand Position

Working name:

```text
BuilderDesk by ProofForge
```

Short product line:

```text
Work radar for serious builders.
```

Two-second explanation:

```text
Find funded work. Track the pursuit. Submit proof. Build a stronger profile.
```

Product promise:

```text
BuilderDesk helps serious ecosystem builders know what to pursue, what is blocked, what is ready to submit, and what proof improves the next opportunity.
```

Brand personality:

- focused
- precise
- useful
- calm
- builder-native
- credible
- quietly rewarding

Do not make it feel like:

- bounty marketplace
- crypto dashboard
- agent chat toy
- grant admin portal
- social profile network
- sponsor SDK catalogue
- gamified casino-like hustle app

## 2. Visual North Star

Name:

```text
Focused Builder Cockpit
```

Reference blend:

```text
Linear density + Stripe clarity + GitHub work context + one subtle builder-progress layer.
```

The product should feel like a clean desk where serious work moves forward. It can have small progress moments, but the main impression is **control, focus, and proof-backed execution**.

Visual principles:

| Principle | Rule |
| --- | --- |
| One screen, one job | each screen has one primary action |
| Rows before cards | use rows for queues, opportunities, tasks, sources, and activity |
| Cards only for objects | use cards for pursuit packets, receipts, profile proof items, and setup modules |
| Structure should recede | borders, rails, and drawers guide without competing |
| Proof is available, not loud | proof details live behind disclosure/export |
| Agents are accountable helpers | show role, boundary, output, and human release, not magic chat |
| Live status is honest | every source and sponsor path is labeled live/configured/demo/roadmap |

## 3. Source Of Truth Map

Future BuilderDesk repo should implement these files or equivalents:

| Layer | Role |
| --- | --- |
| `docs/BUILD_CONTRACT.md` | copied from the BuilderDesk drift-control contract |
| `docs/BRANDLAB.md` | copied/adapted from this file |
| `docs/builderdesk.guardrails.json` | machine-readable gates and claim labels |
| `docs/builderdesk.brand-tokens.json` | machine-readable tokens |
| `src/styles/tokens.css` | CSS variables generated from token names |
| `src/ui/primitives/*` | Button, Field, StatusBadge, Drawer, Row, EmptyState, CommandRow |
| `src/ui/product/*` | OpportunityRow, SourceHealthRow, PursuitPacket, AgentTracePanel, ReceiptPanel |
| `src/app/brand-lab/*` | executable brandlab route when the frontend repo exists |

If code introduces a new token, component surface, or route, update this file and the token JSON in the same change.

## 4. Color Tokens

Use semantic names, not vibes.

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#F7F5F0` | app background |
| `surface` | `#FFFFFF` | primary work surface |
| `surfaceMuted` | `#FBFAF7` | secondary surface |
| `ink` | `#111827` | primary text and black buttons |
| `inkSoft` | `#4B5563` | secondary text |
| `inkMuted` | `#6B7280` | metadata, hints |
| `line` | `#E5E0D8` | ordinary borders |
| `lineStrong` | `#D6D0C6` | active row borders |
| `primary` | `#111827` | primary actions |
| `accent` | `#635BFF` | selected state, command focus, active step |
| `accentSoft` | `#EEECFF` | selected row background |
| `success` | `#16875A` | accepted, ready, verified |
| `successSoft` | `#E8F7EF` | accepted/ready surface |
| `warning` | `#A05A00` | risk, needs attention |
| `warningSoft` | `#FFF5DC` | warning surface |
| `danger` | `#C2413D` | rejected, blocked, destructive |
| `dangerSoft` | `#FFF0EF` | rejected/blocked surface |
| `proof` | `#2563EB` | proof/export affordances behind disclosure |
| `agent` | `#7C3AED` | agent helper accents, never full-screen chrome |
| `receipt` | `#C77700` | accepted-work receipt highlight only |

Usage rules:

- Use `accent` for focus, not decoration.
- Use `agent` only where an accountable agent action exists.
- Use `receipt` only for accepted-work receipts or reusable proof.
- Keep ordinary work UI on `ink`, `surface`, `line`, and status colors.
- Do not create purple/blue gradients as the default page style.

## 5. Typography

Default stack:

```text
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Type scale:

| Token | Desktop | Mobile | Use |
| --- | --- | --- | --- |
| `display` | 48/56 | 36/42 | landing hero only |
| `title` | 32/40 | 28/34 | major app screens |
| `section` | 20/28 | 19/26 | section heading |
| `body` | 15/22 | 15/22 | primary UI copy |
| `small` | 13/18 | 13/18 | metadata, helper copy |
| `micro` | 12/16 | 12/16 | badges, table labels |

Rules:

- No viewport-scaled text.
- No negative letter spacing.
- Use tabular numerals for rewards, deadlines, ticket-like IDs, timestamps, and payout references.
- Use small uppercase labels only for compact metadata, not full sentences.

## 6. Layout, Radius, Elevation, Motion

Spacing:

| Token | Size | Use |
| --- | ---: | --- |
| `space1` | 4px | icon/label gap |
| `space2` | 8px | row internals |
| `space3` | 12px | compact groups |
| `space4` | 16px | default section gap |
| `space5` | 24px | page group gap |
| `space6` | 32px | major vertical separation |
| `space7` | 48px | landing separation |

Layout widths:

| Surface | Target |
| --- | --- |
| app content | 1120-1200px max |
| right drawer | 360-440px |
| form wizard | 680-760px |
| readable copy | 620-720px |
| mobile rail | no rail; bottom tabs or menu |

Radius:

| Token | Size | Use |
| --- | ---: | --- |
| `radiusSm` | 8px | badges, compact fields |
| `radiusMd` | 12px | inputs, rows, smaller surfaces |
| `radiusLg` | 18px | object cards, drawers |
| `radiusXl` | 24px | landing hero or receipt surfaces only |

Elevation:

- ordinary rows: border only
- active command row: border + very soft shadow
- drawers/modals: shadow + overlay
- avoid heavy card shadows and glass blur

Motion:

- 120-180ms color/transform transitions
- no looping decorative motion
- respect reduced motion
- small reward moment only when receipt is created or profile improves

## 7. Mark System

Preferred mark concept:

```text
Desk grid + proof check + forward arrow
```

Meaning:

- desk grid = organized work surface
- proof check = accepted evidence
- forward arrow = pursuit moving to outcome

Do:

- use a compact geometric mark that works at 24px
- keep the wordmark simple: `Builder` in ink, `Desk` in accent or ink
- allow `by ProofForge` as a small endorsement line, not part of the primary mark

Do not:

- use a robot head
- use a blockchain cube
- use a generic lightning bolt
- use a trophy as the primary mark
- use mascot-first branding

Initial lockup options to explore visually:

| Direction | Mark | Mood |
| --- | --- | --- |
| Desk Check | grid square with check notch | most trustworthy |
| Radar Desk | subtle radar sweep inside work tile | strongest discovery cue |
| Proof Arrow | check + arrow in a square | strongest progress cue |

## 8. Component Contracts

Core primitives:

| Component | Contract |
| --- | --- |
| `Button` | black primary, quiet secondary, danger only for destructive actions |
| `Field` | label always visible; helper copy below; errors plain-language |
| `StatusBadge` | state plus semantic color; color never the only cue |
| `CommandRow` | top next action; one per screen maximum |
| `WorkRow` | ranked opportunity, pursuit, source, or activity item |
| `Drawer` | scoring, source snapshot, proof details, agent trace |
| `Stepper` | setup, submission readiness, or human release flow |
| `EmptyState` | one reason + one action; no generic "No data" |
| `ProofDisclosure` | collapsed by default; export/copy when opened |

Product components:

| Component | Job | Primary fields |
| --- | --- | --- |
| `OpportunityRow` | decide pursue/watch/reject | title, reward, deadline, fit/risk, source state, action |
| `SourceHealthRow` | trust or fix a source | name, live/stale/demo, last sync, parser confidence, action |
| `PursuitPacketCard` | show one committed work attempt | scope, acceptance path, blockers, next action |
| `AgentBoundaryPanel` | show accountable agent role | agent, role, allowed tools, denied tools, human release |
| `SubmissionPackagePanel` | package work for review | summary, deliverables, evidence checklist, destination |
| `AcceptedReceiptPanel` | reusable credibility object | accepted result, evidence refs, payout reference, profile update |
| `BuilderProfileProofRow` | profile compounding | skill, source, accepted work, proof link |

Lab-only components:

- static mock primitives
- logo exploration blocks
- fake browser shells
- sample data rows

Never import lab-only mock primitives into production routes.

## 9. Voice And UX Writing

Voice:

- direct
- calm
- specific
- builder-native
- no motivational fluff
- no crypto/protocol jargon in primary UI

Preferred labels:

| Use | Avoid |
| --- | --- |
| Work radar | bounty marketplace |
| Source health | oracle/source proof unless advanced |
| Pursuit packet | proof object on primary UI |
| Submission package | generated artifact |
| Accepted-work receipt | reputation NFT / credential |
| Profile updated | onchain reputation updated |
| Human release required | multisig execution gate |
| Agent trace | autonomous reasoning log |
| Payout reference | payment unless money moved live |

Copy examples:

| Bad | Better |
| --- | --- |
| "Agentic proof execution receipt generated." | "Submission package is ready." |
| "Commitment hash stored." | "Evidence saved." |
| "Oracle-backed payout verification." | "Payout reference attached." |
| "Run autonomous scout." | "Summarize this opportunity." |
| "Onchain reputation updated." | "Profile updated with accepted work." |

## 10. Screen Grammar

Every screen follows:

1. current location
2. state or change that matters
3. one primary action
4. work rows or one meaningful object
5. quiet supporting context
6. details behind drawer/disclosure

Desktop shell:

```text
Left rail: Home, Radar, Pursuits, Sources, Profile
Top bar: search/command, sync/source state, profile
Main: one primary work surface
Right drawer: scoring/source/proof/agent detail only when opened
```

Mobile shell:

```text
Top bar: brand + current section + menu
Bottom tabs: Home, Radar, Pursuits, Profile
Drawers become sheets
Primary CTA sticks to bottom when action-heavy
```

Never show:

- duplicate top and side nav
- all routes as big pills
- giant headings inside app screens
- dashboard metric cards as the main page
- raw proof or agent logs in primary view

## 11. State Language

Every screen must cover:

| State | Copy pattern | Action |
| --- | --- | --- |
| Loading | `Loading [specific object]...` | skeleton rows, stable layout |
| Empty | `No [object] yet.` + why it matters | one setup action |
| Error | what happened + what to do next | retry/edit/recover |
| Success | what changed | next step |
| Offline | what is local vs unsynced | retry sync / keep local |
| Demo | `Demo data` or `Configured only` | do not imply live |

Source state labels:

| Label | UI copy |
| --- | --- |
| `live` | Live source |
| `stale` | Needs refresh |
| `partial` | Missing fields |
| `manual` | Manual capture |
| `fixture` | Demo data |
| `broken` | Source failed |

Claim labels must match [`builderdesk.guardrails.json`](./builderdesk.guardrails.json).

## 12. Brand Lab Route Plan

When the frontend repo exists, build an internal brandlab route. Do not start production UI without it.

Suggested routes:

| Route | Purpose |
| --- | --- |
| `/brand-lab` | full internal reference |
| `/brand-lab/radar` | radar/list density study |
| `/brand-lab/workroom` | agent boundary + evidence workflow |
| `/brand-lab/receipt` | accepted-work receipt and profile update |
| `/brandlab` | redirect to `/brand-lab` |

Suggested in-page fragments:

| Fragment | Block |
| --- | --- |
| `#identity` | mark, wordmark, app icon, color story |
| `#tokens` | color, type, spacing, radius, elevation |
| `#components` | primitives and product components |
| `#flow-mocks` | cockpit/radar/workroom/submission/receipt mocks |
| `#agent-ux` | accountable agent boundary patterns |
| `#states` | loading, empty, error, success, offline, demo |
| `#mobile` | 390px screen stack |

Required render order:

1. internal banner: "Brand lab - internal reference"
2. mini nav to all fragments
3. brand identity and mark exploration
4. token swatches
5. component system
6. flow mocks
7. agent UX patterns
8. state matrix
9. mobile examples
10. implementation checklist

## 13. Flow Mock Inventory

The first BuilderDesk brandlab should include these static mocks before backend wiring:

| Mock | User question | Primary action | Hidden detail |
| --- | --- | --- | --- |
| Landing | What is this? | Build my work radar | none |
| Profile setup | What helps score work? | Create profile | identity options |
| Home cockpit | What should I do next? | contextual top action | pipeline detail |
| Sources | Where does work come from? | Add source | source mapping |
| Opportunity radar | What is worth pursuing? | Start pursuit | scoring reasons |
| Pursuit brief | Should I commit? | Commit to pursuit | source snapshot |
| Agent setup | Who helps and with what boundary? | Lock work plan | permissions |
| Workroom | What is missing? | next missing item | agent trace |
| Submission package | Can this be reviewed? | Copy submission | evidence refs |
| Outcome tracking | What happened? | Create receipt / follow up | payout detail |
| Accepted receipt | What proof can I reuse? | Update profile | proof details |
| Builder profile | What compounds? | Share profile | proof archive |

Every mock must have:

- one obvious primary action
- one status state
- one hidden detail area
- one empty/error state note
- live/demo/configured label when data is not real

## 14. Visual Direction Prompts

Generate exactly three visual directions before coding:

### Direction A - Focused Builder Cockpit

```text
Design a polished SaaS cockpit for BuilderDesk by ProofForge. Warm off-white background, white work surfaces, compact left rail, calm dense rows, black primary actions, restrained indigo accent, source health labels, one command row at the top, no card grid. Mood: Linear plus Stripe plus GitHub, serious and fast.
```

### Direction B - Proof Desk

```text
Design a credible evidence-first builder work app. Clean desk-like layout, strong receipt and submission package moments, quiet proof disclosures, warm neutrals, small receipt-gold highlight only for accepted work, no crypto jargon, no sponsor logos. Mood: professional, precise, proof-backed.
```

### Direction C - Radar Room

```text
Design a builder opportunity radar with ranked rows, source health, pursuit stages, and accountable agent helpers. Subtle radar/accent motif, restrained purple-blue active state, serious typography, no neon, no marketplace feed, no chat-first layout. Mood: focused intelligence center for builders.
```

Selection rule: choose one direction, then build a clickable mock. Do not mix all three into a noisy hybrid.

## 15. Build Checklist

Before implementation:

- [ ] Product spine read.
- [ ] UX wireframes read.
- [ ] Drift contract read.
- [ ] Brandlab read.
- [ ] Brand tokens loaded.
- [ ] Visual direction selected.
- [ ] Claim labels decided for every mock/source/integration.
- [ ] First clickable mock uses only user-facing language.
- [ ] No sponsor logo appears unless primitive is visible.
- [ ] No production code imports lab-only mock primitives.

Before handoff:

- [ ] 390px mobile screenshot reviewed.
- [ ] 768px tablet screenshot reviewed.
- [ ] 1280px desktop screenshot reviewed.
- [ ] Every route has one primary action.
- [ ] No horizontal overflow.
- [ ] No raw JSON/hash/protocol copy in primary UI.
- [ ] All demo data labeled.
- [ ] Source states visible.
- [ ] Agent boundary visible.
- [ ] Accepted-work receipt visually distinct and proof-backed.

## Decision

BuilderDesk should use this Brand Lab as the design system starting point. YourTurn's brand lab taught the structure: canonical doc, token map, route map, component inventory, lab-only boundaries, and QA checklist. BuilderDesk should not copy YourTurn's calendar/turn mark, glass surfaces, or booking-pass visual language.

For the future BuilderDesk repo, copy:

```text
docs/BRANDLAB.md
docs/builderdesk.brand-tokens.json
```

Then build `/brand-lab` before wiring production flows.
