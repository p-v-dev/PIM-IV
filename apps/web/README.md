# EduQuest Web

Interface web do EduQuest, construída com React e Vite. O módulo está em desenvolvimento e atualmente contém uma interface de professor em `src/pages/Professor.jsx`, componentes visuais reutilizáveis e a configuração inicial de roteamento.

## Estado atual

- React 19 com Vite.
- Roteamento inicial configurado com React Router.
- Estilos com Tailwind CSS e componentes no padrão shadcn/ui.
- Tela de professor em desenvolvimento.
- Login de aluno e professor integrado à API, com sessão por aba e logout.
- Rotas protegidas por perfil confirmado pela API; a entrada `/` direciona para `/aluno` ou `/professor`.
- A página inicial do aluno consulta avaliações reais.
- O professor carrega questões reais, cria avaliações com prazo futuro e consulta sua própria lista persistida.
- O aluno lista avaliações reais, responde questões sem acesso ao gabarito e recebe a correção e os pontos do servidor.
- O aluno consulta seu histórico real de avaliações, com notas e resumos calculados a partir dos acertos registrados.
- Consulta de tentativas pelo professor e desativação ainda estão em desenvolvimento.

O web app ainda não representa uma interface acadêmica completa: autenticação está integrada, mas os demais fluxos possuem dados demonstrativos e integrações pendentes.

## Login de aluno e professor

Acesse `/login`, selecione o perfil e informe as credenciais de uma conta ativa
criada pelo administrador no desktop ou na API. Não há cadastro público nem
contas de aluno/professor criadas automaticamente.

A web chama `POST /auth/login` e confirma a identidade em `GET /auth/me`,
usando o JWT recebido. O perfil selecionado deve corresponder ao perfil real
da conta; administradores continuam usando o desktop. Nome e e-mail da sessão
vêm da API, não das configurações demonstrativas do painel.

Somente o token é mantido em `sessionStorage`, sem gravar senha. Ao recarregar
ou navegar entre rotas protegidas, a sessão é novamente consultada na API.
Respostas 401/403 nessa consulta removem a sessão e retornam ao login; erros
temporários da API não apagam o token. O botão Sair limpa a sessão.

O armazenamento por aba é uma simplificação para o projeto acadêmico; não
protege contra JavaScript malicioso na mesma origem. Não há refresh token,
"lembrar de mim", recuperação de senha ou alteração do contrato do desktop.

## Criar avaliação

Entre como professor e abra Criar avaliação. Informe título, descrição e prazo
futuro no horário local, selecione questões do banco compartilhado e salve.
O envio usa `POST /exams`, e a listagem usa `GET /exams/mine`; a avaliação
continua disponível após recarregar a página. Categoria e dificuldade não
fazem parte do contrato atual.

Falhas no envio preservam os dados para nova tentativa. Erros de sessão
retornam ao login. Resultados e desativação dos cartões ficam indisponíveis
até a implementação dos respectivos casos de uso, sem simular exclusão local.

## Fazer avaliação

Entre como estudante e abra Avaliações ou um cartão da página inicial.
Responda todas as questões e finalize para enviar à API. O resultado só é
exibido após o servidor salvar a tentativa e atualizar a pontuação da conta;
os pontos acumulados aparecem na entrada do aluno.

O gabarito não é entregue ao aluno. Há uma tentativa por avaliação, e a API
bloqueia prazo encerrado, respostas inválidas e envio repetido. Falhas de rede
preservam as escolhas na tela para tentar novamente, sem rascunho persistente.
A listagem ainda pode incluir avaliações já respondidas; repetir o envio
informa que a tentativa já existe, sem somar pontos novamente. O resultado
oferece um link para consultar o histórico persistido em Meu desempenho.

## Consultar avaliações realizadas

Abra Desempenho no menu do estudante ou Ver meu desempenho após finalizar uma
avaliação. A tela usa `GET /attempts/me`, mostrando apenas tentativas do aluno
autenticado, das mais recentes para as mais antigas. Avaliações vencidas
continuam disponíveis no histórico, inclusive após recarregar a página.

São exibidos título, data, acertos, total de questões e nota de 0 a 10. A nota
é calculada somente para exibição, sem alterar os acertos ou pontos gravados.
Média e maior nota usam todo o histórico; a busca filtra apenas os cartões por
título. Histórico vazio não mostra resultados fictícios, e falhas de consulta
têm mensagem própria e botão para tentar novamente.

## Requisitos

- Node.js compatível com as dependências do projeto.
- npm.

## Desenvolvimento

```bash
npm install
npm run dev
```

O Vite exibirá a URL local no terminal.

### Docker Compose

Para iniciar web, API e SQL Server juntos, configure o `.env` de `apps/server`
conforme o README da API e execute nessa pasta:

```bash
docker compose up --build
```

A web fica em `http://localhost:5173`, a API em `http://localhost:3000` e o
Swagger em `http://localhost:3000/api`. Essa configuração usa o Vite para
desenvolvimento, com o código local montado no container.

As chamadas relativas para `/auth`, `/exams`, `/questions`, `/attempts` e
`/leaderboard` passam pelo proxy do Vite. No Compose, `API_PROXY_TARGET` aponta
para `http://backend:3000`; fora do Docker, o padrão é `http://localhost:3000`.
O proxy não implementa a integração das telas com a API.

## Verificação

```bash
npm run lint
npm run build
npm test
```

## Estrutura principal

```text
src/
  components/ui/  componentes de interface reutilizáveis
  pages/          páginas em desenvolvimento
  lib/            utilitários
  App.jsx         entrada da aplicação
  main.jsx        montagem do React e roteamento
```

## Próximos passos

- Conectar consulta de tentativas pelo professor à API.
- Desenvolver os demais fluxos específicos de professores e alunos.
