import {
  overviewData,
  creditData,
  clusterData,
  policyData,
  recommendData,
  kecamatanMapData,
} from './static-data';

export interface WhatIfCustomResult {
  affected_count: number;
  avg_score_before: number;
  avg_score_after: number;
  avg_improvement: number;
  umkm_crossing_70_threshold: number;
  pct_improved: number;
  max_improvement: number;
}

const BASE_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || '')
  : '';

async function fetchWithFallback<T>(endpoint: string, fallback: T): Promise<T> {
  if (!BASE_URL) return fallback;
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok) return fallback;
    const json = await res.json();
    // Unwrap the API envelope { success, data }
    if (json && json.success && json.data !== undefined) {
      return json.data as T;
    }
    return json as T;
  } catch {
    return fallback;
  }
}

export async function fetchOverview() {
  const data = await fetchWithFallback('/api/overview', overviewData);
  // Transform API field names to match frontend expectations
  // API uses { bucket, count } but frontend expects { range, count }
  if (data && data.score_distribution && data.score_distribution.length > 0) {
    const first = data.score_distribution[0] as Record<string, unknown>;
    if ('bucket' in first && !('range' in first)) {
      data.score_distribution = data.score_distribution.map(
        (item: { bucket?: string; range?: string; count: number }) => ({
          range: item.bucket || item.range || '',
          count: item.count,
        })
      );
    }
  }
  return data;
}

export async function fetchScores(params?: { kabupaten?: string; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.kabupaten) query.set('kabupaten', params.kabupaten);
  if (params?.limit) query.set('limit', String(params.limit));
  const path = `/api/score${query.toString() ? `?${query}` : ''}`;
  return fetchWithFallback(path, kecamatanMapData);
}

export async function fetchCredit() {
  return fetchWithFallback('/api/credit', creditData);
}

export async function fetchClusters() {
  return fetchWithFallback('/api/cluster', clusterData);
}

export async function fetchRecommendations(params?: { jenis_usaha?: string; kabupaten?: string }) {
  const query = new URLSearchParams();
  if (params?.jenis_usaha) query.set('jenis_usaha', params.jenis_usaha);
  if (params?.kabupaten) query.set('kabupaten', params.kabupaten);
  const path = `/api/recommend${query.toString() ? `?${query}` : ''}`;
  const data = await fetchWithFallback(path, recommendData);
  // Transform API field names: kabupaten_kota -> kabupaten, avg_skor_potensi -> avg_score
  if (Array.isArray(data) && data.length > 0) {
    const first = data[0] as Record<string, unknown>;
    if ('kabupaten_kota' in first || 'avg_skor_potensi' in first) {
      return data.map((item: Record<string, unknown>) => ({
        kabupaten: (item.kabupaten_kota || item.kabupaten || '') as string,
        kecamatan: (item.kecamatan || '') as string,
        jenis_usaha: (item.jenis_usaha || '') as string,
        avg_score: (item.avg_skor_potensi || item.avg_score || 0) as number,
        rank: (item.rank || 0) as number,
        explanation: (item.explanation || '') as string,
      })) as typeof recommendData;
    }
  }
  return data;
}

export async function fetchPolicy() {
  return fetchWithFallback('/api/policy', policyData);
}

export async function fetchKecamatan(_params?: { kabupaten?: string }) {
  // Always return static kecamatanMapData because the API's /api/kecamatan
  // endpoint returns raw reference data without scores, which the map needs
  // for color-coding. The static data has pre-computed scores.
  return kecamatanMapData;
}

export async function postChat(body: { message: string; persona: string; history?: Array<{ role: string; content: string }> }): Promise<{ response: string }> {
  if (!BASE_URL) return { response: '' };
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { response: '' };
    const json = await res.json();
    // Unwrap the API envelope { success, data: { response, intent, sources } }
    if (json && json.success && json.data?.response) {
      return { response: json.data.response };
    }
    if (json?.response) {
      return { response: json.response };
    }
    return { response: '' };
  } catch {
    return { response: '' };
  }
}

export async function postWhatIfCustom(body: {
  infrastructure_delta: number;
  internet_delta: number;
  bank_distance_delta: number;
  target_kabupaten: string;
}): Promise<WhatIfCustomResult> {
  // Client-side fallback computation
  function computeClientSide(): WhatIfCustomResult {
    const filtered = kecamatanMapData.filter(
      (k) => k.kabupaten === body.target_kabupaten
    );

    if (filtered.length === 0) {
      return {
        affected_count: 0,
        avg_score_before: 0,
        avg_score_after: 0,
        avg_improvement: 0,
        umkm_crossing_70_threshold: 0,
        pct_improved: 0,
        max_improvement: 0,
      };
    }

    let totalBefore = 0;
    let totalAfter = 0;
    let crossingThreshold = 0;
    let improvedCount = 0;
    let maxImprovement = 0;

    for (const item of filtered) {
      const scoreBefore = item.score;
      const rawNew = scoreBefore +
        (body.infrastructure_delta * 0.66) +
        (body.internet_delta * 0.33) +
        (body.bank_distance_delta * 0.01);
      const scoreAfter = Math.max(0, Math.min(100, rawNew));
      const improvement = scoreAfter - scoreBefore;

      totalBefore += scoreBefore;
      totalAfter += scoreAfter;

      if (improvement > 0) {
        improvedCount++;
      }
      if (improvement > maxImprovement) {
        maxImprovement = improvement;
      }
      if (scoreBefore < 70 && scoreAfter >= 70) {
        crossingThreshold++;
      }
    }

    const affected_count = filtered.length;
    return {
      affected_count,
      avg_score_before: totalBefore / affected_count,
      avg_score_after: totalAfter / affected_count,
      avg_improvement: (totalAfter - totalBefore) / affected_count,
      umkm_crossing_70_threshold: crossingThreshold,
      pct_improved: (improvedCount / affected_count) * 100,
      max_improvement: maxImprovement,
    };
  }

  if (!BASE_URL) return computeClientSide();

  try {
    const res = await fetch(`${BASE_URL}/api/whatif-custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return computeClientSide();
    const json = await res.json();
    if (json && json.success && json.data) {
      return json.data as WhatIfCustomResult;
    }
    return computeClientSide();
  } catch {
    return computeClientSide();
  }
}
