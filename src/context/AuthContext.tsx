import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AppUser } from '../services/auth'
import { getCurrentUser, loginWithEmail, logoutUser, registerAccount, updateStoredUser } from '../services/auth'

interface AuthContextValue {
  user: AppUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: {
    fullName: string
    email: string
    password: string
    role: string
    department: string
    phone: string
  }) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  updateUser: (user: AppUser) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  useEffect(() => {
    void (async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const login = async (email: string, password: string) => {
    const result = await loginWithEmail(email, password)
    setUser(result.user)
  }

  const register = async (input: {
    fullName: string
    email: string
    password: string
    role: string
    department: string
    phone: string
  }) => {
    const result = await registerAccount(input)
    setUser(result.user)
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  const updateUser = (nextUser: AppUser) => {
    setUser(nextUser)
    updateStoredUser(nextUser)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      updateUser,
    }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
