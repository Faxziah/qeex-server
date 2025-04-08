import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContractStatus } from '../interface/IContract';
import { User } from '../users/user.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.contracts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  chain_id: number;

  @Column()
  block_number: number;

  @Column()
  status: ContractStatus;

  @Column({ length: 100 })
  address: string;

  @Column()
  created_at: Date;

  @Column()
  pay_tx_hash: string;
}
