import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swap } from '../../database/entities/swap.entity';
import { SwapsController } from './swaps.controller';
import { SwapsService } from './swaps.service';

@Module({
  imports: [TypeOrmModule.forFeature([Swap])],
  controllers: [SwapsController],
  providers: [SwapsService],
  exports: [SwapsService],
})
export class SwapsModule {}
