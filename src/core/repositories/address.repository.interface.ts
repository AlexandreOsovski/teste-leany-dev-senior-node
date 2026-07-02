import { Address } from '../domain/entities/address.entity';

export interface IAddressRepository {
  findById(id: string): Promise<Address | null>;
  findByCep(cep: string): Promise<Address | null>;
  create(address: Address): Promise<Address>;
  update(address: Address): Promise<Address>;
}
