import {
  Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn,
} from 'typeorm';

export type CandleInterval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

@Entity('candles')
@Index(['poolId', 'interval', 'openTime'], { unique: true })
export class Candle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  poolId: string;

  @Column()
  interval: CandleInterval;

  @Column({ type: 'bigint' })
  openTime: number;

  @Column({ type: 'bigint' })
  closeTime: number;

  @Column({ type: 'numeric', precision: 36, scale: 18 })
  open: string;

  @Column({ type: 'numeric', precision: 36, scale: 18 })
  high: string;

  @Column({ type: 'numeric', precision: 36, scale: 18 })
  low: string;

  @Column({ type: 'numeric', precision: 36, scale: 18 })
  close: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  volume: string;

  @CreateDateColumn()
  createdAt: Date;
}
