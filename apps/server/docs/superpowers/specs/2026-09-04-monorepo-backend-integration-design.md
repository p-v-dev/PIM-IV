# Integração do Backend ao Monorepo

## Objetivo

Integrar o backend NestJS atual ao repositório `p-v-dev/PIM-IV` como a aplicação oficial em `apps/server`.

## Escopo

- Clonar o monorepo em um diretório de trabalho separado.
- Substituir o diretório vazio `apps/server` pelos arquivos versionáveis deste backend.
- Não copiar `node_modules`, `dist`, `.env` ou `*.tsbuildinfo`.
- Criar `apps/server/.env.example` com `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `NODE_ENV`, `JWT_SECRET`, `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`, sem valores secretos.
- Atualizar o `README.md` raiz para informar NestJS/TypeScript como backend e documentar os comandos para a API.
- Validar o servidor com `npm ci`, `npm run lint`, `npm test` e `npm run build` em `apps/server`.
- Criar uma branch e enviar as alterações para revisão via pull request.

## Fluxo

1. Clonar `https://github.com/p-v-dev/PIM-IV.git`.
2. Copiar os arquivos versionáveis do backend para `apps/server`.
3. Revisar o diff para confirmar a ausência de segredos e artefatos gerados.
4. Adicionar o arquivo de exemplo de ambiente e atualizar o README raiz.
5. Instalar dependências e executar as validações.
6. Criar o commit e abrir a pull request.

## Tratamento de Erros

- Interromper se `apps/server` deixar de estar vazio antes da cópia, para evitar sobrescrever trabalho de outra pessoa.
- Interromper se o `.env` contiver uma variável usada pela aplicação que não esteja documentada no `.env.example`.
- Não abrir pull request se qualquer validação falhar.

## Fora de Escopo

- Converter o backend para C#.
- Configurar workspaces, CI/CD, deploy ou Docker do monorepo.
- Alterar os apps web e mobile.
