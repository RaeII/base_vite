# ThemeToggle

Switch custom (trilho + knob deslizante) para alternar tema claro/escuro. Ícones [[componentes/shadcn-ui|Lucide]] (`Sun`/`Moon`) dentro do knob.

- **Local:** `src/components/ThemeToggle.tsx` (global — usável em qualquer página)
- **Depende de:** `useTheme` (`src/hooks/useTheme.ts`) — toda lógica/persistência vive lá; o componente é só UI.
- **Props:** nenhuma.
- **A11y:** `role="switch"` + `aria-checked` + `aria-label`; foco visível via `ring`.
- **Cores:** tokens (`bg-secondary`, `bg-background`, `ring`) → reage ao tema sozinho.

## Uso

```tsx
import { ThemeToggle } from '@/components/ThemeToggle'

<ThemeToggle />
```
