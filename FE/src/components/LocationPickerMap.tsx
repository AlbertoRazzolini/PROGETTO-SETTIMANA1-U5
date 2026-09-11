import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { accentIcon } from "./leafletIcons";

const DEFAULT_CENTER: [number, number] = [41.9028, 12.4964]; // Roma

interface Props {
  position: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
  height?: number;
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPickerMap({ position, onPick, height = 260 }: Props) {
  const center: [number, number] = position ? [position.lat, position.lng] : DEFAULT_CENTER;

  return (
    <div style={{ height, borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
      <MapContainer center={center} zoom={position ? 13 : 5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={onPick} />
        {position && <Marker position={[position.lat, position.lng]} icon={accentIcon} />}
      </MapContainer>
    </div>
  );
}
