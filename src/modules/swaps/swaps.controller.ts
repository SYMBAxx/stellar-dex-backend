import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SwapsService } from './swaps.service';

@ApiTags('swaps')
@Controller('api/v1/swaps')
export class SwapsController {
  constructor(private readonly swapsService: SwapsService) {}

  @Get()
  @ApiOperation({ summary: 'List swaps with optional pool filter' })
  @ApiQuery({ name: 'poolId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('poolId') poolId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.swapsService.findAll(poolId, +page, +limit);
  }

  @Get('address/:address')
  @ApiOperation({ summary: 'Get swaps by wallet address' })
  findByAddress(
    @Param('address') address: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.swapsService.findByAddress(address, +page, +limit);
  }
}
