import { Badge, Button, PublicShell } from '../components'
import { ScoreMeter } from '../ui/product'
import { navigate } from '../router'

const previewRows: Array<{ score: number; tone: string; band: string; title: string; reward: string }> = [
  { score: 87, tone: 'good', band: 'Pursue', title: 'Trade-offs in Control Flow Analysis', reward: '$1,500' },
  { score: 64, tone: 'info', band: 'Watch', title: 'Add docs for the plugin API', reward: 'Grant' },
  { score: 41, tone: 'warn', band: 'Risky', title: 'Flaky CI on Windows runners', reward: 'Not listed' },
]

const loop: Array<[string, string]> = [
  ['Import', 'Search live GitHub issues into one place.'],
  ['Score', 'Rank by source health, clarity, reward, recency.'],
  ['Pursue', 'Turn the best one into a pursuit packet.'],
  ['Package', 'Bounded agent help, behind human release.'],
  ['Receipt', 'Accepted work becomes a verifiable receipt.'],
  ['Profile', 'Proof compounds into a stronger profile.'],
]

const benefits: Array<[string, string]> = [
  ['Find funded work', 'Search live GitHub issues by label or repo and rank them by source health, clarity, reward, and recency.'],
  ['Stay accountable', 'Agents help inside visible boundaries — and nothing ships without your human release.'],
  ['Build reusable proof', 'Accepted work becomes a verifiable receipt that compounds on your builder profile.'],
]

export function Landing() {
  return (
    <PublicShell>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Live work sources · Human release</span>
          <h1>Work radar for serious builders.</h1>
          <p className="lead">
            Find funded work, run an accountable agent-assisted pursuit, and turn accepted work into reusable proof — without losing the thread.
          </p>
          <div className="actions">
            <Button variant="primary" onClick={() => navigate('/onboarding')}>Build my work radar</Button>
          </div>
          <p className="cap-line">Live: GitHub import · ENS identity &nbsp;·&nbsp; Configured: Privy wallet · Google Cloud insight</p>
        </div>

        <div className="hero-preview" aria-hidden="true">
          <div className="preview-card">
            <div className="preview-head"><span className="preview-dot" /><span className="preview-dot" /><span className="preview-dot" /> builderdesk · radar</div>
            {previewRows.map((row) => (
              <div className="preview-row" key={row.title}>
                <ScoreMeter score={row.score} tone={row.tone} />
                <div className="preview-main">
                  <div className="preview-title">{row.title}</div>
                  <div className="preview-chips">
                    <span className="meta-chip"><span className="meta-chip-label">Reward</span><span className="meta-chip-value">{row.reward}</span></span>
                  </div>
                </div>
                <Badge label={row.band} tone={row.tone} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <h2>One loop, end to end.</h2>
        <div className="loop-grid">
          {loop.map(([title, body], index) => (
            <div className="loop-step" key={title}>
              <span className="loop-num tnum">{index + 1}</span>
              <div className="loop-title">{title}</div>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="benefits">
          {benefits.map(([title, body]) => (
            <div className="benefit" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <div className="band-cta">
          <Button variant="primary" onClick={() => navigate('/onboarding')}>Build my work radar</Button>
        </div>
      </section>
    </PublicShell>
  )
}
