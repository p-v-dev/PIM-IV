# EduQuest Mobile

Aplicativo React Native, via Expo, exclusivo para alunos. Ele porta os fluxos
de login, avaliacoes, desempenho, ranking e FAQ da area de aluno da web.

O plano de port 1:1 da area de aluno da web esta em [ROADMAP.md](ROADMAP.md).

## Executar

Na pasta `apps/mobile`:

```bash
npm install
npm start
```

Use `npm run android`, `npm run ios` ou `npm run web` para abrir a plataforma
correspondente depois de instalar as dependencias.

## Configuracao da API

Defina a URL acessivel pelo dispositivo em `.env`:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
EXPO_PUBLIC_DEMO_MODE=false
```

Para explorar o aplicativo sem API ou login, use
`EXPO_PUBLIC_DEMO_MODE=true`. O modo local mostra dados ficticios e deve ficar
desativado fora do desenvolvimento.

## Testes

```bash
npm test
```

Os testes Vitest verificam os contratos HTTP de sessao e avaliacoes, incluindo
token Bearer, erros de autorizacao e falha de rede.
