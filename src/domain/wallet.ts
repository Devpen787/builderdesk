import { createPublicClient, http, formatEther, type Address } from 'viem'
import { mainnet, base, sepolia, lineaSepolia } from 'viem/chains'
import type { ConnectedWallet } from './types'

// The connected wallet persists in its own dedicated key, written synchronously
// on connect — independent of the app-state blob, so nothing can clobber it.
const CONNECTED_WALLET_KEY = 'builderdesk.connected_wallet'

export function loadConnectedWallet(): ConnectedWallet | undefined {
  try {
    const raw = localStorage.getItem(CONNECTED_WALLET_KEY)
    return raw ? (JSON.parse(raw) as ConnectedWallet) : undefined
  } catch {
    return undefined
  }
}

export function saveConnectedWallet(wallet: ConnectedWallet): void {
  try {
    localStorage.setItem(CONNECTED_WALLET_KEY, JSON.stringify(wallet))
  } catch {
    /* storage unavailable */
  }
}

export function clearConnectedWallet(): void {
  try {
    localStorage.removeItem(CONNECTED_WALLET_KEY)
  } catch {
    /* storage unavailable */
  }
}

// Descriptive facts about a MetaMask Agent Wallet (not a per-address claim).
// No address and no secret lives here — each builder connects their own wallet,
// stored in their local app state.
export const AGENT_WALLET_INFO = {
  custody: 'Server wallet — keys held in a TEE (no seed phrase exists)',
  mode: 'Guard Mode',
  policy: [
    'Recipient & address allowlists',
    '24-hour outflow limit',
    'Blockaid threat-scanning on every transaction',
    '2FA approval required for any out-of-policy action',
  ],
}

// Optional deployment-level default (e.g. a private local build can preset its
// own wallet). Unset by default, so the public app shows the connect flow.
export function defaultWalletAddress(): string | undefined {
  return (import.meta.env.VITE_AGENT_WALLET_ADDRESS as string | undefined) || undefined
}

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

// "Connect with MetaMask": opens the injected wallet and returns the selected
// account. One click, no pasting. Browser-extension only — callers fall back to
// the address/ENS field when there's no injected provider.
export async function connectInjectedWallet(): Promise<{ address?: string; error?: string }> {
  const injected = (window as unknown as { ethereum?: Eip1193Provider }).ethereum
  if (!injected) {
    return { error: 'No browser wallet detected. Install the MetaMask extension, or paste an address below.' }
  }
  try {
    const accounts = (await injected.request({ method: 'eth_requestAccounts' })) as string[]
    const address = accounts?.[0]
    if (!address) return { error: 'MetaMask returned no account.' }
    return { address }
  } catch {
    return { error: 'Connection request was rejected in MetaMask.' }
  }
}

type Network = { key: string; label: string; chain: Parameters<typeof createPublicClient>[0]['chain']; rpc: string; explorer: string; testnet: boolean }

const NETWORKS: Network[] = [
  { key: 'ethereum', label: 'Ethereum', chain: mainnet, rpc: 'https://ethereum-rpc.publicnode.com', explorer: 'https://etherscan.io/address/', testnet: false },
  { key: 'base', label: 'Base', chain: base, rpc: 'https://base-rpc.publicnode.com', explorer: 'https://basescan.org/address/', testnet: false },
  { key: 'sepolia', label: 'Sepolia', chain: sepolia, rpc: 'https://ethereum-sepolia-rpc.publicnode.com', explorer: 'https://sepolia.etherscan.io/address/', testnet: true },
  { key: 'linea-sepolia', label: 'Linea Sepolia', chain: lineaSepolia, rpc: 'https://linea-sepolia-rpc.publicnode.com', explorer: 'https://sepolia.lineascan.build/address/', testnet: true },
]

export type WalletBalance = { key: string; label: string; testnet: boolean; amount: string; explorer: string; ok: boolean }
export type WalletOverview = {
  address: string
  ensName?: string
  txCount?: number
  balances: WalletBalance[]
}

export async function fetchWalletOverview(address: string): Promise<WalletOverview> {
  const account = address as Address
  const mainnetClient = createPublicClient({ chain: mainnet, transport: http('https://ethereum-rpc.publicnode.com') })

  const [ensName, txCount] = await Promise.all([
    mainnetClient.getEnsName({ address: account }).catch(() => null),
    mainnetClient.getTransactionCount({ address: account }).catch(() => undefined),
  ])

  const balances = await Promise.all(
    NETWORKS.map(async (network): Promise<WalletBalance> => {
      try {
        const client = createPublicClient({ chain: network.chain, transport: http(network.rpc) })
        const wei = await client.getBalance({ address: account })
        return { key: network.key, label: network.label, testnet: network.testnet, amount: formatEther(wei), explorer: network.explorer + address, ok: true }
      } catch {
        return { key: network.key, label: network.label, testnet: network.testnet, amount: '0', explorer: network.explorer + address, ok: false }
      }
    }),
  )

  return { address, ensName: ensName ?? undefined, txCount, balances }
}

export function formatEth(amount: string): string {
  const n = Number(amount)
  if (!Number.isFinite(n)) return '0'
  if (n === 0) return '0'
  return n < 0.0001 ? n.toExponential(2) : n.toFixed(4)
}
