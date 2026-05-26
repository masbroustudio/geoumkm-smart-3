'use client';

import dynamic from 'next/dynamic';

const HeatmapMapInner = dynamic(() => import('./HeatmapMapInner'), { ssr: false });

interface HeatmapMapViewProps {
  data: { kecamatan: string; kabupaten: string; lat: number; lng: number; score: number }[];
}

const legendItems = [
  { color: '#EF4444', label: '< 40 (Low)' },
  { color: '#F97316', label: '40-55' },
  { color: '#EAB308', label: '55-70' },
  { color: '#10B981', label: '> 70 (High)' },
];

export default function HeatmapMapView({ data }: HeatmapMapViewProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Heatmap Skor Potensi</h3>
      <div className="relative h-[450px] rounded-lg overflow-hidden">
        <HeatmapMapInner data={data} />
        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-[1000] bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-300 mb-2">Score Legend</p>
          <div className="space-y-1.5">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 border-t border-slate-700 pt-1.5">
            Circle size = score intensity
          </p>
        </div>
      </div>
    </div>
  );
}
