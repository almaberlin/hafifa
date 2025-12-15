import { useEffect, useRef } from "react";
import maplibregl, { Marker, type Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Drone } from "../utils/types";

type MapViewProps = {
  drones: Drone[]
  center?: [number, number];
  zoom?: number;
};

export default function MapView({
  center = [34.7818, 32.0853], 
  zoom = 7,
  drones,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const markersRef = useRef<Map<number, Marker>>(new Map());
  
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
    });

    map.setCenter(center);
    map.setZoom(zoom);
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current = map;
    setTimeout(() => map.resize(), 0);
    
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const drone of drones) {
      if (markersRef.current.has(drone.id)) continue;

      const img = document.createElement("img");
      img.src = "/drone_icon.png"
        img.alt = "drone";
        img.style.width = "28px";
        img.style.height = "28px";
        img.style.cursor = "pointer";
        img.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.35))";

      const [lng, lat] = toLngLat(drone.coordinates);

      const marker = new maplibregl.Marker({ element: img })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.set(drone.id, marker);
    }
  }, [drones]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    />
  );
}

function toLngLat(
  coordinates: { x: number; y: number } | string
): [number, number] {
  if (typeof coordinates === "object") {
    return [Number(coordinates.x), Number(coordinates.y)];
  }

  const match = coordinates.match(/-?\d+(\.\d+)?/g);
  if (!match || match.length < 2) {
    throw new Error(`Invalid point format: ${coordinates}`);
  }

  return [Number(match[0]), Number(match[1])];
}