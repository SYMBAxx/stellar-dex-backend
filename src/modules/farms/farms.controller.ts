import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FarmsService } from './farms.service';

@ApiTags('farms')
@Controller('api/v1/farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Get()
  @ApiOperation({ summary: 'List all active farms' })
  findAll() {
    return this.farmsService.findAll();
  }

  @Get(':contractId')
  @ApiOperation({ summary: 'Get farm by contract ID' })
  findOne(@Param('contractId') contractId: string) {
    return this.farmsService.findOne(contractId);
  }
}
