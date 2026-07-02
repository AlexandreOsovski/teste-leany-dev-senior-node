import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'pokemon_admin',
  password: process.env.DB_PASSWORD || 'pokemon_pass',
  database: process.env.DB_DATABASE || 'pokemon_db',
  entities: ['dist/**/*.typeorm-entity{.ts,.js}'],
  migrations: ['dist/infrastructure/database/typeorm/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  namingStrategy: 'snake_case',
}));
