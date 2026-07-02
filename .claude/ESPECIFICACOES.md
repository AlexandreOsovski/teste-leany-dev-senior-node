# Pokémon Trainers API - Especificação do Projeto

## Descrição

API REST para gerenciamento de treinadores Pokémon, seus times e Pokémon, integrando com a **PokéAPI** para busca de dados de Pokémon e **ViaCEP** para consulta de endereços por CEP.

O projeto segue os princípios de **Clean Architecture**, com forte separação entre regras de negócio (domínio) e detalhes de implementação (framework, banco de dados, APIs externas), visando testabilidade, manutenibilidade e baixo acoplamento.

---

## Requisitos Técnicos

### Stack Obrigatória

| Item | Tecnologia | Observação |
|------|-----------|------------|
| Framework | NestJS 10+ | Estrutura modular, DI nativa |
| ORM | TypeORM 0.3+ | Exclusivamente — **não** utilizar Prisma, Sequelize, Knex ou outro |
| Banco de Dados | PostgreSQL 15 | Via Docker ou instância local |
| Containerização | Docker + Docker Compose | Ambiente reprodutível |
| Linguagem | TypeScript (strict mode) | `strict: true` no `tsconfig.json` |
| Validação | class-validator + class-transformer | DTOs de entrada validados |
| Documentação | Swagger/OpenAPI | Gerado via `@nestjs/swagger` |
| Testes | Jest | Unitários obrigatórios, e2e recomendados |

**Regra de exclusividade do ORM**: qualquer chamada SQL direta (`query runner` bruto) deve ser evitada; toda persistência passa pelo TypeORM (Repository ou QueryBuilder do próprio TypeORM).

### Arquitetura Exigida

Implementar **Clean Architecture** com as seguintes camadas:

```text
src/
├── core/                        # Regras de negócio (SEM dependências de framework)
│   ├── domain/                  # Entidades, Value Objects, Exceções
│   │   ├── entities/            # Entidades ricas com comportamento de negócio
│   │   ├── value-objects/       # Objetos de valor imutáveis
│   │   ├── enums/               # Enumerações
│   │   └── exceptions/          # Exceções de domínio
│   ├── services/                # Serviços de domínio (orquestração)
│   ├── use-cases/               # Casos de uso (um por ação do controller)
│   ├── repositories/            # Interfaces/contratos dos repositórios
│   └── integrations/            # Contratos de APIs externas
│
├── modules/                     # Módulos NestJS
│   ├── trainers/                # Controller + DTOs
│   ├── teams/                   # Controller + DTOs
│   ├── pokemon/                 # Controller + DTOs
│   └── cep/                     # Controller + DTOs
│
├── infrastructure/              # Implementações concretas
│   ├── database/typeorm/        # Entidades, Repositórios, Mappers
│   └── integrations/            # PokéAPI, ViaCEP
│
├── common/                      # Utilitários compartilhados
│   ├── decorators/              # Decorators customizados
│   ├── filters/                 # Filtros de exceção
│   ├── interceptors/            # Interceptors
│   └── pipes/                   # Pipes de validação
│
└── config/                      # Configurações
```

**Regra de dependência**: `core/domain` não pode importar nada de `infrastructure`, `modules` ou de bibliotecas do NestJS (`@nestjs/*`). Apenas `use-cases` e `services` do core podem depender de interfaces (nunca de implementações concretas).

### Padrões de Projeto Obrigatórios

1. **Repository Pattern**
   Interfaces (ex: `ITrainerRepository`) ficam em `core/repositories/`. Implementações concretas (ex: `TypeOrmTrainerRepository`) ficam em `infrastructure/database/typeorm/repositories/`. O domínio nunca conhece o TypeORM diretamente.

2. **Use Case Pattern**
   Cada ação exposta por um controller corresponde a exatamente uma classe de UseCase (ex: `CreateTrainerUseCase`, `DeleteTeamUseCase`). Um UseCase tem um único método público (`execute()`), recebe dependências via construtor e não conhece HTTP (sem `Request`/`Response`).

3. **Mapper Pattern**
   Classes dedicadas (ex: `TrainerMapper`) convertem entre a entidade de domínio (`Trainer`) e a entidade TypeORM (`TrainerOrmEntity`), e também entre entidade de domínio e DTO de resposta.

4. **DTO Pattern**
   DTOs de entrada (`CreateTrainerDto`, `UpdateTeamDto`, etc.) usam decorators do `class-validator`. DTOs de saída (`TrainerResponseDto`) evitam vazar campos internos (ex: nunca retornar `deletedAt` de treinadores ativos).

5. **Value Object Pattern**
   `Cep` e `PokemonType` são objetos de valor imutáveis, com validação de formato no próprio construtor e método `equals()` para comparação estrutural.

6. **Injeção de Dependência com Tokens**
   Interfaces são injetadas via token string (ex: `@Inject('ITrainerRepository')`), configurado no módulo NestJS (`providers: [{ provide: 'ITrainerRepository', useClass: TypeOrmTrainerRepository }]`). Isso permite trocar a implementação (ex: em testes, usar um repositório em memória) sem alterar o domínio.

---

## Regras de Negócio

### Treinador (Trainer)

- [ ] CRUD completo com **Soft Delete** — marcar `deletedAt`, nunca remover fisicamente a linha
- [ ] Email único no sistema — validar tanto na criação quanto na atualização (mesmo entre registros com soft delete aplicado, para evitar reaproveitar email de treinador "excluído")
- [ ] Um treinador pode ter múltiplos times (relação `OneToMany`)
- [ ] Endpoint específico para restaurar treinador: `PATCH /trainers/:id/restore`
- [ ] Ao aplicar soft delete, os times associados **devem ser preservados** (não usar CASCADE de exclusão física)
- [ ] Queries padrão (listagem, busca por ID) devem **excluir automaticamente** treinadores com `deletedAt` preenchido, a menos que explicitamente solicitado
- [ ] Nome obrigatório, entre 2 e 100 caracteres
- [ ] Vínculo opcional com endereço (via CEP consultado previamente)

**Validações de entrada (CreateTrainerDto / UpdateTrainerDto):**

| Campo | Regra |
|-------|-------|
| `name` | string, obrigatório, 2–100 caracteres |
| `email` | string, obrigatório, formato de email válido, único |
| `addressId` | UUID, opcional |

### Time (Team)

- [ ] Cada time pertence a um único treinador (`ManyToOne`)
- [ ] Nome do time obrigatório, 3–50 caracteres
- [ ] Relacionamento com Pokémon via entidade associativa `TeamPokemon`
- [ ] **Limite máximo de 5 Pokémon por time** — a 6ª tentativa de adição retorna `422 Unprocessable Entity` (`TeamFullException`)
- [ ] **Não permitir Pokémon duplicado no mesmo time** — constraint unique em `(team_id, pokemon_id)`, violação retorna `422` (`DuplicatePokemonException`)
- [ ] Ao excluir um time, remover todas as associações `TeamPokemon` via `CASCADE`
- [ ] Quando o treinador sofre soft delete, os times permanecem intactos e consultáveis

### Pokémon

- [ ] Entidade persistida localmente com referência à PokéAPI via `externalId`
- [ ] Dados persistidos: `externalId`, `name`, `types[]`, `spriteUrl`, `lastSyncAt`
- [ ] **Estratégia de cache**: TTL de 24 horas, controlado por `lastSyncAt`
- [ ] Fluxo ao adicionar Pokémon a um time:
  1. Buscar primeiro no banco local (`pokemons` por `external_id`)
  2. Se não existir → buscar na PokéAPI, salvar localmente, então associar ao time
  3. Se existir mas `lastSyncAt` estiver com mais de 24h → atualizar da PokéAPI antes de associar
  4. Se existir e dentro do TTL → usar diretamente o registro local
- [ ] Endpoint para forçar sincronização manual de um Pokémon específico: `POST /pokemon/sync/:id`
- [ ] Endpoint para sincronização em massa: `POST /pokemon/sync-all` (corpo `{ "limit": 50 }`, limitado a no máximo 50 por chamada)
- [ ] Não permitir adicionar ao time um Pokémon inexistente na PokéAPI — retorna `404` (`PokemonNotFoundException`)

### TeamPokemon (Associação)

- [ ] Campos: `teamId`, `pokemonId`, `level` (inteiro, 1–100), `addedAt`
- [ ] Constraint unique em `(teamId, pokemonId)`
- [ ] `level` representa o nível do Pokémon **naquele time específico** — o mesmo Pokémon pode ter níveis diferentes em times diferentes
- [ ] Validação de `level` fora do intervalo 1–100 retorna `422` (`InvalidPokemonLevelException`)

---

## Integrações Externas

### 1. PokéAPI (pokeapi.co)

**Buscar por ID**
```
GET https://pokeapi.co/api/v2/pokemon/{id}
```

**Listar paginado**
```
GET https://pokeapi.co/api/v2/pokemon?offset={offset}&limit={limit}
```

**Mapeamento da resposta (payload da PokéAPI → domínio):**

| Campo PokéAPI | Campo no domínio |
|----------------|-------------------|
| `id` | `externalId` |
| `name` | `name` |
| `types[].type.name` | `types[]` (máx. 2) |
| `sprites.front_default` | `spriteUrl` |

**Tratamento de erros:**

| Cenário | Tratamento |
|---------|-----------|
| Pokémon não encontrado | PokéAPI retorna `404` → propagar `PokemonNotFoundException` (HTTP 404) |
| Timeout | Configurar timeout de 5 segundos por chamada |
| Rate limit / instabilidade | Retry automático — 3 tentativas com backoff exponencial (1s, 2s, 4s) |
| Serviço fora do ar após retries | Retornar `502 Bad Gateway` |

**Contrato**: criar interface `IPokemonApi` em `core/integrations/`, implementada por `PokeApiClient` em `infrastructure/integrations/`.

```typescript
export interface IPokemonApi {
  findById(externalId: number): Promise<ExternalPokemonData>;
  findAll(offset: number, limit: number): Promise<PaginatedExternalPokemon>;
}
```

### 2. ViaCEP (viacep.com.br)

**Consultar CEP**
```
GET https://viacep.com.br/ws/{cep}/json/
```

- Validar formato do CEP antes de chamar a API: aceitar `XXXXX-XXX` ou `XXXXXXXX` (8 dígitos)
- CEP em formato inválido retorna `400 Bad Request` **antes** de chamar a API externa
- CEP válido mas inexistente → ViaCEP retorna `{"erro": true}` → mapear para `404 Not Found`
- Endpoint: `GET /cep/:cep` — consulta **sob demanda**, sem persistência automática do endereço

**Contrato**: criar interface `ICepApi` em `core/integrations/`, implementada por `ViaCepClient` em `infrastructure/integrations/`.

```typescript
export interface ICepApi {
  findByCep(cep: string): Promise<AddressData>;
}
```

---

## Endpoints da API

Prefixo global: `/api/v1`

### Treinadores

| Método | Rota | Descrição | Body | Sucesso |
|--------|------|-----------|------|---------|
| POST | `/trainers` | Criar treinador | `{ name, email, addressId? }` | 201 |
| GET | `/trainers` | Listar (paginado) | Query: `?page=1&limit=10` | 200 |
| GET | `/trainers/:id` | Buscar por ID (inclui times) | — | 200 |
| PATCH | `/trainers/:id` | Atualizar dados | `{ name?, email?, addressId? }` | 200 |
| DELETE | `/trainers/:id` | Soft delete | — | 204 |
| PATCH | `/trainers/:id/restore` | Restaurar treinador excluído | — | 200 |

### Times

| Método | Rota | Descrição | Body | Sucesso |
|--------|------|-----------|------|---------|
| POST | `/trainers/:trainerId/teams` | Criar time | `{ name }` | 201 |
| GET | `/trainers/:trainerId/teams` | Listar times do treinador | — | 200 |
| GET | `/teams/:id` | Buscar time com Pokémon | — | 200 |
| PATCH | `/teams/:id` | Atualizar nome | `{ name }` | 200 |
| DELETE | `/teams/:id` | Excluir time (hard delete + cascade) | — | 204 |
| POST | `/teams/:id/pokemon` | Adicionar Pokémon | `{ externalId, level }` | 200 |
| DELETE | `/teams/:id/pokemon/:pokemonId` | Remover Pokémon do time | — | 204 |

### Pokémon

| Método | Rota | Descrição | Query/Body | Sucesso |
|--------|------|-----------|------------|---------|
| GET | `/pokemon` | Listar Pokémon locais | `?page=1&limit=10` | 200 |
| GET | `/pokemon/:id` | Buscar Pokémon local (UUID interno) | — | 200 |
| GET | `/pokemon/external` | Listar da PokéAPI (proxy paginado) | `?offset=0&limit=10` | 200 |
| GET | `/pokemon/external/:id` | Buscar na PokéAPI (por `externalId`) | — | 200 |
| POST | `/pokemon/sync/:id` | Sincronizar Pokémon específico | — | 200 |
| POST | `/pokemon/sync-all` | Sincronizar em massa | `{ limit: 50 }` | 200 |

### CEP

| Método | Rota | Descrição | Sucesso |
|--------|------|-----------|---------|
| GET | `/cep/:cep` | Consultar endereço por CEP | 200 |

---

## Modelagem do Banco de Dados

### Diagrama de Relacionamentos (resumo)

```text
trainers 1───N teams 1───N team_pokemons N───1 pokemons
trainers N───1 addresses (opcional)
```

### Tabelas

**trainers**

| Coluna | Tipo | Regras |
|--------|------|--------|
| `id` | UUID | PK, `default uuid_generate_v4()` |
| `name` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL |
| `address_id` | UUID | NULLABLE, FK → `addresses(id)` |
| `created_at` | TIMESTAMP | `default now()` |
| `updated_at` | TIMESTAMP | atualizado automaticamente |
| `deleted_at` | TIMESTAMP | NULLABLE — soft delete |

Índices: `UNIQUE INDEX` em `email`; índice parcial em `deleted_at IS NULL` para acelerar listagens padrão.

**addresses**

| Coluna | Tipo | Regras |
|--------|------|--------|
| `id` | UUID | PK |
| `cep` | VARCHAR(9) | NOT NULL |
| `logradouro` | VARCHAR(200) | |
| `bairro` | VARCHAR(100) | |
| `localidade` | VARCHAR(100) | |
| `uf` | VARCHAR(2) | |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

**teams**

| Coluna | Tipo | Regras |
|--------|------|--------|
| `id` | UUID | PK |
| `name` | VARCHAR(50) | NOT NULL |
| `trainer_id` | UUID | NOT NULL, FK → `trainers(id)` |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

**pokemons**

| Coluna | Tipo | Regras |
|--------|------|--------|
| `id` | UUID | PK |
| `external_id` | INTEGER | NOT NULL, `UNIQUE INDEX` |
| `name` | VARCHAR(100) | NOT NULL |
| `types` | TEXT[] | array de tipos |
| `sprite_url` | VARCHAR(500) | |
| `last_sync_at` | TIMESTAMP | NOT NULL — controle de TTL |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

**team_pokemons**

| Coluna | Tipo | Regras |
|--------|------|--------|
| `team_id` | UUID | PK composta, FK → `teams(id)`, `ON DELETE CASCADE` |
| `pokemon_id` | UUID | PK composta, FK → `pokemons(id)` |
| `level` | INTEGER | `DEFAULT 1`, CHECK `level BETWEEN 1 AND 100` |
| `added_at` | TIMESTAMP | |

Constraint: `UNIQUE (team_id, pokemon_id)`.

---

## Dependências

```json
{
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/typeorm": "^10.0.1",
    "@nestjs/swagger": "^7.2.0",
    "@nestjs/config": "^3.1.1",
    "typeorm": "^0.3.19",
    "pg": "^8.11.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "axios": "^1.6.5",
    "uuid": "^9.0.0",
    "swagger-ui-express": "^5.0.0",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@nestjs/testing": "^10.3.0",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.7",
    "@types/uuid": "^9.0.7",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "typescript": "^5.3.3"
  }
}
```

---

## Docker

### `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: pokemon_postgres
    environment:
      POSTGRES_DB: pokemon_db
      POSTGRES_USER: pokemon_admin
      POSTGRES_PASSWORD: pokemon_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - pokemon_network

  app:
    build: .
    container_name: pokemon_api
    ports:
      - "3000:3000"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: pokemon_admin
      DB_PASSWORD: pokemon_pass
      DB_DATABASE: pokemon_db
    depends_on:
      - postgres
    networks:
      - pokemon_network

volumes:
  postgres_data:

networks:
  pokemon_network:
    driver: bridge
```

> Nota: para garantir que o `app` só suba depois que o Postgres esteja realmente pronto para aceitar conexões (e não apenas com o container iniciado), recomenda-se adicionar um `healthcheck` ao serviço `postgres` e usar `depends_on: { postgres: { condition: service_healthy } }` no `app`.

---

## Testes

### Unitários (Jest)

- Testar **todos** os UseCases com mock dos serviços/repositórios (nunca acessar banco real em testes unitários)
- Usar `jest.spyOn` ao invés de referenciar métodos como `objeto.metodo` diretamente, para evitar o erro de lint `unbound-method`
- Cobrir tanto caminhos de sucesso quanto de erro para cada UseCase
- Mínimo de **56 testes** (pelo menos 1 por cenário relevante de cada caso de uso)

### Cobertura esperada por UseCase

| UseCase | Cenários mínimos |
|---------|-------------------|
| `CreateTrainerUseCase` | sucesso, email duplicado, sucesso ignorando CEP não informado |
| `GetTrainerUseCase` | sucesso, trainer não encontrado |
| `ListTrainersUseCase` | paginado, lista vazia, sem parâmetros de paginação |
| `UpdateTrainerUseCase` | atualizar nome, atualizar email, email duplicado |
| `DeleteTrainerUseCase` | soft delete aplicado com sucesso, trainer não encontrado |
| `RestoreTrainerUseCase` | restaurar com sucesso, trainer não encontrado |
| `CreateTeamUseCase` | sucesso, nome curto (< 3), nome longo (> 50) |
| `GetTeamUseCase` | sucesso, time com Pokémon, time não encontrado |
| `ListTrainerTeamsUseCase` | com times, lista vazia |
| `UpdateTeamUseCase` | sucesso, nome inválido, time não encontrado |
| `DeleteTeamUseCase` | sucesso (cascade), time não encontrado |
| `AddPokemonToTeamUseCase` | sucesso, time cheio (6º Pokémon), Pokémon duplicado |
| `RemovePokemonFromTeamUseCase` | sucesso, Pokémon não está no time, time não encontrado |
| `GetPokemonUseCase` | sucesso, Pokémon não encontrado |
| `ListPokemonsUseCase` | paginado, lista vazia |
| `SyncPokemonUseCase` | sucesso, erro na PokéAPI |
| `SyncAllPokemonsUseCase` | sucesso total, sucesso parcial (algumas falhas), lista vazia |
| `GetExternalPokemonUseCase` | sucesso, 404, timeout |
| `ListExternalPokemonsUseCase` | sucesso, lista vazia, erro da API externa |
| `GetAddressUseCase` | CEP válido, CEP em formato inválido, CEP não encontrado, ViaCEP offline |

### Testes end-to-end (recomendado, não obrigatório)

- Subir aplicação com banco de testes (via `docker-compose.test.yml` ou similar)
- Validar fluxo completo: criar treinador → criar time → adicionar Pokémon → buscar time
- Validar respostas HTTP reais (status code + shape do JSON)

---

## Critérios de Aceite

- [ ] Projeto sobe com `docker-compose up -d --build` sem erros
- [ ] Swagger acessível em `http://localhost:3000/api/docs`
- [ ] Criar treinador com email duplicado retorna `409 Conflict`
- [ ] Adicionar o 6º Pokémon a um time retorna `422 Unprocessable Entity`
- [ ] Adicionar Pokémon duplicado ao mesmo time retorna `422 Unprocessable Entity`
- [ ] Soft delete de treinador preserva os times associados (consultáveis normalmente)
- [ ] Endpoint `restore` traz o treinador de volta às listagens padrão
- [ ] Pokémon buscado pela primeira vez na PokéAPI é salvo automaticamente no banco local
- [ ] Nova busca do mesmo Pokémon dentro de 24h usa o cache local (sem nova chamada à PokéAPI)
- [ ] Consulta de CEP válido retorna endereço completo
- [ ] Todos os testes passam (`npm test`)
- [ ] Cobertura de testes > 80%
- [ ] Nenhuma entidade TypeORM é exposta diretamente em resposta HTTP (sempre via DTO)

---

## Observações Importantes

- **NÃO** usar outro ORM além do TypeORM
- **NÃO** misturar lógica de negócio dentro dos controllers — controllers apenas orquestram UseCase + DTO
- **NÃO** expor entidades TypeORM diretamente nas respostas (sempre mapear para DTO de resposta)
- Usar injeção de dependência com tokens de string para interfaces (`@Inject('ITrainerRepository')`)
- Implementar mappers explícitos entre entidade de domínio e entidade de persistência
- Tratar adequadamente erros das APIs externas (timeout, 404, indisponibilidade) — nunca deixar uma exceção não tratada vazar como `500` genérico quando há um cenário de negócio conhecido
- Garantir que as constraints do banco (unique, foreign key, check) reflitam as mesmas regras de negócio validadas na camada de aplicação — validação em duas camadas (aplicação + banco) evita inconsistência em caso de acesso concorrente
- Comentar no código as decisões técnicas não óbvias (ex: por que soft delete, por que TTL de 24h)
