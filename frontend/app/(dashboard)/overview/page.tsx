'use client';

import { Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import MapView from '@/components/dashboard/MapView';
import ScoreDistributionChart from '@/components/dashboard/ScoreDistributionChart';
import ClusterDonutChart from '@/components/dashboard/ClusterDonutChart';
import TopKabupatenChart from '@/components/dashboard/TopKabupatenChart';
import { overviewData, kecamatanMapData } from '@/lib/static-data';

export default function OverviewPage() {
  return (
    <div className="space-y-6 mt-12 lg:mt-0">
      <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Users}
          label="Total UMKM"
          value={overviewData.total_umkm.toLocaleString()}
          subtitle="West Java region"
          color="#3B82F6"
        />
        <KPICard
          icon={TrendingUp}
          label="Avg Score"
          value={overviewData.avg_score.toFixed(1)}
          subtitle="Skor potensi rata-rata"
          color="#10B981"
        />
        <KPICard
          icon={AlertTriangle}
          label="High Risk Areas"
          value={overviewData.high_risk_count}
          subtitle="Kecamatan skor < 30"
          color="#EF4444"
        />
        <KPICard
          icon={Activity}
          label="Survival Rate"
          value={`${overviewData.survival_rate}%`}
          subtitle="Rata-rata tingkat kelangsungan"
          color="#8B5CF6"
        />
      </div>

      {/* Map */}
      <MapView data={kecamatanMapData} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreDistributionChart data={overviewData.score_distribution} />
        <ClusterDonutChart data={overviewData.cluster_distribution} />
      </div>

      <TopKabupatenChart data={overviewData.top_kabupaten} />
    </div>
  );
}
