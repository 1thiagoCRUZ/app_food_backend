import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinOrderRoom')
  handleJoinRoom(@MessageBody() data: { orderId: number }, @ConnectedSocket() client: Socket) {
    const roomName = `order_${data.orderId}`;
    client.join(roomName);
    console.log(`Client ${client.id} joined room ${roomName}`);
    return { event: 'joinedRoom', room: roomName };
  }

  @SubscribeMessage('sendLocation')
  handleLocationUpdate(@MessageBody() data: { orderId: number, lat: number, lng: number }) {
    this.server.to(`order_${data.orderId}`).emit('locationUpdate', {
      lat: data.lat,
      lng: data.lng,
      timestamp: new Date()
    });
  }
}
