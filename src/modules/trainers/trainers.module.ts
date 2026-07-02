import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainersController } from './trainers.controller';
import { TrainerService } from '../../core/services/trainer.service';
import { TrainerTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/trainer.typeorm-entity';
import { TrainerRepository } from '../../infrastructure/database/typeorm/repositories/trainer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TrainerTypeOrmEntity])],
  controllers: [TrainersController],
  providers: [
    TrainerService,
    {
      provide: 'ITrainerRepository',
      useClass: TrainerRepository,
    },
  ],
  exports: [TrainerService],
})
export class TrainersModule {}
