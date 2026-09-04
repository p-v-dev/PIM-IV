# Documentacao do Backend

## O que este projeto faz

Este backend e uma plataforma simples de avaliacoes para uma instituicao de ensino.

Hoje existem dois tipos de usuario:

- `admin`: gerencia contas de administradores e professores.
- `teacher`: consulta o banco fixo de questoes e cria avaliacoes.
- `student`: consulta avaliacoes que ainda nao venceram.

Ainda nao existem tentativas de prova, resultados, edicao de provas ou cadastro publico.

## Tecnologias

- NestJS: organiza a API em modulos, controllers e services.
- TypeORM: conversa com o banco SQL Server.
- SQL Server: guarda usuarios, questoes e avaliacoes.
- JWT: identifica o usuario depois do login.
- Docker Compose: sobe o backend e o SQL Server.

## Como iniciar

1. Confirme que o arquivo `.env` possui as variaveis abaixo:

```env
DB_PASS=TesteDeve1!
ADMIN_NAME=Administrador
ADMIN_EMAIL=admin@eduquest.local
ADMIN_PASSWORD=Admin123!
JWT_SECRET=local-development-secret
```

2. Suba os containers:

```bash
docker compose up --build
```

3. A API fica em `http://localhost:3000`.

O seed executa ao iniciar o backend. Ele cria o administrador inicial e a questao inicial apenas quando ainda nao existem. Reiniciar a aplicacao nao duplica esses dados.

## Autenticacao

Primeiro, faca login:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@eduquest.local",
  "password": "Admin123!"
}
```

Resposta:

```json
{
  "accessToken": "token-jwt-aqui"
}
```

Nas rotas protegidas, envie o token no cabecalho:

```http
Authorization: Bearer token-jwt-aqui
```

O token carrega o id, e-mail e papel do usuario. Mesmo com token valido, uma conta desativada nao pode usar a API.

## Administrador

Somente administradores usam as rotas abaixo.

### Criar usuario

```http
POST /users
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "name": "Maria",
  "email": "maria@escola.com",
  "password": "SenhaSegura123",
  "role": "teacher"
}
```

O campo `role` aceita `admin`, `teacher` ou `student`. O papel nao pode ser alterado depois.

### Listar usuarios

```http
GET /users
Authorization: Bearer <token-admin>
```

### Editar usuario

```http
PATCH /users/<id-do-usuario>
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria.silva@escola.com",
  "password": "OutraSenha123"
}
```

Todos os campos sao opcionais. A senha nunca e retornada pela API; ela e armazenada como hash.

### Desativar usuario

```http
PATCH /users/<id-do-usuario>/deactivate
Authorization: Bearer <token-admin>
```

Desativar nao apaga o usuario. Ele permanece listado, mas nao consegue mais fazer login nem acessar rotas protegidas.

## Banco fixo de questoes

O banco de questoes e compartilhado por todo o app e nao possui CRUD. Ninguem cria, edita ou remove questoes pela API.

O seed inicial adiciona esta questao:

```json
{
  "prompt": "Qual e a capital do Brasil?",
  "options": ["Rio de Janeiro", "Sao Paulo", "Brasilia", "Salvador"],
  "correctOptionIndex": 2
}
```

`correctOptionIndex: 2` significa a terceira alternativa, porque a contagem comeca em zero.

Professores consultam as questoes para obter seus IDs:

```http
GET /questions
Authorization: Bearer <token-professor>
```

Exemplo de resposta:

```json
[
  {
    "id": "018f...",
    "prompt": "Qual e a capital do Brasil?",
    "options": ["Rio de Janeiro", "Sao Paulo", "Brasilia", "Salvador"],
    "correctOptionIndex": 2
  }
]
```

## Criar avaliacao

Somente professores criam avaliacoes. A avaliacao recebe os IDs das questoes existentes, nao as questoes completas.

```http
POST /exams
Authorization: Bearer <token-professor>
Content-Type: application/json

{
  "title": "Geografia basica",
  "description": "Avaliacao sobre capitais brasileiras.",
  "deadline": "2026-10-01T12:00:00.000Z",
  "questionIds": ["018f..."]
}
```

Regras:

- `title` e `description` nao podem estar vazios.
- `deadline` deve ser uma data ISO valida.
- `questionIds` precisa ter pelo menos um ID.
- Todos os IDs devem existir no banco de questoes.
- O `teacherId` vem do token. Ele nao e recebido no corpo da requisicao.

Se algum ID nao existir, a API responde erro `400 Bad Request`.

## Aluno

Alunos nao criam a propria conta: um administrador os cria usando `POST /users` com `"role": "student"`.

Depois de fazer login, o aluno consulta apenas avaliacoes cujo prazo ainda nao passou:

```http
GET /exams
Authorization: Bearer <token-aluno>
```

Fazer avaliacoes, enviar respostas e consultar notas ainda nao fazem parte da API.

## Estrutura das pastas

```text
src/
  auth/       login, JWT, papeis, seed do admin e rotas administrativas
  users/      entidade e acesso ao banco de usuarios
  question/   banco fixo de questoes, seed e consulta para professores
  exam/       entidade e criacao de avaliacoes
  attempt/    reservado para tentativas futuras de alunos
```

## Comandos uteis

```bash
# Rodar testes
npm test

# Validar regras de lint
npm run lint

# Gerar a compilacao de producao
npm run build

# Rodar em modo desenvolvimento sem Docker
npm run start:dev
```

## Proximos passos naturais

1. Adicionar mais questoes ao seed.
2. Criar usuarios `student`.
3. Permitir alunos responderem avaliacoes.
4. Calcular e mostrar desempenho.
