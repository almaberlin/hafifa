import { useEffect, useRef } from "react";
import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type MapViewProps = {
  center?: [number, number];
  zoom?: number;
};

export default function MapView({
  center = [34.7818, 32.0853], 
  zoom = 7,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

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
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    />
  );
}
