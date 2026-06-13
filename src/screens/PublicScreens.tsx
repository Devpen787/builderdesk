import { useState } from 'react'
import type { FormEvent } from 'react'
import { defaultProfile, useAppState } from '../store'
import { navigate } from '../router'
import { Button, Field, PageHeader, Panel, PublicShell } from '../components'

export function Landing() {
  return (
    <PublicShell>
      <section className="hero-page">
        <div>
          <span className="eyebrow">Live work sources. Human release.</span>
          <h1>Work radar for serious builders.</h1>
          <p className="lead">
            BuilderDesk pulls live work from GitHub, turns it into pursuit packets, keeps agent help accountable, and produces receipts when work is accepted.
          </p>
          <div className="actions">
            <Button variant="primary" onClick={() => navigate('/onboarding')}>Build my work radar</Button>
            <Button onClick={() => navigate('/brand-lab')}>Open brand lab</Button>
          </div>
          <div className="flow-line" aria-label="BuilderDesk loop">
            {['Import', 'Score', 'Pursue', 'Package', 'Receipt', 'Profile'].map((step) => (
              <span className="flow-pill" key={step}>{step}</span>
            ))}
          </div>
        </div>
        <div className="panel ticket-visual" aria-label="BuilderDesk receipt preview">
          <span className="badge info">Accepted-work receipt</span>
          <div className="ticket">
            <p>Source</p>
            <h3>GitHub issue</h3>
            <div className="ticket-number">#BD1</div>
            <p>Human released. Locally verified.</p>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}

export function BrandLab() {
  return (
    <PublicShell>
      <main className="main">
        <PageHeader eyebrow="Fresh design system" title="BuilderDesk brand lab">
          <p>Focused Builder Cockpit: calm rows, warm surfaces, one clear action, no sponsor wall, no chat-first maze.</p>
        </PageHeader>
        <div className="two-col">
          <Panel>
            <h3>Voice</h3>
            <p>Plain, operational, accountable. The user should know what source was imported, what is ready, and what still needs human release.</p>
            <div className="stat-strip">
              <div className="stat"><strong>1</strong><p>primary action per screen</p></div>
              <div className="stat"><strong>5</strong><p>claim labels</p></div>
              <div className="stat"><strong>0</strong><p>copied ProofForge assets</p></div>
            </div>
          </Panel>
          <Panel>
            <h3>Tokens</h3>
            <p>Warm off-white background, near-black actions, restrained purple accent, green for verified states, amber for friction.</p>
            <div className="flow-line">
              <span className="badge info">Live</span>
              <span className="badge good">Accepted</span>
              <span className="badge warn">Needs check</span>
              <span className="badge bad">Broken</span>
            </div>
          </Panel>
        </div>
      </main>
    </PublicShell>
  )
}

export function Onboarding({ setState }: { setState: ReturnType<typeof useAppState>['setState'] }) {
  const [name, setName] = useState('Maya')
  const [email, setEmail] = useState('maya@example.com')
  const [skills, setSkills] = useState('React, agent workflows, technical writing')
  const [ecosystems, setEcosystems] = useState('Ethereum, GitHub, open source')
  const [capacity, setCapacity] = useState('6 focused hours this weekend')

  function submit(event: FormEvent) {
    event.preventDefault()
    setState((state) => ({ ...state, profile: defaultProfile(name, email, skills, ecosystems, capacity) }))
    navigate('/app')
  }

  return (
    <PublicShell>
      <main className="narrow">
        <PageHeader eyebrow="Builder profile" title="Set up your desk">
          <p>Your profile keeps sources, pursuit packets, receipts, and accepted-work history on this device.</p>
        </PageHeader>
        <form className="panel panel-pad form" onSubmit={submit}>
          <Field label="Name" value={name} onChange={setName} required />
          <Field label="Email" value={email} onChange={setEmail} required />
          <Field label="Skills" value={skills} onChange={setSkills} />
          <Field label="Ecosystems" value={ecosystems} onChange={setEcosystems} />
          <Field label="Capacity" value={capacity} onChange={setCapacity} />
          <Button type="submit" variant="primary">Continue</Button>
        </form>
      </main>
    </PublicShell>
  )
}
