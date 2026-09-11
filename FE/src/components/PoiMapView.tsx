import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Link } from "react-router-dom";
import type { PoiResp, PostResp } from "../api/types";
import { defaultIcon } from "./leafletIcons";

const DEFAULT_CENTER: [number, number] = [41.9028, 12.4964]; // Roma

interface Props {
  pois: PoiResp[];
  posts: PostResp[];
  onCreateAt?: (lat: number, lng: number) => void;
  onBoundsSearch?: (bounds: { nord: number; sud: number; est: number; ovest: number }) => void;
  height?: number;
}

function ClickHandler({ onCreateAt }: { onCreateAt?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onCreateAt?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function SearchAreaControl({ onBoundsSearch }: { onBoundsSearch?: (b: { nord: number; sud: number; est: number; ovest: number }) => void }) {
  const map = useMap();
  if (!onBoundsSearch) return null;

  return (
    <button
      type="button"
      className="btn btn-sm btn-secondary"
      style={{ position: "absolute", top: 10, right: 10, zIndex: 1000, background: "var(--surface)" }}
      onClick={() => {
        const b = map.getBounds();
        onBoundsSearch({
          nord: b.getNorth(),
          sud: b.getSouth(),
          est: b.getEast(),
          ovest: b.getWest(),
        });
      }}
    >
      Cerca in quest'area
    </button>
  );
}

export function PoiMapView({ pois, posts, onCreateAt, onBoundsSearch, height = 420 }: Props) {
  const [ready, setReady] = useState(false);

  const postsByPoi = useMemo(() => {
    const map = new Map<string, PostResp[]>();
    for (const post of posts) {
      if (!post.poi) continue;
      const list = map.get(post.poi.id) ?? [];
      list.push(post);
      map.set(post.poi.id, list);
    }
    return map;
  }, [posts]);

  const center: [number, number] = pois.length
    ? [Number(pois[0].latitudine), Number(pois[0].longitudine)]
    : DEFAULT_CENTER;

  return (
    <div style={{ position: "relative", height, borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
      <MapContainer
        center={center}
        zoom={pois.length ? 12 : 5}
        style={{ height: "100%", width: "100%" }}
        whenReady={() => setReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onCreateAt={onCreateAt} />
        {ready && <SearchAreaControl onBoundsSearch={onBoundsSearch} />}
        {pois.map((poi) => {
          const relatedPosts = postsByPoi.get(poi.id) ?? [];
          return (
            <Marker key={poi.id} position={[Number(poi.latitudine), Number(poi.longitudine)]} icon={defaultIcon}>
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <strong>{poi.indirizzo ?? "Posizione senza indirizzo"}</strong>
                  <p style={{ margin: "4px 0", fontSize: 12, color: "#666" }}>
                    {Number(poi.latitudine).toFixed(5)}, {Number(poi.longitudine).toFixed(5)}
                  </p>
                  {relatedPosts.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                      {relatedPosts.map((p) => (
                        <Link
                          key={p.id}
                          to={`/posts/${p.id}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          {p.foto[0] ? (
                            <img
                              src={p.foto[0].contenuto}
                              alt=""
                              style={{
                                width: 40,
                                height: 40,
                                objectFit: "cover",
                                borderRadius: 6,
                                flexShrink: 0,
                              }}
                              onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")}
                            />
                          ) : (
                            <span
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 6,
                                background: "#eee",
                                flexShrink: 0,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                              }}
                            >
                              📝
                            </span>
                          )}
                          <span style={{ fontSize: 13 }}>{p.titolo}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: "#999" }}>Nessun post collegato</span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
