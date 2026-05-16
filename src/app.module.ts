import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PairsModule } from './modules/pairs/pairs.module';
import { SwapsModule } from './modules/swaps/swaps.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { FarmsModule } from './modules/farms/farms.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { IndexerModule } from './modules/indexer/indexer.module';
import { AdminModule } from './modules/admin/admin.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        autoLoadEntities: true,
        synchronize: config.get('app.env') === 'development',
        logging: config.get('app.env') === 'development',
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    PairsModule,
    SwapsModule,
    TokensModule,
    FarmsModule,
    AnalyticsModule,
    IndexerModule,
    AdminModule,
    WebsocketModule,
  ],
})
export class AppModule {}
