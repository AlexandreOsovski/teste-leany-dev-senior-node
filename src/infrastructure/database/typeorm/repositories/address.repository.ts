import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAddressRepository } from '../../../../core/repositories/address.repository.interface';
import { Address } from '../../../../core/domain/entities/address.entity';
import { AddressTypeOrmEntity } from '../entities/address.typeorm-entity';
import { AddressMapper } from '../mappers/address.mapper';

@Injectable()
export class AddressRepository implements IAddressRepository {
  constructor(
    @InjectRepository(AddressTypeOrmEntity)
    private readonly repository: Repository<AddressTypeOrmEntity>,
  ) {}

  async findById(id: string): Promise<Address | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? AddressMapper.toDomain(entity) : null;
  }

  async findByCep(cep: string): Promise<Address | null> {
    const entity = await this.repository.findOne({
      where: { cep },
    });

    return entity ? AddressMapper.toDomain(entity) : null;
  }

  async create(address: Address): Promise<Address> {
    const entity = AddressMapper.toPersistence(address);
    const savedEntity = await this.repository.save(entity);
    return AddressMapper.toDomain(savedEntity);
  }

  async update(address: Address): Promise<Address> {
    const entity = AddressMapper.toPersistence(address);
    await this.repository.save(entity);
    return address;
  }
}
