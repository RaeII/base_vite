# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Vite 8 · React 19 · TypeScript · Tailwind v4. Package manager: **bun** (`bun.lock`).

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
  - `src/hooks/useTheme.ts` — hook global; estado inicial lido da classe `.dark` já presente; `toggle` persiste em `localStorage`.
  - Componentes usam só os tokens → reagem ao tema sozinhos.
- Entrada: `src/main.tsx` → `App.tsx`. Sem router ainda.

## Regras do projeto (OBRIGATÓRIAS)

Detalhe e templates em `doc/` (vault Obsidian, [[wikilinks]]). Índice: `doc/index.md`.

- **Uma pasta por página** em `src/pages/<Pagina>/`, documentada em `doc/paginas/<pagina>/`.
- **Componente exclusivo da página** → `src/pages/<Pagina>/components/`. **Usado por 2+ páginas** → `src/components/` (global).
- **Todo componente global é documentado** em `doc/componentes/` — para reusar, não repetir.
- **Funções/hooks**: reutilizável → `src/lib/` ou `src/hooks/` + doc em `doc/funcoes/`. Exclusivo da página → fica na página.
- Comece local; na 2ª página que precisar, **promova e documente — nunca copie**.
- **Performance React+Vite** (`doc/regras/04-performance.md`): code-split por página (`lazy`+`Suspense`); memoizar só com medida; estado no componente mais baixo; keys estáveis; **sem barrel files** (quebram tree-shaking/HMR — importe direto).
- **Documentação sempre atualizada**, só o necessário, prática, no formato `/caveman-review` (1 linha por item: local, problema/fato, ação).
- Sempre aplicar **`/karpathy-guidelines`** (mudanças cirúrgicas, sem overcomplicar, critério de sucesso verificável) e **`/ponytail`** (solução mais simples que funciona; reusar antes de escrever).

## Antes de escrever, procure

```bash
rg -l "NomeProvavel|useAlgo" src/components src/hooks src/lib src/pages
```
Existe algo que resolve? Reutilize. Duplicar é o erro mais comum.
