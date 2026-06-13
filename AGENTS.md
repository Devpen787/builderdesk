# BuilderDesk Agent Guide

This repository is a fresh BuilderDesk implementation for ETHGlobal.

## Product Loop

Preserve this loop:

```text
live GitHub source import -> opportunity radar -> pursuit packet -> accountable agent workroom -> submission package -> accepted-work receipt -> profile update
```

## Fresh Track Rules

- Do not copy prior ProofForge code, CSS, assets, screenshots, generated packets, or implementation files.
- Prior ProofForge work may inform judgment only.
- Keep commits small and named around what they prove.
- Every claim must be labeled `live`, `artifact`, `configured`, `demo`, or `roadmap`.

## UI Rules

- Focused Builder Cockpit.
- Row-first over card grids.
- One primary action per screen.
- No wallet-first onboarding.
- No sponsor-logo wall.
- No generic chat-first agent interface.
- No raw JSON, hashes, prompts, protocol names, or internal metadata in primary UI.

## Build Rules

- Use React + Vite + TypeScript.
- Keep domain logic outside UI components.
- Add tests for source import, scoring, pursuit packets, agent traces, receipts, and verifier output.
- Run `npm run test` and `npm run build` before completion claims.
