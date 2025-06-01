import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContractStatus } from '../../interface/IContract';
import { User } from '../../users/entities/user.entity';
import { ContractType } from '../../contract-types/entities/contract-type.entity';

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
  contract_type_id: number;

  @ManyToOne(() => ContractType)
  @JoinColumn({ name: 'contract_type_id' })
  contractType: ContractType;

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
  payment_transaction_hash: string;
}
