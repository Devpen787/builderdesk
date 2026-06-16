import { useEffect, useState } from 'react'
import {
  AGENT_WALLET_INFO,
  clearConnectedWallet,
  connectInjectedWallet,
  defaultWalletAddress,
  fetchWalletOverview,
  formatEth,
  loadConnectedWallet,
  saveConnectedWallet,
} from '../domain/wallet'
import type { WalletOverview } from '../domain/wallet'
import type { ConnectedWallet } from '../domain/types'
import { resolveEns } from '../domain/ens'
import { supabaseConfigured } from '../lib/supabase'
import { signInWithEthereum } from '../lib/auth'
import { Badge, Button, PageHeader, Panel } from '../components'

export function Wallet() {
  const [wallet, setWallet] = useState<ConnectedWallet | undefined>(() => {
    const stored = loadConnectedWallet()
    if (stored) return stored
    const preset = defaultWalletAddress()
    return preset ? { address: preset } : undefined
  })

  function connect(next: ConnectedWallet) {
    saveConnectedWallet(next) // synchronous write — persists immediately
    setWallet(next)
  }

  function disconnect() {
    clearConnectedWallet()
    setWallet(undefined)
  }

  if (!wallet) return <ConnectWallet onConnect={connect} />
  return <WalletDashboard wallet={wallet} onChange={disconnect} />
}

function ConnectWallet({ onConnect }: { onConnect: (wallet: ConnectedWallet) => void }) {
  const [input, setInput] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function connectMetaMask() {
    setConnecting(true)
    setError(null)
    const result = await connectInjectedWallet()
    if (result.error || !result.address) {
      setError(result.error ?? 'Could not connect.')
      setConnecting(false)
      return
    }
    const ens = await resolveEns(result.address)
    setConnecting(false)
    onConnect({ address: result.address, ensName: ens.ensName })
  }

  async function signIn() {
    setConnecting(true)
    setError(null)
    const result = await signInWithEthereum()
    if (result.error || !result.address) {
      setError(result.error ?? 'Sign-in failed.')
      setConnecting(false)
      return
    }
    const ens = await resolveEns(result.address)
    setConnecting(false)
    onConnect({ address: result.address, ensName: ens.ensName })
  }

  async function connectByInput() {
    setConnecting(true)
    setError(null)
    const result = await resolveEns(input)
    setConnecting(false)
    if (!result.resolved || !result.address) {
      setError(result.note)
      return
    }
    onConnect({ address: result.address, ensName: result.ensName })
  }

  return (
    <>
      <PageHeader eyebrow="Agent wallet" title="Connect your wallet">
        <p>Connect your wallet to see it live in BuilderDesk. Read-only; BuilderDesk never holds your keys.</p>
      </PageHeader>
      <Panel className="panel-pad">
        {supabaseConfigured ? (
          <>
            <Button variant="primary" onClick={signIn} disabled={connecting}>{connecting ? 'Signing in…' : 'Sign in with Ethereum'}</Button>
            <p className="row-meta" style={{ marginTop: 8 }}>Signs you in with your wallet (SIWE) and saves your desk to your account — across devices.</p>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={connectMetaMask} disabled={connecting}>{connecting ? 'Connecting…' : 'Connect with MetaMask'}</Button>
            <p className="row-meta" style={{ marginTop: 8 }}>Opens your MetaMask extension and connects the selected account in one click.</p>
          </>
        )}

        <div className="connect-divider">or paste an address</div>

        <div className="field">
          <label>Wallet address or ENS name</label>
          <div className="inline-field">
            <input className="input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="0x… or name.eth" />
            <Button onClick={connectByInput} disabled={connecting || !input.trim()}>Connect</Button>
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
          <li>A MetaMask Agent Wallet isn't in the extension — paste its address here to watch it.</li>
        </ul>
      </Panel>
    </>
  )
}

function WalletDashboard({ wallet, onChange }: { wallet: ConnectedWallet; onChange: () => void }) {
  const [data, setData] = useState<WalletOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const address = wallet.address

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

  const displayEns = data?.ensName ?? wallet.ensName

  return (
    <>
      <PageHeader
        eyebrow="Agent wallet"
        title="Your wallet"
        action={
          <div className="actions" style={{ marginTop: 0 }}>
            <Button onClick={refresh} disabled={loading}>{loading ? 'Reading…' : 'Refresh'}</Button>
            <Button onClick={onChange}>Change</Button>
          </div>
        }
      >
        <p>Read live on-chain. No extension, no CLI, nothing to manage. Stays connected across sessions.</p>
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
