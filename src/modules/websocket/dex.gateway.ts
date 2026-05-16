import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws',
})
export class DexGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DexGateway.name);

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe:pool')
  handleSubscribePool(
    @MessageBody() poolId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`pool:${poolId}`);
    return { event: 'subscribed', data: `pool:${poolId}` };
  }

  @SubscribeMessage('subscribe:swaps')
  handleSubscribeSwaps(@ConnectedSocket() client: Socket) {
    client.join('swaps');
    return { event: 'subscribed', data: 'swaps' };
  }

  // Called by indexer when new swap is processed
  emitSwap(swap: any) {
    this.server.to('swaps').emit('swap', swap);
    this.server.to(`pool:${swap.poolId}`).emit('pool:swap', swap);
  }

  // Called when pool reserves update
  emitPoolUpdate(poolId: string, data: any) {
    this.server.to(`pool:${poolId}`).emit('pool:update', data);
  }

  // Broadcast price tick
  emitPriceTick(poolId: string, price: string) {
    this.server.to(`pool:${poolId}`).emit('price', { poolId, price });
  }
}
