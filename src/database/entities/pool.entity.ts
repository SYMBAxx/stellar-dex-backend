import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, Index,
} from 'typeorm';

@Entity('pools')
export class Pool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  contractId: string;

  @Column()
  token0Address: string;

  @Column()
  token1Address: string;

  @Column()
  token0Symbol: string;

  @Column()
  token1Symbol: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  reserve0: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  reserve1: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  totalSupply: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  tvlUsd: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  volume24h: string;

  @Column({ type: 'numeric', precision: 10, scale: 4, default: '0.3' })
  feePercent: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'bigint', default: 0 })
  lastIndexedLedger: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
