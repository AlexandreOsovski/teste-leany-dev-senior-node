import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TrainersModule } from './modules/trainers/trainers.module';
import { TeamsModule } from './modules/teams/teams.module';
import { PokemonModule } from './modules/pokemon/pokemon.module';
import { CepModule } from './modules/cep/cep.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';
import databaseConfig from './config/database/database.config';
import redisConfig from './config/redis.config';
import { MongoDBModule } from '@modules/infrastructure/database/mongoDB/mongodb.module';
import { MongoDBLogsModule } from '@modules/infrastructure/database/mongoDB/mongodb-logs.module';
import mongodbConfig from '@config/database/mongodb.config';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, mongodbConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TrainersModule,
    TeamsModule,
    PokemonModule,
    CepModule,
    MongoDBModule,
    MongoDBLogsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
