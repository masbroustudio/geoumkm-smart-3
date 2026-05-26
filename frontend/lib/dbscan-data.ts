export interface DbscanSummary {
  total_clusters: number;
  noise_ratio: number;
  eps: number;
  min_samples: number;
}

export interface DbscanCluster {
  cluster_id: number;
  centroid_lat: number;
  centroid_lng: number;
  n_umkm: number;
  avg_score: number;
  dominant_jenis_usaha: string;
}

export interface DensityByKabupaten {
  kabupaten: string;
  cluster_count: number;
}

export const dbscanSummary: DbscanSummary = {
  total_clusters: 408,
  noise_ratio: 0.31,
  eps: 0.015,
  min_samples: 5,
};

export const topDensestClusters: DbscanCluster[] = [
  { cluster_id: 12, centroid_lat: -6.914, centroid_lng: 107.609, n_umkm: 87, avg_score: 84.2, dominant_jenis_usaha: 'Makanan' },
  { cluster_id: 45, centroid_lat: -6.178, centroid_lng: 106.968, n_umkm: 72, avg_score: 81.5, dominant_jenis_usaha: 'Jasa' },
  { cluster_id: 78, centroid_lat: -6.362, centroid_lng: 106.831, n_umkm: 65, avg_score: 79.8, dominant_jenis_usaha: 'Makanan' },
  { cluster_id: 103, centroid_lat: -6.870, centroid_lng: 107.620, n_umkm: 61, avg_score: 82.1, dominant_jenis_usaha: 'Fashion' },
  { cluster_id: 156, centroid_lat: -6.940, centroid_lng: 107.545, n_umkm: 58, avg_score: 76.4, dominant_jenis_usaha: 'Fashion' },
  { cluster_id: 201, centroid_lat: -6.476, centroid_lng: 106.748, n_umkm: 54, avg_score: 77.9, dominant_jenis_usaha: 'Makanan' },
  { cluster_id: 234, centroid_lat: -6.222, centroid_lng: 107.070, n_umkm: 51, avg_score: 80.3, dominant_jenis_usaha: 'Jasa' },
  { cluster_id: 267, centroid_lat: -6.620, centroid_lng: 106.730, n_umkm: 48, avg_score: 73.6, dominant_jenis_usaha: 'Pertanian' },
  { cluster_id: 312, centroid_lat: -6.856, centroid_lng: 107.590, n_umkm: 45, avg_score: 81.0, dominant_jenis_usaha: 'Kerajinan' },
  { cluster_id: 389, centroid_lat: -7.035, centroid_lng: 107.542, n_umkm: 42, avg_score: 70.2, dominant_jenis_usaha: 'Pertanian' },
];

export const densityByKabupaten: DensityByKabupaten[] = [
  { kabupaten: 'Kota Bandung', cluster_count: 68 },
  { kabupaten: 'Kota Bekasi', cluster_count: 55 },
  { kabupaten: 'Kota Depok', cluster_count: 48 },
  { kabupaten: 'Kab. Bogor', cluster_count: 45 },
  { kabupaten: 'Kab. Bandung', cluster_count: 42 },
  { kabupaten: 'Kab. Bandung Barat', cluster_count: 35 },
  { kabupaten: 'Kota Cimahi', cluster_count: 28 },
  { kabupaten: 'Kab. Cirebon', cluster_count: 22 },
  { kabupaten: 'Kab. Garut', cluster_count: 20 },
  { kabupaten: 'Kab. Karawang', cluster_count: 18 },
  { kabupaten: 'Kab. Sumedang', cluster_count: 15 },
  { kabupaten: 'Kab. Sukabumi', cluster_count: 12 },
];
