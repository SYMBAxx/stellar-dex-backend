import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from '../../database/entities/pool.entity';
import { Swap } from '../../database/entities/swap.entity';
import { Candle } from '../../database/entities/candle.entity';
import { IndexerService } from './indexer.service';
import { EventProcessorService } from './event-processor.service';
import { PairsModule } from '../pairs/pairs.module';
import { SwapsModule } from '../swaps/swaps.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Pool, Swap, Candle]),
    PairsModule,
    SwapsModule,
    AnalyticsModule,
  ],
  providers: [IndexerService, EventProcessorService],
  exports: [IndexerService],
})
export class IndexerModule {}
