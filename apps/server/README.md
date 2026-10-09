# EduQuest API

API da plataforma EduQuest, responsável por autenticação, autorização, usuários, questões, avaliações e tentativas. A aplicação foi construída com NestJS e TypeScript e persiste os dados em SQL Server por meio do TypeORM.

## Módulos

- `auth`: login, emissão e validação de JWT, guardas de autenticação e autorização por papel.
- `users`: entidade e persistência de usuários.
- `question`: consulta de questões para professores e seed da questão inicial.
- `exam`: criação de avaliações por professores e consulta de avaliações futuras por alunos.
- `attempt`: envio de respostas por alunos, validação, pontuação e ranking.

Os papéis disponíveis são `admin`, `teacher` e `student`. Contas desativadas não podem fazer login nem acessar rotas protegidas.

## Stack

- NestJS 12 e TypeScript.
- TypeORM com driver `mssql`.
- SQL Server 2022.
- JWT para autenticação e `class-validator` para validação de entrada.
- Swagger para documentação interativa.
- Vitest para testes unitários e end-to-end.
- Docker Compose para executar a API com um SQL Server local.

## Autenticação e autorização

Faça login em `POST /auth/login`:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@eduquest.local",
  "password": "Admin123!"
}
```

A resposta contém um `accessToken`. Envie-o nas rotas protegidas:

```http
Authorization: Bearer <access-token>
```

As rotas usam `JwtAuthGuard` para validar o token e `RolesGuard` para restringir o acesso ao papel necessário.

## Endpoints implementados

| Método | Rota | Papel | Descrição |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | público | Autentica um usuário e retorna um JWT |
| `POST` | `/users` | `admin` | Cria um usuário |
| `GET` | `/users` | `admin` | Lista usuários |
| `PATCH` | `/users/:id` | `admin` | Atualiza nome, e-mail e senha |
| `PATCH` | `/users/:id/deactivate` | `admin` | Desativa um usuário sem removê-lo |
| `GET` | `/questions` | `teacher` | Lista as questões disponíveis |
| `POST` | `/exams` | `teacher` | Cria uma avaliação com questões existentes |
| `GET` | `/exams` | `student` | Lista avaliações ainda dentro do prazo |
| `POST` | `/exams/:examId/attempts` | `student` | Envia respostas e registra a pontuação |
| `GET` | `/leaderboard` | `teacher`, `student` | Consulta o ranking dos alunos |

As validações de payload rejeitam campos não permitidos. O papel de um usuário não é alterado pela rota de edição. A senha não é retornada pela API e é persistida como hash.

## Persistência e seed

As entidades são carregadas automaticamente pelo TypeORM e incluem usuários, questões, avaliações e tentativas. Em desenvolvimento, o `synchronize` do TypeORM é habilitado pela configuração atual.

Ao iniciar, os serviços de seed criam somente quando necessário:

- o administrador definido por `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`;
- a questão inicial do banco compartilhado.

Não há cadastro público. Administradores criam contas de professores e alunos pela API.

## Swagger

Com a API em execução, a documentação interativa está disponível em:

```text
http://localhost:3000/api
```

O documento inclui autenticação Bearer e exemplos de payload para as rotas principais.

## Configuração local

### Docker Compose

Pré-requisitos: Docker e Docker Compose.

```bash
cp .env.example .env
docker compose up --build
```

Configure o `.env` com valores locais:

```env
DB_PASS=TesteDeve1!
JWT_SECRET=local-development-secret
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@eduquest.local
ADMIN_PASSWORD=Admin123!
```

O Compose inicia a API na porta `3000` e o SQL Server na porta `1433`. O arquivo `.env` não deve conter credenciais de produção nem ser commitado.

### Execução direta

Com Node.js instalado e um SQL Server acessível pelas variáveis de ambiente:

```bash
npm ci
npm run start:dev
```

Variáveis de banco usadas pela aplicação:

```env
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASS=senha-local
DB_NAME=eduquest-db
JWT_SECRET=local-development-secret
PORT=3000
```

## Comandos

```bash
# Desenvolvimento
npm run start:dev

# Produção, após o build
npm run build
npm run start:prod

# Qualidade
npm run lint

# Testes unitários
npm test

# Testes em modo observação
npm run test:watch

# Testes end-to-end
npm run test:e2e

# Cobertura
npm run test:cov
```

Os testes unitários ficam junto aos módulos em `src/**/*.spec.ts`; o teste end-to-end fica em `test/app.e2e-spec.ts`.

## Limites atuais

O backend já implementa o envio de tentativas e o ranking. Ainda não há cadastro público, edição de avaliações, CRUD de questões pela API ou funcionalidades de FAQ/SAQ. A interface web e o aplicativo mobile não são necessários para executar a API e possuem estados de implementação próprios documentados nos respectivos READMEs.
