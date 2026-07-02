# Pokémon Trainers API

API REST para gerenciamento de treinadores Pokémon, seus times e Pokémon, integrando com PokéAPI e ViaCEP.

## Stack

- **Framework**: NestJS 10
- **ORM**: TypeORM 0.3 (exclusivamente)
- **Banco**: PostgreSQL 15
- **Cache**: TTL local (sem Redis)
- **Containerização**: Docker + Docker Compose
- **Documentação**: Swagger/OpenAPI

## Como Rodar

### Pré-requisitos

- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado
- OU [Node.js 20](https://nodejs.org/) + [PostgreSQL](https://www.postgresql.org/) se preferir rodar local

### Rodando com Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone <repo-url>
cd pokemon-trainers-api

# 2. Suba os containers (PostgreSQL + API)
docker-compose up -d --build

# 3. Aguarde alguns segundos e verifique os logs
docker-compose logs -f app

# 4. Acesse a aplicação
# API: http://localhost:3000/api/v1
# Swagger: http://localhost:3000/api/docs
```

#### Comandos úteis

```bash
# Ver logs da aplicação
docker-compose logs -f app

# Parar tudo
docker-compose down

# Parar e remover dados do banco
docker-compose down -v

# Reiniciar a aplicação
docker-compose restart app

# Entrar no container
docker-compose exec app sh

# Acessar o banco de dados
docker-compose exec postgres psql -U pokemon_admin -d pokemon_db
```

### Rodando Local (sem Docker)

```bash
# 1. Instale as dependências
npm install

# 2. Configure o .env
cp .env.example .env
# Edite .env com suas configurações locais

# 3. Certifique-se que o PostgreSQL está rodando
# Crie o banco: pokemon_db

# 4. Rode a aplicação
npm run start:dev

# Acessar
# API: http://localhost:3000/api/v1
# Swagger: http://localhost:3000/api/docs
```

#### Arquivo `.env`

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost          # Use 'postgres' se estiver no Docker
DB_PORT=5432
DB_USERNAME=pokemon_admin
DB_PASSWORD=pokemon_pass
DB_DATABASE=pokemon_db
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
VIACEP_BASE_URL=https://viacep.com.br/ws
```

## Primeiros Testes

Após subir a aplicação, teste os endpoints:

```bash
# Criar um treinador
curl -X POST http://localhost:3000/api/v1/trainers \
  -H "Content-Type: application/json" \
  -d '{"name":"Ash Ketchum","email":"ash@pokemon.com"}'

# Listar treinadores
curl http://localhost:3000/api/v1/trainers

# Buscar Pokémon na PokéAPI
curl http://localhost:3000/api/v1/pokemon/external/25

# Sincronizar Pokémon para o banco local
curl -X POST http://localhost:3000/api/v1/pokemon/sync/25

# Consultar CEP
curl http://localhost:3000/api/v1/cep/01001-000

# Documentação completa
open http://localhost:3000/api/docs
```

## Documentação da API

A documentação completa com todos os endpoints, payloads e exemplos está disponível no Swagger:

`http://localhost:3000/api/docs`

### Endpoints Disponíveis

| Grupo | Endpoints |
|-------|-----------|
| Trainers | POST criar, GET listar/buscar, PATCH atualizar, DELETE soft delete, PATCH restaurar |
| Teams | POST criar, GET listar/buscar, PATCH atualizar, DELETE excluir, POST adicionar Pokémon, DELETE remover Pokémon |
| Pokémon | GET listar/buscar locais, GET listar/buscar da API externa, POST sincronizar, POST sync em massa |
| CEP | GET consultar endereço por CEP |

## Parar a Aplicação

```bash
# Docker
docker-compose down

# Se quiser limpar tudo (banco + volumes)
docker-compose down -v
```

Desenvolvido com NestJS, TypeORM e PostgreSQL.

## Arquitetura

### Clean Architecture

```text
src/
├── core/                      # Regras de negócio (sem dependências externas)
│   ├── domain/                # Entidades, Value Objects, Exceções
│   │   ├── entities/          # Entidades ricas com comportamento
│   │   ├── value-objects/     # CEP, PokemonTypes
│   │   └── exceptions/        # TeamFull, DuplicatePokemon, etc
│   ├── services/               # Serviços de domínio (orquestração)
│   ├── use-cases/              # Casos de uso (um por ação do controller)
│   ├── repositories/           # Interfaces/contratos
│   └── integrations/           # Contratos de APIs externas
│
├── modules/                    # Módulos NestJS (controllers + DTOs)
│   ├── trainers/
│   ├── teams/
│   ├── pokemon/
│   └── cep/
│
├── infrastructure/              # Implementações concretas
│   ├── database/typeorm/        # Entidades, repositórios, mappers
│   └── integrations/            # PokéAPI, ViaCEP
│
├── common/                      # Decorators, filters, interceptors
│   ├── decorators/              # @LogUseCase()
│   ├── filters/                 # Exceções HTTP
│   └── interceptors/            # Transformação de resposta
│
└── config/                      # Configurações (database, APIs externas)
```

### Padrões Utilizados

| Padrão | Onde | Por quê |
|--------|------|---------|
| **Repository** | Interfaces em `core/repositories/`, implementações em `infrastructure/` | Desacoplar domínio do banco |
| **Use Case** | Cada ação do controller é um UseCase separado | Single Responsibility |
| **Mapper** | `infrastructure/database/typeorm/mappers/` | Separar entidade de domínio da entidade TypeORM |
| **Decorator** | `@LogUseCase()` nos controllers | Logs de auditoria sem poluir código |
| **DTO** | `modules/*/dto/` | Validação de entrada com class-validator |
| **Value Object** | `core/domain/value-objects/` | CEP e tipos Pokémon como objetos imutáveis |

### Injeção de Dependência

```typescript
// Tokens para interfaces (permite trocar implementação sem alterar domínio)
@Inject('ITrainerRepository')  // Token string → implementação concreta
@Inject('IPokemonApi')         // PokéAPI hoje, outra API amanhã

// Classes concretas (injeção direta)
private readonly pokemonService: PokemonService
```

## Regras de Negócio

### Treinador (Trainer)

| Regra | Decisão | Implementação |
|-------|---------|----------------|
| Um treinador pode ter múltiplos times | OneToMany | `Trainer.hasMany(Team)` |
| Exclusão de treinador | Soft Delete | `deletedAt` timestamp, dados preservados |
| Times ao excluir treinador | Preservados | Times continuam existindo após soft delete |
| Restaurar treinador | Endpoint dedicado | `PATCH /trainers/:id/restore` |
| Email único | Validação na criação/update | `findByEmail` antes de salvar |

**Decisão Soft Delete**: Optei por soft delete em vez de CASCADE ou bloqueio porque:
- Preserva histórico de times para auditoria
- Permite restaurar treinador sem perder dados
- Evita deleção acidental de times

### Time (Team)

| Regra | Decisão | Implementação |
|-------|---------|----------------|
| Time pertence a 1 treinador | ManyToOne | `team.trainer_id` FK |
| Nome obrigatório | 3-50 caracteres | Validação no constructor |
| Máximo 5 Pokémon | Constante `MAX_POKEMONS = 5` | `TeamFullException` (422) |
| Pokémon duplicado | Unique constraint (team_id, pokemon_id) | `DuplicatePokemonException` (422) |
| Excluir time | CASCADE nas associações | `onDelete: 'CASCADE'` em TeamPokemon |

### Pokémon

| Regra | Decisão | Implementação |
|-------|---------|----------------|
| Persistido localmente | Tabela `pokemons` | `externalId` como referência à PokéAPI |
| Dados salvos | `externalId`, `name`, `types[]`, `spriteUrl`, `lastSyncAt` | Suficiente para uso offline |
| Primeira busca | Busca PokéAPI → salva local | `getOrSyncPokemon()` |
| Buscas seguintes | Prioriza banco local | TTL 24h antes de re-sincronizar |
| Sincronização manual | Endpoints dedicados | `POST /pokemon/sync/:id` e `/sync-all` |
| Pokémon inexistente | Erro 404 | PokéAPI retorna 404 → `PokemonNotFoundException` |

### Associação TeamPokemon

- Entidade: `team_pokemons` com `team_id`, `pokemon_id`, `level`, `added_at`
- Constraint unique: `(team_id, pokemon_id)` - impossibilita duplicados
- Level: 1-100 (validação no domain)
- Ao excluir Time: CASCADE remove todas as associações
- Ao excluir Treinador (soft delete): associações preservadas

## Estratégia de Cache/Sincronização Pokémon

### Configuração (`config/pokeapi.config.ts`)

```typescript
POKEAPI_CONFIG = {
  TTL_HOURS: 24,       // Tempo de validade do cache local
  MAX_RETRIES: 3,      // Tentativas com backoff exponencial
  TIMEOUT_MS: 5000,    // Timeout de 5 segundos
}
```

### Fluxo `getOrSyncPokemon(externalId)`

```text
Buscar Pokémon por externalId
  │
  ├─ Existe no banco?
  │   ├─ SIM → lastSyncAt < 24h?
  │   │   ├─ SIM → Retorna do banco (cache válido)
  │   │   └─ NÃO → Busca PokéAPI → Atualiza banco → Retorna
  │   │
  │   └─ NÃO → Busca PokéAPI → Salva banco → Retorna
  │
  └─ Erro na PokéAPI?
      └─ Retry 3x com backoff exponencial (1s, 2s, 4s)
```

### Quando sincroniza

| Gatilho | Ação |
|---------|------|
| Adicionar Pokémon ao time | `getOrSyncPokemon()` automático |
| Endpoint manual | `POST /pokemon/sync/:id` |
| Atualização em massa | `POST /pokemon/sync-all` (limite 50) |
| TTL expirado (24h) | Automático na próxima busca |

### Decisão: TTL de 24h

- Pokémon não mudam frequentemente (dados estáticos)
- 24h equilibra frescor dos dados vs. chamadas à API
- Rate limit da PokéAPI é respeitado
- Usuário pode forçar sync manual se necessário

## Integrações Externas

### 1. PokéAPI (pokeapi.co)

- Busca por ID: `GET https://pokeapi.co/api/v2/pokemon/{id}`
- Dados extraídos:
  - `id` → `externalId`
  - `name` → nome do Pokémon
  - `types[]` → array de tipos (max 2)
  - `sprites.front_default` → sprite URL
- Tratamento de erros:
  - 404 → `PokemonNotFoundException`
  - Timeout (5s) → retry 3x com backoff
  - Rate limit → backoff exponencial
  - Serviço indisponível → erro 502

### 2. ViaCEP (viacep.com.br)

- Busca por CEP: `GET https://viacep.com.br/ws/{cep}/json/`
- Dados extraídos: `cep`, `logradouro`, `bairro`, `localidade`, `uf`

**Decisão**: Endpoint sob demanda (`GET /cep/:cep`), sem persistência automática. Treinador pode consultar CEP e decidir se vincula ao perfil.

## Modelagem do Banco

```text
trainers
├── id (UUID, PK)
├── name (VARCHAR 100)
├── email (VARCHAR 255, UNIQUE)
├── address_id (UUID, FK → addresses, NULLABLE)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── deleted_at (TIMESTAMP, NULLABLE)  ← Soft delete

addresses
├── id (UUID, PK)
├── cep (VARCHAR 9)
├── logradouro (VARCHAR 200)
├── bairro (VARCHAR 100)
├── localidade (VARCHAR 100)
├── uf (VARCHAR 2)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

teams
├── id (UUID, PK)
├── name (VARCHAR 50)
├── trainer_id (UUID, FK → trainers, CASCADE)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

pokemons
├── id (UUID, PK)
├── external_id (INTEGER, INDEX)
├── name (VARCHAR 100)
├── types (TEXT[])              ← Array de tipos
├── sprite_url (VARCHAR 500)
├── last_sync_at (TIMESTAMP)    ← Controle de TTL
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

team_pokemons
├── team_id (UUID, PK, FK → teams, CASCADE)
├── pokemon_id (UUID, PK, FK → pokemons)
├── level (INTEGER, DEFAULT 1)
├── added_at (TIMESTAMP)
└── UNIQUE (team_id, pokemon_id)  ← Impede duplicados

use_case_logs
├── id (UUID, PK)
├── use_case (VARCHAR 200)
├── controller (VARCHAR 200)
├── acao (ENUM: GET, POST, PUT, PATCH, DELETE)
├── status (ENUM: SUCESSO, ERRO)
├── payload (TEXT)
├── response (TEXT)
├── mensagem (TEXT)
├── ip (VARCHAR 45)
├── execution_time_ms (INTEGER)
└── created_at (TIMESTAMP)
```

## Endpoints da API

### Treinadores

| Método | Path | Descrição |
|--------|------|-----------|
| POST | `/api/v1/trainers` | Criar treinador |
| GET | `/api/v1/trainers` | Listar treinadores (paginado) |
| GET | `/api/v1/trainers/:id` | Buscar treinador |
| PATCH | `/api/v1/trainers/:id` | Atualizar treinador |
| DELETE | `/api/v1/trainers/:id` | Soft delete treinador |
| PATCH | `/api/v1/trainers/:id/restore` | Restaurar treinador |

### Times

| Método | Path | Descrição |
|--------|------|-----------|
| POST | `/api/v1/trainers/:trainerId/teams` | Criar time |
| GET | `/api/v1/trainers/:trainerId/teams` | Listar times do treinador |
| GET | `/api/v1/teams/:id` | Buscar time com Pokémon |
| PATCH | `/api/v1/teams/:id` | Atualizar nome do time |
| DELETE | `/api/v1/teams/:id` | Excluir time |
| POST | `/api/v1/teams/:id/pokemon` | Adicionar Pokémon ao time |
| DELETE | `/api/v1/teams/:id/pokemon/:pokemonId` | Remover Pokémon do time |

### Pokémon

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/api/v1/pokemon` | Listar Pokémon locais |
| GET | `/api/v1/pokemon/:id` | Buscar Pokémon local |
| GET | `/api/v1/pokemon/external` | Listar Pokémon da PokéAPI (paginado) |
| GET | `/api/v1/pokemon/external/:id` | Buscar Pokémon na PokéAPI |
| POST | `/api/v1/pokemon/sync/:externalId` | Sincronizar Pokémon |
| POST | `/api/v1/pokemon/sync-all` | Sincronizar em massa |

### CEP

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/api/v1/cep/:cep` | Consultar endereço por CEP |

## Exemplos de Uso

### Criar Treinador

```bash
curl -X POST http://localhost:3000/api/v1/trainers \
  -H "Content-Type: application/json" \
  -d '{"name":"Ash Ketchum","email":"ash@pokemon.com"}'
```

Resposta (201):

```json
{
  "data": {
    "id": "dc1f24db-617a-46a4-85c2-ed8804f29f8e",
    "name": "Ash Ketchum",
    "email": "ash@pokemon.com",
    "createdAt": "2026-07-02T20:15:30.000Z"
  },
  "timestamp": "2026-07-02T20:15:30.000Z"
}
```

### Listar Treinadores

```bash
curl http://localhost:3000/api/v1/trainers?page=1&limit=10
```

### Buscar Treinador com Times

```bash
curl http://localhost:3000/api/v1/trainers/dc1f24db-617a-46a4-85c2-ed8804f29f8e
```

### Soft Delete Treinador

```bash
curl -X DELETE http://localhost:3000/api/v1/trainers/dc1f24db-617a-46a4-85c2-ed8804f29f8e
# Status: 204 No Content
# Treinador marcado com deletedAt, times preservados
```

### Restaurar Treinador

```bash
curl -X PATCH http://localhost:3000/api/v1/trainers/dc1f24db-617a-46a4-85c2-ed8804f29f8e/restore
```

### Criar Time

```bash
curl -X POST http://localhost:3000/api/v1/trainers/dc1f24db-617a-46a4-85c2-ed8804f29f8e/teams \
  -H "Content-Type: application/json" \
  -d '{"name":"Time Principal"}'
```

### Adicionar Pokémon ao Time

```bash
curl -X POST http://localhost:3000/api/v1/teams/{teamId}/pokemon \
  -H "Content-Type: application/json" \
  -d '{"externalId":25,"level":15}'
```

Resposta (200):

```json
{
  "data": {
    "message": "Pokémon adicionado ao time com sucesso"
  },
  "timestamp": "2026-07-02T20:20:00.000Z"
}
```

### Time Cheio (Erro 422)

Após adicionar 5 Pokémon, o 6º retorna:

```json
{
  "statusCode": 422,
  "message": "O time já atingiu o limite máximo de 5 Pokémon",
  "error": "Unprocessable Entity",
  "timestamp": "2026-07-02T20:20:00.000Z",
  "path": "/api/v1/teams/123/pokemon"
}
```

### Pokémon Duplicado (Erro 422)

Adicionar Pikachu (25) duas vezes:

```json
{
  "statusCode": 422,
  "message": "Pokémon 25 já existe no time 123",
  "error": "Unprocessable Entity",
  "timestamp": "2026-07-02T20:20:00.000Z",
  "path": "/api/v1/teams/123/pokemon"
}
```

### Buscar Pokémon na PokéAPI

```bash
curl http://localhost:3000/api/v1/pokemon/external/25
```

Resposta:

```json
{
  "data": {
    "id": 25,
    "name": "pikachu",
    "types": ["electric"],
    "spriteUrl": "https://raw.githubusercontent.com/..."
  },
  "timestamp": "2026-07-02T20:20:00.000Z"
}
```

### Listar Pokémon da API (paginado)

```bash
curl http://localhost:3000/api/v1/pokemon/external?offset=0&limit=10
```

### Sincronizar Pokémon Manualmente

```bash
curl -X POST http://localhost:3000/api/v1/pokemon/sync/25
curl -X POST http://localhost:3000/api/v1/pokemon/sync-all \
  -H "Content-Type: application/json" \
  -d '{"limit":10}'
```

### Consultar CEP

```bash
curl http://localhost:3000/api/v1/cep/01001-000
```

Resposta:

```json
{
  "data": {
    "cep": "01001-000",
    "logradouro": "Praça da Sé",
    "bairro": "Sé",
    "localidade": "São Paulo",
    "uf": "SP"
  },
  "timestamp": "2026-07-02T20:20:00.000Z"
}
```

### Email Duplicado (Erro 409)

```bash
curl -X POST http://localhost:3000/api/v1/trainers \
  -H "Content-Type: application/json" \
  -d '{"name":"Misty","email":"ash@pokemon.com"}'
```

```json
{
  "statusCode": 409,
  "message": "Email já cadastrado no sistema",
  "error": "Conflict",
  "timestamp": "2026-07-02T20:20:00.000Z",
  "path": "/api/v1/trainers"
}
```

## Tratamento de Erros

### Formato Padronizado

```json
{
  "statusCode": 422,
  "message": "Mensagem descritiva",
  "error": "Unprocessable Entity",
  "timestamp": "2026-07-02T20:20:00.000Z",
  "path": "/api/v1/teams/123/pokemon"
}
```

### Mapeamento de Exceções

| Exceção de Domínio | HTTP Status |
|---------------------|-------------|
| `TrainerNotFoundException` | 404 |
| `PokemonNotFoundException` | 404 |
| `TeamFullException` | 422 |
| `DuplicatePokemonException` | 422 |
| `InvalidPokemonLevelException` | 422 |
| Email duplicado | 409 |
| Erro de validação (DTO) | 400 |
| Erro interno | 500 |

## Logs de Auditoria

Todo endpoint anotado com `@LogUseCase()` persiste automaticamente:

- Nome do caso de uso (ex: "Criar Treinador")
- Controller que originou a chamada
- Ação HTTP (GET, POST, PUT, DELETE)
- Status (SUCESSO ou ERRO)
- Payload da requisição
- Resposta do endpoint
- Tempo de execução em ms
- IP do cliente

Logs são persistidos na tabela `use_case_logs` e podem ser consultados para auditoria.

## Decisões Técnicas

### Por que Clean Architecture?

- **Testabilidade**: Cada camada pode ser testada isoladamente
- **Manutenibilidade**: Mudar banco ou framework não afeta regras de negócio
- **Clareza**: Cada arquivo tem responsabilidade única e óbvia

### Por que Use Cases separados?

- Cada ação do controller é um UseCase (`CreateTrainer`, `GetTrainer`, etc.)
- Facilita testes unitários (um mock por dependência)
- Permite compor UseCases em diferentes contextos

### Por que Mappers?

- Entidade de domínio ≠ Entidade TypeORM
- Domínio não conhece detalhes de persistência
- Mappers isolam a conversão em uma única classe

### Por que Soft Delete no Trainer?

- Preserva histórico de times para relatórios/auditoria
- Permite restaurar treinador sem perder dados
- Evita deleção acidental em cascata

### Por que TTL de 24h para Pokémon?

- Dados de Pokémon são estáticos (não mudam com frequência)
- Reduz chamadas à PokéAPI (rate limit)
- Usuário pode forçar sync manual se necessário

### Por que CEP sob demanda?

- CEP não é obrigatório para treinador
- Evita chamadas desnecessárias à ViaCEP
- Treinador decide se quer vincular endereço

## 📦 Estrutura de Arquivos

```text
src/
├── core/
│   ├── domain/
│   │   ├── entities/          # 5 entidades com comportamento
│   │   ├── value-objects/     # Cep, PokemonTypes
│   │   └── exceptions/        # 5 exceções de domínio
│   ├── services/               # 4 serviços
│   ├── use-cases/               # 15 casos de uso
│   ├── repositories/            # 4 interfaces
│   └── integrations/            # 2 interfaces de API externa
├── modules/                     # 4 módulos NestJS
├── infrastructure/               # Implementações TypeORM + APIs externas
├── common/                       # Decorators, filters, interceptors
└── config/                       # Configurações tipadas
```
