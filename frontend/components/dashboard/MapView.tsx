'use client';

import dynamic from 'next/dynamic';

const MapInner = dynamic(() => import('./MapInner'), { ssr: false });

interface MapViewProps {
  data: { kecamatan: string; kabupaten: string; lat: number; lng: number; score: number }[];
}

export default function MapView({ data }: MapViewProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Peta Skor Potensi Kecamatan</h3>
      <div className="h-[450px] rounded-lg overflow-hidden">
        <MapInner data={data} />
      </div>
    </div>
  );
}
