import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('API client', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchOverview returns fallback when BASE_URL is empty', async () => {
    // When NEXT_PUBLIC_API_URL is not set, BASE_URL is empty string,
    // so fetchWithFallback returns fallback immediately
    const { fetchOverview } = await import('@/lib/api');
    const result = await fetchOverview();
    // Should return overviewData from static-data (the fallback)
    expect(result).toBeDefined();
    expect(result).toHaveProperty('total_umkm');
  });

  it('fetchCredit returns fallback data', async () => {
    const { fetchCredit } = await import('@/lib/api');
    const result = await fetchCredit();
    expect(result).toBeDefined();
    // creditData has approval_rate or similar properties
    expect(typeof result).toBe('object');
  });

  it('fetchWithFallback handles API envelope unwrapping', async () => {
    // We need to set NEXT_PUBLIC_API_URL so BASE_URL is not empty
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:7071');

    const mockData = { total_umkm: 999, avg_score: 75 };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockData }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { fetchOverview } = await import('@/lib/api');
    const result = await fetchOverview();

    expect(mockFetch).toHaveBeenCalled();
    expect(result).toHaveProperty('total_umkm', 999);

    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('fetchWithFallback returns fallback on network error', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:7071');

    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', mockFetch);

    const { fetchCredit } = await import('@/lib/api');
    const result = await fetchCredit();

    // Should fall back to static creditData
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');

    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
});
