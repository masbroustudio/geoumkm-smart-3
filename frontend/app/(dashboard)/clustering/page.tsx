'use client';

import { clusterData } from '@/lib/static-data';

const clusterColors = ['#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B'];

export default function ClusteringPage() {
  return (
    <div className="space-y-6 mt-12 lg:mt-0">
      <h1 className="text-2xl font-bold text-white">Clustering & Segmentation</h1>

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
        <h3 className="text-lg font-semibold text-white mb-4">Government Priority Ranking</h3>
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
        <h3 className="text-lg font-semibold text-white mb-4">Investment Opportunity Matrix</h3>
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
    </div>
  );
}
