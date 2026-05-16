import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  contractId: string;

  @Column()
  lpTokenAddress: string;

  @Column()
  rewardTokenAddress: string;

  @Column()
  rewardTokenSymbol: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  totalStaked: string;

  @Column({ type: 'numeric', precision: 36, scale: 18, default: '0' })
  rewardPerSecond: string;

  @Column({ type: 'numeric', precision: 10, scale: 4, default: '0' })
  apr: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
