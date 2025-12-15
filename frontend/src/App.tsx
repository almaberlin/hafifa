import { useEffect, useState } from "react";
import { socket } from "./socket";
import type { Drone } from "./utils/types";
import MapView from "./components/MapView";
import api from "./api";

export default function App() {
  const [drones, setDrones] = useState<Drone[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.drones().getAll();
        setDrones(res.data);
      } catch (e) {
        console.error("Failed to fetch drones:", e);
      }
    })();
  }, []);
  
  useEffect(() => {

    const onDroneReceived = (saved: Drone) => {
      setDrones((prev) => {
        if (prev.some((d) => d.id === saved.id)) return prev;
        return [...prev, saved];
      });
    };

    socket.on("droneSaved", onDroneReceived);

    return () => {
      socket.off("droneSaved", onDroneReceived);
    };
  }, []);

  return <MapView drones={drones}/>;
}
