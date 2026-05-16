import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pool } from '../../database/entities/pool.entity';
import { Swap } from '../../database/entities/swap.entity';
import { Candle, CandleInterval } from '../../database/entities/candle.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Pool) private readonly poolRepo: Repository<Pool>,
    @InjectRepository(Swap) private readonly swapRepo: Repository<Swap>,
    @InjectRepository(Candle) private readonly candleRepo: Repository<Candle>,
  ) {}

  async getProtocolStats() {
    const tvl = await this.poolRepo
      .createQueryBuilder('p')
      .select('SUM(CAST(p.tvlUsd AS NUMERIC))', 'tvl')
      .getRawOne();

    const vol24h = await this.swapRepo
      .createQueryBuilder('s')
      .select('SUM(CAST(s.amountInUsd AS NUMERIC))', 'volume')
      .where('s.timestamp >= :since', { since: Math.floor(Date.now() / 1000) - 86400 })
      .getRawOne();

    const poolCount = await this.poolRepo.count({ where: { isActive: true } });
    const swapCount = await this.swapRepo.count();

    return {
      tvlUsd: tvl?.tvl ?? '0',
      volume24hUsd: vol24h?.volume ?? '0',
      poolCount,
      swapCount,
    };
  }

  async getCandles(
    poolId: string,
    interval: CandleInterval,
    from: number,
    to: number,
  ): Promise<Candle[]> {
    return this.candleRepo
      .createQueryBuilder('c')
      .where('c.poolId = :poolId', { poolId })
      .andWhere('c.interval = :interval', { interval })
      .andWhere('c.openTime >= :from', { from })
      .andWhere('c.openTime <= :to', { to })
      .orderBy('c.openTime', 'ASC')
      .getMany();
  }

  async upsertCandle(data: Partial<Candle>): Promise<Candle> {
    const existing = await this.candleRepo.findOne({
      where: {
        poolId: data.poolId,
        interval: data.interval,
        openTime: data.openTime as number,
      },
    });
    if (existing) {
      Object.assign(existing, data);
      return this.candleRepo.save(existing);
    }
    return this.candleRepo.save(this.candleRepo.create(data));
  }
}
