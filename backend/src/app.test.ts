import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import app from './app.js';

function fetchResponse(body: unknown, ok = true, status = ok ? 200 : 500) {
  return { ok, status, json: async () => body, headers: { getSetCookie: () => [] } };
}

describe('GET /health', () => {
  it('responds 200 ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('POST /api/guest-token', () => {
  beforeEach(() => {
    vi.stubEnv('SUPERSET_URL', 'http://superset.test');
    vi.stubEnv('SUPERSET_ADMIN_USERNAME', 'admin');
    vi.stubEnv('SUPERSET_ADMIN_PASSWORD', 'secret');
    vi.stubEnv('SUPERSET_DASHBOARD_ID', 'dash-1');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns 200 with a guest token when Superset accepts the request', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(fetchResponse({ access_token: 'admin-token' }))
      .mockResolvedValueOnce(fetchResponse({ result: 'csrf-xyz' }))
      .mockResolvedValueOnce(fetchResponse({ token: 'guest-token-xyz' }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await request(app).post('/api/guest-token');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: 'guest-token-xyz' });
  });

  it('returns 502 when admin credentials are missing', async () => {
    vi.stubEnv('SUPERSET_ADMIN_PASSWORD', '');

    const response = await request(app).post('/api/guest-token');

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: 'Failed to issue guest token' });
  });

  it('returns 502 when the dashboard id is not configured', async () => {
    vi.stubEnv('SUPERSET_DASHBOARD_ID', '');

    const response = await request(app).post('/api/guest-token');

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: 'Failed to issue guest token' });
  });

  it('returns 502 when Superset rejects the admin login', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fetchResponse({}, false, 401)));

    const response = await request(app).post('/api/guest-token');

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: 'Failed to issue guest token' });
  });

  it('returns 502 when Superset rejects the guest token request', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(fetchResponse({ access_token: 'admin-token' }))
      .mockResolvedValueOnce(fetchResponse({ result: 'csrf-xyz' }))
      .mockResolvedValueOnce(fetchResponse({}, false, 403));
    vi.stubGlobal('fetch', fetchMock);

    const response = await request(app).post('/api/guest-token');

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: 'Failed to issue guest token' });
  });
});
