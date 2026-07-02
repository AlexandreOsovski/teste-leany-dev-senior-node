import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTrainerUseCase } from '../../core/use-cases/trainers/create-trainer.use-case';
import { GetTrainerUseCase } from '../../core/use-cases/trainers/get-trainer.use-case';
import { ListTrainersUseCase } from '../../core/use-cases/trainers/list-trainers.use-case';
import { UpdateTrainerUseCase } from '../../core/use-cases/trainers/update-trainer.use-case';
import { DeleteTrainerUseCase } from '../../core/use-cases/trainers/delete-trainer.use-case';
import { RestoreTrainerUseCase } from '../../core/use-cases/trainers/restore-trainer.use-case';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@ApiTags('Trainers')
@Controller('trainers')
export class TrainersController {
  constructor(
    private readonly createTrainerUseCase: CreateTrainerUseCase,
    private readonly getTrainerUseCase: GetTrainerUseCase,
    private readonly listTrainersUseCase: ListTrainersUseCase,
    private readonly updateTrainerUseCase: UpdateTrainerUseCase,
    private readonly deleteTrainerUseCase: DeleteTrainerUseCase,
    private readonly restoreTrainerUseCase: RestoreTrainerUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo treinador' })
  @ApiResponse({ status: 201, description: 'Treinador criado com sucesso' })
  async create(@Body() createTrainerDto: CreateTrainerDto) {
    return this.createTrainerUseCase.execute(createTrainerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar treinadores' })
  @ApiResponse({ status: 200, description: 'Lista de treinadores' })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.listTrainersUseCase.execute({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar treinador por ID' })
  @ApiResponse({ status: 200, description: 'Treinador encontrado' })
  @ApiResponse({ status: 404, description: 'Treinador não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.getTrainerUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar treinador' })
  @ApiResponse({ status: 200, description: 'Treinador atualizado' })
  async update(
    @Param('id') id: string,
    @Body() updateTrainerDto: UpdateTrainerDto,
  ) {
    return this.updateTrainerUseCase.execute({ id, ...updateTrainerDto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete do treinador' })
  @ApiResponse({ status: 204, description: 'Treinador desativado' })
  async remove(@Param('id') id: string) {
    await this.deleteTrainerUseCase.execute(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar treinador' })
  @ApiResponse({ status: 200, description: 'Treinador restaurado' })
  async restore(@Param('id') id: string) {
    return this.restoreTrainerUseCase.execute(id);
  }
}
