import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Swap } from '../../database/entities/swap.entity';

@Injectable()
export class SwapsService {
  constructor(
    @InjectRepository(Swap)
    private readonly swapRepo: Repository<Swap>,
  ) {}

  async findAll(
    poolId?: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: Swap[]; total: number }> {
    const qb = this.swapRepo.createQueryBuilder('swap');
    if (poolId) qb.where('swap.poolId = :poolId', { poolId });
    qb.orderBy('swap.timestamp', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async findByAddress(
    address: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: Swap[]; total: number }> {
    const [data, total] = await this.swapRepo.findAndCount({
      where: { sender: address },
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async save(swap: Partial<Swap>): Promise<Swap> {
    return this.swapRepo.save(this.swapRepo.create(swap));
  }

  async getVolume24h(): Promise<string> {
    const since = Math.floor(Date.now() / 1000) - 86400;
    const result = await this.swapRepo
      .createQueryBuilder('swap')
      .select('SUM(CAST(swap.amountInUsd AS NUMERIC))', 'volume')
      .where('swap.timestamp >= :since', { since })
      .getRawOne();
    return result?.volume ?? '0';
  }
}
