import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MonitoringController } from './monitoring/monitoring.controller';
import {
  Log,
  LogSchema,
} from '@infrastructure/database/mongoDB/schemas/log.schema';
import { LogService } from '@infrastructure/database/mongoDB/services/log.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  controllers: [MonitoringController],
  providers: [LogService],
  exports: [LogService],
})
export class MongoDBLogsModule {}
