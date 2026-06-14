import { Badge, Button, PublicShell } from '../components'
import { ScoreMeter } from '../ui/product'
import { navigate } from '../router'

const loop: Array<[string, string]> = [
  ['Import', 'Pull a live GitHub issue or pull request into one place.'],
  ['Score', 'Rank it by source health, clarity, reward, and recency.'],
  ['Pursue', 'Turn the best one into a focused pursuit packet.'],
  ['Package', 'Bounded agent help, assembled behind human release.'],
  ['Receipt', 'Accepted work becomes a verifiable receipt.'],
  ['Profile', 'Proof compounds into a stronger builder profile.'],
]

const capabilities: Array<[string, string]> = [
  ['Live GitHub import · Live', 'good'],
  ['ENS identity · Live', 'good'],
  ['Privy wallet · Configured', 'warn'],
  ['Google Cloud insight · Configured', 'warn'],
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
            <Button onClick={() => navigate('/brand-lab')}>Open brand lab</Button>
          </div>
          <div className="cap-strip">
            {capabilities.map(([label, tone]) => <Badge key={label} label={label} tone={tone} />)}
          </div>
        </div>

        <div className="hero-preview" aria-hidden="true">
          <div className="preview-card">
            <div className="preview-head"><span className="preview-dot" /><span className="preview-dot" /><span className="preview-dot" /> builderdesk · radar</div>
            <div className="preview-row">
              <ScoreMeter score={87} tone="good" />
              <div className="preview-main">
                <div className="preview-title">Trade-offs in Control Flow Analysis</div>
                <div className="preview-chips">
                  <span className="meta-chip"><span className="meta-chip-label">Reward</span><span className="meta-chip-value">$1,500</span></span>
                  <span className="meta-chip"><span className="meta-chip-label">State</span><span className="meta-chip-value">open</span></span>
                </div>
              </div>
              <Badge label="Pursue" tone="good" />
            </div>
            <div className="preview-receipt">
              <span className="eyebrow">Accepted-work receipt</span>
              <div className="ticket-number tnum">#BD1</div>
              <p>Human released · Locally verified</p>
            </div>
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
        <h2>Built like a cockpit, not a feed.</h2>
        <div className="surface-grid">
          <div className="surface-card">
            <Badge label="Opportunity radar" tone="info" />
            <h3>Decide at a glance</h3>
            <p>Ranked rows with a live score, source health, and reward signals — so you know what's worth pursuing.</p>
          </div>
          <div className="surface-card agent-panel">
            <Badge label="Accountable agent" tone="agent" />
            <h3>Bounded help</h3>
            <p>Every agent shows allowed and blocked actions, and nothing ships without human release.</p>
          </div>
          <div className="surface-card receipt-card">
            <Badge label="Accepted-work receipt" tone="warn" />
            <h3>Reusable proof</h3>
            <p>Accepted work becomes a verifiable receipt that compounds on your builder profile.</p>
          </div>
        </div>
        <div className="band-cta">
          <Button variant="primary" onClick={() => navigate('/onboarding')}>Build my work radar</Button>
        </div>
      </section>
    </PublicShell>
  )
}
