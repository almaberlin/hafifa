import { useEffect } from "react";
import { socket } from "./socket";
import type { DronePayload } from "./utils/types";
import api from "./api";

export default function App() {

  useEffect(() => {

    const onDroneGenerated = async (drone: DronePayload) => {
        try {
        console.log("Received droneGenerated:", drone);

        const response = await api.drones().create(drone);

        console.log("Saved drone:", response.data);
      } catch (error) {
        console.error("Failed to save drone:", error);
      }
    };

    socket.on("droneGenerated", onDroneGenerated);

    return () => {
      socket.off("droneGenerated", onDroneGenerated);
    };
  }, []);

  return <div>Listening for drones… (check console)</div>;
}
