import { Module } from '@nestjs/common';
import { DexGateway } from './dex.gateway';

@Module({
  providers: [DexGateway],
  exports: [DexGateway],
})
export class WebsocketModule {}
