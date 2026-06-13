# BuilderDesk Demo Script (~3 minutes)

Run from a reset browser (clear localStorage). The full loop works offline; sponsor keys upgrade specific moments from `configured` to `live`.

1. **Landing (`/`)** — "Work radar for serious builders." Click **Build my work radar**.
2. **Onboarding (`/onboarding`)** — fill the profile. In **ENS name or wallet address**, enter a real name (e.g. `vitalik.eth`) and click **Resolve** → the live ENS name + address appear (`live · ENS`). With `VITE_PRIVY_APP_ID` set, **Sign in with Privy** provisions an embedded wallet that auto-fills here. Continue.
3. **Cockpit (`/app`)** — one clear next action. Click **Import source**.
4. **Sources (`/sources`)** — paste a real public GitHub issue/PR URL → it imports **live** with an honest source-health label (author, labels, import note).
5. **Radar (`/radar`)** — the opportunity shows a score-meter ring, band badge, and State/Reward/Deadline chips. Open **Why this score?** for plain-language reasons. Click **Start pursuit**.
6. **Pursuit (`/pursuits/:id`)** — acceptance criteria + risks. Click **Get qualification insight** for the Google Cloud (Gemini) read (`live` with `GEMINI_API_KEY`, else `configured only`). Click **Open workroom**.
7. **Workroom** — the accountable agent panel (agent-purple) shows the helper's allowed/blocked actions and that human release is required. Click **Prepare submission package**.
8. **Submission** — review deliverables and evidence checklist; **Copy submission package** exports the artifact. Click **Mark accepted and create receipt** → with Privy configured, this is signed by the embedded wallet (human release).
9. **Receipt (`/receipts/:id`)** — the gold accepted-work receipt: verified locally, builder ENS identity, "Signed release" when signed, **Export receipt (JSON)**.
10. **Profile (`/profile`)** — builder identity (ENS) + accepted-work count incremented. The loop compounds.

Also show **`/brand-lab`** — the live design system (mark, tokens, components, product rows, state matrix) that every screen is built from.

## Honesty callouts during the demo

- ENS resolution is **live**.
- Privy login + signed release is **configured** (live with an app id).
- Google Cloud insight is **configured** (live with a key); local scoring is always on.
- The agent helper and local verifier are **demo/artifact** — clearly labeled, no faked payments or external submission.
