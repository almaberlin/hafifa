import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DroneType } from 'src/drones/droneType.enum';

type DronePayload = {
  latitude: number;
  longitude: number;
  type: DroneType;
  altitude: number;
};

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private intervalId: NodeJS.Timeout | null = null;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);

    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        const drone = this.generateRandomDrone();
        this.server.emit('droneGenerated', drone);
        console.log('Emitted droneGenerated:', drone);
      }, 10_000);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);

    if (this.server.engine.clientsCount === 0 && this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Stopped drone generator (no clients).');
    }
  }

  private generateRandomDrone(): DronePayload {
    const latitude = this.randomInRange(29.5, 33.3);
    const longitude = this.randomInRange(34.2, 35.9);
    const altitude = Math.floor(this.randomInRange(0, 500));

    const types = Object.values(DroneType);
    const type = types[Math.floor(Math.random() * types.length)] as DroneType;

    return { latitude, longitude, altitude, type };
  }

  private randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
