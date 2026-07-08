# 📚 Documentação — base_vite

Índice mestre. Vault Obsidian — navegue pelos `[[links]]` ou pelo grafo.

**Stack:** Vite 8 · React 19 · TypeScript · Tailwind v4 · [[componentes/shadcn-ui|shadcn/ui]].

---

## 📐 Regras do projeto

Leia **antes** de criar qualquer arquivo. São obrigatórias.

- [[01-estrutura]] — onde cada arquivo mora (`src/` e `doc/`)
- [[02-componentes]] — componente global vs. exclusivo da página
- [[03-funcoes]] — funções/hooks globais vs. locais
- [[04-performance]] — React 19 + Vite: componentes, render, estado, props e front-end rápidos

## 📄 Páginas

Cada página tem sua própria pasta aqui e em `src/pages/`.

- [[paginas/_template|Template de página]] — copie ao criar uma página
- [[paginas/login/index|Login]] — `/login`, formulário de autenticação
- [[paginas/signup/index|Signup]] — `/signup`, cadastro público de usuário
- [[paginas/home/index|Home]] — `/`, showcase do tema (rota autenticada)

## 🧩 Componentes globais

Reutilizáveis em qualquer página. **Documentar é obrigatório** ([[02-componentes]]).

- [[componentes/shadcn-ui|shadcn/ui]] — **base dos componentes** (primitivos em `src/components/ui/`)
- [[componentes/_template|Template de componente]]
- [[componentes/app-sidebar|AppSidebar]] — sidebar do app (nav + usuário/tema no rodapé)
- [[componentes/auth-provider|AuthProvider]] — provider global de autenticação (sessão, login/logout)
- [[componentes/require-auth|RequireAuth]] — guarda de rotas autenticadas
- [[componentes/theme-toggle|ThemeToggle]] — switch custom claro/escuro (ícones Lucide)

## ⚙️ Funções e hooks globais

- [[funcoes/_template|Template de função/hook]]
- [[funcoes/api|api]] — cliente axios + rotas do backend (`src/api/`) — **toda request passa aqui**
- [[funcoes/use-auth|useAuth]] — hook de autenticação (`src/hooks/useAuth.ts`)
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
