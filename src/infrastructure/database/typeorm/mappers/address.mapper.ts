import { Address } from '../../../../core/domain/entities/address.entity';
import { AddressTypeOrmEntity } from '../entities/address.typeorm-entity';

export class AddressMapper {
  static toDomain(entity: AddressTypeOrmEntity): Address {
    return new Address({
      id: entity.id,
      cep: entity.cep,
      logradouro: entity.logradouro,
      bairro: entity.bairro,
      localidade: entity.localidade,
      uf: entity.uf,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(domain: Address): AddressTypeOrmEntity {
    const entity = new AddressTypeOrmEntity();
    entity.id = domain.getId();
    entity.cep = domain.getCep().getValue();
    entity.logradouro = domain.getLogradouro();
    entity.bairro = domain.getBairro();
    entity.localidade = domain.getLocalidade();
    entity.uf = domain.getUf();
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();

    return entity;
  }
}
