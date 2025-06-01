import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Contract } from '../../contracts/entities/contract.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain_id: number;

  @Column({ length: 100 })
  address: string;

  @Column()
  created_at: Date;

  @OneToMany(() => Contract, (contract) => contract.user)
  contracts: Contract[];
}
