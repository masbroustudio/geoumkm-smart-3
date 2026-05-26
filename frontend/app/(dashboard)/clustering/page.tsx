'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { clusterData as staticClusterData } from '@/lib/static-data';
import { fetchClusters } from '@/lib/api';
import { dbscanSummary, topDensestClusters, densityByKabupaten } from '@/lib/dbscan-data';
import DownloadCSVButton from '@/components/ui/DownloadCSVButton';

const clusterColors = ['#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B'];

function KMeansView({ clusterData }: { clusterData: typeof staticClusterData }) {
  return (
    <>
      {/* Cluster Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusterData.profiles.map((cluster, i) => (
          <div key={cluster.id} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: clusterColors[i] }} />
              <h4 className="text-sm font-semibold text-white">{cluster.name}</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">UMKM Count</span>
                <p className="text-white font-medium">{cluster.n_umkm.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400">Avg Score</span>
                <p className="text-white font-medium">{cluster.avg_score}</p>
              </div>
              <div>
                <span className="text-slate-400">Infra Score</span>
                <p className="text-white font-medium">{cluster.infra_score}</p>
              </div>
              <div>
                <span className="text-slate-400">Digital %</span>
                <p className="text-white font-medium">{cluster.digital_pct}%</p>
              </div>
              <div>
                <span className="text-slate-400">Survival Rate</span>
                <p className="text-white font-medium">{cluster.survival_rate}%</p>
              </div>
              <div>
                <span className="text-slate-400">Income (Jt)</span>
                <p className="text-white font-medium">{cluster.income}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Government Priority Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Government Priority Ranking</h3>
          <DownloadCSVButton data={clusterData.govPriority as unknown as Record<string, unknown>[]} filename="government-priority" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Cluster</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">UMKM</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Priority Score</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Budget %</th>
              </tr>
            </thead>
            <tbody>
              {clusterData.govPriority.map((item, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-white font-medium">#{item.rank}</td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${clusterColors[i]}22`, color: clusterColors[i] }}
                    >
                      {item.cluster}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">{item.n_umkm.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-accent font-medium">{item.priority_score.toFixed(3)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{item.budget_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investment Opportunity Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Investment Opportunity Matrix</h3>
          <DownloadCSVButton data={clusterData.investment as unknown as Record<string, unknown>[]} filename="investment-opportunity" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Cluster</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">UMKM</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Investment Score</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Market Size (Juta)</th>
              </tr>
            </thead>
            <tbody>
              {clusterData.investment.map((item, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-white font-medium">#{item.rank}</td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${clusterColors[i]}22`, color: clusterColors[i] }}
                    >
                      {item.cluster}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">{item.n_umkm.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-accent font-medium">{item.investment_score.toFixed(3)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{item.market_size_juta.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function DbscanView() {
  return (
    <>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400 mb-1">Total Clusters</p>
          <p className="text-2xl font-bold text-white">{dbscanSummary.total_clusters}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400 mb-1">Noise Ratio</p>
          <p className="text-2xl font-bold text-white">{dbscanSummary.noise_ratio}%</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400 mb-1">Epsilon (eps)</p>
          <p className="text-2xl font-bold text-white">{dbscanSummary.eps}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400 mb-1">Min Samples</p>
          <p className="text-2xl font-bold text-white">{dbscanSummary.min_samples}</p>
        </div>
      </div>

      {/* Top 10 Densest Clusters Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top 10 Densest Spatial Clusters</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Cluster ID</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Lat</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Lng</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">UMKM</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Avg Score</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Dominant Jenis</th>
              </tr>
            </thead>
            <tbody>
              {topDensestClusters.map((cluster) => (
                <tr key={cluster.cluster_id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-white font-medium">#{cluster.cluster_id}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{cluster.centroid_lat.toFixed(3)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{cluster.centroid_lng.toFixed(3)}</td>
                  <td className="py-3 px-4 text-right text-accent font-medium">{cluster.n_umkm}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{cluster.avg_score}</td>
                  <td className="py-3 px-4 text-slate-300">{cluster.dominant_jenis_usaha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Density by Kabupaten Bar Chart */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Cluster Density by Kabupaten</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={densityByKabupaten} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="kabupaten"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="cluster_count" name="Clusters" radius={[4, 4, 0, 0]}>
                {densityByKabupaten.map((_, index) => (
                  <Cell key={index} fill={clusterColors[index % clusterColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Note Card */}
      <div className="glass-card p-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold text-white mb-2">DBSCAN vs K-Means</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>
            <strong className="text-white">DBSCAN</strong> (Density-Based Spatial Clustering of Applications with Noise)
            mengelompokkan UMKM berdasarkan kedekatan spasial tanpa perlu menentukan jumlah cluster sebelumnya.
            Algoritma ini cocok untuk menemukan cluster dengan bentuk tidak beraturan dan mengidentifikasi noise (outlier).
          </p>
          <p>
            <strong className="text-white">K-Means</strong> mempartisi data ke dalam K cluster yang telah ditentukan
            berdasarkan jarak ke centroid. Cocok untuk segmentasi bisnis berdasarkan karakteristik multi-dimensi
            (skor lokasi, digital presence, omset, dll).
          </p>
          <p className="text-slate-400 mt-3">
            Pada proyek ini, DBSCAN digunakan untuk analisis spatial density (408 cluster geografis),
            sedangkan K-Means digunakan untuk segmentasi profil bisnis (5 cluster strategis).
          </p>
        </div>
      </div>
    </>
  );
}

export default function ClusteringPage() {
  const [clusterData, setClusterData] = useState(staticClusterData);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'kmeans' | 'dbscan'>('kmeans');

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const data = await fetchClusters();
        if (!cancelled) setClusterData(data);
      } catch {
        // Keep static data
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 mt-12 lg:mt-0">
        <h1 className="text-2xl font-bold text-white">Clustering & Segmentation</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-2/3 mb-3" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-4 bg-slate-700 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-12 lg:mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-white">Clustering & Segmentation</h1>
        <div className="flex rounded-lg overflow-hidden border border-slate-700">
          <button
            onClick={() => setActiveTab('kmeans')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'kmeans'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            K-Means
          </button>
          <button
            onClick={() => setActiveTab('dbscan')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'dbscan'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            DBSCAN
          </button>
        </div>
      </div>

      {activeTab === 'kmeans' ? (
        <KMeansView clusterData={clusterData} />
      ) : (
        <DbscanView />
      )}
    </div>
  );
}
