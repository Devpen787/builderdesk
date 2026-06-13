# Sponsor Integrations

Each integration is filled against the BUILD_CONTRACT sponsor-fit contract. Claim labels are honest: `live` runs now against a real service, `configured` works when keys are supplied, `roadmap` is future work.

## ENS — `live`

| Field | Answer |
| --- | --- |
| Product need | Builder/agent identity must be portable and non-hardcoded, not a local string. |
| Sponsor primitive | ENS forward + reverse resolution (`getEnsAddress` / `getEnsName`) via a viem public mainnet client. |
| User-visible moment | Onboarding resolves an ENS name or address; the resolved name shows on the profile and on the accepted-work receipt. |
| Artifact / proof | The receipt and profile carry the resolved ENS name/address. |
| Breakage test | Without ENS the builder identity is an unverifiable local string with no portable resolution. |
| Claim label | `live` — verified: `vitalik.eth` resolves to `0xd8dA…6045` and reverse-resolves. |
| Showcase reason | Read-only ENS identity with no custody is a copyable pattern for any builder profile/receipt. |

Implementation: [src/domain/ens.ts](../src/domain/ens.ts). No wallet, no signing.

## Privy — `configured`

| Field | Answer |
| --- | --- |
| Product need | Web2-style login that provisions an account/wallet without a wallet-first wall, and makes "human release" a real signed action. |
| Sponsor primitive | Privy email login + embedded Ethereum wallet; `personal_sign` for the release. |
| User-visible moment | Onboarding "Sign in with Privy" → embedded wallet address (ENS-resolved); the submission release is signed and the receipt shows "Signed release". |
| Artifact / proof | The receipt stores the release signature and signer identity. |
| Breakage test | Without Privy there is no real account and the human release is an unsigned button click. |
| Claim label | `configured` — set `VITE_PRIVY_APP_ID` to go live; the local fallback flow remains the default so the demo always works. |
| Showcase reason | Email-login-to-embedded-wallet with a signed approval gate is a reusable Web2-onboarding pattern. |

Implementation: [src/auth/privy.tsx](../src/auth/privy.tsx). Env-gated; never executes without an app id.

## Google Cloud — `configured`

| Field | Answer |
| --- | --- |
| Product need | Scoring should be augmented with current, model-generated qualification insight, not just static heuristics. |
| Sponsor primitive | Gemini `generateContent` via a Vercel edge function. |
| User-visible moment | The pursuit screen's "Get qualification insight" button returns a plain-language read on the opportunity. |
| Artifact / proof | The returned insight is shown with a live/configured label. |
| Breakage test | Without Google Cloud the radar still scores locally, but loses live model-generated insight. |
| Claim label | `configured` — set `GEMINI_API_KEY` on Vercel to go live; the deterministic local scorer is the always-on default. |
| Showcase reason | A graceful, key-gated enrichment endpoint that never blocks the core flow is a copyable pattern. |

Implementation: [api/enrich.ts](../api/enrich.ts) + [src/domain/enrich.ts](../src/domain/enrich.ts).

## Roadmap (not claimed as working)

Live payments / payout movement (Arc), durable evidence storage (Walrus/Sui), human proof (World), hardware human-release (Ledger), a second non-GitHub live source adapter.

## Environment variables

| Var | Enables | Without it |
| --- | --- | --- |
| `VITE_PRIVY_APP_ID` | Privy login + embedded wallet + signed release | local identity/ENS flow (default) |
| `GEMINI_API_KEY` | Google Cloud insight (live) | local scorer only; insight labeled configured |
