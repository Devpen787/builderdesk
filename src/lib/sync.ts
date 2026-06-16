import { supabase } from './supabase'
import type { BuilderProfile, ConnectedWallet } from '../domain/types'

// Account-backed sync. All writes/reads are no-ops unless signed in (RLS ties
// every row to the authenticated user, so each builder only sees their own).

async function userId(): Promise<string | undefined> {
  if (!supabase) return undefined
  const { data } = await supabase.auth.getUser()
  return data.user?.id
}

export async function saveProfileRemote(profile: BuilderProfile): Promise<void> {
  if (!supabase) return
  const id = await userId()
  if (!id) return
  await supabase.from('profiles').upsert({
    id,
    display_name: profile.name,
    skills: profile.skills,
    ecosystems: profile.ecosystems,
    capacity: profile.capacity,
  })
}

export async function loadProfileRemote(): Promise<Partial<BuilderProfile> | undefined> {
  if (!supabase) return undefined
  const id = await userId()
  if (!id) return undefined
  const { data } = await supabase
    .from('profiles')
    .select('display_name, skills, ecosystems, capacity')
    .eq('id', id)
    .maybeSingle()
  if (!data) return undefined
  const row = data as { display_name?: string; skills?: string; ecosystems?: string; capacity?: string }
  return {
    name: row.display_name ?? undefined,
    skills: row.skills ?? undefined,
    ecosystems: row.ecosystems ?? undefined,
    capacity: row.capacity ?? undefined,
  }
}

export async function saveWalletRemote(wallet: ConnectedWallet): Promise<void> {
  if (!supabase) return
  const id = await userId()
  if (!id) return
  await supabase.from('wallets').upsert(
    { user_id: id, address: wallet.address, ens_name: wallet.ensName ?? null, is_primary: true },
    { onConflict: 'user_id,address' },
  )
}

export async function loadPrimaryWalletRemote(): Promise<ConnectedWallet | undefined> {
  if (!supabase) return undefined
  const id = await userId()
  if (!id) return undefined
  const { data } = await supabase
    .from('wallets')
    .select('address, ens_name')
    .eq('user_id', id)
    .order('is_primary', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!data) return undefined
  const row = data as { address: string; ens_name?: string }
  return { address: row.address, ensName: row.ens_name ?? undefined }
}
