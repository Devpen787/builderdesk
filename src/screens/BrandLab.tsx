import { useState } from 'react'
import type { ReactNode } from 'react'
import { Badge, BrandMark, Button, Field, PageHeader, Panel, ProofDisclosure, PublicShell } from '../components'
import { OpportunityRow, ScoreMeter, SourceHealthRow } from '../ui/product'
import { sourceStateCopy } from '../domain/status'
import type { OpportunitySnapshot, QualificationScorecard, SourceState } from '../domain/types'

const navItems: Array<[string, string]> = [
  ['identity', 'Identity'],
  ['tokens', 'Tokens'],
  ['components', 'Components'],
  ['product', 'Product'],
  ['states', 'States'],
]

const colorTokens: Array<[string, string]> = [
  ['Canvas', 'canvas'],
  ['Surface', 'surface'],
  ['Ink', 'ink'],
  ['Ink soft', 'ink-soft'],
  ['Line', 'line'],
  ['Primary', 'primary'],
  ['Accent', 'accent'],
  ['Success', 'success'],
  ['Warning', 'warning'],
  ['Danger', 'danger'],
  ['Proof', 'proof'],
  ['Agent', 'agent'],
  ['Receipt', 'receipt'],
]

const typeScale: Array<[string, string]> = [
  ['Title', 'title-size'],
  ['Section', 'section-size'],
  ['Body', 'body-size'],
  ['Small', 'small-size'],
  ['Micro', 'micro-size'],
]

const claimLabels = ['live', 'artifact', 'configured', 'demo', 'roadmap']
const sourceStates: SourceState[] = ['live', 'partial', 'broken', 'rate_limited']

const sampleOpportunity: OpportunitySnapshot = {
  id: 'sample',
  target: { owner: 'ethereum', repo: 'EIPs', number: 7212, kind: 'issue', url: '#' },
  sourceState: 'live',
  claimMode: 'demo',
  importedAt: new Date().toISOString(),
  title: 'Add validation for precompile gas costs',
  bodyPreview: 'Demo opportunity for the brand lab.',
  stateLabel: 'open',
  labels: ['core', 'good first issue'],
  author: 'sample-maintainer',
  rewardSignal: '$1,500 USDC',
  deadlineSignal: 'Due in 9 days',
  sourceHealthNote: 'Live import with enough public context to score.',
  lastActivityAt: new Date().toISOString(),
}

const sampleScorecard: QualificationScorecard = {
  opportunityId: 'sample',
  score: 82,
  band: 'pursue',
  reasons: ['source-live', 'open-work', 'clear-scope', 'reward-signal', 'fresh-activity'],
  summary: 'Strong pursuit candidate with a visible reward and clear scope.',
}

export function BrandLab() {
  const [sample, setSample] = useState('Maya')
  return (
    <PublicShell>
      <main className="main lab">
        <div className="lab-banner">Brand lab · internal reference · demo data only</div>
        <PageHeader eyebrow="Design system" title="BuilderDesk brand lab">
          <p>The live component system behind BuilderDesk. Every block renders the same primitives the product screens use, so the lab cannot drift from the app.</p>
        </PageHeader>
        <nav className="lab-nav" aria-label="Brand lab sections">
          {navItems.map(([id, label]) => (
            <a className="flow-pill" key={id} href={`#${id}`}>{label}</a>
          ))}
        </nav>

        <LabSection id="identity" title="Identity">
          <div className="lab-grid">
            <Panel>
              <h3>Mark</h3>
              <div className="mark-demo">
                <div className="mark-tile light"><BrandMark /></div>
                <div className="mark-tile dark"><BrandMark /></div>
              </div>
              <p>Desk surface plus accepted-proof check. Drawn in currentColor so it reads on light and dark.</p>
            </Panel>
            <Panel>
              <h3>Wordmark</h3>
              <div className="wordmark-demo">
                <span className="wordmark"><span>Builder</span><span className="wordmark-desk">Desk</span></span>
                <span className="endorse">by ProofForge</span>
              </div>
              <p>Builder in ink, Desk in accent. The endorsement line stays small and separate.</p>
            </Panel>
          </div>
        </LabSection>

        <LabSection id="tokens" title="Tokens">
          <div className="lab-grid">
            <Panel>
              <h3>Color</h3>
              <div className="swatch-grid">
                {colorTokens.map(([name, token]) => (
                  <div className="swatch" key={token}>
                    <span className="swatch-chip" style={{ background: `var(--${token})` }} />
                    <span className="swatch-name">{name}</span>
                    <span className="swatch-token">--{token}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel>
              <h3>Type scale</h3>
              <div className="type-scale">
                {typeScale.map(([name, token]) => (
                  <span key={token} style={{ fontSize: `var(--${token})`, lineHeight: 1.2 }}>{name}</span>
                ))}
              </div>
            </Panel>
          </div>
        </LabSection>

        <LabSection id="components" title="Components">
          <div className="lab-grid">
            <Panel>
              <h3>Buttons</h3>
              <div className="lab-row">
                <Button variant="primary">Primary</Button>
                <Button>Secondary</Button>
                <Button variant="accent">Accent</Button>
                <Button disabled>Disabled</Button>
              </div>
            </Panel>
            <Panel>
              <h3>Status badges</h3>
              <div className="lab-row">
                <Badge label="Live" tone="good" />
                <Badge label="Watch" tone="info" />
                <Badge label="Needs check" tone="warn" />
                <Badge label="Broken" tone="bad" />
              </div>
            </Panel>
            <Panel>
              <h3>Score meter</h3>
              <div className="lab-row">
                <ScoreMeter score={82} tone="good" />
                <ScoreMeter score={54} tone="info" />
                <ScoreMeter score={38} tone="warn" />
                <ScoreMeter score={17} tone="bad" />
              </div>
            </Panel>
            <Panel>
              <h3>Field &amp; disclosure</h3>
              <Field label="Name" value={sample} onChange={setSample} />
              <ProofDisclosure summary="Proof details">
                <p>Collapsed by default. Opens to evidence, export, or copy.</p>
              </ProofDisclosure>
            </Panel>
          </div>
        </LabSection>

        <LabSection id="product" title="Product components">
          <Badge label="Demo data" tone="info" />
          <div className="row-list" style={{ marginTop: 16 }}>
            <OpportunityRow opportunity={sampleOpportunity} scorecard={sampleScorecard} onStart={() => {}} />
            <SourceHealthRow opportunity={sampleOpportunity} />
          </div>
        </LabSection>

        <LabSection id="states" title="State language">
          <div className="lab-grid">
            <Panel>
              <h3>Source states</h3>
              <div className="row-list">
                {sourceStates.map((state) => {
                  const copy = sourceStateCopy[state]
                  return (
                    <div className="row" key={state}>
                      <div>
                        <div className="row-title">{copy.label}</div>
                        <div className="row-meta">{copy.help}</div>
                      </div>
                      <Badge label={copy.label} tone={copy.tone} />
                    </div>
                  )
                })}
              </div>
            </Panel>
            <Panel>
              <h3>Claim labels</h3>
              <p>Every product and sponsor claim carries one of these.</p>
              <div className="lab-row">
                {claimLabels.map((label) => (
                  <span className="meta-chip" key={label}><span className="meta-chip-label">{label}</span></span>
                ))}
              </div>
            </Panel>
          </div>
        </LabSection>
      </main>
    </PublicShell>
  )
}

function LabSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="lab-section" id={id}>
      <h2 className="lab-section-title">{title}</h2>
      {children}
    </section>
  )
}
