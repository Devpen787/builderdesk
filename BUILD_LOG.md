# Build Log

Use this log to keep the work traceable and avoid large opaque commits.

| Stage | Commit | What changed | Verification |
| --- | --- | --- | --- |
| 1 | `85dd179` | Scaffold repo, README, AI attribution, claims, build log | Fresh-track disclosure files created |
| 2 | `8149c09` | Added Wave 1 product loop: routing, local state, GitHub importer, scoring, pursuit packets, agent trace, submission package, receipt verifier, profile update | `npm run test`, `npm run build` |
| 3 | `8e7b89e` | Split screens and styles under the 400-line source-file rule | `npm run test`, `npm run build`, `npm run lint` |
| 4 | `43179d1` | Added Playwright screenshot QA, clean-state journey, live-source seed fix, mobile receipt/profile overflow checks | `npm run test`, `npm run build`, `npm run lint`, `npm run qa:screenshots` |
| 5 | `03a14db` | Recorded screenshot evidence in the repo | `qa/screenshots-wave1/` committed |
| 6 | pending | Published GitHub repo and Vercel production deployment | GitHub: `https://github.com/Devpen787/builderdesk`; Vercel: `https://builderdesk-roan.vercel.app` |

## Screenshot Evidence

Browser QA screenshots are saved in:

```text
qa/screenshots-wave1/
```

The script captures the full happy path plus mobile/tablet checks:

```bash
npm run qa:screenshots
```

## Published Surfaces

- GitHub: `https://github.com/Devpen787/builderdesk`
- Vercel production alias: `https://builderdesk-roan.vercel.app`
- Vercel deployment URL: `https://builderdesk-6slya25jc-devinsons-projects-b5ab981e.vercel.app`
