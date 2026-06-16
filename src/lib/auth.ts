import { supabase } from './supabase'

type Injected = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }

async function injectedAddress(): Promise<string | undefined> {
  const eth = (window as unknown as { ethereum?: Injected }).ethereum
  if (!eth) return undefined
  try {
    const accounts = (await eth.request({ method: 'eth_accounts' })) as string[]
    return accounts?.[0]
  } catch {
    return undefined
  }
}

// Sign-In-With-Ethereum via Supabase Web3 auth: MetaMask signs an EIP-4361
// message → a real Supabase session tied to the wallet. On success we ensure a
// profile row and record the wallet, both protected by RLS.
export async function signInWithEthereum(): Promise<{ address?: string; error?: string }> {
  if (!supabase) return { error: 'Account backend is not configured.' }
  try {
    const { error } = await supabase.auth.signInWithWeb3({
      chain: 'ethereum',
      statement: 'Sign in to BuilderDesk',
    })
    if (error) return { error: error.message }
    const address = await injectedAddress()
    if (address) await upsertProfileAndWallet(address)
    return { address }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Sign-in failed.' }
  }
}

async function upsertProfileAndWallet(address: string): Promise<void> {
  if (!supabase) return
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) return
  await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id' })
  await supabase.from('wallets').upsert(
    { user_id: user.id, address, is_primary: true },
    { onConflict: 'user_id,address' },
  )
}

export async function signOut(): Promise<void> {
  await supabase?.auth.signOut()
}
