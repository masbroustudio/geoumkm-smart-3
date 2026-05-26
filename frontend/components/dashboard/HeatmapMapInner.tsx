'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface HeatmapMapInnerProps {
  data: { kecamatan: string; kabupaten: string; lat: number; lng: number; score: number }[];
}

function getHeatmapColor(score: number): string {
  if (score < 40) return '#EF4444';
  if (score < 55) return '#F97316';
  if (score < 70) return '#EAB308';
  return '#10B981';
}

function getRadius(score: number): number {
  return 6 + (score / 100) * 12;
}

export default function HeatmapMapInner({ data }: HeatmapMapInnerProps) {
  return (
    <MapContainer
      center={[-6.9, 107.6]}
      zoom={9}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((item, index) => (
        <CircleMarker
          key={index}
          center={[item.lat, item.lng]}
          radius={getRadius(item.score)}
          fillColor={getHeatmapColor(item.score)}
          fillOpacity={0.6}
          stroke={false}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{item.kecamatan}</p>
              <p className="text-gray-600">{item.kabupaten}</p>
              <p className="font-medium">Score: {item.score.toFixed(1)}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
