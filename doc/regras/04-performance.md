# 04 — Performance (React 19 + Vite)

[[index|← Índice]]

Objetivo: renderizar rápido e enviar pouco JS. Regras, da que mais rende para a
que menos rende.

## 1. Code splitting por página (maior ganho)

Cada página é uma pasta ([[01-estrutura]]) → carregue sob demanda. O usuário
baixa só a página que abriu.

```tsx
// routes.tsx
import { lazy, Suspense } from 'react'

const Home  = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))

// envolva as rotas em <Suspense fallback={…}>
```

## 2. Não memoize por reflexo

React 19 com o **React Compiler** memoiza sozinho. Sem o compiler, use
`memo` / `useMemo` / `useCallback` **só quando medir** re-render custando caro
(React DevTools Profiler). Memo prematuro é código morto que ninguém revisa.

## 3. Estado perto de quem usa

Estado mora no componente mais baixo que o lê. Subir estado re-renderiza a
árvore inteira à toa. Componente grande re-renderizando → quebre em menores.

## 4. Keys estáveis

`key` = id estável do dado. **Nunca** o índice do array em listas que mudam de
ordem/tamanho.

## 5. Imports que preservam tree-shaking

- **Sem barrel files** (`index.ts` reexportando tudo) — quebram tree-shaking e
  deixam o HMR lento. Importe direto: `import { X } from './lib/x'`.
- Importe só o que usa. Evite `import * as`.

## 6. Assets pelo Vite

- Imagens via `import` (`src/assets/`) — o Vite versiona e otimiza. Veja `hero.png`.
- Imagem abaixo da dobra: `<img loading="lazy" … />`.
- SVG de ícone: prefira sprite (`public/icons.svg`) a um componente por ícone.

## 7. Build

- `vite build` já faz minificação e code splitting.
- Vendor chunk grande? Configure `build.rollupOptions.output.manualChunks` no
  `vite.config.ts`. Só depois de medir (`vite build` mostra os tamanhos).

---

**Regra-mãe:** medir antes de otimizar. Profiler/Network primeiro, otimização
depois. As regras 1, 3, 4 e 5 são estruturais — siga sempre. As outras, só com
medida na mão.
