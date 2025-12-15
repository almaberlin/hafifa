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
      center,
      zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current = map;
    setTimeout(() => map.resize(), 0);
    
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const drone of drones) {
      if (markersRef.current.has(drone.id)) continue;

      const el = document.createElement("div");
      el.title = `Drone #${drone.id}\nType: ${drone.type}\nAlt: ${drone.altitude}`;
      el.style.width = "18px";
      el.style.height = "18px";
      el.style.borderRadius = "999px";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 0 6px rgba(0,0,0,0.35)";
      // simple “icon” look; we can swap to an image later

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([drone.coordinates.x, drone.coordinates.y]) // [lng, lat]
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
