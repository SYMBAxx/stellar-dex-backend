import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farm } from '../../database/entities/farm.entity';

@Injectable()
export class FarmsService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepo: Repository<Farm>,
  ) {}

  async findAll(): Promise<Farm[]> {
    return this.farmRepo.find({ where: { isActive: true }, order: { apr: 'DESC' } });
  }

  async findOne(contractId: string): Promise<Farm> {
    const farm = await this.farmRepo.findOne({ where: { contractId } });
    if (!farm) throw new NotFoundException(`Farm ${contractId} not found`);
    return farm;
  }

  async upsert(data: Partial<Farm>): Promise<Farm> {
    const existing = await this.farmRepo.findOne({ where: { contractId: data.contractId } });
    if (existing) {
      Object.assign(existing, data);
      return this.farmRepo.save(existing);
    }
    return this.farmRepo.save(this.farmRepo.create(data));
  }
}
