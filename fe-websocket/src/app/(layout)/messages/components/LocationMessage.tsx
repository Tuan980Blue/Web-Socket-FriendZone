import React from 'react';
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from 'leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { SiGooglemaps } from 'react-icons/si';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

interface LocationMessageProps {
  lat: number;
  lng: number;
  address?: string; // nếu có thể truyền địa chỉ
}

const LocationMessage: React.FC<LocationMessageProps> = ({ lat, lng, address }) => {
  const handleClick = () => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="relative w-[260px] h-[160px] rounded-2xl shadow-md border border-gray-200 overflow-hidden cursor-pointer transition hover:shadow-lg group bg-white"
      onClick={handleClick}
      title="Xem trên Google Maps"
    >
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ width: '100%', height: '70%' }}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
      </MapContainer>
      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-white via-white/80 to-transparent flex items-center px-4">
        <FaMapMarkerAlt className="text-red-500 mr-2" />
        <span className="text-sm font-medium text-gray-800 truncate">
          {address || "Vị trí được chia sẻ"}
        </span>
      </div>
      <div className="absolute bottom-3 right-3 z-10">
        <div className="bg-white rounded-full shadow p-1 group-hover:bg-blue-100 transition">
          <SiGooglemaps className="text-xl text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default LocationMessage; 