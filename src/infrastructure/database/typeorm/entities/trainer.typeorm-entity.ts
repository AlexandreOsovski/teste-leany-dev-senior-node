import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { AddressTypeOrmEntity } from './address.typeorm-entity';
import { TeamTypeOrmEntity } from './team.typeorm-entity';

@Entity('trainers')
export class TrainerTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @OneToOne(() => AddressTypeOrmEntity, (address) => address.trainer, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'address_id' })
  address?: AddressTypeOrmEntity;

  @OneToMany(() => TeamTypeOrmEntity, (team) => team.trainer)
  teams: TeamTypeOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
