import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;

      // Map domain exceptions to HTTP status codes
      switch (exception.constructor.name) {
        case 'TrainerNotFoundException':
        case 'PokemonNotFoundException':
          status = HttpStatus.NOT_FOUND;
          break;
        case 'TeamFullException':
        case 'DuplicatePokemonException':
        case 'InvalidPokemonLevelException':
          status = HttpStatus.UNPROCESSABLE_ENTITY;
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
      }
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message,
      error: error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
