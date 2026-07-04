import { LogService } from '@infrastructure/database/mongoDB/services/log.service';
import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';

@ApiTags('Monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly logService: LogService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Buscar logs com filtros opcionais' })
  @ApiQuery({ name: 'level', required: false, enum: ['info', 'warn', 'error'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'Data inicial (ISO format)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'Data final (ISO format)',
  })
  async getLogs(
    @Query('level') level?: string,
    @Query('limit') limit?: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    try {
      const filters: any = {};

      if (level) {
        filters.level = level;
      }

      if (from || to) {
        filters.createdAt = {};
        if (from) {
          const fromDate = new Date(from);
          if (isNaN(fromDate.getTime())) {
            throw new HttpException(
              'Invalid "from" date format',
              HttpStatus.BAD_REQUEST,
            );
          }
          filters.createdAt.$gte = fromDate;
        }
        if (to) {
          const toDate = new Date(to);
          if (isNaN(toDate.getTime())) {
            throw new HttpException(
              'Invalid "to" date format',
              HttpStatus.BAD_REQUEST,
            );
          }
          filters.createdAt.$lte = toDate;
        }
      }

      const logs = await this.logService.findAll(filters);

      if (limit && limit > 0) {
        return logs.slice(0, limit);
      }

      return logs;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error fetching logs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas dos logs' })
  async getStats() {
    return this.logService.getStats();
  }

  @Get('health')
  @ApiOperation({ summary: 'Verificar saúde do MongoDB' })
  async healthCheck() {
    try {
      // Testa a conexão com MongoDB
      await this.logService.create('info', 'Health check');
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        mongodb: 'connected',
        service: 'pokemon-trainers-api',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        mongodb: 'disconnected',
        error: error.message,
      };
    }
  }
}
