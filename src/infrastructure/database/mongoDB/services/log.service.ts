import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from '../schemas/log.schema';

@Injectable()
export class LogService {
  private readonly logger = new Logger(LogService.name);

  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async create(level: string, message: string, context?: any): Promise<Log> {
    const log = new this.logModel({
      level,
      message,
      context,
      service: 'pokemon-trainers-api',
      traceId: context?.traceId,
    });
    return log.save();
  }

  async findAll(filters?: any): Promise<Log[]> {
    return this.logModel
      .find(filters)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }

  async findByLevel(level: string): Promise<Log[]> {
    return this.logModel.find({ level }).sort({ createdAt: -1 }).exec();
  }

  async findByDateRange(start: Date, end: Date): Promise<Log[]> {
    return this.logModel
      .find({
        createdAt: { $gte: start, $lte: end },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getStats(): Promise<any> {
    try {
      const totalLogs = await this.logModel.countDocuments();
      const logsByLevel = await this.logModel.aggregate([
        { $group: { _id: '$level', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentLogs = await this.logModel.countDocuments({
        createdAt: { $gte: last24Hours },
      });

      const db = this.logModel.db;
      let databaseSize = 'N/A';
      let collections = 0;
      let indexes = 0;

      if (db?.db) {
        const dbStats = await db.db.stats();
        databaseSize = `${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`;
        collections = dbStats.collections;
        indexes = dbStats.indexes;
      }

      return {
        totalLogs,
        logsByLevel,
        recentLogs24h: recentLogs,
        databaseSize,
        collections,
        indexes,
      };
    } catch (error) {
      this.logger.error('Error getting log stats', error);
      return {
        totalLogs: 0,
        logsByLevel: [],
        recentLogs24h: 0,
        databaseSize: 'Error fetching stats',
        collections: 0,
        indexes: 0,
        error: error.message,
      };
    }
  }

  async cleanup(daysToKeep: number = 30): Promise<any> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    const result = await this.logModel.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    this.logger.log(
      `Cleaned up ${result.deletedCount} logs older than ${daysToKeep} days`,
    );
    return result;
  }
}
