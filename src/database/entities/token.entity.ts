import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, Index,
} from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  address: string;

  @Column()
  symbol: string;

  @Column()
  name: string;

  @Column({ default: 7 })
  decimals: number;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  priceUsd: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  volume24h: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  tvl: string;

  @Column({ default: false })
  isWhitelisted: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
