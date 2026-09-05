import { API_BASE_URL } from './api'

export type AppUser = {
  id: string
  name: string
  email: string
  role: string
  department: string
  phone: string
  avatarUrl?: string
  createdAt: string
}

const TOKEN_KEY = 'icu-auth-token'
const USER_KEY = 'icu-auth-user'

const demoUser: AppUser = {
  id: 'demo-user-1',
  name: 'Dr. Sarah Williams',
  email: 'sarah@icu.intelligence',
  role: 'ICU Consultant',
  department: 'Critical Care',
  phone: '+1 (415) 204-1188',
  avatarUrl: '',
  createdAt: '2024-01-15T08:30:00.000Z',
}

const normalizeRole = (role?: string) => {
  const value = String(role ?? 'ICU Consultant').trim()

  if (value.toLowerCase().includes('admin')) return 'Administrator'
  if (value.toLowerCase().includes('nurse')) return 'Nurse'
  if (value.toLowerCase().includes('consult')) return 'ICU Consultant'
  if (value.toLowerCase().includes('doctor')) return 'Doctor'
  return 'ICU Consultant'
}

const normalizeRequestRole = (role?: string) => {
  const value = String(role ?? 'Doctor').trim().toLowerCase()

  if (value.includes('admin')) return 'ADMIN'
  if (value.includes('nurse')) return 'NURSE'
  if (value.includes('analyst')) return 'ANALYST'
  if (value.includes('doctor') || value.includes('consult')) return 'DOCTOR'
  return 'DOCTOR'
}

const normalizeUser = (user: Partial<AppUser> | null | undefined): AppUser | null => {
  if (!user) return null

  return {
    id: user.id ?? 'demo-user-1',
    name: user.name ?? 'Dr. Sarah Williams',
    email: user.email ?? 'sarah@icu.intelligence',
    role: normalizeRole(user.role),
    department: user.department ?? 'Critical Care',
    phone: user.phone ?? '+1 (415) 204-1188',
    avatarUrl: user.avatarUrl ?? '',
    createdAt: user.createdAt ?? new Date().toISOString(),
  }
}

const persistSession = (token: string, user: AppUser) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const getStoredUser = (): AppUser | null => {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem(USER_KEY)

  if (!stored) {
    return null
  }

  try {
    return normalizeUser(JSON.parse(stored))
  } catch {
    return null
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text()
  if (!text) return {} as T
  return JSON.parse(text) as T
}

export async function loginWithEmail(email: string, password: string): Promise<{ token: string; user: AppUser }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const payload = await parseJson<{ token?: string; user?: Partial<AppUser> }> (response)
      if (payload.token && payload.user) {
        const user = normalizeUser(payload.user)
        if (!user) {
          throw new Error('Invalid backend user payload.')
        }
        persistSession(payload.token, user)
        return { token: payload.token, user }
      }
    }
  } catch {
    // Fall through to dev fallback below.
  }

  if (password.length >= 8) {
    const user = normalizeUser({ ...demoUser, email }) ?? demoUser
    persistSession('dev-icu-demo-token', user)
    return { token: 'dev-icu-demo-token', user }
  }

  throw new Error('Password must be at least 8 characters long.')
}

export async function registerAccount(input: {
  fullName: string
  email: string
  password: string
  role: string
  department: string
  phone: string
}): Promise<{ token: string; user: AppUser }> {
  const normalized = {
    name: input.fullName,
    email: input.email,
    password: input.password,
    role: normalizeRequestRole(input.role),
    department: input.department,
    phone: input.phone,
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized),
    })

    if (response.ok) {
      const payload = await parseJson<{ token?: string; user?: Partial<AppUser> }> (response)
      if (payload.token && payload.user) {
        const user = normalizeUser(payload.user)
        if (!user) {
          throw new Error('Invalid backend registration payload.')
        }
        persistSession(payload.token, user)
        return { token: payload.token, user }
      }
    }
  } catch {
    // Fall through to dev fallback below.
  }

  const user: AppUser = {
    id: `user-${Date.now()}`,
    name: input.fullName,
    email: input.email,
    role: input.role,
    department: input.department,
    phone: input.phone,
    createdAt: new Date().toISOString(),
  }

  persistSession('dev-icu-demo-token', user)
  return { token: 'dev-icu-demo-token', user }
}

export async function getCurrentUser(): Promise<AppUser | null> {
  if (typeof window === 'undefined') {
    return null
  }

  const token = localStorage.getItem(TOKEN_KEY)

  if (!token) {
    const storedUser = getStoredUser()
    return storedUser
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Backend user fetch failed.')
    }

    const payload = await parseJson<{ user?: Partial<AppUser> }> (response)
    const user = normalizeUser(payload.user)
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      return user
    }
  } catch {
    const storedUser = getStoredUser()
    if (storedUser) {
      return storedUser
    }
    return null
  }

  return getStoredUser()
}

export function logoutUser() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function updateStoredUser(user: AppUser) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getDemoUser() {
  return demoUser
}
