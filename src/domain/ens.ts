import { createPublicClient, http, isAddress, type Address } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

// Public mainnet client for read-only ENS resolution. No wallet, no signing.
const client = createPublicClient({
  chain: mainnet,
  transport: http('https://ethereum-rpc.publicnode.com'),
})

export type EnsIdentity = {
  input: string
  address?: Address
  ensName?: string
  resolved: boolean
  note: string
}

export async function resolveEns(input: string): Promise<EnsIdentity> {
  const value = input.trim()
  if (!value) return { input, resolved: false, note: 'Enter an ENS name or wallet address.' }

  // A valid address always connects. The ENS reverse-name is best-effort, so a
  // flaky RPC never blocks connecting a perfectly valid address.
  if (isAddress(value)) {
    let ensName: string | undefined
    try {
      ensName = (await client.getEnsName({ address: value })) ?? undefined
    } catch {
      ensName = undefined
    }
    return {
      input,
      address: value,
      ensName,
      resolved: true,
      note: ensName ? `Primary name ${ensName}.` : 'Valid address.',
    }
  }

  if (value.includes('.')) {
    try {
      const address = await client.getEnsAddress({ name: normalize(value) })
      if (address) {
        return { input, address, ensName: value, resolved: true, note: `${value} resolves to ${shortenAddress(address)}.` }
      }
      return { input, ensName: value, resolved: false, note: `${value} does not resolve to an address.` }
    } catch {
      return { input, ensName: value, resolved: false, note: 'ENS lookup failed. Try again.' }
    }
  }

  return { input, resolved: false, note: 'Enter a full ENS name (name.eth) or a 0x address.' }
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function identityLabel(ensName?: string, address?: string) {
  if (ensName) return ensName
  if (address) return shortenAddress(address)
  return undefined
}
