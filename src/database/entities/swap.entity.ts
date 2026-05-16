import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index,
} from 'typeorm';

@Entity('swaps')
export class Swap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  txHash: string;

  @Index()
  @Column()
  poolId: string;

  @Index()
  @Column()
  sender: string;

  @Column()
  tokenIn: string;

  @Column()
  tokenOut: string;

  @Column({ type: 'numeric', precision: 36, scale: 18 })
  amountIn: string;

  @Column({ type: 'numeric', precision: 36, scale: 18 })
  amountOut: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  amountInUsd: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  amountOutUsd: string;

  @Column({ type: 'numeric', precision: 10, scale: 4, default: '0' })
  priceImpact: string;

  @Column({ type: 'bigint' })
  ledger: number;

  @Column({ type: 'bigint' })
  timestamp: number;

  @CreateDateColumn()
  createdAt: Date;
}
