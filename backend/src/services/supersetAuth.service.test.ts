import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchGuestToken, fetchSupersetAccessToken } from './supersetAuth.service.js';

function fetchResponse(body: unknown, ok = true, status = ok ? 200 : 500, setCookie: string[] = []) {
  return {
    ok,
    status,
    json: async () => body,
    headers: { getSetCookie: () => setCookie },
  };
}

describe('fetchSupersetAccessToken', () => {
  beforeEach(() => {
    vi.stubEnv('SUPERSET_URL', 'http://superset.test');
    vi.stubEnv('SUPERSET_ADMIN_USERNAME', 'admin');
    vi.stubEnv('SUPERSET_ADMIN_PASSWORD', 'secret');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('throws when SUPERSET_URL is missing', async () => {
    vi.stubEnv('SUPERSET_URL', '');

    await expect(fetchSupersetAccessToken()).rejects.toThrow('SUPERSET_URL is not set');
  });

  it('throws when admin credentials are missing', async () => {
    vi.stubEnv('SUPERSET_ADMIN_PASSWORD', '');

    await expect(fetchSupersetAccessToken()).rejects.toThrow(
      'SUPERSET_ADMIN_USERNAME or SUPERSET_ADMIN_PASSWORD is not set',
    );
  });

  it('returns the access token on a successful login', async () => {
    const fetchMock = vi.fn().mockResolvedValue(fetchResponse({ access_token: 'abc123' }));
    vi.stubGlobal('fetch', fetchMock);

    const token = await fetchSupersetAccessToken();

    expect(token).toBe('abc123');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://superset.test/api/v1/security/login',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws when Superset rejects the login', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fetchResponse({}, false, 401)));

    await expect(fetchSupersetAccessToken()).rejects.toThrow('Superset login failed with status 401');
  });
});

describe('fetchGuestToken', () => {
  beforeEach(() => {
    vi.stubEnv('SUPERSET_URL', 'http://superset.test');
    vi.stubEnv('SUPERSET_ADMIN_USERNAME', 'admin');
    vi.stubEnv('SUPERSET_ADMIN_PASSWORD', 'secret');
    vi.stubEnv('SUPERSET_DASHBOARD_ID', 'dash-1');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('throws when SUPERSET_DASHBOARD_ID is missing', async () => {
    vi.stubEnv('SUPERSET_DASHBOARD_ID', '');

    await expect(fetchGuestToken()).rejects.toThrow('SUPERSET_DASHBOARD_ID is not set');
  });

  it('logs in, fetches a CSRF token, then requests a guest token scoped to the dashboard', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(fetchResponse({ access_token: 'abc123' }))
      .mockResolvedValueOnce(fetchResponse({ result: 'csrf-xyz' }, true, 200, ['session=s1; Path=/', 'other=v2; Path=/']))
      .mockResolvedValueOnce(fetchResponse({ token: 'guest-token-xyz' }));
    vi.stubGlobal('fetch', fetchMock);

    const token = await fetchGuestToken();

    expect(token).toBe('guest-token-xyz');
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const [csrfUrl, csrfInit] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(csrfUrl).toBe('http://superset.test/api/v1/security/csrf_token/');
    expect((csrfInit.headers as Record<string, string>).Authorization).toBe('Bearer abc123');

    const [guestUrl, guestInit] = fetchMock.mock.calls[2] as [string, RequestInit];
    expect(guestUrl).toBe('http://superset.test/api/v1/security/guest_token/');
    const headers = guestInit.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer abc123');
    expect(headers['X-CSRFToken']).toBe('csrf-xyz');
    expect(headers.Cookie).toBe('session=s1; other=v2');

    const body = JSON.parse(guestInit.body as string);
    expect(body.resources).toEqual([{ type: 'dashboard', id: 'dash-1' }]);
    expect(body.rls).toEqual([]);
  });

  it('throws when the admin login fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fetchResponse({}, false, 401)));

    await expect(fetchGuestToken()).rejects.toThrow('Superset login failed with status 401');
  });

  it('throws when the CSRF token request fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(fetchResponse({ access_token: 'abc123' }))
      .mockResolvedValueOnce(fetchResponse({}, false, 401));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchGuestToken()).rejects.toThrow('Superset CSRF token request failed with status 401');
  });

  it('throws when Superset rejects the guest token request', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(fetchResponse({ access_token: 'abc123' }))
      .mockResolvedValueOnce(fetchResponse({ result: 'csrf-xyz' }))
      .mockResolvedValueOnce(fetchResponse({}, false, 403));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchGuestToken()).rejects.toThrow('Superset guest token request failed: 403');
  });
});
