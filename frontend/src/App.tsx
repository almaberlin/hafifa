import { useEffect } from "react";
import { socket } from "./socket";
import type { DronePayload } from "./utils/types";

export default function App() {

  useEffect(() => {

    const onDroneReceived = async (drone: DronePayload) => {
        console.log("Received droneGenerated:", drone);
    };

    socket.on("droneSaved", onDroneReceived);

    return () => {
      socket.off("droneSaved", onDroneReceived);
    };
  }, []);

  return <div>Listening for drones… (check console)</div>;
}
