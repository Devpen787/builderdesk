import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { defaultProfile, useAppState } from '../store'
import { navigate } from '../router'
import { resolveEns, shortenAddress } from '../domain/ens'
import type { EnsIdentity } from '../domain/ens'
import { useBuilderAuth } from '../auth/privy'
import { Badge, Button, Field, PageHeader, PublicShell } from '../components'

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

export function Onboarding({ setState }: { setState: ReturnType<typeof useAppState>['setState'] }) {
  const [name, setName] = useState('Maya')
  const [email, setEmail] = useState('maya@example.com')
  const [skills, setSkills] = useState('React, agent workflows, technical writing')
  const [ecosystems, setEcosystems] = useState('Ethereum, GitHub, open source')
  const [capacity, setCapacity] = useState('6 focused hours this weekend')
  const [identity, setIdentity] = useState('')
  const [ens, setEns] = useState<EnsIdentity | null>(null)
  const [resolving, setResolving] = useState(false)
  const auth = useBuilderAuth()

  async function resolveIdentity() {
    setResolving(true)
    setEns(await resolveEns(identity))
    setResolving(false)
  }

  // When Privy provides a wallet, adopt it as the identity and ENS-resolve it.
  useEffect(() => {
    if (!(auth.configured && auth.authenticated && auth.address) || ens) return
    const address = auth.address
    let active = true
    resolveEns(address).then((result) => {
      if (!active) return
      setIdentity(address)
      setEns(result)
    })
    return () => {
      active = false
    }
  }, [auth.configured, auth.authenticated, auth.address, ens])

  function submit(event: FormEvent) {
    event.preventDefault()
    const resolvedIdentity = ens?.resolved ? { address: ens.address, ensName: ens.ensName } : undefined
    setState((state) => ({ ...state, profile: defaultProfile(name, email, skills, ecosystems, capacity, resolvedIdentity) }))
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
          {auth.configured && (
            <div className="field">
              <label>Wallet sign-in (Privy)</label>
              {auth.authenticated && auth.address ? (
                <div className="identity-result">
                  <Badge label="Live · Privy wallet" tone="good" />
                  <span className="identity-note">{shortenAddress(auth.address)}</span>
                </div>
              ) : (
                <Button onClick={auth.login}>Sign in with Privy</Button>
              )}
            </div>
          )}
          <div className="field">
            <label>ENS name or wallet address (optional)</label>
            <div className="inline-field">
              <input className="input" value={identity} onChange={(event) => setIdentity(event.target.value)} placeholder="builder.eth or 0x..." />
              <Button onClick={resolveIdentity} disabled={resolving || !identity.trim()}>{resolving ? 'Resolving…' : 'Resolve'}</Button>
            </div>
            {ens && (
              <div className="identity-result">
                <Badge label={ens.resolved ? 'Live · ENS' : 'Not resolved'} tone={ens.resolved ? 'good' : 'warn'} />
                <span className="identity-note">
                  {ens.resolved
                    ? `${ens.ensName ?? 'Address'}${ens.address ? ` · ${shortenAddress(ens.address)}` : ''}`
                    : ens.note}
                </span>
              </div>
            )}
          </div>
          <Button type="submit" variant="primary">Continue</Button>
        </form>
      </main>
    </PublicShell>
  )
}
