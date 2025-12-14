import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    client.emit('serverHello', { message: 'Connected to Nest socket!' });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // client -> server example
  @SubscribeMessage('ping')
  onPing(@MessageBody() body: { text: string }) {
    // server -> all clients
    this.server.emit('pong', { text: `pong: ${body.text}`, at: Date.now() });
  }

  // server -> client event you can call from anywhere
  broadcastInfo(payload: any) {
    this.server.emit('info', payload);
  }
}
