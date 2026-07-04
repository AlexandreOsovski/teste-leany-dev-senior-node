import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  context?: Record<string, any>;

  @Prop()
  service?: string;

  @Prop()
  traceId?: string;

  @Prop({ type: Date, expires: '30d' })
  createdAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
