import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Token } from '../../database/entities/token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
  ) {}

  async findAll(
    search?: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: Token[]; total: number }> {
    const where = search
      ? [{ symbol: ILike(`%${search}%`) }, { name: ILike(`%${search}%`) }]
      : { isActive: true };
    const [data, total] = await this.tokenRepo.findAndCount({
      where,
      order: { volume24h: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(address: string): Promise<Token> {
    const token = await this.tokenRepo.findOne({ where: { address } });
    if (!token) throw new NotFoundException(`Token ${address} not found`);
    return token;
  }

  async upsert(data: Partial<Token>): Promise<Token> {
    const existing = await this.tokenRepo.findOne({ where: { address: data.address } });
    if (existing) {
      Object.assign(existing, data);
      return this.tokenRepo.save(existing);
    }
    return this.tokenRepo.save(this.tokenRepo.create(data));
  }
}
