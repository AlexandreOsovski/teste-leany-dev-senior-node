export interface CepApiResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export interface ICepApi {
  getAddressByCep(cep: string): Promise<CepApiResponse>;
  validateCep(cep: string): boolean;
}
