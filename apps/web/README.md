# EduQuest Web

Interface web do EduQuest, construída com React e Vite. O módulo está em desenvolvimento e atualmente contém uma interface de professor em `src/pages/Professor.jsx`, componentes visuais reutilizáveis e a configuração inicial de roteamento.

## Estado atual

- React 19 com Vite.
- Roteamento inicial configurado com React Router.
- Estilos com Tailwind CSS e componentes no padrão shadcn/ui.
- Tela de professor em desenvolvimento.
- A rota inicial ainda renderiza um `App` sem fluxo funcional completo.
- Não há integração web implementada com a API neste momento.

O web app não deve ser apresentado como uma interface acadêmica completa até que autenticação, integração com a API e os fluxos de usuário estejam conectados.

## Requisitos

- Node.js compatível com as dependências do projeto.
- npm.

## Desenvolvimento

```bash
npm install
npm run dev
```

O Vite exibirá a URL local no terminal.

## Verificação

```bash
npm run lint
npm run build
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

- Conectar a rota inicial a uma experiência de usuário real.
- Implementar autenticação e consumo da API EduQuest.
- Desenvolver os fluxos específicos de professores e alunos.
