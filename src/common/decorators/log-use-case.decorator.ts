import { Logger } from '@nestjs/common';
import {
  UseCaseLog,
  LogAcaoEnum,
  LogStatusEnum,
} from '../../core/domain/entities/use-case-log.entity';
import { GLOBAL_MODULE_REF } from 'src/main';

function inferHttpAction(method: string): LogAcaoEnum {
  const lower = method?.toLowerCase() ?? '';

  if (lower.startsWith('get')) return LogAcaoEnum.GET;
  if (lower.startsWith('create') || lower.startsWith('post'))
    return LogAcaoEnum.POST;
  if (lower.startsWith('update') || lower.startsWith('put'))
    return LogAcaoEnum.PUT;
  if (lower.startsWith('patch')) return LogAcaoEnum.PATCH;
  if (lower.startsWith('delete') || lower.startsWith('remove'))
    return LogAcaoEnum.DELETE;

  return LogAcaoEnum.GET;
}

function safeSerialize(data: any): string {
  try {
    return JSON.stringify(data);
  } catch {
    return '"[CIRCULAR]"';
  }
}

export function LogUseCase() {
  const logger = new Logger('UseCaseLog');

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();

      // Pega o Request (igual seu modelo)
      const req = args.find(
        (a) => a && (a.headers || a.ip || a.socket || a.raw?.headers),
      );

      // Remove request dos args pra pegar só o payload
      const cleanArgs = args.filter(
        (a) => !(a && (a.headers || a.ip || a.socket || a.raw?.headers)),
      );

      const payload = safeSerialize(cleanArgs);
      const ip =
        req?.ip ||
        req?.headers?.['x-forwarded-for'] ||
        req?.socket?.remoteAddress ||
        req?.raw?.socket?.remoteAddress ||
        'IP NAO ENCONTRADO';

      const httpMethod = req?.method || 'POST';

      try {
        const result = await original.apply(this, args);
        const executionTimeMs = Date.now() - startTime;

        try {
          const logRepo = GLOBAL_MODULE_REF?.get('UseCaseLogRepository', {
            strict: false,
          });

          if (logRepo) {
            await logRepo.insert(
              new UseCaseLog({
                useCase: propertyKey,
                controller: target.constructor.name,
                acao: inferHttpAction(httpMethod),
                status: LogStatusEnum.SUCESSO,
                payload,
                response: safeSerialize(result),
                mensagem: 'OK',
                ip,
                executionTimeMs,
              }),
            );
          }
        } catch (err) {
          logger.error(`Erro ao registrar log: ${err?.message}`);
        }

        return result;
      } catch (error) {
        const executionTimeMs = Date.now() - startTime;

        try {
          const logRepo = GLOBAL_MODULE_REF?.get('UseCaseLogRepository', {
            strict: false,
          });

          if (logRepo) {
            await logRepo.insert(
              new UseCaseLog({
                useCase: propertyKey,
                controller: target.constructor.name,
                acao: inferHttpAction(httpMethod),
                status: LogStatusEnum.ERRO,
                payload,
                response: safeSerialize({ error: error?.message }),
                mensagem: error?.message ?? 'Erro desconhecido',
                ip,
                executionTimeMs,
              }),
            );
          }
        } catch (err) {
          logger.error(`Erro ao registrar log de erro: ${err?.message}`);
        }

        throw error;
      }
    };

    return descriptor;
  };
}
