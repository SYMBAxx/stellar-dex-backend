import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CandleInterval } from '../../database/entities/candle.entity';

@ApiTags('analytics')
@Controller('api/v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Protocol-wide stats: TVL, volume, pool count' })
  getStats() {
    return this.analyticsService.getProtocolStats();
  }

  @Get('candles/:poolId')
  @ApiOperation({ summary: 'OHLCV candle data for a pool' })
  @ApiQuery({ name: 'interval', enum: ['1m', '5m', '15m', '1h', '4h', '1d'] })
  @ApiQuery({ name: 'from', type: Number })
  @ApiQuery({ name: 'to', type: Number })
  getCandles(
    @Param('poolId') poolId: string,
    @Query('interval') interval: CandleInterval = '1h',
    @Query('from') from: number,
    @Query('to') to: number,
  ) {
    return this.analyticsService.getCandles(poolId, interval, +from, +to);
  }
}
