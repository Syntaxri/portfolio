'use client'

import { createContext, useContext } from 'react'

interface ModeContextType {
  accentColor: string
}

const ModeContext = createContext<ModeContextType | null>(null)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModeContext.Provider value={{ accentColor: '#8b5cf6' }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('[useMode] Must be inside <ModeProvider>')
  return ctx
}
