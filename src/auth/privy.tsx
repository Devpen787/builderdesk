/* eslint-disable react-refresh/only-export-components -- provider module also exports its hook/context */
import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth'

const APP_ID = import.meta.env.VITE_PRIVY_APP_ID as string | undefined

export type BuilderAuth = {
  configured: boolean
  ready: boolean
  authenticated: boolean
  address?: string
  login: () => void
  logout: () => void
  signMessage?: (message: string) => Promise<string | undefined>
}

const fallback: BuilderAuth = {
  configured: false,
  ready: true,
  authenticated: false,
  login: () => {},
  logout: () => {},
}

const AuthContext = createContext<BuilderAuth>(fallback)

export function useBuilderAuth() {
  return useContext(AuthContext)
}

// Only mounts Privy when an app id is configured. Without one, the app runs
// on the local fallback identity flow and Privy code never executes.
export function AuthProvider({ children }: { children: ReactNode }) {
  if (!APP_ID) return <AuthContext.Provider value={fallback}>{children}</AuthContext.Provider>
  return (
    <PrivyProvider
      appId={APP_ID}
      config={{ embeddedWallets: { ethereum: { createOnLogin: 'users-without-wallets' } } }}
    >
      <PrivyBridge>{children}</PrivyBridge>
    </PrivyProvider>
  )
}

function PrivyBridge({ children }: { children: ReactNode }) {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const { wallets } = useWallets()
  const address = wallets[0]?.address ?? user?.wallet?.address

  const value = useMemo<BuilderAuth>(
    () => ({
      configured: true,
      ready,
      authenticated,
      address,
      login,
      logout,
      signMessage: async (message: string) => {
        const wallet = wallets[0]
        if (!wallet || !address) return undefined
        try {
          const provider = await wallet.getEthereumProvider()
          return (await provider.request({ method: 'personal_sign', params: [message, address] })) as string
        } catch {
          return undefined
        }
      },
    }),
    [ready, authenticated, address, login, logout, wallets],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
