import { v4 as uuidv4 } from 'uuid';

export enum LogAcaoEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum LogStatusEnum {
  SUCESSO = 'SUCESSO',
  ERRO = 'ERRO',
}

export interface UseCaseLogProps {
  id?: string;
  useCase: string;
  controller: string;
  acao: LogAcaoEnum;
  status: LogStatusEnum;
  payload?: string;
  response?: string;
  mensagem?: string;
  ip?: string;
  executionTimeMs: number;
  createdAt?: Date;
}

export class UseCaseLog {
  id: string;
  useCase: string;
  controller: string;
  acao: LogAcaoEnum;
  status: LogStatusEnum;
  payload?: string;
  response?: string;
  mensagem?: string;
  ip?: string;
  executionTimeMs: number;
  createdAt: Date;

  constructor(props: UseCaseLogProps) {
    this.id = props.id ?? uuidv4();
    this.useCase = props.useCase;
    this.controller = props.controller;
    this.acao = props.acao;
    this.status = props.status;
    this.payload = props.payload;
    this.response = props.response;
    this.mensagem = props.mensagem;
    this.ip = props.ip;
    this.executionTimeMs = props.executionTimeMs;
    this.createdAt = props.createdAt ?? new Date();
  }
}
