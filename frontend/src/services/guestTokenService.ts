import type { GuestTokenResponse } from '../types/dashboard.types'

export async function fetchGuestToken(): Promise<string> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/guest-token`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch guest token: ${response.status}`)
  }

  const data = (await response.json()) as GuestTokenResponse
  return data.token
}
