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
- [[paginas/login/index|Login]] — `/login` e `/admin/login` (modo admin, step-up) · login com Google
- [[paginas/signup/index|Signup]] — `/signup`, cadastro público de usuário · 1º acesso pelo Google
- [[paginas/home/index|Home]] — `/`, showcase do tema (rota autenticada)
- [[paginas/admin-dashboard/index|Admin · Visão geral]] — `/admin`, números, atividade recente, saúde
- [[paginas/admin-users/index|Admin · Usuários]] — `/admin/users`, busca, filtros, criar/editar, desativar, encerrar sessões
- [[paginas/admin-audit/index|Admin · Auditoria]] — `/admin/audit`, trilha de ações administrativas
- [[paginas/admin-system/index|Admin · Sistema]] — `/admin/system`, saúde, runtime, banco, config de segurança

## 🧩 Componentes globais

Reutilizáveis em qualquer página. **Documentar é obrigatório** ([[02-componentes]]).

- [[componentes/shadcn-ui|shadcn/ui]] — **base dos componentes** (primitivos em `src/components/ui/`)
- [[componentes/_template|Template de componente]]
- [[componentes/app-sidebar|AppSidebar]] — sidebar do app (nav + usuário/tema no rodapé)
- [[componentes/mobile-nav|MobileNav]] — navegação mobile (bottom bar + drawer lateral; `< md`)
- [[componentes/auth-provider|AuthProvider]] — provider global de autenticação (sessão, login/logout)
- [[componentes/google-login-button|GoogleLoginButton]] — "Continuar com Google" (GIS sob demanda) + divisor "ou"
- [[componentes/require-auth|RequireAuth]] — guarda de rotas autenticadas
- [[componentes/require-admin|RequireAdmin]] — guarda da área admin (sessão admin elevada)
- [[componentes/admin-layout|AdminLayout]] — shell da área admin (sidebar/bottom bar com `adminNavItems`)
- [[componentes/health-indicator|HealthIndicator]] — status do health check (ponto + rótulo)
- [[componentes/pagination-bar|PaginationBar]] — rodapé de lista paginada
- [[componentes/load-error|LoadError]] — erro de carregamento + "Tentar de novo"
- [[componentes/theme-toggle|ThemeToggle]] — switch custom claro/escuro (ícones Lucide)

## ⚙️ Funções e hooks globais

- [[funcoes/_template|Template de função/hook]]
- [[funcoes/api|api]] — cliente axios + rotas do backend (`src/api/`) — **toda request passa aqui**
- [[funcoes/use-auth|useAuth]] — hook de autenticação (`src/hooks/useAuth.ts`)
- [[funcoes/use-api-data|useApiData]] — busca dados da API com loading/erro/reload (`src/hooks/useApiData.ts`)
- [[funcoes/format|format]] — datas, bytes, durações e rótulos de auditoria pt-BR (`src/lib/format.ts`)
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
