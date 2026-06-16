import { useEffect, useState } from 'react'
import { AGENT_WALLET_INFO, defaultWalletAddress, fetchWalletOverview, formatEth } from '../domain/wallet'
import type { WalletOverview } from '../domain/wallet'
import { resolveEns } from '../domain/ens'
import { useAppState } from '../store'
import { Badge, Button, PageHeader, Panel } from '../components'

type Store = ReturnType<typeof useAppState>

export function Wallet({ state, setState }: { state: Store['state']; setState: Store['setState'] }) {
  const address = state.wallet?.address ?? defaultWalletAddress()
  if (!address) return <ConnectWallet setState={setState} />
  return <WalletDashboard address={address} ensName={state.wallet?.ensName} setState={setState} />
}

function ConnectWallet({ setState }: { setState: Store['setState'] }) {
  const [input, setInput] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function connect() {
    setConnecting(true)
    setError(null)
    const result = await resolveEns(input)
    setConnecting(false)
    if (!result.resolved || !result.address) {
      setError(result.note)
      return
    }
    const connected = { address: result.address, ensName: result.ensName }
    setState((current) => ({ ...current, wallet: connected }))
  }

  return (
    <>
      <PageHeader eyebrow="Agent wallet" title="Connect your wallet">
        <p>Connect any wallet to see it live in BuilderDesk — paste your address or ENS name. Read-only; BuilderDesk never holds your keys.</p>
      </PageHeader>
      <Panel className="panel-pad">
        <div className="field">
          <label>Wallet address or ENS name</label>
          <div className="inline-field">
            <input className="input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="0x… or name.eth" />
            <Button variant="primary" onClick={connect} disabled={connecting || !input.trim()}>{connecting ? 'Connecting…' : 'Connect'}</Button>
          </div>
          {error && (
            <div className="identity-result">
              <Badge label="Not connected" tone="warn" />
              <span className="identity-note">{error}</span>
            </div>
          )}
        </div>
        <ul style={{ marginTop: 16 }}>
          <li>Your address and balances are public on-chain — nothing secret is shared.</li>
          <li>For a MetaMask Agent Wallet, paste its address; it stays TEE-custodied and Guard-Mode protected.</li>
        </ul>
      </Panel>
    </>
  )
}

function WalletDashboard({ address, ensName, setState }: { address: string; ensName?: string; setState: Store['setState'] }) {
  const [data, setData] = useState<WalletOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  async function refresh() {
    setLoading(true)
    setData(await fetchWalletOverview(address))
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    fetchWalletOverview(address).then((overview) => {
      if (active) {
        setData(overview)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [address])

  function copyAddress() {
    void navigator.clipboard?.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function disconnect() {
    setState((current) => ({ ...current, wallet: undefined }))
  }

  const displayEns = data?.ensName ?? ensName

  return (
    <>
      <PageHeader
        eyebrow="Agent wallet"
        title="Your wallet"
        action={
          <div className="actions" style={{ marginTop: 0 }}>
            <Button onClick={refresh} disabled={loading}>{loading ? 'Reading…' : 'Refresh'}</Button>
            <Button onClick={disconnect}>Change</Button>
          </div>
        }
      >
        <p>Read live on-chain. No extension, no CLI, nothing to manage.</p>
      </PageHeader>

      <div className="two-col">
        <Panel>
          <div className="wallet-head"><h3>Identity</h3><Badge label="Live · on-chain" tone="good" /></div>
          <div className="wallet-address tnum">{address}</div>
          <div className="actions" style={{ marginTop: 12 }}>
            <Button onClick={copyAddress}>{copied ? 'Copied' : 'Copy address'}</Button>
            <a className="button" href={`https://etherscan.io/address/${address}`} target="_blank" rel="noreferrer">Etherscan</a>
          </div>
          <div className="stat-strip" style={{ marginTop: 18 }}>
            <div className="stat"><strong>{displayEns ?? '—'}</strong><p>ENS name</p></div>
            <div className="stat"><strong className="tnum">{data?.txCount ?? '—'}</strong><p>Transactions</p></div>
          </div>
        </Panel>

        <Panel className="agent-panel">
          <div className="wallet-head"><h3>Agent Wallet security</h3><Badge label={AGENT_WALLET_INFO.mode} tone="agent" /></div>
          <p>When this is a MetaMask Agent Wallet: {AGENT_WALLET_INFO.custody}.</p>
          <ul>{AGENT_WALLET_INFO.policy.map((item) => <li key={item}>{item}</li>)}</ul>
        </Panel>
      </div>

      <Panel>
        <div className="wallet-head"><h3>Balances</h3>{loading && <Badge label="Reading chain…" tone="info" />}</div>
        <div className="row-list" style={{ marginTop: 12 }}>
          {(data?.balances ?? []).map((balance) => (
            <div className="row" key={balance.key}>
              <div>
                <div className="row-title">{balance.label}{balance.testnet ? ' · testnet' : ''}</div>
                <div className="row-meta tnum">{formatEth(balance.amount)} ETH{!balance.ok ? ' · read failed' : ''}</div>
              </div>
              <a className="button" href={balance.explorer} target="_blank" rel="noreferrer">Explorer</a>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}
