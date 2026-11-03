# 01 — Estrutura de pastas

A doc espelha o `src/`. Cada coisa tem **um** lugar. Antes de criar, decida:
serve a uma página só, ou a várias?

[[index|← Índice]]

---

## Código (`src/`)

```
src/
  pages/
    <Pagina>/
      index.tsx          # componente da página (carregado via lazy)
      components/        # componentes EXCLUSIVOS da página
      hooks/             # hooks exclusivos da página      (opcional)
      utils.ts           # funções exclusivas da página     (opcional)
    admin/
      <Pagina>/          # páginas da área admin (/admin/*), mesma estrutura
  components/            # componentes GLOBAIS (2+ páginas)
  hooks/                 # hooks GLOBAIS (ex: useTheme)
  lib/                   # funções puras GLOBAIS
  routes.tsx             # rotas — lazy + Suspense ([[04-performance]])
  main.tsx               # entrada
```

### Regras

1. **Uma pasta por página.** Toda página vira `src/pages/<Pagina>/`.
2. **Componente exclusivo → fica na página** (`pages/<Pagina>/components/`).
   Usado por 2+ páginas → sobe para `src/components/` ([[02-componentes]]).
3. **Função exclusiva → fica na página.** Reutilizável → `src/lib/` ([[03-funcoes]]).
4. **Sem barrel files** (`index.ts` que reexporta tudo). Quebram tree-shaking
   e HMR — importe direto do arquivo. Ver [[04-performance]].
5. **Página da área admin → `src/pages/admin/<Pagina>/`**, sem repetir o
   prefixo (`admin/Users/`, não `admin/AdminUsers/`). Doc em `doc/paginas/admin/<pagina>/`.

> Promover (local → global) é o movimento normal. Na segunda página que
> precisa do mesmo código, mova-o e documente. Não copie.

---

## Documentação (`doc/`)

A doc reflete o código:

```
doc/
  index.md               # índice mestre
  regras/                # estas regras
  paginas/
    _template.md         # copie ao criar uma página
    <pagina>/            # uma pasta por página
      index.md
      components/         # doc dos componentes exclusivos da página
    admin/
      <pagina>/          # páginas da área admin
  componentes/           # doc dos componentes globais
  funcoes/               # doc dos hooks/funções globais
```

- Criou `src/pages/Login/` → crie `doc/paginas/login/index.md` (copie o [[paginas/_template|template]]).
- Subiu um componente para global → mova a doc dele para `doc/componentes/`.
- Doc fica **junto** do que documenta, na mesma hierarquia. Mesma lógica do código.
