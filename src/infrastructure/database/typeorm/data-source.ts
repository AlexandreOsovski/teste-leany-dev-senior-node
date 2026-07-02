import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'pokemon_admin'),
  password: configService.get('DB_PASSWORD', 'pokemon_pass'),
  database: configService.get('DB_DATABASE', 'pokemon_db'),
  entities: ['src/**/*.typeorm-entity{.ts,.js}'],
  migrations: ['src/infrastructure/database/typeorm/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
