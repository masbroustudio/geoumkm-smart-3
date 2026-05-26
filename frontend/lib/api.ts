import {
  overviewData,
  creditData,
  clusterData,
  policyData,
  recommendData,
  kecamatanMapData,
} from './static-data';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchWithFallback<T>(path: string, fallback: T): Promise<T> {
  if (!BASE_URL) return fallback;
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function fetchOverview() {
  return fetchWithFallback('/api/overview', overviewData);
}

export async function fetchScores(params?: { kabupaten?: string; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.kabupaten) query.set('kabupaten', params.kabupaten);
  if (params?.limit) query.set('limit', String(params.limit));
  const path = `/api/scores${query.toString() ? `?${query}` : ''}`;
  return fetchWithFallback(path, kecamatanMapData);
}

export async function fetchCredit() {
  return fetchWithFallback('/api/credit', creditData);
}

export async function fetchClusters() {
  return fetchWithFallback('/api/clusters', clusterData);
}

export async function fetchRecommendations(params?: { jenis_usaha?: string; kabupaten?: string }) {
  const query = new URLSearchParams();
  if (params?.jenis_usaha) query.set('jenis_usaha', params.jenis_usaha);
  if (params?.kabupaten) query.set('kabupaten', params.kabupaten);
  const path = `/api/recommendations${query.toString() ? `?${query}` : ''}`;
  return fetchWithFallback(path, recommendData);
}

export async function fetchPolicy() {
  return fetchWithFallback('/api/policy', policyData);
}

export async function postChat(body: { message: string; persona: string }) {
  if (!BASE_URL) return { response: '' };
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return { response: '' };
  }
}
