# Função/Hook — format

[[index|← Índice]] · [[03-funcoes]]

**Arquivo:** `src/lib/format.ts`
**Tipo:** funções puras (pt-BR)

## O que faz

| Função | Exemplo |
|---|---|
| `formatDateTime(iso)` | `21/10/2026, 15:58` |
| `formatRelative(iso, now?)` | `agora`, `há 5 minutos`, `ontem` |
| `formatBytes(n)` | `8,3 MB` |
| `formatDuration(segundos)` | `15 min`, `8 h`, `7 dias`, `2 h 5 min` |
| `formatAuditAction(action)` | `user.update` → `Alterou usuário` (desconhecida → código cru) |
| `formatAuditDetail(entry)` | `campos: senha, papel` · `como administrador` · nome do token · `null` |

## Uso

```ts
import { formatRelative } from '@/lib/format'

<time dateTime={iso} title={formatDateTime(iso)}>{formatRelative(iso)}</time>
```

## Notas

- Ação nova no backend (`AuditAction`) → adicione o rótulo em `AUDIT_ACTIONS` e o tipo em `src/api/admin/admin.types.ts`.
