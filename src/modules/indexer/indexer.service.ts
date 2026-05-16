import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SorobanRpc, Networks } from '@stellar/stellar-sdk';
import { EventProcessorService } from './event-processor.service';

interface IndexerCursor {
  ledger: number;
}

@Injectable()
export class IndexerService implements OnModuleInit {
  private readonly logger = new Logger(IndexerService.name);
  private rpc: SorobanRpc.Server;
  private cursor: IndexerCursor = { ledger: 0 };
  private isRunning = false;

  constructor(
    private readonly config: ConfigService,
    private readonly eventProcessor: EventProcessorService,
  ) {}

  onModuleInit() {
    const rpcUrl = this.config.get<string>('app.stellarRpc')!;
    this.rpc = new SorobanRpc.Server(rpcUrl, { allowHttp: rpcUrl.startsWith('http://') });
    this.logger.log(`Indexer initialized — RPC: ${rpcUrl}`);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async poll() {
    if (this.isRunning) return;
    this.isRunning = true;
    try {
      await this.indexNewLedgers();
    } catch (err) {
      this.logger.error('Indexer poll error', err);
    } finally {
      this.isRunning = false;
    }
  }

  private async indexNewLedgers() {
    const latestLedger = await this.rpc.getLatestLedger();
    const latest = latestLedger.sequence;

    if (this.cursor.ledger === 0) {
      // Start from recent ledgers on first run
      this.cursor.ledger = Math.max(latest - 100, 1);
    }

    if (this.cursor.ledger >= latest) return;

    const factoryId = this.config.get<string>('app.factoryContractId');
    if (!factoryId) return;

    // Fetch contract events from Soroban RPC
    const response = await this.rpc.getEvents({
      startLedger: this.cursor.ledger,
      filters: [
        {
          type: 'contract',
          contractIds: [factoryId],
        },
      ],
      limit: 200,
    });

    for (const event of response.events) {
      await this.eventProcessor.process(event);
    }

    this.cursor.ledger = latest;
    this.logger.debug(`Indexed up to ledger ${latest}, processed ${response.events.length} events`);
  }

  getCursor(): IndexerCursor {
    return this.cursor;
  }
}
