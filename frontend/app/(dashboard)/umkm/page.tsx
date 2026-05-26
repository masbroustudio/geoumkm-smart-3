'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Users, Building2, Calendar, DollarSign, Wifi, WifiOff, ShieldCheck, Target, Lightbulb, MapPin, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { umkmDetailData, umkmDetailMap, UmkmDetail } from '@/lib/umkm-detail-data';

const clusterDescriptions: Record<string, string> = {
  'Urban Digital Leaders': 'Bisnis urban matang dengan kehadiran digital kuat, infrastruktur tinggi, dan survival rate terbaik.',
  'Rural Developing': 'Bisnis berkembang di area rural dengan infrastruktur tumbuh dan potensi transformasi digital.',
  'Suburban Growth Hub': 'Area suburban dengan adopsi digital tinggi dan basis infrastruktur kuat untuk pertumbuhan.',
  'High-Risk Underserved': 'Bisnis di area underserved dengan infrastruktur rendah dan risiko tinggi, butuh intervensi prioritas.',
  'Transitional Developing': 'Area transisi dengan infrastruktur moderat dan kehadiran digital tumbuh, rentan terhadap banjir.',
};

function getRiskBandColor(band: string): string {
  if (['AAA', 'AA', 'A'].includes(band)) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (['BBB', 'BB'].includes(band)) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}

function UmkmListView() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState<string>('all');
  const [filterKabupaten, setFilterKabupaten] = useState<string>('all');

  const kabupatenList = useMemo(() => {
    const set = new Set(umkmDetailData.map((u) => u.kabupaten));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return umkmDetailData.filter((u) => {
      const matchSearch = search === '' || u.nama_usaha.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase());
      const matchJenis = filterJenis === 'all' || u.jenis_usaha === filterJenis;
      const matchKab = filterKabupaten === 'all' || u.kabupaten === filterKabupaten;
      return matchSearch && matchJenis && matchKab;
    });
  }, [search, filterJenis, filterKabupaten]);

  return (
    <div className="space-y-6 mt-12 lg:mt-0">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">UMKM Directory</h1>
        <p className="text-slate-400 text-sm">Direktori profil detail {umkmDetailData.length} UMKM terdaftar</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama usaha atau ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">Semua Jenis</option>
            <option value="Makanan">Makanan</option>
            <option value="Fashion">Fashion</option>
            <option value="Kerajinan">Kerajinan</option>
            <option value="Jasa">Jasa</option>
            <option value="Pertanian">Pertanian</option>
          </select>
          <select
            value={filterKabupaten}
            onChange={(e) => setFilterKabupaten(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">Semua Kabupaten</option>
            {kabupatenList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((umkm) => (
          <button
            key={umkm.id}
            onClick={() => router.push(`/umkm?id=${umkm.id}`)}
            className="glass-card p-4 text-left hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-slate-500 font-mono">{umkm.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getRiskBandColor(umkm.credit_risk_band)}`}>
                {umkm.credit_risk_band}
              </span>
            </div>
            <h3 className="text-white font-semibold text-sm mb-1 truncate">{umkm.nama_usaha}</h3>
            <p className="text-slate-400 text-xs mb-2">{umkm.kecamatan}, {umkm.kabupaten}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="px-2 py-0.5 bg-slate-800 rounded">{umkm.jenis_usaha}</span>
              <span>Skor: {umkm.location_score}</span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-slate-400">Tidak ada UMKM yang cocok dengan filter.</p>
        </div>
      )}
    </div>
  );
}

function UmkmDetailView({ data }: { data: UmkmDetail }) {
  const chartData = [
    { name: 'Infrastructure', value: data.location_score_breakdown.infrastructure, color: '#3B82F6' },
    { name: 'Digital', value: data.location_score_breakdown.digital, color: '#8B5CF6' },
    { name: 'Financial', value: data.location_score_breakdown.financial, color: '#10B981' },
    { name: 'Market', value: data.location_score_breakdown.market, color: '#F59E0B' },
    { name: 'Risk', value: data.location_score_breakdown.risk, color: '#EC4899' },
  ];

  return (
    <div className="space-y-6 mt-12 lg:mt-0">
      {/* Back Button + Header */}
      <Link href="/umkm" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Directory</span>
      </Link>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-mono text-slate-500">{data.id}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${getRiskBandColor(data.credit_risk_band)}`}>
            {data.credit_risk_band}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white">{data.nama_usaha}</h1>
        <p className="text-slate-400 mt-1">{data.kecamatan}, {data.kabupaten}</p>
      </div>

      {/* Basic Info Card */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-400" />
          Informasi Dasar
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Jenis Usaha</p>
            <p className="text-sm text-white font-medium">{data.jenis_usaha}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Kecamatan</p>
            <p className="text-sm text-white font-medium">{data.kecamatan}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Kabupaten</p>
            <p className="text-sm text-white font-medium">{data.kabupaten}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Tahun Berdiri</p>
            <p className="text-sm text-white font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />{data.tahun_berdiri}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Jumlah Karyawan</p>
            <p className="text-sm text-white font-medium flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />{data.jumlah_karyawan} orang
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Omset Bulanan</p>
            <p className="text-sm text-white font-medium flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-slate-400" />Rp {data.omset_bulanan} Juta
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Kehadiran Digital</p>
            <p className="text-sm font-medium flex items-center gap-1">
              {data.has_digital_presence ? (
                <><Wifi className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Aktif</span></>
              ) : (
                <><WifiOff className="w-3 h-3 text-slate-500" /><span className="text-slate-500">Belum Ada</span></>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Location Score Card */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          Location Score
        </h3>
        <div className="flex items-center gap-6 mb-4">
          <div className="text-4xl font-bold text-white">{data.location_score}</div>
          <div className="text-sm text-slate-400">/ 100</div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#F8FAFC' }}
                itemStyle={{ color: '#94A3B8' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Credit Risk Card */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-yellow-400" />
          Credit Risk Assessment
        </h3>
        <div className="flex items-center gap-6">
          <div className={`px-4 py-2 rounded-lg border text-lg font-bold ${getRiskBandColor(data.credit_risk_band)}`}>
            {data.credit_risk_band}
          </div>
          <div>
            <p className="text-sm text-slate-400">Probability of Default</p>
            <p className="text-2xl font-bold text-white">{data.probability_of_default}%</p>
          </div>
        </div>
        <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${data.probability_of_default < 20 ? 'bg-emerald-400' : data.probability_of_default < 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
            style={{ width: `${data.probability_of_default}%` }}
          />
        </div>
      </div>

      {/* Cluster Card */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Cluster Membership
        </h3>
        <div className="flex items-start gap-3">
          <span className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium">
            {data.cluster_name}
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-3">{clusterDescriptions[data.cluster_name]}</p>
      </div>

      {/* Recommendations Card */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          Rekomendasi Perbaikan
        </h3>
        <ol className="space-y-3">
          {data.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs text-blue-400 font-medium">
                {idx + 1}
              </span>
              <span className="text-sm text-slate-300">{rec}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* How to Improve Card */}
      {data.counterfactuals && data.counterfactuals.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            How to Improve
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Analisis counterfactual: perubahan minimal pada fitur tertentu untuk meningkatkan skor.
          </p>
          <div className="space-y-4">
            {data.counterfactuals.map((cf, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{cf.feature}</span>
                  <span className="text-xs text-emerald-400 font-medium">{cf.impact}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-14">Current</span>
                    <div className="flex-1 h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400 rounded-full"
                        style={{ width: `${cf.current}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">{cf.current}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-14">Target</span>
                    <div className="flex-1 h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${cf.target}%` }}
                      />
                    </div>
                    <span className="text-xs text-emerald-400 w-8 text-right">{cf.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitors */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-400" />
          Kompetitor Sekitar
        </h3>
        <p className="text-3xl font-bold text-white">{data.nearby_competitors}</p>
        <p className="text-sm text-slate-400 mt-1">usaha sejenis dalam radius kecamatan</p>
      </div>
    </div>
  );
}

function UmkmContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 mt-12 lg:mt-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-slate-700 rounded animate-pulse" />
          <div className="h-8 bg-slate-700 rounded w-1/3 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-3" />
              <div className="h-8 bg-slate-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!id) {
    return <UmkmListView />;
  }

  const data = umkmDetailMap[id];
  if (!data) {
    return (
      <div className="space-y-6 mt-12 lg:mt-0">
        <Link href="/umkm" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Directory</span>
        </Link>
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">UMKM Tidak Ditemukan</h2>
          <p className="text-slate-400">Data untuk UMKM dengan ID &quot;{id}&quot; tidak tersedia.</p>
        </div>
      </div>
    );
  }

  return <UmkmDetailView data={data} />;
}

export default function UmkmPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 mt-12 lg:mt-0">
        <div className="h-8 bg-slate-700 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-3" />
              <div className="h-8 bg-slate-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    }>
      <UmkmContent />
    </Suspense>
  );
}
