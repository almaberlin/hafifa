import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DronesService } from 'src/drones/drones.service';
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
  private isTickRunning = false;

  constructor(private readonly dronesService: DronesService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);

    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        void (async () => {
          if (this.isTickRunning) return;
          this.isTickRunning = true;

          try {
            const dto = this.generateRandomDrone();
            const savedDrone = await this.dronesService.create(dto);

            this.server.emit('droneSaved', savedDrone);
            console.log('Saved & emitted droneSaved:', savedDrone);
          } catch (err) {
            console.error('Failed to generate/save drone:', err);
          } finally {
            this.isTickRunning = false;
          }
        })();
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
