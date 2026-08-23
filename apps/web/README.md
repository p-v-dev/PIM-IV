# EduQuest Web

## Desenvolvimento

```bash
npm install
npm run dev
```

O Vite exibira a URL local no terminal.

## Componentes shadcn/ui

Adicione um componente com o CLI. Por exemplo, para adicionar um botao:

```bash
npx shadcn@latest add button
```

Use o componente gerado:

```jsx
import { Button } from "@/components/ui/button";

export function Example() {
  return <Button>Salvar</Button>;
}
```
