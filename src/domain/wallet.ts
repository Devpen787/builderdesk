import { createPublicClient, http, formatEther, type Address } from 'viem'
import { mainnet, base, sepolia, lineaSepolia } from 'viem/chains'

// The MetaMask Agent Wallet. Address is public; override via env if needed.
// Custody type and policy are configured facts (set with `mm init --wallet
// server-wallet --mode guard`). No secret ever lives here.
export const AGENT_WALLET = {
  address: (import.meta.env.VITE_AGENT_WALLET_ADDRESS as string | undefined) ??
    '0x09b7815143de8d7ecc093dd6eb70e94e041ba40d',
  custody: 'Server wallet — keys held in a TEE (no seed phrase exists)',
  mode: 'Guard Mode',
  policy: [
    'Recipient & address allowlists',
    '24-hour outflow limit',
    'Blockaid threat-scanning on every transaction',
    '2FA approval required for any out-of-policy action',
  ],
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
