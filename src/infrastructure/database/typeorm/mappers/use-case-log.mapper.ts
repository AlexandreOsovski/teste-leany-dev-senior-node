import { UseCaseLog } from '../../../../core/domain/entities/use-case-log.entity';
import { UseCaseLogModel } from '../entities/use-case-log-entity';

export class UseCaseLogMapper {
  static toModel(domain: UseCaseLog): UseCaseLogModel {
    const model = new UseCaseLogModel();
    model.id = domain.id;
    model.useCase = domain.useCase;
    model.controller = domain.controller;
    model.acao = domain.acao;
    model.status = domain.status;
    model.payload = domain.payload ?? '';
    model.response = domain.response ?? '';
    model.mensagem = domain.mensagem ?? '';
    model.ip = domain.ip ?? '';
    model.executionTimeMs = domain.executionTimeMs;
    model.createdAt = domain.createdAt;

    return model;
  }

  static toDomain(model: UseCaseLogModel): UseCaseLog {
    return new UseCaseLog({
      id: model.id,
      useCase: model.useCase,
      controller: model.controller,
      acao: model.acao,
      status: model.status,
      payload: model.payload,
      response: model.response,
      mensagem: model.mensagem,
      ip: model.ip,
      executionTimeMs: model.executionTimeMs,
      createdAt: model.createdAt,
    });
  }
}
