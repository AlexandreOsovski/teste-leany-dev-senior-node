import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import {
  LogAcaoEnum,
  LogStatusEnum,
} from '../../../../core/domain/entities/use-case-log.entity';

@Entity({ name: 'use_case_logs' })
export class UseCaseLogModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'use_case', type: 'varchar', length: 200 })
  useCase: string;

  @Column({ name: 'controller', type: 'varchar', length: 200 })
  controller: string;

  @Column({ type: 'enum', enum: LogAcaoEnum }) // ✅ Usa o enum do domínio
  acao: LogAcaoEnum;

  @Column({ type: 'enum', enum: LogStatusEnum }) // ✅ Usa o enum do domínio
  status: LogStatusEnum;

  @Column({ type: 'text', nullable: true })
  payload: string;

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({ type: 'text', nullable: true })
  mensagem: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip: string;

  @Column({ name: 'execution_time_ms', type: 'integer' })
  executionTimeMs: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
