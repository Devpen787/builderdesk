# BuilderDesk Drift Control Contract - 2026-06-13

Status: **mandatory build contract for BuilderDesk planning/prototype work, not a submission lock**.

Related:

- [`forgescout-product-spine-and-flywheel-2026-06-13.md`](./forgescout-product-spine-and-flywheel-2026-06-13.md)
- [`forgescout-ux-wireframes-design-gates-2026-06-13.md`](./forgescout-ux-wireframes-design-gates-2026-06-13.md)
- [`builderdesk.guardrails.json`](./builderdesk.guardrails.json)
- [`builderdesk-brandlab-2026-06-13.md`](./builderdesk-brandlab-2026-06-13.md)
- [`builderdesk.brand-tokens.json`](./builderdesk.brand-tokens.json)
- [`product-idea-gates.md`](./product-idea-gates.md)

Purpose: hard-code the operating rules that prevent BuilderDesk from drifting into a generic dashboard, bounty board, sponsor demo, agent console, or overbuilt marketplace.

Machine-readable companion: [`builderdesk.guardrails.json`](./builderdesk.guardrails.json) mirrors the core gates, labels, tripwires, contracts, and build stages for future build agents.

## Product Truth

BuilderDesk by ProofForge helps serious ecosystem builders:

```text
find live funded work -> score source health -> run an accountable agent-assisted pursuit -> package evidence -> create an accepted-work receipt -> improve their builder profile
```

If the work does not serve that loop, it is out of scope until explicitly promoted.

## Mandatory Operating Loop

Every major decision, commit, feature, integration, or demo claim must be written in this shape:

| Field | Required answer |
| --- | --- |
| Discovery | What did we observe in repo, sponsor docs, browser, tests, source adapters, or user feedback? |
| Facts | What is verified now? |
| Inference | What do we believe because of those facts? |
| Decision | What are we doing? |
| Next step | What is the smallest thing that proves or improves it? |

Do not merge or call a milestone complete if it skips this loop.

## Claim Labels

Every product or sponsor claim must use one label:

| Label | Meaning | Allowed demo wording |
| --- | --- | --- |
| `live` | Runs in the app now against a real service/source/transaction. | "This is live." |
| `artifact` | Produces a real file, receipt, packet, log, screenshot, or export. | "This artifact was generated." |
| `configured` | Works when keys/accounts are supplied, but not active in this local run. | "Configured path." |
| `demo` | Fake or fixture data for flow review only. | "Demo data." |
| `roadmap` | Future work. Not claimed as working. | "Roadmap." |

Forbidden wording:

- "live" for fixture data
- "payment" when only a payout reference is tracked
- "verified" when no verifier or artifact exists
- "integrated" when a sponsor SDK is only installed or named
- "agent did it" when the user manually supplied the output

## Non-Negotiable Gates

| Gate | Must pass |
| --- | --- |
| Candidate status | BuilderDesk remains candidate-only until Gate 0 collision, sponsor necessity, and continuity boundaries are resolved. |
| Anchor user | Serious ecosystem builder or small studio working across 3-7 funded opportunities. |
| Anchor flow | Source import -> radar -> pursuit packet -> workroom -> submission package -> accepted receipt -> profile update. |
| Proof object | Pursuit Packet and Accepted-Work Receipt. |
| Verifier | Local verifier checks receipt -> pursuit packet -> evidence bundle -> profile update. |
| Source quality | Every source has freshness, source state, parser confidence, and snapshot. |
| Agent accountability | Every agent has name, owner, role, tools, boundary, output, trace, and human release state. |
| Sponsor fit | Sponsor must pass product necessity and sponsor showcase. |
| UX quality | One screen, one job, one primary action; no internal metadata on primary UI. |
| Build discipline | Small staged commits; no monolith files; browser/mobile QA before polish claims. |

## Drift Tripwires

Stop and correct course if any of these appear:

- "Let's add a marketplace."
- "Let's support all sources now."
- "Let's use all sponsors."
- "Let's show raw agent logs first."
- "Let's start with wallet connect."
- "Let's make agents the headline."
- "Let's add dashboard cards for everything."
- "Let's make payment live later but imply it now."
- "Let's hide demo/configured labels."
- "Let's wire backend before the clickable flow works."
- "Let's add a sponsor logo even if the primitive is not visible."
- "Let's make the profile a social feed."

Required correction:

```text
Return to the anchor flow and ask which single user action this improves.
```

## Sponsor Integration Contract

Sponsors are not decoration. They must show why their solution is the best solution.

For every sponsor integration, fill this before building:

| Field | Required answer |
| --- | --- |
| Sponsor | Name |
| Product need | What BuilderDesk problem does it solve? |
| Sponsor primitive | Which SDK/API/protocol feature is used? |
| User-visible moment | Where does the user see its value? |
| Artifact/proof | What receipt, tx, record, export, or state change proves it? |
| Breakage test | What becomes weaker if this sponsor is removed? |
| Claim label | `live`, `artifact`, `configured`, `demo`, or `roadmap` |
| Showcase reason | Why would another builder copy this pattern? |

Current sponsor candidates:

| Sponsor path | Best BuilderDesk use | Only build if |
| --- | --- | --- |
| ENS | builder/agent names, records, profile/receipt discovery | portable identity is visible and non-hardcoded |
| Dynamic or Privy | app login, embedded wallets, agent wallet setup, funding | Web2 onboarding or agent wallets matter in demo |
| Google Cloud | source/reputation intelligence, BigQuery/agent reputation path, scalable indexing | discovery/scoring/reputation is the demo's core proof |
| Ledger | human release for submit/spend/profile publish | approval trust is visible and high-impact |
| Arc | live agent payments/stablecoin movement | money actually moves or a transaction is shown |
| Walrus/Sui | durable evidence package storage | evidence must survive outside local app |
| World | human-backed agent/builder/reviewer proof | one-human or Sybil resistance is required |

## Source Adapter Contract

Every source adapter must produce:

- source name
- source URL
- source type
- opportunity title
- reward/funding reference
- deadline or freshness timestamp
- owner/reviewer/maintainer
- acceptance criteria
- submission destination
- last fetched time
- source state: `live`, `stale`, `partial`, `manual`, `fixture`, or `broken`
- parser confidence
- raw source snapshot
- normalized opportunity object

V1 source target:

```text
GitHub live adapter + manual URL capture + one reliable live bounty/grant/governance source
```

If a source is not live, label it.

## Agent Contract

Every agent must declare:

- name
- owner
- role
- allowed tools
- denied tools
- budget or no-budget state
- wallet or no-wallet state
- evidence output type
- trace export
- last run
- status
- human release requirement

Agent autonomy levels:

| Level | Allowed in V1? | Human gate |
| --- | --- | --- |
| Read | yes | no |
| Score | yes | override available |
| Plan | yes | user commits pursuit |
| Work | yes | approval for high-impact evidence |
| Package | yes | user approves submission package |
| Submit | limited | human release required |
| Spend/pay | only if sponsor path selected | human release and wallet policy required |
| Profile publish | yes | human release required |

No generic "AI assistant" role is allowed.

## UX Contract

Primary UI must show:

- where am I?
- what needs attention?
- what should I do next?
- what is the state?
- what changed?

Primary UI must not show:

- raw hashes
- JSON
- raw logs
- prompts
- sponsor labels
- protocol names
- storage URIs
- internal implementation notes

Advanced details belong behind:

- `Show scoring reasons`
- `View source snapshot`
- `Open agent trace`
- `View proof details`
- `Export packet`

## Build Staging Contract

Commit stages should be small and inspectable:

1. repo scaffold + README + guardrails
2. design tokens + app shell
3. static cockpit/radar/workroom/receipt mock
4. mobile/responsive pass
5. live GitHub source adapter
6. manual URL capture
7. second live source adapter
8. agent registry + autonomy ladder
9. workroom evidence + submission package
10. accepted-work receipt + profile update
11. sponsor integration 1
12. sponsor integration 2
13. sponsor integration 3 only if load-bearing
14. demo script + screenshots + Vercel deploy

No commit should combine unrelated architecture, styling, copy, sponsor code, and docs.

## Demo End State

The final demo should prove:

```text
live source imported -> source health visible -> opportunity scored -> pursuit packet created -> agent helps inside boundaries -> human releases submission/package -> accepted-work receipt created -> profile improves
```

The demo fails if it only shows:

- a static dashboard
- a bounty feed
- a chat agent
- a proof page
- a wallet login
- a sponsor logo collection

## Pre-Commit Checklist

Before each commit:

- [ ] What did this commit prove?
- [ ] Which gate did it move?
- [ ] Is every claim labeled live/artifact/configured/demo/roadmap?
- [ ] Did it add internal metadata to user-facing UI?
- [ ] Did it create or worsen a monolith?
- [ ] Did it add a sponsor without product necessity and showcase reason?
- [ ] Did it keep BuilderDesk candidate status honest?
- [ ] Did it update README/docs if product truth changed?

## Pre-Demo Checklist

Before presenting:

- [ ] Browser path works from reset state.
- [ ] Mobile 390px path has no overflow.
- [ ] Source freshness states are visible.
- [ ] Demo data is labeled.
- [ ] Agent trace/export exists for agent actions.
- [ ] Human release moment is visible.
- [ ] Accepted-work receipt exists.
- [ ] Profile update is visible.
- [ ] Sponsor use is explained as product-critical.
- [ ] README separates live/configured/demo/roadmap.

## Decision

Hard-code this contract into the future BuilderDesk repo as:

```text
docs/BUILD_CONTRACT.md
docs/builderdesk.guardrails.json
docs/BRANDLAB.md
docs/builderdesk.brand-tokens.json
```

Later hardening: make the build script read `docs/builderdesk.guardrails.json` and print the next required gate after each staged commit.

Until then, this file and [`builderdesk.guardrails.json`](./builderdesk.guardrails.json) are the canonical drift-control artifacts.
