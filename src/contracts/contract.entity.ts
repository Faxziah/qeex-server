import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  chain_id: number;

  @Column({ length: 100 })
  address: string;

  @Column()
  created_at: Date;
}
