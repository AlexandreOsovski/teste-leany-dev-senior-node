import { LogService } from '@infrastructure/database/mongoDB/services/log.service';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logService.create('info', `${method} ${url}`, {
            statusCode: context.switchToHttp().getResponse().statusCode,
            duration: `${Date.now() - now}ms`,
            body: JSON.stringify(data).substring(0, 1000),
          });
        },
        error: (error) => {
          this.logService.create('error', `${method} ${url}`, {
            statusCode: error.status,
            message: error.message,
            duration: `${Date.now() - now}ms`,
          });
        },
      }),
    );
  }
}
