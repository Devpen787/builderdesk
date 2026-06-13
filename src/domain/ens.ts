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

  try {
    if (isAddress(value)) {
      const ensName = await client.getEnsName({ address: value })
      return {
        input,
        address: value,
        ensName: ensName ?? undefined,
        resolved: true,
        note: ensName ? `Primary name ${ensName}.` : 'Valid address. No primary ENS name set.',
      }
    }
    if (value.includes('.')) {
      const address = await client.getEnsAddress({ name: normalize(value) })
      if (address) {
        return { input, address, ensName: value, resolved: true, note: `${value} resolves to ${shortenAddress(address)}.` }
      }
      return { input, ensName: value, resolved: false, note: `${value} does not resolve to an address.` }
    }
    return { input, resolved: false, note: 'Enter a full ENS name (name.eth) or a 0x address.' }
  } catch {
    return { input, resolved: false, note: 'ENS lookup failed. Check the name or try again.' }
  }
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function identityLabel(ensName?: string, address?: string) {
  if (ensName) return ensName
  if (address) return shortenAddress(address)
  return undefined
}
