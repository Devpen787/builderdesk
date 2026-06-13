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
} from '../domain/artifacts'
import { upsert } from '../domain/collection'
import { importGitHubOpportunity } from '../domain/github'
import { scoreOpportunity } from '../domain/scoring'
import type { AgentTrace } from '../domain/types'
import { useAppState } from '../store'
import { navigate } from '../router'
import { Badge, Button, EmptyState, Field, PageHeader, Panel, ProofDisclosure } from '../components'
import { OpportunityRow, SourceHealthRow } from '../ui/product'

type AppStore = ReturnType<typeof useAppState>
type State = AppStore['state']
type SetState = AppStore['setState']

export function Home({ state }: { state: State }) {
  const next = nextAction(state)
  return (
    <>
      <PageHeader eyebrow="Cockpit" title={`Welcome${state.profile?.name ? ` back, ${state.profile.name}` : ''}.`} action={<Button variant="primary" onClick={() => navigate(next.href)}>{next.label}</Button>}>
        <p>{next.help}</p>
      </PageHeader>
      <div className="row-list">
        <MetricRow title="Live sources" meta={`${state.opportunities.length} imported opportunity snapshots`} action="Manage sources" href="/sources" />
        <MetricRow title="Pursuits" meta={`${state.packets.length} pursuit packets created`} action="Open radar" href="/radar" />
        <MetricRow title="Accepted work" meta={`${state.profile?.acceptedWork ?? 0} local accepted-work receipts`} action="View profile" href="/profile" />
      </div>
    </>
  )
}

export function Sources({ state, setState }: { state: State; setState: SetState }) {
  const [url, setUrl] = useState('https://github.com/microsoft/TypeScript/issues/9998')
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

export function Radar({ state, setState }: { state: State; setState: SetState }) {
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
          {rows.map(({ opportunity, scorecard }) => (
            <OpportunityRow
              key={opportunity.id}
              opportunity={opportunity}
              scorecard={scorecard}
              onStart={() => start(opportunity.id)}
            />
          ))}
        </div>
      )}
    </>
  )
}

export function Pursuit({ state, id, setState }: { state: State; id: string; setState: SetState }) {
  const packet = state.packets.find((item) => item.id === id)
  if (!packet) return <EmptyState title="Pursuit not found" body="Open the radar and create a packet from a live source." />
  const opportunity = state.opportunities.find((item) => item.id === packet.opportunityId)

  function openWorkroom() {
    if (!opportunity) return
    const trace = createAgentTrace(packet!, opportunity)
    setState((current) => ({
      ...current,
      traces: upsert(current.traces, trace, 'packetId'),
      packets: current.packets.map((item) => item.id === packet!.id ? { ...item, status: 'in_workroom' } : item),
    }))
    navigate(`/pursuits/${packet!.id}/workroom`)
  }

  return (
    <>
      <PageHeader eyebrow="Pursuit packet" title={packet.userProblem} action={<Button variant="primary" onClick={openWorkroom}>Open workroom</Button>}><p>{packet.scope}</p></PageHeader>
      <div className="two-col">
        <Panel><h3>Acceptance criteria</h3><List items={packet.acceptanceCriteria} /></Panel>
        <Panel><h3>Risks</h3><List items={packet.risks} /></Panel>
      </div>
    </>
  )
}

export function Workroom({ state, id, setState }: { state: State; id: string; setState: SetState }) {
  const packet = state.packets.find((item) => item.id === id)
  const trace = state.traces.find((item) => item.packetId === id)
  if (!packet || !trace) return <EmptyState title="Workroom is not ready" body="Open the pursuit packet first so the local helper can prepare a trace." />

  function release() {
    const pkg = createSubmissionPackage(packet!, trace!)
    setState((current) => ({ ...current, packages: upsert(current.packages, pkg, 'packetId') }))
    navigate(`/pursuits/${packet!.id}/submission`)
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

export function Submission({ state, id, setState }: { state: State; id: string; setState: SetState }) {
  const packet = state.packets.find((item) => item.id === id)
  const pkg = state.packages.find((item) => item.packetId === id)
  if (!packet || !pkg) return <EmptyState title="No submission package" body="Prepare the package from the workroom before releasing." />

  function createReceipt() {
    const released = releaseSubmissionPackage(pkg!)
    const receipt = createAcceptedWorkReceipt(released, packet!)
    setState((current) => ({
      ...current,
      packages: upsert(current.packages, released, 'id'),
      receipts: upsert(current.receipts, receipt, 'id'),
      packets: current.packets.map((item) => item.id === packet!.id ? { ...item, status: 'accepted' } : item),
      profile: current.profile ? applyReceiptToProfile(current.profile, receipt) : current.profile,
    }))
    navigate(`/receipts/${receipt.id}`)
  }

  return (
    <>
      <PageHeader eyebrow="Submission package" title="Review before release" action={<Button variant="primary" onClick={createReceipt}>Mark accepted and create receipt</Button>}><p>{pkg.releaseNote}</p></PageHeader>
      <Panel>
        <h3>{pkg.summary}</h3>
        <List items={pkg.deliverables} />
        <ProofDisclosure summary="Evidence checklist"><List items={pkg.evidenceChecklist} /></ProofDisclosure>
      </Panel>
    </>
  )
}

export function Receipt({ state, id }: { state: State; id: string }) {
  const receipt = state.receipts.find((item) => item.id === id)
  const pkg = receipt ? state.packages.find((item) => item.id === receipt.packageId) : undefined
  const packet = receipt ? state.packets.find((item) => item.id === receipt.packetId) : undefined
  const output = receipt ? verifyReceipt(receipt, pkg, packet) : { valid: false, message: 'Receipt is not available on this device.' }
  if (!receipt) return <EmptyState title="Receipt not found" body="This device does not have that local receipt. Open profile or recreate from the submission package." />

  return (
    <>
      <PageHeader eyebrow="Accepted-work receipt" title={output.valid ? 'Receipt verified' : 'Receipt needs recovery'} action={<Button onClick={() => navigate('/profile')}>Open profile</Button>}><p>{output.message}</p></PageHeader>
      <section className="panel panel-pad receipt-card">
        <div className="receipt-card-head">
          <div>
            <div className="receipt-id tnum">{receipt.id}</div>
            <h3 className="receipt-card-title">{packet?.userProblem ?? 'Unknown pursuit'}</h3>
          </div>
          <Badge label={output.valid ? 'Verified locally' : 'Recovery needed'} tone={output.valid ? 'good' : 'warn'} />
        </div>
        <div className="stat-strip">
          <div className="stat"><strong>{receipt.result}</strong><p>Result</p></div>
          <div className="stat"><strong className="tnum">{receipt.verifierDigest}</strong><p>Verifier digest</p></div>
          <div className="stat"><strong>+1</strong><p>Profile accepted work</p></div>
        </div>
      </section>
    </>
  )
}

export function Profile({ state }: { state: State }) {
  return (
    <>
      <PageHeader eyebrow="Builder profile" title={state.profile?.name ?? 'No profile yet'} action={<Button variant="primary" onClick={() => navigate('/onboarding')}>Edit profile</Button>}>
        <p>{state.profile ? `${state.profile.skills} · ${state.profile.capacity}` : 'Create a local profile before pursuing work.'}</p>
      </PageHeader>
      <div className="row-list">
        <div className="row"><div><div className="row-title">Accepted work</div><div className="row-meta">Updated only when a local receipt verifies against a released package.</div></div><Badge label={`${state.profile?.acceptedWork ?? 0} receipts`} tone="good" /></div>
        {state.receipts.map((receipt) => (
          <div className="row" key={receipt.id}><div><div className="row-title">{receipt.id}</div><div className="row-meta">{receipt.profileDelta} · {receipt.verifierDigest}</div></div><Button onClick={() => navigate(`/receipts/${receipt.id}`)}>Open receipt</Button></div>
        ))}
      </div>
    </>
  )
}

function SourceRows({ state }: { state: State }) {
  if (state.opportunities.length === 0) return <EmptyState title="No sources yet" body="Import a public GitHub issue or pull request to start the radar." />
  return (
    <div className="row-list" style={{ marginTop: 18 }}>
      {state.opportunities.map((opportunity) => (
        <SourceHealthRow key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  )
}

function WorkroomTrace({ trace }: { trace: AgentTrace }) {
  return (
    <div className="two-col">
      <Panel><h3>Work plan</h3><List items={trace.workPlan} /></Panel>
      <Panel><h3>Guardrails</h3><Badge label="Demo helper" tone="info" /><h3 style={{ marginTop: 18 }}>Allowed</h3><List items={trace.allowedActions} /><h3 style={{ marginTop: 18 }}>Blocked</h3><List items={trace.blockedActions} /></Panel>
    </div>
  )
}

function MetricRow({ title, meta, action, href }: { title: string; meta: string; action: string; href: string }) {
  return <div className="row"><div><div className="row-title">{title}</div><div className="row-meta">{meta}</div></div><Button onClick={() => navigate(href)}>{action}</Button></div>
}

function List({ items }: { items: string[] }) {
  return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
}

function nextAction(state: State) {
  if (!state.profile) return { href: '/onboarding', label: 'Set up profile', help: 'Create your local builder profile before importing work.' }
  if (state.opportunities.length === 0) return { href: '/sources', label: 'Import source', help: 'Start with one live GitHub issue or pull request.' }
  if (state.packets.length === 0) return { href: '/radar', label: 'Open radar', help: 'Choose one source that is worth pursuing.' }
  const packet = state.packets[state.packets.length - 1]
  if (!state.packages.some((item) => item.packetId === packet.id)) return { href: `/pursuits/${packet.id}/workroom`, label: 'Open workroom', help: 'Package agent help behind human release.' }
  if (state.receipts.length === 0) return { href: `/pursuits/${packet.id}/submission`, label: 'Review package', help: 'Release the submission package and create a receipt.' }
  return { href: '/profile', label: 'View profile', help: 'Accepted work is now reflected in your profile.' }
}
