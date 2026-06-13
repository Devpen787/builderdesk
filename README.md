# BuilderDesk

Work radar for serious builders.

BuilderDesk helps ecosystem builders find funded work, track each pursuit, prepare clean evidence, and turn accepted work into reusable proof.

## Fresh Track Posture

This repository is intended as a fresh ETHGlobal project repository.

- No prior ProofForge code, CSS, screenshots, assets, generated packets, or project-specific implementation files are copied into this repo.
- Prior ProofForge work may inform product judgment only.
- All implementation work in this repository should be visible through small staged commits.

## Wave 1 Loop

```text
live GitHub source import -> opportunity radar -> pursuit packet -> accountable agent workroom -> submission package -> accepted-work receipt -> profile update
```

## What Works In Wave 1

- Import a public GitHub issue or pull request URL.
- Label source state honestly.
- Score the opportunity with plain-language reason codes.
- Create a pursuit packet.
- Use a bounded local agent helper with a visible trace.
- Require human release before creating a submission package.
- Create an accepted-work receipt.
- Verify the receipt locally.
- Update a builder profile from accepted work.

## What Is Not In Wave 1

- No wallet-first onboarding.
- No live payments or escrow.
- No sponsor-logo wall.
- No marketplace hosting.
- No generic AI chat interface.
- No copied ProofForge implementation code.

## Claim Labels

BuilderDesk uses explicit claim labels:

- `live`: works now against a real service or source.
- `artifact`: produces a real file, packet, receipt, log, or export.
- `configured`: works when keys or accounts are supplied.
- `demo`: deterministic local demo behavior.
- `roadmap`: future work, not claimed as working.

## Local Development

```bash
npm install
npm run dev
npm run test
npm run build
npm run qa:screenshots
```

## Core Routes

- `/` landing
- `/brand-lab`
- `/onboarding`
- `/app`
- `/sources`
- `/radar`
- `/pursuits/:id`
- `/pursuits/:id/workroom`
- `/pursuits/:id/submission`
- `/receipts/:id`
- `/profile`

## Verification

Before claiming a wave is complete:

```bash
npm run test
npm run build
```

Then run a browser click-through from a reset state:

1. create a builder profile
2. import a real GitHub issue
3. start a pursuit
4. create a pursuit packet
5. prepare workroom evidence
6. release a submission package
7. create and verify a receipt
8. confirm the profile updates

The automated screenshot pass writes inspection artifacts to:

```text
qa/screenshots-wave1/
```
