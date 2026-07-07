# shadcn/ui — base de componentização

[[index|← Índice]] · [[02-componentes]]

**Base oficial dos componentes do projeto.** Primitivos (Button, Input, Dialog…)
vêm do shadcn, não são escritos do zero. Config em `components.json` (raiz).

## O que é (e o que não é)

- shadcn **não é uma lib de npm**: o CLI **copia o código-fonte** do componente
  para `src/components/ui/`. Você é dono do arquivo — pode editar.
- Estilo: **new-york** · Tailwind v4 · ícones **lucide-react**.
- Cores: reutilizam os **tokens da marca** já definidos em `src/index.css`
  (`--primary` creme/navy, `--accent` terracota, …). shadcn **não** trouxe paleta própria —
  os componentes reagem ao tema claro/escuro sozinhos.

## Onde mora cada coisa

| Pasta | Conteúdo | Editar? |
|---|---|---|
| `src/components/ui/` | primitivos shadcn (vendorizados) | só p/ customizar |
| `src/components/` | componentes **globais** compostos (juntam primitivos) — [[02-componentes]] | sim |
| `src/pages/<Pagina>/components/` | componente exclusivo da página | sim |
| `src/lib/utils.ts` | `cn()` — merge de classes Tailwind | — |

`src/components/ui/` é a **exceção** à regra "toda pasta documentada": primitivos
têm doc upstream (ui.shadcn.com). Documente aqui só os **compostos** que você criar.

## Adicionar um primitivo

```bash
bunx --bun shadcn@latest add <componente>   # ex: input, dialog, card
```

Vai para `src/components/ui/`. Deps (ex: `radix-ui`) instalam sozinhas.
Lista: https://ui.shadcn.com/docs/components

## Usar

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Salvar</Button>
<Button variant="outline" size="sm">Cancelar</Button>
```

Alias `@` → `src/` (config em `vite.config.ts` + `tsconfig*.json`).
**Sem barrel files** ([[04-performance]]): importe o arquivo direto, nunca de um `index`.

## Tokens exigidos pelo shadcn

Já mapeados em `src/index.css` para a marca:

| Token shadcn | Mapeado para |
|---|---|
| `--popover` / `--popover-foreground` | mesma superfície do `--card` |
| `--input` | cor da `--border` |
| `--radius` | `0.5rem` (deriva sm/md/lg/xl em `@theme inline`) |

`--chart-*` e `--sidebar-*` **não** existem ainda — adicione no `:root`/`.dark`
+ `@theme inline` **quando** usar `chart`/`sidebar` (o CLI avisa se faltar).

## Notas

- Lint: `src/components/ui/**` desliga `react-refresh/only-export-components`
  (primitivos exportam componente + `xxxVariants` de propósito) — `eslint.config.js`.
- Regra de ouro: **antes de compor, procure** se o primitivo/composto já existe.
