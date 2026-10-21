# Função/Hook — useApiData

[[index|← Índice]] · [[03-funcoes]]

**Arquivo:** `src/hooks/useApiData.ts`
**Tipo:** hook

## O que faz

Busca dados da API ao montar e sempre que `deps` mudar; descarta resposta atrasada de busca antiga; mantém o último dado bom durante o recarregamento (sem piscar).

## Assinatura

```ts
function useApiData<T>(load: () => Promise<T>, deps: DependencyList): ApiData<T>
```

**Parâmetros:** `load` — função de `src/api/` · `deps` — **primitivos** (page, search…), viram a chave da busca.

**Retorno:**

| Campo | Tipo | Descrição |
|---|---|---|
| `data` | `T \| undefined` | último resultado bom |
| `error` | `string \| null` | mensagem do último erro (`ApiError.message`) |
| `loading` | `boolean` | busca da chave atual em andamento |
| `reload` | `() => void` | busca de novo |

## Uso

```ts
const users = useApiData(() => findAllUsers({ page, status }), [page, status])
```

## Notas

- Sem cache entre páginas. Duas+ telas precisando do **mesmo dado em cache** → hora do React Query ([[04-performance]] §3).
