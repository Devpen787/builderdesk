# Claims

BuilderDesk separates working claims from configured and future claims. See [docs/SPONSORS.md](docs/SPONSORS.md) for the per-sponsor breakdown.

## Live

- Public GitHub issue or pull request URL import.
- ENS identity resolution (forward + reverse) over a public mainnet RPC.
- Local app state changes in the browser.
- Production web app deployed to Vercel.

## Artifact

- Pursuit packet, agent trace, submission package, accepted-work receipt, local verifier output.
- Export/copy of the submission package and receipt (JSON to clipboard).
- Browser QA screenshots in `qa/screenshots-wave1/`.

## Configured

- Optional GitHub token for higher rate limits.
- Privy email login + embedded wallet + signed human-release (`VITE_PRIVY_APP_ID`).
- Google Cloud (Gemini) qualification insight (`GEMINI_API_KEY`).

## Demo

- Local scoring rules (always-on default).
- Local bounded agent helper.
- Local acceptance outcome.

## Roadmap

- Live payments / payout movement (Arc).
- Wallet custody beyond the embedded-wallet demo.
- Durable decentralized evidence storage (Walrus/Sui).
- Human proof (World), hardware human-release (Ledger).
- A second non-GitHub live source adapter.
