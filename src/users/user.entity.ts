import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
