import { Module, Global, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('mongodb.uri');
        const dbName = configService.get<string>('mongodb.database');

        console.log('MongoDB Config:', { uri, dbName });

        return {
          uri: uri || 'mongodb://mongodb:27017/pokemon_logs',
          dbName: dbName || 'pokemon_logs',
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class MongoDBModule {}
