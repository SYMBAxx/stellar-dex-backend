import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TokensService } from './tokens.service';

@ApiTags('tokens')
@Controller('api/v1/tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  @ApiOperation({ summary: 'List tokens with optional search' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.tokensService.findAll(search, +page, +limit);
  }

  @Get(':address')
  @ApiOperation({ summary: 'Get token by contract address' })
  findOne(@Param('address') address: string) {
    return this.tokensService.findOne(address);
  }
}
