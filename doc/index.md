# 📚 Documentação — base_vite

Índice mestre. Vault Obsidian — navegue pelos `[[links]]` ou pelo grafo.

**Stack:** Vite 8 · React 19 · TypeScript · Tailwind v4.

---

## 📐 Regras do projeto

Leia **antes** de criar qualquer arquivo. São obrigatórias.

- [[01-estrutura]] — onde cada arquivo mora (`src/` e `doc/`)
- [[02-componentes]] — componente global vs. exclusivo da página
- [[03-funcoes]] — funções/hooks globais vs. locais
- [[04-performance]] — React 19 + Vite: renderizar rápido

## 📄 Páginas

Cada página tem sua própria pasta aqui e em `src/pages/`.

- [[paginas/_template|Template de página]] — copie ao criar uma página

> Páginas documentadas aparecem aqui conforme forem criadas.

## 🧩 Componentes globais

Reutilizáveis em qualquer página. **Documentar é obrigatório** ([[02-componentes]]).

- [[componentes/_template|Template de componente]]

## ⚙️ Funções e hooks globais

- [[funcoes/_template|Template de função/hook]]
- `useTheme` — hook de tema claro/escuro (`src/hooks/useTheme.ts`)

---

## Regra de ouro

> Antes de escrever, procure. Se já existe um componente, hook ou função
> que resolve, **reutilize**. Duplicar é o erro mais comum.

Decisão rápida — global ou local?

| O código serve a... | Vai para... | Documenta em... |
|---|---|---|
| 1 página só | `src/pages/<Pagina>/` | `doc/paginas/<pagina>/` |
| 2+ páginas | `src/components` · `src/hooks` · `src/lib` | `doc/componentes/` · `doc/funcoes/` |
