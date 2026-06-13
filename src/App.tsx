import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  applyReceiptToProfile,
  createAcceptedWorkReceipt,
  createAgentTrace,
  createPursuitPacket,
  createSubmissionPackage,
  releaseSubmissionPackage,
  verifyReceipt,
} from './domain/artifacts'
import { importGitHubOpportunity } from './domain/github'
import { scoreOpportunity } from './domain/scoring'
import { scoreBandCopy, sourceStateCopy } from './domain/status'
import type { AgentTrace } from './domain/types'
import { defaultProfile, useAppState } from './store'
import { navigate, routeParam, usePath } from './router'
import { Badge, Button, EmptyState, Field, OrganizerShell, PageHeader, Panel, PublicShell } from './components'
import './styles.css'

function App() {
  const path = usePath()
  const { state, setState } = useAppState()

  if (path === '/') return <Landing />
  if (path === '/brand-lab') return <BrandLab />
  if (path === '/onboarding') return <Onboarding setState={setState} />

  const organizer = (
    <OrganizerShell path={path}>
      {path === '/app' && <Home state={state} />}
      {path === '/sources' && <Sources state={state} setState={setState} />}
      {path === '/radar' && <Radar state={state} setState={setState} />}
      {path === '/profile' && <Profile state={state} />}
      {routeParam(path, /^\/pursuits\/([^/]+)$/) && <Pursuit state={state} id={routeParam(path, /^\/pursuits\/([^/]+)$/)!} setState={setState} />}
      {routeParam(path, /^\/pursuits\/([^/]+)\/workroom$/) && <Workroom state={state} id={routeParam(path, /^\/pursuits\/([^/]+)\/workroom$/)!} setState={setState} />}
      {routeParam(path, /^\/pursuits\/([^/]+)\/submission$/) && <Submission state={state} id={routeParam(path, /^\/pursuits\/([^/]+)\/submission$/)!} setState={setState} />}
      {routeParam(path, /^\/receipts\/([^/]+)$/) && <Receipt state={state} id={routeParam(path, /^\/receipts\/([^/]+)$/)!} />}
    </OrganizerShell>
  )

  return organizer
}

function Landing() {
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

function BrandLab() {
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

function Onboarding({ setState }: { setState: ReturnType<typeof useAppState>['setState'] }) {
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

function Home({ state }: { state: ReturnType<typeof useAppState>['state'] }) {
  const next = nextAction(state)
  return (
    <>
      <PageHeader eyebrow="Cockpit" title={`Welcome${state.profile?.name ? ` back, ${state.profile.name}` : ''}.`} action={<Button variant="primary" onClick={() => navigate(next.href)}>{next.label}</Button>}>
        <p>{next.help}</p>
      </PageHeader>
      <div className="row-list">
        <div className="row">
          <div>
            <div className="row-title">Live sources</div>
            <div className="row-meta">{state.opportunities.length} imported opportunity snapshots</div>
          </div>
          <Button onClick={() => navigate('/sources')}>Manage sources</Button>
        </div>
        <div className="row">
          <div>
            <div className="row-title">Pursuits</div>
            <div className="row-meta">{state.packets.length} pursuit packets created</div>
          </div>
          <Button onClick={() => navigate('/radar')}>Open radar</Button>
        </div>
        <div className="row">
          <div>
            <div className="row-title">Accepted work</div>
            <div className="row-meta">{state.profile?.acceptedWork ?? 0} local accepted-work receipts</div>
          </div>
          <Button onClick={() => navigate('/profile')}>View profile</Button>
        </div>
      </div>
    </>
  )
}

function Sources({ state, setState }: { state: ReturnType<typeof useAppState>['state']; setState: ReturnType<typeof useAppState>['setState'] }) {
  const [url, setUrl] = useState('https://github.com/vercel/next.js/issues/72923')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    const opportunity = await importGitHubOpportunity(url, import.meta.env.VITE_GITHUB_TOKEN)
    const scorecard = scoreOpportunity(opportunity)
    setState((current) => ({
      ...current,
      opportunities: upsert(current.opportunities, opportunity, 'id'),
      scorecards: upsert(current.scorecards, scorecard, 'opportunityId'),
    }))
    setLoading(false)
  }

  return (
    <>
      <PageHeader eyebrow="Live source import" title="Connect work sources">
        <p>Paste a public GitHub issue or pull request. BuilderDesk imports it live and labels the source health.</p>
      </PageHeader>
      <form className="panel panel-pad form" onSubmit={submit}>
        <Field label="GitHub issue or pull request URL" value={url} onChange={setUrl} required />
        <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Importing live source...' : 'Import source'}</Button>
      </form>
      <SourceRows state={state} />
    </>
  )
}

function SourceRows({ state }: { state: ReturnType<typeof useAppState>['state'] }) {
  if (state.opportunities.length === 0) {
    return <EmptyState title="No sources yet" body="Import a public GitHub issue or pull request to start the radar." />
  }
  return (
    <div className="row-list" style={{ marginTop: 18 }}>
      {state.opportunities.map((opportunity) => {
        const copy = sourceStateCopy[opportunity.sourceState]
        return (
          <div className="row" key={opportunity.id}>
            <div>
              <div className="row-title">{opportunity.title}</div>
              <div className="row-meta">{opportunity.target.owner}/{opportunity.target.repo} #{opportunity.target.number} · {copy.help}</div>
            </div>
            <Badge label={copy.label} tone={copy.tone} />
          </div>
        )
      })}
    </div>
  )
}

function Radar({ state, setState }: { state: ReturnType<typeof useAppState>['state']; setState: ReturnType<typeof useAppState>['setState'] }) {
  const rows = state.opportunities.map((opportunity) => ({
    opportunity,
    scorecard: state.scorecards.find((item) => item.opportunityId === opportunity.id) ?? scoreOpportunity(opportunity),
  }))

  function start(opportunityId: string) {
    const opportunity = state.opportunities.find((item) => item.id === opportunityId)
    const scorecard = state.scorecards.find((item) => item.opportunityId === opportunityId)
    if (!opportunity || !scorecard) return
    const packet = createPursuitPacket(opportunity, scorecard)
    setState((current) => ({ ...current, packets: upsert(current.packets, packet, 'id') }))
    navigate(`/pursuits/${packet.id}`)
  }

  return (
    <>
      <PageHeader eyebrow="Opportunity radar" title="Choose the work worth pursuing" action={<Button variant="primary" onClick={() => navigate('/sources')}>Import source</Button>}>
        <p>Rows are ranked by live source health, clarity, work status, reward signal, and recency.</p>
      </PageHeader>
      {rows.length === 0 ? (
        <EmptyState title="Radar is empty" body="Import a live GitHub source before starting a pursuit." action={<Button variant="primary" onClick={() => navigate('/sources')}>Import source</Button>} />
      ) : (
        <div className="row-list">
          {rows.map(({ opportunity, scorecard }) => {
            const band = scoreBandCopy[scorecard.band]
            return (
              <div className="row" key={opportunity.id}>
                <div>
                  <div className="row-title">{opportunity.title}</div>
                  <div className="row-meta">{scorecard.score}/100 · {scorecard.summary}</div>
                  <details style={{ marginTop: 10 }}>
                    <summary>Why this score?</summary>
                    <p>{scorecard.reasons.join(', ')}</p>
                  </details>
                </div>
                <div className="actions" style={{ marginTop: 0 }}>
                  <Badge label={band.label} tone={band.tone} />
                  <Button variant="primary" onClick={() => start(opportunity.id)} disabled={opportunity.sourceState === 'broken'}>Start pursuit</Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

function Pursuit({ state, id, setState }: { state: ReturnType<typeof useAppState>['state']; id: string; setState: ReturnType<typeof useAppState>['setState'] }) {
  const packet = state.packets.find((item) => item.id === id)
  if (!packet) return <EmptyState title="Pursuit not found" body="Open the radar and create a packet from a live source." />
  const activePacket = packet
  const opportunity = state.opportunities.find((item) => item.id === packet.opportunityId)

  function openWorkroom() {
    if (!opportunity) return
    const trace = createAgentTrace(activePacket, opportunity)
    setState((current) => ({
      ...current,
      traces: upsert(current.traces, trace, 'packetId'),
      packets: current.packets.map((item) => item.id === activePacket.id ? { ...item, status: 'in_workroom' } : item),
    }))
    navigate(`/pursuits/${activePacket.id}/workroom`)
  }

  return (
    <>
      <PageHeader eyebrow="Pursuit packet" title={packet.userProblem} action={<Button variant="primary" onClick={openWorkroom}>Open workroom</Button>}>
        <p>{packet.scope}</p>
      </PageHeader>
      <div className="two-col">
        <Panel>
          <h3>Acceptance criteria</h3>
          <List items={packet.acceptanceCriteria} />
        </Panel>
        <Panel>
          <h3>Risks</h3>
          <List items={packet.risks} />
        </Panel>
      </div>
    </>
  )
}

function Workroom({ state, id, setState }: { state: ReturnType<typeof useAppState>['state']; id: string; setState: ReturnType<typeof useAppState>['setState'] }) {
  const packet = state.packets.find((item) => item.id === id)
  const trace = state.traces.find((item) => item.packetId === id)
  if (!packet || !trace) return <EmptyState title="Workroom is not ready" body="Open the pursuit packet first so the local helper can prepare a trace." />
  const activePacket = packet
  const activeTrace = trace

  function release() {
    const pkg = createSubmissionPackage(activePacket, activeTrace)
    setState((current) => ({
      ...current,
      packages: upsert(current.packages, pkg, 'packetId'),
    }))
    navigate(`/pursuits/${activePacket.id}/submission`)
  }

  return (
    <>
      <PageHeader eyebrow="Accountable agent workroom" title="Bounded help, human release." action={<Button variant="primary" onClick={release}>Prepare submission package</Button>}>
        <p>This local demo helper can organize evidence. It cannot submit, claim payment, or touch external repos.</p>
      </PageHeader>
      <WorkroomTrace trace={trace} />
    </>
  )
}

function WorkroomTrace({ trace }: { trace: AgentTrace }) {
  return (
    <div className="two-col">
      <Panel>
        <h3>Work plan</h3>
        <List items={trace.workPlan} />
      </Panel>
      <Panel>
        <h3>Guardrails</h3>
        <Badge label="Demo helper" tone="info" />
        <h3 style={{ marginTop: 18 }}>Allowed</h3>
        <List items={trace.allowedActions} />
        <h3 style={{ marginTop: 18 }}>Blocked</h3>
        <List items={trace.blockedActions} />
      </Panel>
    </div>
  )
}

function Submission({ state, id, setState }: { state: ReturnType<typeof useAppState>['state']; id: string; setState: ReturnType<typeof useAppState>['setState'] }) {
  const packet = state.packets.find((item) => item.id === id)
  const pkg = state.packages.find((item) => item.packetId === id)
  if (!packet || !pkg) return <EmptyState title="No submission package" body="Prepare the package from the workroom before releasing." />
  const activePacket = packet
  const activePackage = pkg

  function createReceipt() {
    const released = releaseSubmissionPackage(activePackage)
    const receipt = createAcceptedWorkReceipt(released, activePacket)
    setState((current) => ({
      ...current,
      packages: upsert(current.packages, released, 'id'),
      receipts: upsert(current.receipts, receipt, 'id'),
      packets: current.packets.map((item) => item.id === activePacket.id ? { ...item, status: 'accepted' } : item),
      profile: current.profile ? applyReceiptToProfile(current.profile, receipt) : current.profile,
    }))
    navigate(`/receipts/${receipt.id}`)
  }

  return (
    <>
      <PageHeader eyebrow="Submission package" title="Review before release" action={<Button variant="primary" onClick={createReceipt}>Mark accepted and create receipt</Button>}>
        <p>{pkg.releaseNote}</p>
      </PageHeader>
      <Panel>
        <h3>{pkg.summary}</h3>
        <List items={pkg.deliverables} />
        <details style={{ marginTop: 18 }}>
          <summary>Evidence checklist</summary>
          <List items={pkg.evidenceChecklist} />
        </details>
      </Panel>
    </>
  )
}

function Receipt({ state, id }: { state: ReturnType<typeof useAppState>['state']; id: string }) {
  const receipt = state.receipts.find((item) => item.id === id)
  const pkg = receipt ? state.packages.find((item) => item.id === receipt.packageId) : undefined
  const packet = receipt ? state.packets.find((item) => item.id === receipt.packetId) : undefined
  const output = receipt ? verifyReceipt(receipt, pkg, packet) : { valid: false, message: 'Receipt is not available on this device.' }

  if (!receipt) return <EmptyState title="Receipt not found" body="This device does not have that local receipt. Open profile or recreate from the submission package." />

  return (
    <>
      <PageHeader eyebrow="Accepted-work receipt" title={output.valid ? 'Receipt verified' : 'Receipt needs recovery'} action={<Button onClick={() => navigate('/profile')}>Open profile</Button>}>
        <p>{output.message}</p>
      </PageHeader>
      <Panel>
        <Badge label={output.valid ? 'Verified locally' : 'Recovery needed'} tone={output.valid ? 'good' : 'warn'} />
        <h3 style={{ marginTop: 18 }}>{packet?.userProblem ?? 'Unknown pursuit'}</h3>
        <div className="stat-strip">
          <div className="stat"><strong>{receipt.result}</strong><p>Result</p></div>
          <div className="stat"><strong>{receipt.verifierDigest}</strong><p>Verifier digest</p></div>
          <div className="stat"><strong>+1</strong><p>Profile accepted work</p></div>
        </div>
      </Panel>
    </>
  )
}

function Profile({ state }: { state: ReturnType<typeof useAppState>['state'] }) {
  return (
    <>
      <PageHeader eyebrow="Builder profile" title={state.profile?.name ?? 'No profile yet'} action={<Button variant="primary" onClick={() => navigate('/onboarding')}>Edit profile</Button>}>
        <p>{state.profile ? `${state.profile.skills} · ${state.profile.capacity}` : 'Create a local profile before pursuing work.'}</p>
      </PageHeader>
      <div className="row-list">
        <div className="row">
          <div>
            <div className="row-title">Accepted work</div>
            <div className="row-meta">Updated only when a local receipt verifies against a released package.</div>
          </div>
          <Badge label={`${state.profile?.acceptedWork ?? 0} receipts`} tone="good" />
        </div>
        {state.receipts.map((receipt) => (
          <div className="row" key={receipt.id}>
            <div>
              <div className="row-title">{receipt.id}</div>
              <div className="row-meta">{receipt.profileDelta} · {receipt.verifierDigest}</div>
            </div>
            <Button onClick={() => navigate(`/receipts/${receipt.id}`)}>Open receipt</Button>
          </div>
        ))}
      </div>
    </>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

function nextAction(state: ReturnType<typeof useAppState>['state']) {
  if (!state.profile) return { href: '/onboarding', label: 'Set up profile', help: 'Create your local builder profile before importing work.' }
  if (state.opportunities.length === 0) return { href: '/sources', label: 'Import source', help: 'Start with one live GitHub issue or pull request.' }
  if (state.packets.length === 0) return { href: '/radar', label: 'Open radar', help: 'Choose one source that is worth pursuing.' }
  const packet = state.packets[state.packets.length - 1]
  if (!state.packages.some((item) => item.packetId === packet.id)) {
    return { href: `/pursuits/${packet.id}/workroom`, label: 'Open workroom', help: 'Package agent help behind human release.' }
  }
  if (state.receipts.length === 0) {
    return { href: `/pursuits/${packet.id}/submission`, label: 'Review package', help: 'Release the submission package and create a receipt.' }
  }
  return { href: '/profile', label: 'View profile', help: 'Accepted work is now reflected in your profile.' }
}

function upsert<T extends Record<string, unknown>>(items: T[], item: T, key: keyof T) {
  const exists = items.some((current) => current[key] === item[key])
  return exists ? items.map((current) => current[key] === item[key] ? item : current) : [item, ...items]
}

export default App
