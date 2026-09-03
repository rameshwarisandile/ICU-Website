const normalizeUrl = (value: string) => value.replace(/\/$/, '')

export const API_BASE_URL = normalizeUrl(import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api')
export const SOCKET_URL = normalizeUrl(import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:4000')
const STORAGE_KEY = 'icu-auth-token'

const readToken = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(STORAGE_KEY)
}

const storeToken = (token: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, token)
  }
}

export async function ensureAuthToken() {
  const existingToken = readToken()

  if (existingToken) {
    return existingToken
  }

  const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@icu.local', password: 'admin123' }),
  })

  if (!loginResponse.ok) {
    throw new Error(`Auth failed: ${loginResponse.status}`)
  }

  const payload = (await loginResponse.json()) as { token?: string }

  if (!payload.token) {
    throw new Error('Auth token missing from backend response.')
  }

  storeToken(payload.token)
  return payload.token
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await ensureAuthToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}
