import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function hydrateSession() {
      const { data, error } = await supabase.auth.getSession()
      if (!mounted) return

      if (error) {
        console.log('[Auth] Rehidratación falló', error.message)
        setSession(null)
        setUser(null)
        setLoading(false)
        return
      }

      console.log('[Auth] Rehidratación inicial', {
        hasSession: Boolean(data.session),
        userId: data.session?.user?.id ?? null,
      })
      setSession(data.session ?? null)
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    hydrateSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      console.log('[Auth] onAuthStateChange', {
        event,
        hasSession: Boolean(nextSession),
        userId: nextSession?.user?.id ?? null,
      })
      setSession(nextSession ?? null)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, isAuthenticated: Boolean(session), logout }}>
      {children}
    </AuthContext.Provider>
  )
}
