# 04 — Performance e boas práticas React (React 19 + Vite)

[[index|← Índice]]

Objetivo: renderizar rápido, enviar pouco JS, manter o código simples de manter.

**Regra-mãe: medir antes de otimizar.** React DevTools Profiler para render,
Network/Lighthouse para carregamento, `bun run build` para bundle. Otimização
sem medida é código morto que ninguém revisa. As regras estruturais (§1.1, §2,
§3, §4) valem sempre; as de memoização (§1.2), só com medida na mão.

---

## 1. Otimização de componentes

### 1.1 Code splitting + lazy loading (maior ganho, sempre)

- **Toda página** entra por `lazy()` + `Suspense` — já é o padrão em
  `src/App.tsx`. Página nova segue igual: `const X = lazy(() => import('./pages/X/X'))`.
- Componente pesado que **não aparece no primeiro paint** (modal, gráfico,
  editor, lib grande) → também pode ser `lazy`, dentro da página.
- Não fazer lazy de componente pequeno: o roundtrip do chunk custa mais que o JS.

### 1.2 `memo` / `useMemo` / `useCallback` — só quando fizer sentido

React 19 + React Compiler memoizam sozinhos na maioria dos casos. Memoização
manual é **exceção com medida**, não padrão. Quando usar cada um:

| Ferramenta | Use quando | Não use quando |
|---|---|---|
| `React.memo(Comp)` | Componente **puro** que re-renderiza com as mesmas props e o Profiler mostra custo real (lista de cards, linha de tabela) | Componente barato; props mudam a cada render mesmo |
| `useMemo(fn, deps)` | Cálculo caro no render (sort/filter/derivação de lista grande) **ou** identidade estável exigida por dep de outro hook / filho `memo` | Cálculo trivial (`a + b`, `.map` de 10 itens) |
| `useCallback(fn, deps)` | Função passada a filho envolvido em `memo` ou usada como dep de effect | Filho não é `memo` → não muda nada, só polui |

Armadilha: `memo` no filho + prop literal no pai (`items={[]}`, `onX={() => …}`,
`style={{…}}`) = memo quebrado. Estabilize a prop ou remova o `memo`.

## 2. Otimização de render

Evitar re-render desnecessário é estrutura, não hook:

- **Estado no componente mais baixo** que o lê. Subir estado re-renderiza a
  árvore inteira à toa. Componente grande re-renderizando → quebre em menores.
- **Derive, não duplique**: valor calculável de props/estado se calcula no
  render. `useState` + `useEffect` para "sincronizar" estado derivado é bug em
  potencial e render extra garantido.
- **`children` corta re-render**: componente com estado que embrulha subtree
  cara → receba a subtree como `children`. Quando o estado muda, `children`
  (criado pelo pai) não re-renderiza.

  ```tsx
  // Scroll re-renderiza só o wrapper; <PaginaPesada/> (children) fica intacta
  function ScrollTracker({ children }: { children: ReactNode }) {
    const [y, setY] = useState(0)
    // …
    return <div onScroll={e => setY(e.currentTarget.scrollTop)}>{children}</div>
  }
  ```

- **Nunca declare componente dentro de componente** — o React desmonta e
  remonta a subtree a cada render (perde estado, foco, scroll).
- **Keys estáveis**: `key` = id do dado. Nunca índice do array em lista que
  muda de ordem/tamanho.
- **Context re-renderiza todo consumer** quando o `value` muda. Provider com
  `value={{ … }}` literal muda a cada render → memoize o `value` ou separe em
  contexts menores (dado que muda muito ≠ dado que muda pouco).

## 3. Gerência de estado — escada de decisão

Comece no degrau 1. Só suba com dor real (não "vai que precisa").

1. **`useState` local** no componente que usa. 90% dos casos param aqui.
2. **Lift** para o pai comum mais próximo quando 2+ irmãos compartilham.
3. **Context** para global que **muda pouco**: tema e sessão. Já existe —
   [[../componentes/auth-provider|AuthProvider]] e `useTheme`. Não crie context
   para dado que muda a cada interação (ver §2, re-render de consumers).
4. **React Query (TanStack Query)** quando 2+ páginas consumirem os mesmos
   dados de API (cache, refetch, loading/error de graça). Estado de **servidor**
   nunca vai para context/Zustand/`useState` global manual — some com cache
   duplicado e dado velho.
5. **Zustand** para estado global de **cliente** que muda com frequência
   (carrinho, filtros cross-página, preferências de UI). Leve, sem provider,
   sem boilerplate.
6. **Redux**: não adotar. Zustand cobre os casos deste template com fração do
   código. Só entra por exigência externa (time/legado).

Regras transversais:

- **Estado de servidor ≠ estado de cliente.** Dados que vêm da API pertencem à
  camada de fetch (React Query ou hook sobre `src/api/`), não a store global.
- **URL é estado**: filtro, aba ativa, paginação → querystring
  (`useSearchParams`). Sobrevive a refresh, é compartilhável, zero store.
- Libs (React Query, Zustand) entram **quando a necessidade aparecer** — este
  template não as instala por padrão.

## 4. Props — evitar prop drilling

Sinal de alerta: prop atravessa **2+ níveis** sem ser usada no caminho.
Soluções, na ordem:

1. **Composição** (resolve a maioria): em vez de `<Layout user={user}>` passando
   `user` até o Avatar, monte no topo e passe pronto —
   `<Layout header={<Avatar user={user} />}>`. O intermediário vira "buraco"
   (`children`/slot) e não conhece o dado.
2. **Context** se o dado é global e estável (sessão, tema) — degrau 3 da §3.
3. **Zustand** se é global e muda muito — degrau 5 da §3.

Higiene de props:

- **Passe o mínimo**: filho usa `user.name` → prop é `name`, não `user`.
  Acopla menos e re-renderiza menos.
- Sem `{...props}` cego entre componentes próprios — esconde contrato e vaza
  prop errada pro DOM. (Exceção: primitivos `ui/` do shadcn, que embrulham
  elemento nativo.)
- Callback de filho para pai: `onAlgo` (`onSubmit`, `onSelect`) — dado desce
  por prop, evento sobe por callback.

## 5. Boas práticas React

Estrutura (pasta por página, global vs. local, procurar antes de escrever) já
está em [[01-estrutura]], [[02-componentes]], [[03-funcoes]]. Aqui, o resto:

- **`useEffect` é para sincronizar com sistema externo** (listener, timer,
  DOM imperativo, websocket) — sempre com cleanup. Não é para: derivar estado
  (§2), reagir a prop mudar (calcule no render), buscar dado (hook sobre
  `src/api/`, futuramente React Query).
- **React 19**: `ref` é prop comum — não escreva `forwardRef` novo.
- **Props tipadas** com `type`/`interface` explícito no arquivo do componente.
  `any` proibido; `unknown` + narrow quando o tipo é realmente desconhecido.
- **Lista grande** (centenas de linhas montadas): virtualize
  (`@tanstack/react-virtual`) — só com travamento medido no Profiler.
- **Formulário**: estado controlado local resolve login/CRUD simples. Form
  grande/dinâmico → `react-hook-form` (render por campo, não por tecla) quando
  a dor aparecer.
- **Imports diretos, sem barrel files** (`index.ts` reexportando tudo):
  quebram tree-shaking e deixam HMR lento. `import { X } from '@/lib/x'`.

## 6. Performance front-end (carregamento, bundle, assets)

- **Bundle é orçamento**: `bun run build` lista os chunks. Chunk inicial
  passou de ~250 kB gzip → investigue (`rollup-plugin-visualizer` sob demanda).
  `build.rollupOptions.output.manualChunks` só depois de medir.
- **Dependência nova pesa**: antes de `bun add`, cheque o custo (bundlephobia)
  e se o nativo resolve (`Intl` para data/número/moeda antes de instalar lib).
- **Imagens**: via `import` de `src/assets/` (Vite versiona com hash);
  `width`/`height` ou `aspect-ratio` sempre (evita CLS); `loading="lazy"`
  abaixo da dobra; prefira WebP/AVIF. Ícone SVG: sprite > um componente por ícone.
- **Fontes**: self-host (sem request a terceiro), `font-display: swap`,
  `<link rel="preload">` só da principal.
- **Cache**: assets do build têm hash no nome → servidor serve com
  `Cache-Control: immutable`; `index.html` sem cache.
- **Sem waterfall de rede**: requests independentes disparam juntas
  (`Promise.all`), não em sequência de `await`.
- **Métricas-alvo** (medir no `bun run preview` + Lighthouse, nunca no dev
  server): LCP < 2,5 s · INP < 200 ms · CLS < 0,1.
- **SEO técnico** (páginas públicas; rota autenticada não indexa):
  `document.title` + meta description por página, HTML semântico
  (`main`/`nav`/`h1` único), `lang` correto no `index.html`.

---

**Resumo em uma linha:** estrutura certa primeiro (§1.1–§4), medida na mão
para o resto — memoização, virtualização e chunk manual só entram com Profiler
ou build apontando o custo.
