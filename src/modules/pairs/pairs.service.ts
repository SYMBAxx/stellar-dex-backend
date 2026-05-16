import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pool } from '../../database/entities/pool.entity';

@Injectable()
export class PairsService {
  constructor(
    @InjectRepository(Pool)
    private readonly poolRepo: Repository<Pool>,
  ) {}

  async findAll(page = 1, limit = 20): Promise<{ data: Pool[]; total: number }> {
    const [data, total] = await this.poolRepo.findAndCount({
      where: { isActive: true },
      order: { tvlUsd: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(contractId: string): Promise<Pool> {
    const pool = await this.poolRepo.findOne({ where: { contractId } });
    if (!pool) throw new NotFoundException(`Pool ${contractId} not found`);
    return pool;
  }

  async upsert(data: Partial<Pool>): Promise<Pool> {
    const existing = await this.poolRepo.findOne({
      where: { contractId: data.contractId },
    });
    if (existing) {
      Object.assign(existing, data);
      return this.poolRepo.save(existing);
    }
    return this.poolRepo.save(this.poolRepo.create(data));
  }

  async getTvlTotal(): Promise<string> {
    const result = await this.poolRepo
      .createQueryBuilder('pool')
      .select('SUM(CAST(pool.tvlUsd AS NUMERIC))', 'total')
      .where('pool.isActive = true')
      .getRawOne();
    return result?.total ?? '0';
  }
}
