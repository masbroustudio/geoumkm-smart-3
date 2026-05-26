'use client';

import { useState } from 'react';
import { MapPin, Search, Sliders } from 'lucide-react';
import { recommendData, policyData } from '@/lib/static-data';

const jenisUsahaOptions = ['Semua', 'Makanan', 'Fashion', 'Kerajinan', 'Jasa', 'Pertanian'];
const kabupatenOptions = ['Semua', 'Kota Bekasi', 'Kota Depok', 'Kota Bandung', 'Kab. Bogor', 'Kota Cimahi'];

export default function LocationIntelligencePage() {
  const [jenisUsaha, setJenisUsaha] = useState('Semua');
  const [kabupaten, setKabupaten] = useState('Semua');
  const [infra, setInfra] = useState(50);
  const [bankDist, setBankDist] = useState(50);
  const [internet, setInternet] = useState(50);
  const [simResult, setSimResult] = useState<string | null>(null);

  const filtered = recommendData.filter((item) => {
    if (jenisUsaha !== 'Semua' && item.jenis_usaha !== jenisUsaha) return false;
    if (kabupaten !== 'Semua' && item.kabupaten !== kabupaten) return false;
    return true;
  });

  const handleSimulate = () => {
    const baseScore = 45;
    const infraBonus = (infra / 100) * 25;
    const bankBonus = ((100 - bankDist) / 100) * 5;
    const internetBonus = (internet / 100) * 15;
    const predicted = Math.min(100, baseScore + infraBonus + bankBonus + internetBonus).toFixed(1);
    setSimResult(`Predicted Score: ${predicted} (Infrastructure: +${infraBonus.toFixed(1)}, Bank Access: +${bankBonus.toFixed(1)}, Internet: +${internetBonus.toFixed(1)})`);
  };

  return (
    <div className="space-y-6 mt-12 lg:mt-0">
      <h1 className="text-2xl font-bold text-white">Location Intelligence</h1>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-white">Filter Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Jenis Usaha</label>
            <select
              value={jenisUsaha}
              onChange={(e) => setJenisUsaha(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-accent"
            >
              {jenisUsahaOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Kabupaten/Kota</label>
            <select
              value={kabupaten}
              onChange={(e) => setKabupaten(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-accent"
            >
              {kabupatenOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full glass-card p-8 text-center">
            <p className="text-slate-400">No recommendations found for the selected filters.</p>
          </div>
        ) : (
          filtered.map((item, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-white">{item.kecamatan}</span>
                </div>
                <span className="text-lg font-bold text-accent">{item.avg_score}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">{item.kabupaten} | {item.jenis_usaha}</p>
              <p className="text-xs text-slate-500">{item.explanation}</p>
            </div>
          ))
        )}
      </div>

      {/* What-If Simulator */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-white">What-If Simulator</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Infrastructure Score: {infra}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={infra}
              onChange={(e) => setInfra(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Bank Distance (lower = closer): {bankDist}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={bankDist}
              onChange={(e) => setBankDist(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Internet Coverage: {internet}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={internet}
              onChange={(e) => setInternet(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
        <button
          onClick={handleSimulate}
          className="px-6 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-600 transition-colors"
        >
          Simulate
        </button>
        {simResult && (
          <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-slate-700">
            <p className="text-sm text-accent font-medium">{simResult}</p>
          </div>
        )}
      </div>

      {/* What-If Scenario Results from ML */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Pre-computed Scenario Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Scenario</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Affected</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Before</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">After</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Improvement</th>
              </tr>
            </thead>
            <tbody>
              {policyData.whatifScenarios.map((s, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-slate-200">{s.scenario}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{s.affected}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{s.before.toFixed(1)}</td>
                  <td className="py-3 px-4 text-right text-accent">{s.after.toFixed(1)}</td>
                  <td className="py-3 px-4 text-right text-emerald-400">+{s.improvement.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
