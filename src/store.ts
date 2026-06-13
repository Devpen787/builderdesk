import { useEffect, useMemo, useState } from 'react'
import type { AppState, BuilderProfile } from './domain/types'

const STORAGE_KEY = 'builderdesk.wave1.state'

export const emptyState: AppState = {
  opportunities: [],
  scorecards: [],
  packets: [],
  traces: [],
  packages: [],
  receipts: [],
}

export function loadState(): AppState {
  if (typeof localStorage === 'undefined') return emptyState
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return emptyState
  try {
    return { ...emptyState, ...JSON.parse(raw) } as AppState
  } catch {
    return emptyState
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return useMemo(() => ({ state, setState }), [state])
}

export function defaultProfile(name: string, email: string, skills: string, ecosystems: string, capacity: string): BuilderProfile {
  return {
    name,
    email,
    skills,
    ecosystems,
    capacity,
    acceptedWork: 0,
    receiptIds: [],
  }
}
