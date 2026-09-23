import { 
  SupersetGuestTokenResponse,
  SupersetLoginResponse 
} from "../interfaces/supersetAuth.interface.js";

function getSupersetUrl(): string {
  const url = process.env.SUPERSET_URL;
  if (!url) throw new Error('SUPERSET_URL is not set');
  return url;
};

export async function fetchSupersetAccessToken(): Promise<string> {
  const username = process.env.SUPERSET_ADMIN_USERNAME;
  const password = process.env.SUPERSET_ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error('SUPERSET_ADMIN_USERNAME or SUPERSET_ADMIN_PASSWORD is not set');
  }

  const response = await fetch(`${getSupersetUrl()}/api/v1/security/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      provider: 'db',
      refresh: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Superset login failed with status ${response.status}`);
  }

  const data = (await response.json()) as SupersetLoginResponse;
  return data.access_token;
};

export async function fetchGuestToken(): Promise<string> {
  const dashboardId = process.env.SUPERSET_DASHBOARD_ID
  if (!dashboardId) {
    throw new Error('SUPERSET_DASHBOARD_ID is not set');
  }

  const accessToken = await fetchSupersetAccessToken();

  const response = await fetch(`${getSupersetUrl()}/api/v1/security/guest_token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      user: {
        username: 'guest',
        first_name: 'Guest',
        last_name: 'Guest',
      },
      resources: [{ type: 'dashboard', id: dashboardId }],
      rls: [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Superset guest token request failed: ${response.status}`);
  }

  const data = (await response.json()) as SupersetGuestTokenResponse;
  return data.token;
};

