/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { socket } from "./socket";

type LogItem = { type: string; payload: any };

export default function App() {
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onServerHello = (payload: any) =>
      setLogs((p) => [{ type: "serverHello", payload }, ...p]);

    const onPong = (payload: any) =>
      setLogs((p) => [{ type: "pong", payload }, ...p]);

    const onInfo = (payload: any) =>
      setLogs((p) => [{ type: "info", payload }, ...p]);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("serverHello", onServerHello);
    socket.on("pong", onPong);
    socket.on("info", onInfo);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("serverHello", onServerHello);
      socket.off("pong", onPong);
      socket.off("info", onInfo);
    };
  }, []);

  const sendPing = () => {
    socket.emit("ping", { text: "hello from client" });
  };

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h1>Socket Demo</h1>
      <p>
        Status: <b>{connected ? "Connected" : "Disconnected"}</b>
      </p>

      <button onClick={sendPing}>Send ping</button>

      <h2 style={{ marginTop: 20 }}>Events</h2>
      <div style={{ display: "grid", gap: 8 }}>
        {logs.slice(0, 10).map((l, i) => (
          <div key={i} style={{ border: "1px solid #ddd", padding: 10 }}>
            <b>{l.type}</b>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(l.payload, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
