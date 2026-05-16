import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PairsService } from './pairs.service';

@ApiTags('pairs')
@Controller('api/v1/pairs')
export class PairsController {
  constructor(private readonly pairsService: PairsService) {}

  @Get()
  @ApiOperation({ summary: 'List all liquidity pools' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.pairsService.findAll(+page, +limit);
  }

  @Get(':contractId')
  @ApiOperation({ summary: 'Get pool by contract ID' })
  findOne(@Param('contractId') contractId: string) {
    return this.pairsService.findOne(contractId);
  }
}
