import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from '../../database/entities/pool.entity';
import { PairsController } from './pairs.controller';
import { PairsService } from './pairs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pool])],
  controllers: [PairsController],
  providers: [PairsService],
  exports: [PairsService],
})
export class PairsModule {}
