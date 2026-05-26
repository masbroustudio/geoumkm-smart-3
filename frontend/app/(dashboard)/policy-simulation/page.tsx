'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Target, ArrowUpRight } from 'lucide-react';
import { policyData as staticPolicyData } from '@/lib/static-data';
import { fetchPolicy } from '@/lib/api';

export default function PolicySimulationPage() {
  const [policyData, setPolicyData] = useState(staticPolicyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const data = await fetchPolicy();
        if (!cancelled) setPolicyData(data);
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
        <h1 className="text-2xl font-bold text-white">Policy Simulation</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-2/3 mb-3" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
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
      <h1 className="text-2xl font-bold text-white">Policy Simulation</h1>

      {/* Policy Impact Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {policyData.impacts.map((impact, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h4 className="text-sm font-semibold text-white">{impact.policy}</h4>
            </div>
            <p className="text-xs text-slate-400 mb-4">{impact.target}</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Avg Improvement</span>
                <span className="text-sm font-bold text-accent">+{impact.avgImprovement.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">% Improved</span>
                <span className="text-sm font-medium text-slate-200">{impact.pctImproved}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">New Above 70</span>
                <span className="text-sm font-medium text-emerald-400">+{impact.newAbove70}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Additional Survivors</span>
                <span className="text-sm font-medium text-blue-400">+{impact.additionalSurvivors}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Priority Kecamatan Table */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-white">Priority Kecamatan (Top 15)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Kecamatan</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Kabupaten</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Avg Score</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Factor</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {policyData.priorityKecamatan.map((item, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-white font-medium">#{item.rank}</td>
                  <td className="py-3 px-4 text-slate-200">{item.kecamatan}</td>
                  <td className="py-3 px-4 text-slate-300">{item.kabupaten}</td>
                  <td className="py-3 px-4 text-right text-red-400 font-medium">{item.avg_skor.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.factor === 'digital_readiness' ? 'bg-blue-500/20 text-blue-400' :
                      item.factor === 'infrastructure' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.factor.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-xs max-w-[200px] truncate">{item.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ArrowUpRight className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-white">What-If Scenario Results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Scenario</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Affected</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Before</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">After</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Improvement</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">% Improved</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Above 70</th>
              </tr>
            </thead>
            <tbody>
              {policyData.whatifScenarios.map((s, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-slate-200">{s.scenario}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{s.affected}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{s.before.toFixed(1)}</td>
                  <td className="py-3 px-4 text-right text-accent font-medium">{s.after.toFixed(1)}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">+{s.improvement.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{s.pct_improved}%</td>
                  <td className="py-3 px-4 text-right text-blue-400">{s.above_70}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
