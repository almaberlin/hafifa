import { useEffect } from "react";
import { socket } from "./socket";
import type { DronePayload } from "./utils/types";
import MapView from "./components/MapView";

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

  return <MapView/>;
}
