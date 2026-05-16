import { Injectable, Logger } from '@nestjs/common';
import { PairsService } from '../pairs/pairs.service';
import { SwapsService } from '../swaps/swaps.service';

@Injectable()
export class EventProcessorService {
  private readonly logger = new Logger(EventProcessorService.name);

  constructor(
    private readonly pairsService: PairsService,
    private readonly swapsService: SwapsService,
  ) {}

  async process(event: any): Promise<void> {
    try {
      const topic = event.topic?.[0]?.value ?? '';

      switch (topic) {
        case 'PairCreated':
          await this.handlePairCreated(event);
          break;
        case 'swap':
          await this.handleSwap(event);
          break;
        case 'mint':
          await this.handleMint(event);
          break;
        case 'burn':
          await this.handleBurn(event);
          break;
        default:
          // Unknown event — skip
          break;
      }
    } catch (err) {
      this.logger.error(`Failed to process event: ${err}`);
    }
  }

  private async handlePairCreated(event: any) {
    const [token0, token1, pairAddress] = event.value?.value ?? [];
    if (!pairAddress) return;

    await this.pairsService.upsert({
      contractId: pairAddress,
      token0Address: token0,
      token1Address: token1,
      token0Symbol: 'UNKNOWN',
      token1Symbol: 'UNKNOWN',
      isActive: true,
    });

    this.logger.log(`New pair indexed: ${pairAddress}`);
  }

  private async handleSwap(event: any) {
    const data = event.value?.value ?? {};
    await this.swapsService.save({
      txHash: event.txHash,
      poolId: event.contractId,
      sender: data.sender ?? '',
      tokenIn: data.token_in ?? '',
      tokenOut: data.token_out ?? '',
      amountIn: String(data.amount_in ?? 0),
      amountOut: String(data.amount_out ?? 0),
      ledger: event.ledger,
      timestamp: event.ledgerClosedAt
        ? Math.floor(new Date(event.ledgerClosedAt).getTime() / 1000)
        : 0,
    });
  }

  private async handleMint(event: any) {
    // Update pool reserves after liquidity add
    this.logger.debug(`Mint event on ${event.contractId}`);
  }

  private async handleBurn(event: any) {
    // Update pool reserves after liquidity remove
    this.logger.debug(`Burn event on ${event.contractId}`);
  }
}
