import { useEffect, useState } from 'react'
import { AGENT_WALLET, fetchWalletOverview, formatEth } from '../domain/wallet'
import type { WalletOverview } from '../domain/wallet'
import { Badge, Button, PageHeader, Panel } from '../components'

export function Wallet() {
  const [data, setData] = useState<WalletOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  async function refresh() {
    setLoading(true)
    setData(await fetchWalletOverview(AGENT_WALLET.address))
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    fetchWalletOverview(AGENT_WALLET.address).then((overview) => {
      if (active) {
        setData(overview)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  function copyAddress() {
    void navigator.clipboard?.writeText(AGENT_WALLET.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <PageHeader
        eyebrow="Agent wallet"
        title="MetaMask agent wallet"
        action={<Button onClick={refresh} disabled={loading}>{loading ? 'Reading chain…' : 'Refresh'}</Button>}
      >
        <p>Everything about your agent wallet in one place — read live on-chain. No extension, no CLI, nothing to manage.</p>
      </PageHeader>

      <div className="two-col">
        <Panel>
          <div className="wallet-head">
            <h3>Identity</h3>
            <Badge label="Live · on-chain" tone="good" />
          </div>
          <div className="wallet-address tnum">{AGENT_WALLET.address}</div>
          <div className="actions" style={{ marginTop: 12 }}>
            <Button onClick={copyAddress}>{copied ? 'Copied' : 'Copy address'}</Button>
            <a className="button" href={`https://etherscan.io/address/${AGENT_WALLET.address}`} target="_blank" rel="noreferrer">Etherscan</a>
          </div>
          <div className="stat-strip" style={{ marginTop: 18 }}>
            <div className="stat"><strong>{data?.ensName ?? '—'}</strong><p>ENS name</p></div>
            <div className="stat"><strong className="tnum">{data?.txCount ?? '—'}</strong><p>Transactions</p></div>
          </div>
        </Panel>

        <Panel className="agent-panel">
          <div className="wallet-head">
            <h3>Custody &amp; policy</h3>
            <Badge label={AGENT_WALLET.mode} tone="agent" />
          </div>
          <p>{AGENT_WALLET.custody}</p>
          <ul>{AGENT_WALLET.policy.map((item) => <li key={item}>{item}</li>)}</ul>
        </Panel>
      </div>

      <Panel>
        <div className="wallet-head">
          <h3>Balances</h3>
          {loading && <Badge label="Reading chain…" tone="info" />}
        </div>
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
        <p className="row-meta" style={{ marginTop: 12 }}>Fund the testnet rows from a faucet, then Refresh — the balance appears here live.</p>
      </Panel>
    </>
  )
}
