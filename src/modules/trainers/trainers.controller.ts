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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TrainerService } from '../../core/services/trainer.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@ApiTags('Trainers')
@Controller('api/v1/trainers')
export class TrainersController {
  constructor(private readonly trainerService: TrainerService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo treinador' })
  @ApiResponse({ status: 201, description: 'Treinador criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createTrainerDto: CreateTrainerDto) {
    return this.trainerService.createTrainer(createTrainerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar treinadores' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de treinadores' })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.trainerService.getAllTrainers({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar treinador por ID' })
  @ApiParam({ name: 'id', description: 'ID do treinador' })
  @ApiResponse({ status: 200, description: 'Treinador encontrado' })
  @ApiResponse({ status: 404, description: 'Treinador não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.trainerService.getTrainerById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar treinador' })
  @ApiParam({ name: 'id', description: 'ID do treinador' })
  @ApiResponse({ status: 200, description: 'Treinador atualizado' })
  @ApiResponse({ status: 404, description: 'Treinador não encontrado' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  async update(
    @Param('id') id: string,
    @Body() updateTrainerDto: UpdateTrainerDto,
  ) {
    return this.trainerService.updateTrainer(id, updateTrainerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete do treinador' })
  @ApiParam({ name: 'id', description: 'ID do treinador' })
  @ApiResponse({ status: 204, description: 'Treinador desativado' })
  @ApiResponse({ status: 404, description: 'Treinador não encontrado' })
  async remove(@Param('id') id: string) {
    await this.trainerService.softDeleteTrainer(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar treinador' })
  @ApiParam({ name: 'id', description: 'ID do treinador' })
  @ApiResponse({ status: 200, description: 'Treinador restaurado' })
  @ApiResponse({ status: 404, description: 'Treinador não encontrado' })
  async restore(@Param('id') id: string) {
    return this.trainerService.restoreTrainer(id);
  }

  // @Patch(':id/address')
  // @ApiOperation({ summary: 'Atualizar endereço via CEP' })
  // @ApiParam({ name: 'id', description: 'ID do treinador' })
  // @ApiResponse({ status: 200, description: 'Endereço atualizado' })
  // @ApiResponse({ status: 404, description: 'Treinador ou CEP não encontrado' })
  // async updateAddress(@Param('id') id: string, @Body('cep') cep: string) {
  //   return { message: 'Endpoint em implementação' };
  // }
}
