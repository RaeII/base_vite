# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Vite 8 · React 19 · TypeScript · Tailwind v4 · shadcn/ui (new-york, lucide). Package manager: **bun** (`bun.lock`).

## Comandos

```bash
bun install        # deps
bun dev            # dev server + HMR
bun run build      # tsc -b && vite build
bun run lint       # eslint
bun run preview    # serve build local
```

Sem suíte de testes configurada. Validação = `bun run build` (typecheck via `tsc -b`) + `bun run lint`.

## Arquitetura

- **Tema (claro/escuro)** é a peça central, espalhada por 4 arquivos:
  - `index.html` — script anti-FOUC: lê `localStorage.theme` e seta `.dark` no `<html>` **antes** do React montar.
  - `src/index.css` — `@custom-variant dark`, paleta em CSS vars (`--primary`, `--background`, …) com override em `.dark`. Cores são tokens semânticos (`bg-primary`, `text-muted-foreground`), não valores crus.
  - `src/hooks/useTheme.ts` — hook global via `useSyncExternalStore`; fonte da verdade é a classe `.dark` no `<html>` (N consumidores sincronizados, sem provider); `toggle` persiste em `localStorage`.
  - Componentes usam só os tokens → reagem ao tema sozinhos.
- Entrada: `src/main.tsx` → `App.tsx` (router + `AuthProvider` + `Suspense`; páginas lazy).
- **API** (`src/api/`): instância axios única em `client.ts` (`baseURL: '/api'`, `withCredentials`, erros normalizados em `ApiError`); rotas por módulo em `src/api/<modulo>/` (`*.routes.ts` + `*.types.ts`). Nunca chame axios/fetch fora dessa pasta. Dev: proxy do Vite encaminha `/api` ao backend (`VITE_API_TARGET`, default `http://localhost:3000`).
- **Auth**: JWT em cookie httpOnly (`token_access`) — JS nunca lê o token. `AuthProvider` (`src/components/`) espelha a sessão em `localStorage` e escuta `SESSION_EXPIRED_EVENT` (401 do interceptor); `useAuth` (`src/hooks/`) expõe `user/login/logout`; `RequireAuth` protege rotas filhas. Docs: `doc/funcoes/api.md`, `doc/funcoes/use-auth.md`.

## Regras do projeto (OBRIGATÓRIAS)

Detalhe e templates em `doc/` (vault Obsidian, [[wikilinks]]). Índice: `doc/index.md`.

- **Uma pasta por página** em `src/pages/<Pagina>/`, documentada em `doc/paginas/<pagina>/`.
- **shadcn/ui é a base**: primitivos (Button, Input, …) vêm de `bunx --bun shadcn@latest add <x>` → `src/components/ui/` (vendorizados, alias `@/`). Não escreva primitivo do zero. Cores usam os tokens da marca em `src/index.css` (sem paleta própria do shadcn). Doc: `doc/componentes/shadcn-ui.md`.
- **Componente exclusivo da página** → `src/pages/<Pagina>/components/`. **Usado por 2+ páginas** → `src/components/` (global, compõe primitivos `ui/`).
- **Todo componente global é documentado** em `doc/componentes/` — para reusar, não repetir. Exceção: primitivos em `src/components/ui/` (doc upstream).
- **Funções/hooks**: reutilizável → `src/lib/` ou `src/hooks/` + doc em `doc/funcoes/`. Exclusivo da página → fica na página.
- Comece local; na 2ª página que precisar, **promova e documente — nunca copie**.
- **Performance React+Vite** (`doc/regras/04-performance.md`): code-split por página (`lazy`+`Suspense`); memoizar só com medida (React 19 + Compiler já memoizam); estado no componente mais baixo e **escada de estado** (`useState` → lift → Context estável → React Query p/ dados de API → Zustand p/ global mutável; Redux não); prop drilling se resolve com composição antes de context; `useEffect` só para sistema externo; keys estáveis; **sem barrel files** (quebram tree-shaking/HMR — importe direto).
- **Documentação sempre atualizada**, só o necessário, prática, no formato `/caveman-review` (1 linha por item: local, problema/fato, ação).
- Sempre aplicar **`/karpathy-guidelines`** (mudanças cirúrgicas, sem overcomplicar, critério de sucesso verificável) e **`/ponytail`** (solução mais simples que funciona; reusar antes de escrever).

## Antes de escrever, procure

```bash
rg -l "NomeProvavel|useAlgo" src/components src/hooks src/lib src/pages
```
Existe algo que resolve? Reutilize. Duplicar é o erro mais comum.
