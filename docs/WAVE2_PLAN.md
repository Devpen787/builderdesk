# BuilderDesk Wave 2 Plan

Status: **active build plan**. Governed by [`BUILD_CONTRACT.md`](./BUILD_CONTRACT.md) and [`BRANDLAB.md`](./BRANDLAB.md). Tokens: [`builderdesk.brand-tokens.json`](./builderdesk.brand-tokens.json). Gates: [`builderdesk.guardrails.json`](./builderdesk.guardrails.json).

Date opened: 2026-06-13.

## Operating Loop (why this wave exists)

| Field | Answer |
| --- | --- |
| Discovery | Wave 1 shipped the full loop, but the brand lab is two text panels (~5% of BRANDLAB §12), the visual system violates the spec (viewport-scaled text, negative letter-spacing, drifted accent hex, receipt-gold spent on the hero), and none of the §8 component contracts exist as real components. |
| Facts | The four canonical spec docs (`BUILD_CONTRACT`, `BRANDLAB`, guardrails, brand-tokens) and `src/styles/tokens.css` were **never in the repo** — BUILD_CONTRACT §3/Decision require them. The Wave 1 agent built without the spec in front of it. |
| Inference | The "basic" feel is drift from an existing spec, not a taste problem. With the spec anchored in-repo, Track A is finish-to-spec, not a rebuild. The bones (domain/UI separation, row-first layout, working loop) are sound. |
| Decision | Wave 2 runs two tracks at full depth: (A) bring the brand/visual system to BRANDLAB spec, and (B) add real depth — a second live source, an auth/wallet substrate, and load-bearing sponsor integrations. |
| Next step | Stage 0: anchor the specs + tokens in the repo and write this plan (this commit). |

## Goal

Both tracks, full depth:

- **Track A — Brand & visual system to spec.** Make BuilderDesk feel like the "Focused Builder Cockpit" north star (BRANDLAB §2), including the real internal `/brand-lab` route.
- **Track B — Real depth.** Second live source adapter, auth/wallet substrate, and sponsor integrations that pass the BUILD_CONTRACT sponsor test (removing them breaks a core trust path).

## Stage 0 — Anchor the spec (this commit)

- [x] Copy canonical docs into `docs/`: `BUILD_CONTRACT.md`, `BRANDLAB.md`, `builderdesk.guardrails.json`, `builderdesk.brand-tokens.json`.
- [x] Generate `src/styles/tokens.css` from the brand-tokens JSON (exact values).
- [x] Wire `tokens.css` ahead of the existing stylesheets.
- [x] Write this plan.

Result: every later commit is checked against a spec that physically lives in the repo, so the build cannot drift the same way again.

## Track A — Brand & visual system to spec

Ordered as small, inspectable commits (BUILD_CONTRACT build-staging contract):

1. **Token reconciliation.** Migrate `base.css`/`ui.css`/`layout.css` consumers onto `tokens.css`. Remove the spec violations: kill `clamp()` viewport text and negative `letter-spacing` (BRANDLAB §5), implement the fixed type scale (display/title/section/body/small/micro), add tabular numerals for scores, IDs, deadlines, payout refs. Fix accent to `#635BFF`.
2. **Mark system (BRANDLAB §7).** Replace the "B" tile with the geometric desk-grid + proof-check + forward-arrow mark that works at 24px; wordmark `Builder` (ink) + `Desk` (accent). Explore Desk-Check / Radar-Desk / Proof-Arrow directions in the brand lab.
3. **Primitive components (§8).** Build as real components: `StatusBadge` (color is never the only cue), `CommandRow` (one per screen), `WorkRow`, `Drawer`, `Stepper`, `ProofDisclosure`.
4. **Product components (§8).** `OpportunityRow`, `SourceHealthRow`, `PursuitPacketCard`, `AgentBoundaryPanel`, `SubmissionPackagePanel`, `AcceptedReceiptPanel`, `BuilderProfileProofRow`.
5. **Reserve the signature.** Receipt-gold (`#C77700`) only on the accepted-work receipt; make that screen visually distinct; add the small reward moment on receipt creation (§6 motion, reduced-motion aware). Remove the gold gradient from the hero.
6. **Right-drawer pattern (§10).** Move scoring reasons, source snapshot, agent trace, and proof details out of inline `<details>` into the right drawer. Add score visualization to radar rows.
7. **The real `/brand-lab` (§12).** Internal banner, mini-nav, identity/mark, token swatches, full component gallery, flow mocks, agent-UX, state matrix, mobile stack. Sub-routes: `/brand-lab/radar`, `/brand-lab/workroom`, `/brand-lab/receipt`. Lab-only primitives must never import into production routes.

## Track B — Real depth

Maps onto BUILD_CONTRACT build stages 7, 8, 11–13.

1. **Second live source adapter** (guardrails `v1SourceTarget`): one reliable live bounty/grant/governance source beyond GitHub, producing every field in `sourceAdapterRequiredFields`, labeled honestly by source state.
2. **Auth / wallet substrate.** Privy or Dynamic for builder account + embedded wallet (BRANDLAB forbids wallet-first onboarding — login stays Web2-style, wallet appears only when an action needs it).
3. **Sponsor integrations** — see drill below. Each must fill the 8-field sponsor-fit table before building.

## Sponsor Drill (deferred by the docs — decision still open)

The product-spine doc explicitly says **"Do not pick final sponsors yet. Run a sponsor architecture drill against three demo concepts. Only promote a sponsor if removing it breaks the demo's trust path."** Candidate bundles to pressure-test:

| Bundle | Sponsors | Best when |
| --- | --- | --- |
| A — Identity + Evidence | ENS + Walrus/Sui | demo centers on portable builder/agent names + durable pursuit packets and receipts |
| B — Agent Wallet + Human Release | Privy/Dynamic + Ledger | demo centers on agents with wallets/budgets + human approval before submit/spend |
| C — Agent Economy Search | ENS + Google Cloud | demo centers on discovering/ranking agents from public reputation data |
| D — Live Agent Payments | Arc + Privy/Dynamic | demo centers on real stablecoin payout/tx with transaction evidence |
| E — Human-Backed Agents | World + ENS | demo centers on proving an agent is accountable to a real human |

Working recommendation (not locked): combine **A + B** — ENS (identity on profile/receipt) + Walrus (durable evidence) + Ledger (human release), with Privy/Dynamic as the substrate. This maps one-to-one onto the loop's weak spots (profile, receipt durability, release) and each upgrades a current `demo`/`local` limitation. Confirm via the drill before committing sponsor code.

For each chosen sponsor, fill before building: sponsor, product need, sponsor primitive, user-visible moment, artifact/proof, breakage test, claim label, showcase reason.

## Pre-Demo Bar (BUILD_CONTRACT)

Browser path works from reset; 390px mobile has no overflow; source freshness visible; demo data labeled; agent trace/export exists; human-release moment visible; accepted-work receipt exists and is visually distinct; profile update visible; each sponsor use explained as product-critical; README separates live/configured/demo/roadmap.
