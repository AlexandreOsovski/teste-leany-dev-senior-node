import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainersController } from './trainers.controller';
import { TrainerService } from '../../core/services/trainer.service';
import { TrainerTypeOrmEntity } from '../../infrastructure/database/typeorm/entities/trainer.typeorm-entity';
import { TrainerRepository } from '../../infrastructure/database/typeorm/repositories/trainer.repository';
import { CreateTrainerUseCase } from '../../core/use-cases/trainers/create-trainer.use-case';
import { GetTrainerUseCase } from '../../core/use-cases/trainers/get-trainer.use-case';
import { ListTrainersUseCase } from '../../core/use-cases/trainers/list-trainers.use-case';
import { UpdateTrainerUseCase } from '../../core/use-cases/trainers/update-trainer.use-case';
import { DeleteTrainerUseCase } from '../../core/use-cases/trainers/delete-trainer.use-case';
import { RestoreTrainerUseCase } from '../../core/use-cases/trainers/restore-trainer.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([TrainerTypeOrmEntity])],
  controllers: [TrainersController],
  providers: [
    TrainerService,
    CreateTrainerUseCase,
    GetTrainerUseCase,
    ListTrainersUseCase,
    UpdateTrainerUseCase,
    DeleteTrainerUseCase,
    RestoreTrainerUseCase,
    {
      provide: 'ITrainerRepository',
      useClass: TrainerRepository,
    },
  ],
  exports: [TrainerService],
})
export class TrainersModule {}
