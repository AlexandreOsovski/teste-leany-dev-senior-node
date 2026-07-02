import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { TrainerTypeOrmEntity } from './trainer.typeorm-entity';

@Entity('addresses')
export class AddressTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 9 })
  cep: string;

  @Column({ type: 'varchar', length: 200 })
  logradouro: string;

  @Column({ type: 'varchar', length: 100 })
  bairro: string;

  @Column({ type: 'varchar', length: 100 })
  localidade: string;

  @Column({ type: 'varchar', length: 2 })
  uf: string;

  @OneToOne(() => TrainerTypeOrmEntity, (trainer) => trainer.address)
  trainer: TrainerTypeOrmEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
