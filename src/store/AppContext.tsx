import { createContext, useContext, type ReactNode } from 'react'
import { useAppStore, type GlobalState, type GlobalActions } from './appStore'

type AppCtx = GlobalState & GlobalActions

const AppContext = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const store = useAppStore()
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>
}

export function useApp(): AppCtx {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
